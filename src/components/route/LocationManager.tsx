import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { Location, GradeLevel } from '@/types/location';
import LocationSelector from './LocationSelector';
import LocationInfo from './LocationInfo';
import AddLocationForm from '../location/AddLocationForm';
import GradeSystemManager from '../location/GradeSystemManager';

interface LocationManagerProps {
  locations: Location[];
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
  onAddLocation: (locationData: Omit<Location, 'id' | 'createdBy' | 'createdByUsername' | 'createdAt' | 'isGlobal'>) => Promise<void>;
  onUpdateGrades: (locationId: string, grades: GradeLevel[]) => Promise<void>;
}

const LocationManager = ({ 
  locations, 
  selectedLocation, 
  onLocationChange, 
  onAddLocation, 
  onUpdateGrades 
}: LocationManagerProps) => {
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showGradeSetup, setShowGradeSetup] = useState(false);

  const selectedLocationData = locations.find(loc => loc.id === selectedLocation);

  const handleAddLocation = async (locationData: Omit<Location, 'id' | 'createdBy' | 'createdByUsername' | 'createdAt' | 'isGlobal'>) => {
    await onAddLocation(locationData);
    setShowAddLocation(false);
  };

  const handleGradeSetup = () => {
    setShowGradeSetup(true);
  };

  const handleGradeSetupComplete = async (updatedGrades: GradeLevel[]) => {
    if (selectedLocationData) {
      await onUpdateGrades(selectedLocationData.id, updatedGrades);
      setShowGradeSetup(false);
    }
  };

  if (locations.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="text-center py-8">
          <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-lg mb-2">No locations available</p>
          <p className="text-slate-500 text-sm mb-4">Add a climbing location to start tracking routes and logging scores.</p>
          <Button 
            onClick={() => setShowAddLocation(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Location
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <LocationSelector 
        locations={locations}
        selectedLocation={selectedLocation}
        onLocationChange={onLocationChange}
      />

      {selectedLocation && selectedLocationData && (
        <LocationInfo location={selectedLocationData} />
      )}

      {showAddLocation && (
        <AddLocationForm
          onAdd={handleAddLocation}
          onCancel={() => setShowAddLocation(false)}
        />
      )}

      {showGradeSetup && selectedLocationData && (
        <div className="space-y-4">
          <GradeSystemManager
            grades={selectedLocationData.gradeSystem || []}
            onGradesChange={handleGradeSetupComplete}
          />
          <Button 
            onClick={() => setShowGradeSetup(false)}
            variant="outline"
            className="border-slate-600 text-slate-300"
          >
            Cancel
          </Button>
        </div>
      )}

      {selectedLocationData && (
        <div className="text-center">
          <Button 
            onClick={() => setShowAddLocation(true)}
            variant="outline"
            className="border-slate-600 text-slate-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Location
          </Button>
        </div>
      )}
    </div>
  );
};

export default LocationManager;