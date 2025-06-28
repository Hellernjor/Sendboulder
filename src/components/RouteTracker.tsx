
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import { Location } from './LocationManager';

export interface Route {
  id: string;
  name: string;
  color: string;
  difficulty: string;
  locationId: string;
  isActive: boolean;
  createdAt: Date;
  removedAt?: Date;
  personalRoute: boolean;
  createdBy: string;
}

export interface Attempt {
  id: string;
  routeId: string;
  locationId: string;
  completed: boolean;
  attempts: number;
  date: Date;
  notes?: string;
}

const RouteTracker = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    color: 'Red',
    difficulty: 'V0'
  });

  // Mock data - would come from props or context in real app
  const locations: Location[] = [
    {
      id: '1',
      name: 'Vertical World Seattle',
      type: 'gym',
      address: '2123 W Elmore St, Seattle, WA 98199',
      createdBy: 'user123',
      createdAt: new Date('2024-01-15'),
      routeChangeFrequency: 'weekly'
    },
    {
      id: '2',
      name: 'Smith Rock State Park',
      type: 'outdoor',
      address: 'Terrebonne, OR 97760',
      createdBy: 'user456',
      createdAt: new Date('2024-02-01'),
      routeChangeFrequency: 'never'
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

  const [attempts, setAttempts] = useState<Attempt[]>([
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

  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Black', 'White', 'Orange', 'Pink'];
  const difficulties = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10+'];

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'Red': 'bg-red-500',
      'Blue': 'bg-blue-500',
      'Green': 'bg-green-500',
      'Yellow': 'bg-yellow-500',
      'Purple': 'bg-purple-500',
      'Black': 'bg-gray-800',
      'White': 'bg-gray-100',
      'Orange': 'bg-orange-500',
      'Pink': 'bg-pink-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const handleAddRoute = () => {
    if (!selectedLocation || !newRoute.name) return;

    const route: Route = {
      id: Date.now().toString(),
      name: newRoute.name,
      color: newRoute.color,
      difficulty: newRoute.difficulty,
      locationId: selectedLocation,
      isActive: true,
      createdAt: new Date(),
      personalRoute: true,
      createdBy: 'current-user'
    };

    setRoutes([...routes, route]);
    setNewRoute({ name: '', color: 'Red', difficulty: 'V0' });
    setShowAddRoute(false);
  };

  const filteredRoutes = selectedLocation 
    ? routes.filter(route => route.locationId === selectedLocation)
    : [];

  const selectedLocationData = locations.find(loc => loc.id === selectedLocation);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Target className="h-5 w-5" />
          <span>Route Tracker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Selection */}
        <div>
          <Label htmlFor="location-select" className="text-white">Select Location</Label>
          <select
            id="location-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full h-10 bg-slate-800 border border-slate-600 rounded-md px-3 text-white mt-1"
          >
            <option value="">Choose a location...</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name} ({location.type})
              </option>
            ))}
          </select>
        </div>

        {selectedLocation && (
          <>
            {/* Location Info */}
            <Card className="bg-slate-700/30 border-slate-600">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{selectedLocationData?.name}</h3>
                    <p className="text-slate-400 text-sm">{selectedLocationData?.address}</p>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Routes change {selectedLocationData?.routeChangeFrequency}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Add Route Form */}
            {showAddRoute && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <Label htmlFor="route-name" className="text-white">Route Name</Label>
                    <Input
                      id="route-name"
                      value={newRoute.name}
                      onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
                      placeholder="Enter route name or description"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="route-color" className="text-white">Color</Label>
                      <select
                        id="route-color"
                        value={newRoute.color}
                        onChange={(e) => setNewRoute({...newRoute, color: e.target.value})}
                        className="w-full h-10 bg-slate-800 border border-slate-600 rounded-md px-3 text-white"
                      >
                        {colors.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="route-difficulty" className="text-white">Difficulty</Label>
                      <select
                        id="route-difficulty"
                        value={newRoute.difficulty}
                        onChange={(e) => setNewRoute({...newRoute, difficulty: e.target.value})}
                        className="w-full h-10 bg-slate-800 border border-slate-600 rounded-md px-3 text-white"
                      >
                        {difficulties.map(diff => (
                          <option key={diff} value={diff}>{diff}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddRoute} className="bg-green-600 hover:bg-green-700">
                      Add Route
                    </Button>
                    <Button 
                      onClick={() => setShowAddRoute(false)} 
                      variant="outline" 
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add Route Button */}
            {!showAddRoute && (
              <Button 
                onClick={() => setShowAddRoute(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Personal Route
              </Button>
            )}

            {/* Routes List */}
            <div className="space-y-2">
              <h3 className="text-white font-medium">Your Routes at {selectedLocationData?.name}</h3>
              {filteredRoutes.length === 0 ? (
                <p className="text-slate-400 text-sm">No routes tracked at this location yet.</p>
              ) : (
                filteredRoutes.map((route) => {
                  const routeAttempts = attempts.filter(a => a.routeId === route.id);
                  const lastAttempt = routeAttempts[routeAttempts.length - 1];
                  
                  return (
                    <Card key={route.id} className="bg-slate-700/30 border-slate-600">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${getColorClass(route.color)}`} />
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="text-white font-medium">{route.name}</p>
                                {!route.isActive && (
                                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                                    Removed
                                  </Badge>
                                )}
                              </div>
                              <p className="text-slate-400 text-sm">
                                {route.difficulty} • {route.color}
                                {lastAttempt && (
                                  <span className="ml-2">
                                    • Last: {lastAttempt.attempts} attempts 
                                    {lastAttempt.completed ? ' ✓' : ' ✗'}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-right text-sm">
                              <p className="text-slate-400">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {route.createdAt.toLocaleDateString()}
                              </p>
                              {routeAttempts.length > 0 && (
                                <p className="text-slate-500">
                                  {routeAttempts.length} session{routeAttempts.length !== 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                            {lastAttempt && (
                              lastAttempt.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-400" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-400" />
                              )
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteTracker;
