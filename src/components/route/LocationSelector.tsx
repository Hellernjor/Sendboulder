
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
      <Label htmlFor="location-select" className="text-white">Select Global Location</Label>
      <select
        id="location-select"
        value={selectedLocation}
        onChange={(e) => onLocationChange(e.target.value)}
        className="w-full h-10 bg-slate-800 border border-slate-600 rounded-md px-3 text-white mt-1"
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
