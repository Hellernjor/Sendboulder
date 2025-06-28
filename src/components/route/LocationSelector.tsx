
import React from 'react';
import { Label } from '@/components/ui/label';
import { Location } from '@/types/location';

interface LocationSelectorProps {
  locations: Location[];
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
}

const LocationSelector = ({ locations, selectedLocation, onLocationChange }: LocationSelectorProps) => {
  return (
    <div>
      <Label htmlFor="location-select" className="text-purple-600 dark:text-purple-300">Select Global Location</Label>
      <select
        id="location-select"
        value={selectedLocation}
        onChange={(e) => onLocationChange(e.target.value)}
        className="w-full h-10 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-600 rounded-md px-3 text-purple-800 dark:text-purple-200 mt-1"
      >
        <option value="">Choose from community locations...</option>
        {locations.map(location => (
          <option key={location.id} value={location.id}>
            {location.name} ({location.type}) - added by {location.createdByUsername}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
