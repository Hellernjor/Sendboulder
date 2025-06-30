
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMapSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

const GoogleMapSelector = ({ onLocationSelect, initialLocation }: GoogleMapSelectorProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Get Google Maps API key from Supabase secrets
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Not authenticated');
        }

        const { data: secrets } = await supabase.functions.invoke('get-secrets', {
          body: { keys: ['GOOGLE_MAPS_API_KEY'] }
        });

        const apiKey = secrets?.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          throw new Error('Google Maps API key not found');
        }

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        const { Map } = await loader.importLibrary('maps');
        const { Marker } = await loader.importLibrary('marker');

        if (!mapRef.current) return;

        // Default to user's location or San Francisco
        const defaultLocation = initialLocation || { lat: 37.7749, lng: -122.4194 };

        const mapInstance = new Map(mapRef.current, {
          zoom: 13,
          center: defaultLocation,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        const markerInstance = new Marker({
          position: defaultLocation,
          map: mapInstance,
          draggable: true,
          title: 'Click and drag to select location'
        });

        // Handle map clicks
        mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const position = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            markerInstance.setPosition(position);
            reverseGeocode(position);
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
            reverseGeocode(pos);
          }
        });

        const reverseGeocode = async (position: { lat: number; lng: number }) => {
          try {
            const { Geocoder } = await loader.importLibrary('geocoding');
            const geocoder = new Geocoder();
            
            geocoder.geocode({ location: position }, (results, status) => {
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

        // Initial reverse geocode
        reverseGeocode(defaultLocation);

      } catch (err) {
        console.error('Error initializing map:', err);
        setError(err instanceof Error ? err.message : 'Failed to load map');
        setLoading(false);
      }
    };

    initializeMap();
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
            
            // Reverse geocode the current position
            const loader = new Loader({
              apiKey: '', // Will be handled by the existing loader
              version: 'weekly',
            });
            
            loader.importLibrary('geocoding').then(({ Geocoder }) => {
              const geocoder = new Geocoder();
              geocoder.geocode({ location: pos }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  onLocationSelect({
                    ...pos,
                    address: results[0].formatted_address
                  });
                }
              });
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
          <p className="text-slate-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 bg-red-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
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
