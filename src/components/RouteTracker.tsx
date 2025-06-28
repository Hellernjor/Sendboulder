import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, CheckCircle, XCircle, Calendar, User } from 'lucide-react';
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
        {/* Location Selection */}
        <div>
          <Label htmlFor="location-select" className="text-white">Select Global Location</Label>
          <select
            id="location-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
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

        {selectedLocation && (
          <>
            {/* Location Info */}
            <Card className="bg-slate-700/30 border-slate-600">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{selectedLocationData?.name}</h3>
                    <p className="text-slate-400 text-sm">{selectedLocationData?.address}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      Added by {selectedLocationData?.createdByUsername} • Community location
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                      Routes change {selectedLocationData?.routeChangeFrequency}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Route Form */}
            {showAddRoute && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-4 space-y-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2 text-green-400">
                      <User className="h-4 w-4" />
                      <p className="text-sm">This route will be private to you but linked to this location</p>
                    </div>
                  </div>
                  
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
                      Add Personal Route
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
                Add Personal Route at {selectedLocationData?.name}
              </Button>
            )}

            {/* Routes List */}
            <div className="space-y-2">
              <h3 className="text-white font-medium">Your Routes at {selectedLocationData?.name}</h3>
              {filteredRoutes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No personal routes tracked at this location yet.</p>
                  <p className="text-slate-500 text-xs mt-1">Add your first route to start tracking your progress!</p>
                </div>
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
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                  Personal
                                </Badge>
                                {!route.isActive && (
                                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                                    Removed from gym
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
