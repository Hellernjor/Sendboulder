
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { Route } from '@/types/route';
import { Location } from '@/types/location';

interface AddRouteFormProps {
  onAdd: (routeData: Omit<Route, 'id' | 'createdAt' | 'isActive' | 'personalRoute' | 'createdBy'>) => void;
  onCancel: () => void;
  location: Location;
}

const AddRouteForm = ({ onAdd, onCancel, location }: AddRouteFormProps) => {
  const [newRoute, setNewRoute] = useState({
    name: '',
    color: '',
    gradeId: ''
  });

  const gymGrades = location.gradeSystem || [];

  const handleSubmit = () => {
    if (!newRoute.name || !newRoute.gradeId) return;
    
    const selectedGrade = gymGrades.find(g => g.id === newRoute.gradeId);
    
    onAdd({
      name: newRoute.name,
      color: selectedGrade?.color || '#gray',
      gradeId: newRoute.gradeId,
      locationId: location.id
    });

    setNewRoute({ name: '', color: '', gradeId: '' });
  };

  if (gymGrades.length === 0) {
    return (
      <Card className="bg-white/80 border-blue-200 shadow-sm backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="bg-yellow-50/80 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-yellow-700 text-sm">
              This gym doesn't have a grade system set up yet. Ask the gym owner to define their color grades!
            </p>
          </div>
          <div className="mt-4">
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
  }

  return (
    <Card className="bg-white/80 border-blue-200 shadow-sm backdrop-blur-sm">
      <CardContent className="p-4 space-y-3">
        <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 text-blue-700">
            <User className="h-4 w-4" />
            <p className="text-sm">This route will be public and available for everyone at this location</p>
          </div>
        </div>
        
        <div>
          <Label htmlFor="route-name" className="text-slate-700">Route Name</Label>
          <Input
            id="route-name"
            value={newRoute.name}
            onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
            placeholder="Enter route name or description"
            className="bg-white/80 border-blue-200 text-slate-800"
          />
        </div>
        
        <div>
          <Label htmlFor="route-grade" className="text-slate-700">Grade</Label>
          <select
            id="route-grade"
            value={newRoute.gradeId}
            onChange={(e) => setNewRoute({...newRoute, gradeId: e.target.value})}
            className="w-full h-10 bg-white/80 border border-blue-200 rounded-md px-3 text-slate-800"
          >
            <option value="">Select a grade</option>
            {gymGrades.sort((a, b) => a.order - b.order).map(grade => (
              <option key={grade.id} value={grade.id}>
                {grade.name} - {grade.difficulty}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Add Public Route
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

export default AddRouteForm;
