
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        // Use environment variable for Google Maps API key
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';
        
        if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
          throw new Error('Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.');
        }

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        const google = await loader.load();
        
        if (!mapRef.current) return;

        // Default to user's location or San Francisco
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

        // Initial reverse geocode
        reverseGeocode(defaultLocation, google);

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
          <p className="text-slate-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 bg-red-50 rounded-lg flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-slate-600 text-xs mt-2">
            The map requires a Google Maps API key. Contact your administrator to configure this.
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
