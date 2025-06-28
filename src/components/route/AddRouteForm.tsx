
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { Route } from '@/types/route';

interface AddRouteFormProps {
  onAdd: (routeData: Omit<Route, 'id' | 'createdAt' | 'isActive' | 'personalRoute' | 'createdBy'>) => void;
  onCancel: () => void;
  locationId: string;
}

const AddRouteForm = ({ onAdd, onCancel, locationId }: AddRouteFormProps) => {
  const [newRoute, setNewRoute] = useState({
    name: '',
    color: 'Red',
    difficulty: 'V0'
  });

  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Black', 'White', 'Orange', 'Pink'];
  const difficulties = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10+'];

  const handleSubmit = () => {
    if (!newRoute.name) return;
    
    onAdd({
      name: newRoute.name,
      color: newRoute.color,
      difficulty: newRoute.difficulty,
      locationId
    });

    setNewRoute({ name: '', color: 'Red', difficulty: 'V0' });
  };

  return (
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
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Add Personal Route
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

export default AddRouteForm;
