
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMapSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

const GoogleMapSelector = ({ onLocationSelect, initialLocation }: GoogleMapSelectorProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        console.log('🗺️ Starting Google Maps initialization...');
        setLoading(true);
        setError(null);
        
        if (!mapRef.current) {
          throw new Error('Map container not available');
        }
        
        console.log('📞 Fetching GOOGLE_API_KEY from Supabase secrets...');
        
        const { data, error: secretError } = await supabase.functions.invoke('get-secrets', {
          body: { keys: ['GOOGLE_API_KEY'] }
        });

        console.log('🔑 Secrets response:', { 
          data, 
          error: secretError,
          hasApiKey: !!data?.GOOGLE_API_KEY
        });

        if (secretError) {
          console.error('❌ Error fetching secrets:', secretError);
          throw new Error(`Failed to fetch Google API key: ${secretError.message}`);
        }

        if (!data?.GOOGLE_API_KEY) {
          console.error('❌ GOOGLE_API_KEY not found in response');
          throw new Error('GOOGLE_API_KEY not configured in Supabase secrets');
        }

        const apiKey = data.GOOGLE_API_KEY;
        console.log('✅ Retrieved GOOGLE_API_KEY successfully');

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        const google = await loader.load();
        console.log('✅ Google Maps JavaScript API loaded');
        
        if (!mapRef.current) {
          throw new Error('Map container no longer available');
        }

        const defaultLocation = initialLocation || { lat: 37.7749, lng: -122.4194 };

        const mapInstance = new google.maps.Map(mapRef.current, {
          zoom: 13,
          center: defaultLocation,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        const markerInstance = new google.maps.Marker({
          position: defaultLocation,
          map: mapInstance,
          draggable: true,
          title: 'Click and drag to select location'
        });

        const reverseGeocode = async (position: { lat: number; lng: number }) => {
          try {
            const geocoder = new google.maps.Geocoder();
            
            geocoder.geocode({ location: position }, (results: any, status: any) => {
              if (status === 'OK' && results && results[0]) {
                onLocationSelect({
                  ...position,
                  address: results[0].formatted_address
                });
              } else {
                onLocationSelect({
                  ...position,
                  address: `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
                });
              }
            });
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            onLocationSelect({
              ...position,
              address: `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
            });
          }
        };

        mapInstance.addListener('click', (event: any) => {
          if (event.latLng) {
            const position = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            markerInstance.setPosition(position);
            reverseGeocode(position);
          }
        });

        markerInstance.addListener('dragend', () => {
          const position = markerInstance.getPosition();
          if (position) {
            const pos = {
              lat: position.lat(),
              lng: position.lng()
            };
            reverseGeocode(pos);
          }
        });

        setMap(mapInstance);
        setMarker(markerInstance);
        setLoading(false);

        console.log('✅ Map initialization completed');
        reverseGeocode(defaultLocation);

      } catch (err) {
        console.error('❌ Map initialization error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load Google Maps';
        setError(errorMessage);
        setLoading(false);
      }
    };

    const timer = setTimeout(initializeMap, 100);
    return () => clearTimeout(timer);
  }, [initialLocation, onLocationSelect]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          if (map && marker) {
            map.setCenter(pos);
            marker.setPosition(pos);
            
            onLocationSelect({
              ...pos,
              address: `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`
            });
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-slate-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
        <div className="text-center max-w-sm px-4">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 text-sm font-medium mb-2">Google Maps Error</p>
          <p className="text-red-600 text-xs mb-3">{error}</p>
          <p className="text-slate-600 text-xs">
            Please ensure GOOGLE_API_KEY is configured in Supabase secrets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-600">Click on the map to select location</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          className="text-xs"
        >
          <Navigation className="h-3 w-3 mr-1" />
          Use Current Location
        </Button>
      </div>
      <div ref={mapRef} className="h-64 w-full rounded-lg border border-slate-300" />
    </div>
  );
};

export default GoogleMapSelector;
