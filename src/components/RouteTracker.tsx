
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

  // Start with empty arrays - only real user data
  const locations: Location[] = [];
  const [routes, setRoutes] = useState<Route[]>([]);
  const [attempts] = useState<Attempt[]>([]);

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
        {locations.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-lg mb-2">No locations available</p>
            <p className="text-slate-500 text-sm">Add some locations in the Global Climbing Locations section first to start tracking routes.</p>
          </div>
        ) : (
          <>
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
                    location={selectedLocationData}
                  />
                )}

                {!showAddRoute && (
                  <Button 
                    onClick={() => setShowAddRoute(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={selectedLocationData.type === 'gym' && (!selectedLocationData.gradeSystem || selectedLocationData.gradeSystem.length === 0)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Personal Route at {selectedLocationData.name}
                  </Button>
                )}

                <RoutesList 
                  routes={filteredRoutes}
                  attempts={attempts}
                  locationName={selectedLocationData.name}
                  location={selectedLocationData}
                />
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteTracker;
