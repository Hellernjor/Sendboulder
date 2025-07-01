
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
        
        // Check if map container exists
        if (!mapRef.current) {
          console.error('❌ Map container not found');
          throw new Error('Map container not available');
        }
        
        console.log('📞 Calling get-secrets function for GOOGLE_API_KEY...');
        
        // Get Google API key from Supabase secrets
        const { data, error: secretError } = await supabase.functions.invoke('get-secrets', {
          body: { keys: ['GOOGLE_API_KEY'] }
        });

        console.log('🔑 Secrets response:', { 
          hasData: !!data, 
          error: secretError,
          hasApiKey: !!data?.GOOGLE_API_KEY,
          keyLength: data?.GOOGLE_API_KEY ? data.GOOGLE_API_KEY.length : 0
        });

        if (secretError) {
          console.error('❌ Error fetching GOOGLE_API_KEY:', secretError);
          throw new Error(`Failed to fetch Google API key: ${secretError.message || 'Unknown error'}`);
        }

        if (!data) {
          console.error('❌ No data returned from get-secrets function');
          throw new Error('No response from secrets function');
        }

        if (!data.GOOGLE_API_KEY) {
          console.error('❌ GOOGLE_API_KEY not found in Supabase secrets');
          throw new Error('GOOGLE_API_KEY not found in Supabase secrets');
        }

        const apiKey = data.GOOGLE_API_KEY;
        console.log('✅ Got GOOGLE_API_KEY, length:', apiKey.length);

        console.log('🚀 Loading Google Maps JavaScript API...');

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        const google = await loader.load();
        console.log('✅ Google Maps JavaScript API loaded successfully');
        
        // Double-check map container still exists
        if (!mapRef.current) {
          console.error('❌ Map container disappeared during loading');
          throw new Error('Map container no longer available');
        }

        // Default to user's location or San Francisco
        const defaultLocation = initialLocation || { lat: 37.7749, lng: -122.4194 };
        console.log('📍 Creating map with location:', defaultLocation);

        const mapInstance = new google.maps.Map(mapRef.current, {
          zoom: 13,
          center: defaultLocation,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        console.log('✅ Google Map instance created');

        const markerInstance = new google.maps.Marker({
          position: defaultLocation,
          map: mapInstance,
          draggable: true,
          title: 'Click and drag to select location'
        });

        console.log('✅ Map marker created');

        // Handle map clicks
        mapInstance.addListener('click', (event: any) => {
          if (event.latLng) {
            const position = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            markerInstance.setPosition(position);
            reverseGeocode(position, google);
          }
        });

        // Handle marker drag
        markerInstance.addListener('dragend', () => {
          const position = markerInstance.getPosition();
          if (position) {
            const pos = {
              lat: position.lat(),
              lng: position.lng()
            };
            reverseGeocode(pos, google);
          }
        });

        const reverseGeocode = async (position: { lat: number; lng: number }, googleMaps: any) => {
          try {
            const geocoder = new googleMaps.maps.Geocoder();
            
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

        setMap(mapInstance);
        setMarker(markerInstance);
        setLoading(false);

        console.log('✅ Map initialization completed successfully');

        // Initial reverse geocode
        reverseGeocode(defaultLocation, google);

      } catch (err) {
        console.error('❌ Error initializing Google Maps:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load Google Maps';
        setError(errorMessage);
        setLoading(false);
      }
    };

    // Add a small delay to ensure DOM is ready
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
            
            // Simple reverse geocoding
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
          <p className="text-red-600 text-sm font-medium mb-2">Google Maps Loading Error</p>
          <p className="text-red-600 text-xs mb-3">{error}</p>
          <p className="text-slate-600 text-xs">
            Please ensure the GOOGLE_API_KEY is configured in your Supabase secrets.
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
