
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';
import { Location } from '@/types/location';
import { useAuth } from '@/contexts/AuthContext';
import { Logger } from '@/lib/logger';
import LocationCard from './LocationCard';

interface LocationListProps {
  locations: Location[];
  userLocation: {lat: number, lng: number} | null;
  onAddLocation: () => void;
  onEditLocation: (location: Location) => void;
  onDeleteLocation: (locationId: string) => void;
}

const LocationList = ({ 
  locations, 
  userLocation, 
  onAddLocation, 
  onEditLocation, 
  onDeleteLocation 
}: LocationListProps) => {
  const { user } = useAuth();

  Logger.component('LocationList', `Rendering with ${locations.length} locations`);

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    Logger.debug('LocationList', `Calculated distance: ${distance.toFixed(2)}km`, {
      from: { lat: lat1, lng: lng1 },
      to: { lat: lat2, lng: lng2 }
    });
    
    return distance;
  };

  // Sort locations by distance from user
  const sortedLocations = userLocation ? 
    [...locations].sort((a, b) => {
      if (!a.coordinates || !b.coordinates) return 0;
      const distanceA = calculateDistance(
        userLocation.lat, userLocation.lng,
        a.coordinates.lat, a.coordinates.lng
      );
      const distanceB = calculateDistance(
        userLocation.lat, userLocation.lng,
        b.coordinates.lat, b.coordinates.lng
      );
      return distanceA - distanceB;
    }) : locations;

  if (locations.length === 0) {
    return (
      <div className="text-center py-6">
        <MapPin className="h-8 w-8 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-600 text-sm mb-3">No locations available</p>
        <Button 
          onClick={onAddLocation}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add First Location
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sortedLocations.map((location) => {
          const distance = userLocation && location.coordinates ? 
            calculateDistance(
              userLocation.lat, userLocation.lng,
              location.coordinates.lat, location.coordinates.lng
            ) : null;

          const canEdit = user && location.createdBy === user.id;

          return (
            <LocationCard
              key={location.id}
              location={location}
              distance={distance}
              canEdit={canEdit}
              onEdit={onEditLocation}
              onDelete={onDeleteLocation}
            />
          );
        })}
      </div>
      
      <Button 
        onClick={onAddLocation}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Location
      </Button>
    </>
  );
};

export default LocationList;
