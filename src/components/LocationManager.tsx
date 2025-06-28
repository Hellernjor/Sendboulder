
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Building, Mountain, Edit, Trash2 } from 'lucide-react';

export interface Location {
  id: string;
  name: string;
  type: 'gym' | 'outdoor';
  address?: string;
  coordinates?: { lat: number; lng: number };
  createdBy: string;
  createdAt: Date;
  routeChangeFrequency: 'weekly' | 'monthly' | 'rarely' | 'never';
}

const LocationManager = () => {
  const [locations, setLocations] = useState<Location[]>([
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
      coordinates: { lat: 44.3672, lng: -121.1419 },
      createdBy: 'user456',
      createdAt: new Date('2024-02-01'),
      routeChangeFrequency: 'never'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: '',
    type: 'gym',
    address: '',
    routeChangeFrequency: 'weekly'
  });

  const handleAddLocation = () => {
    if (!newLocation.name) return;
    
    const location: Location = {
      id: Date.now().toString(),
      name: newLocation.name,
      type: newLocation.type || 'gym',
      address: newLocation.address,
      coordinates: newLocation.coordinates,
      createdBy: 'current-user',
      createdAt: new Date(),
      routeChangeFrequency: newLocation.routeChangeFrequency || 'weekly'
    };

    setLocations([...locations, location]);
    setNewLocation({
      name: '',
      type: 'gym',
      address: '',
      routeChangeFrequency: 'weekly'
    });
    setShowAddForm(false);
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'monthly': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rarely': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'never': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Climbing Locations</span>
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
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location-name" className="text-white">Location Name</Label>
                  <Input
                    id="location-name"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                    placeholder="Enter location name"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="location-type" className="text-white">Type</Label>
                  <select
                    id="location-type"
                    value={newLocation.type}
                    onChange={(e) => setNewLocation({...newLocation, type: e.target.value as 'gym' | 'outdoor'})}
                    className="w-full h-10 bg-slate-800 border border-slate-600 rounded-md px-3 text-white"
                  >
                    <option value="gym">Gym</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="location-address" className="text-white">Address</Label>
                <Input
                  id="location-address"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                  placeholder="Enter address or general location"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="route-frequency" className="text-white">Route Change Frequency</Label>
                <select
                  id="route-frequency"
                  value={newLocation.routeChangeFrequency}
                  onChange={(e) => setNewLocation({...newLocation, routeChangeFrequency: e.target.value as any})}
                  className="w-full h-10 bg-slate-800 border border-slate-600 rounded-md px-3 text-white"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="rarely">Rarely</option>
                  <option value="never">Never (Outdoor)</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleAddLocation} className="bg-green-600 hover:bg-green-700">
                  Add Location
                </Button>
                <Button 
                  onClick={() => setShowAddForm(false)} 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {locations.map((location) => (
            <Card key={location.id} className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-600/50 rounded-lg">
                      {location.type === 'gym' ? (
                        <Building className="h-5 w-5 text-blue-400" />
                      ) : (
                        <Mountain className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{location.name}</h3>
                      <p className="text-slate-400 text-sm">{location.address}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {location.type}
                        </Badge>
                        <Badge className={`text-xs ${getFrequencyColor(location.routeChangeFrequency)}`}>
                          Routes change {location.routeChangeFrequency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationManager;
