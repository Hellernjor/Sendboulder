
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Users } from 'lucide-react';
import { Location } from '@/types/location';
import LocationCard from './location/LocationCard';
import AddLocationForm from './location/AddLocationForm';

const LocationManager = () => {
  // Mock data showing locations from different users - globally shared
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Vertical World Seattle',
      type: 'gym',
      address: '2123 W Elmore St, Seattle, WA 98199',
      createdBy: 'user123',
      createdByUsername: 'john_climber',
      createdAt: new Date('2024-01-15'),
      routeChangeFrequency: 'weekly',
      isGlobal: true
    },
    {
      id: '2',
      name: 'Smith Rock State Park',
      type: 'outdoor',
      address: 'Terrebonne, OR 97760',
      coordinates: { lat: 44.3672, lng: -121.1419 },
      createdBy: 'user456',
      createdByUsername: 'sarah_boulder',
      createdAt: new Date('2024-02-01'),
      routeChangeFrequency: 'never',
      isGlobal: true
    },
    {
      id: '3',
      name: 'Brooklyn Boulders',
      type: 'gym',
      address: '575 Degraw St, Brooklyn, NY 11217',
      createdBy: 'user789',
      createdByUsername: 'mike_sends',
      createdAt: new Date('2024-02-10'),
      routeChangeFrequency: 'monthly',
      isGlobal: true
    }
  ]);

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
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onDelete={handleDeleteLocation}
            />
          ))}
        </div>

        <div className="text-center pt-4">
          <p className="text-slate-400 text-sm">
            {locations.length} locations shared by the climbing community
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationManager;
