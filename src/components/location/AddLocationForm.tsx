
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';
import { Location } from '@/types/location';

interface AddLocationFormProps {
  onAdd: (location: Omit<Location, 'id' | 'createdBy' | 'createdByUsername' | 'createdAt' | 'isGlobal'>) => void;
  onCancel: () => void;
}

const AddLocationForm = ({ onAdd, onCancel }: AddLocationFormProps) => {
  const [newLocation, setNewLocation] = useState<{
    name: string;
    type: 'gym' | 'outdoor';
    address: string;
    routeChangeFrequency: 'weekly' | 'monthly' | 'rarely' | 'never';
  }>({
    name: '',
    type: 'gym',
    address: '',
    routeChangeFrequency: 'weekly'
  });

  const handleSubmit = () => {
    if (!newLocation.name) return;
    
    onAdd({
      name: newLocation.name,
      type: newLocation.type,
      address: newLocation.address,
      routeChangeFrequency: newLocation.routeChangeFrequency
    });

    setNewLocation({
      name: '',
      type: 'gym',
      address: '',
      routeChangeFrequency: 'weekly'
    });
  };

  return (
    <Card className="bg-slate-700/50 border-slate-600">
      <CardContent className="p-4 space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 text-blue-400">
            <Globe className="h-4 w-4" />
            <p className="text-sm">This location will be visible to all users in the community</p>
          </div>
        </div>
        
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
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Add Global Location
          </Button>
          <Button 
            onClick={onCancel} 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddLocationForm;
