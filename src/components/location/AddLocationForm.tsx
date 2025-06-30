
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';
import { Location, GradeLevel } from '@/types/location';
import GradeSystemManager from './GradeSystemManager';

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

  // Default grade system for new gyms
  const [gradeSystem, setGradeSystem] = useState<GradeLevel[]>([
    { id: '1', color: '#22c55e', name: 'Green', difficulty: 'beginner', order: 0 },
    { id: '2', color: '#eab308', name: 'Yellow', difficulty: 'easy', order: 1 },
    { id: '3', color: '#3b82f6', name: 'Blue', difficulty: 'intermediate', order: 2 },
    { id: '4', color: '#f97316', name: 'Orange', difficulty: 'advanced', order: 3 },
    { id: '5', color: '#ef4444', name: 'Red', difficulty: 'expert', order: 4 }
  ]);

  const handleSubmit = () => {
    if (!newLocation.name) return;
    
    onAdd({
      name: newLocation.name,
      type: newLocation.type,
      address: newLocation.address,
      routeChangeFrequency: newLocation.routeChangeFrequency,
      gradeSystem: newLocation.type === 'gym' ? gradeSystem : undefined
    });

    setNewLocation({
      name: '',
      type: 'gym',
      address: '',
      routeChangeFrequency: 'weekly'
    });
  };

  return (
    <Card className="bg-white/80 border-blue-200 shadow-sm backdrop-blur-sm">
      <CardContent className="p-4 space-y-4">
        <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 text-blue-700">
            <Globe className="h-4 w-4" />
            <p className="text-sm">This location will be visible to all users in the community</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location-name" className="text-slate-700">Location Name</Label>
            <Input
              id="location-name"
              value={newLocation.name}
              onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
              placeholder="Enter location name"
              className="bg-white/80 border-blue-200 text-slate-800"
            />
          </div>
          <div>
            <Label htmlFor="location-type" className="text-slate-700">Type</Label>
            <select
              id="location-type"
              value={newLocation.type}
              onChange={(e) => setNewLocation({...newLocation, type: e.target.value as 'gym' | 'outdoor'})}
              className="w-full h-10 bg-white/80 border border-blue-200 rounded-md px-3 text-slate-800"
            >
              <option value="gym">Gym</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="location-address" className="text-slate-700">Address</Label>
          <Input
            id="location-address"
            value={newLocation.address}
            onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
            placeholder="Enter address or general location"
            className="bg-white/80 border-blue-200 text-slate-800"
          />
        </div>

        <div>
          <Label htmlFor="route-frequency" className="text-slate-700">Route Change Frequency</Label>
          <select
            id="route-frequency"
            value={newLocation.routeChangeFrequency}
            onChange={(e) => setNewLocation({...newLocation, routeChangeFrequency: e.target.value as any})}
            className="w-full h-10 bg-white/80 border border-blue-200 rounded-md px-3 text-slate-800"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="rarely">Rarely</option>
            <option value="never">Never (Outdoor)</option>
          </select>
        </div>

        {newLocation.type === 'gym' && (
          <div>
            <Label className="text-slate-700">Grade System (for gym routes)</Label>
            <GradeSystemManager 
              grades={gradeSystem}
              onGradesChange={setGradeSystem}
            />
          </div>
        )}

        <div className="flex space-x-2">
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Add Global Location
          </Button>
          <Button 
            onClick={onCancel} 
            variant="outline" 
            className="border-blue-300 text-slate-700 hover:bg-blue-50"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddLocationForm;
