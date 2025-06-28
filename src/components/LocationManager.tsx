
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Users } from 'lucide-react';
import { Location } from '@/types/location';
import LocationCard from './location/LocationCard';
import AddLocationForm from './location/AddLocationForm';

const LocationManager = () => {
  // Start with empty locations array - only real user data
  const [locations, setLocations] = useState<Location[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddLocation = (locationData: Omit<Location, 'id' | 'createdBy' | 'createdByUsername' | 'createdAt' | 'isGlobal'>) => {
    const location: Location = {
      id: Date.now().toString(),
      ...locationData,
      createdBy: 'current-user',
      createdByUsername: 'you',
      createdAt: new Date(),
      isGlobal: true
    };

    setLocations([...locations, location]);
    setShowAddForm(false);
  };

  const handleDeleteLocation = (locationId: string) => {
    setLocations(locations.filter(loc => loc.id !== locationId));
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Global Climbing Locations</span>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              <Users className="h-3 w-3 mr-1" />
              Shared by community
            </Badge>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <AddLocationForm
            onAdd={handleAddLocation}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        <div className="space-y-3">
          {locations.length === 0 && !showAddForm ? (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-lg mb-2">No locations added yet</p>
              <p className="text-slate-500 text-sm mb-4">Be the first to add a climbing location for the community!</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Location
              </Button>
            </div>
          ) : (
            locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onDelete={handleDeleteLocation}
              />
            ))
          )}
        </div>

        {locations.length > 0 && (
          <div className="text-center pt-4">
            <p className="text-slate-400 text-sm">
              {locations.length} location{locations.length !== 1 ? 's' : ''} shared by the climbing community
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationManager;
