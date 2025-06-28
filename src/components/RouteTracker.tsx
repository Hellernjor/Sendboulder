
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, User } from 'lucide-react';
import { Location } from '@/types/location';
import { Route, Attempt } from '@/types/route';
import LocationSelector from './route/LocationSelector';
import LocationInfo from './route/LocationInfo';
import AddRouteForm from './route/AddRouteForm';
import RoutesList from './route/RoutesList';

const RouteTracker = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showAddRoute, setShowAddRoute] = useState(false);

  // Global locations shared by all users
  const locations: Location[] = [
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
  ];

  const [routes, setRoutes] = useState<Route[]>([
    {
      id: '1',
      name: 'Red Corner Problem',
      color: 'Red',
      difficulty: 'V4',
      locationId: '1',
      isActive: true,
      createdAt: new Date('2024-01-20'),
      personalRoute: true,
      createdBy: 'current-user'
    },
    {
      id: '2',
      name: 'Blue Overhang',
      color: 'Blue',
      difficulty: 'V3',
      locationId: '1',
      isActive: false,
      createdAt: new Date('2024-01-15'),
      removedAt: new Date('2024-01-22'),
      personalRoute: true,
      createdBy: 'current-user'
    }
  ]);

  const [attempts] = useState<Attempt[]>([
    {
      id: '1',
      routeId: '1',
      locationId: '1',
      completed: true,
      attempts: 3,
      date: new Date('2024-01-21'),
      notes: 'Great footwork practice'
    },
    {
      id: '2',
      routeId: '2',
      locationId: '1',
      completed: false,
      attempts: 5,
      date: new Date('2024-01-16'),
      notes: 'Need to work on grip strength'
    }
  ]);

  const handleAddRoute = (routeData: Omit<Route, 'id' | 'createdAt' | 'isActive' | 'personalRoute' | 'createdBy'>) => {
    const route: Route = {
      id: Date.now().toString(),
      ...routeData,
      isActive: true,
      createdAt: new Date(),
      personalRoute: true,
      createdBy: 'current-user'
    };

    setRoutes([...routes, route]);
    setShowAddRoute(false);
  };

  const filteredRoutes = selectedLocation 
    ? routes.filter(route => route.locationId === selectedLocation)
    : [];

  const selectedLocationData = locations.find(loc => loc.id === selectedLocation);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Your Personal Routes</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              <User className="h-3 w-3 mr-1" />
              Personal tracking
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LocationSelector 
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />

        {selectedLocation && selectedLocationData && (
          <>
            <LocationInfo location={selectedLocationData} />

            {showAddRoute && (
              <AddRouteForm
                onAdd={handleAddRoute}
                onCancel={() => setShowAddRoute(false)}
                locationId={selectedLocation}
              />
            )}

            {!showAddRoute && (
              <Button 
                onClick={() => setShowAddRoute(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Personal Route at {selectedLocationData.name}
              </Button>
            )}

            <RoutesList 
              routes={filteredRoutes}
              attempts={attempts}
              locationName={selectedLocationData.name}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteTracker;
