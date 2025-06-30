
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Location } from '@/types/location';
import GoogleMapSelector from '@/components/maps/GoogleMapSelector';

interface EditLocationModalProps {
  location: Location;
  onClose: () => void;
  onSave: (locationData: Partial<Location>) => void;
  userLocation?: { lat: number; lng: number } | null;
}

const EditLocationModal = ({ location, onClose, onSave, userLocation }: EditLocationModalProps) => {
  const [formData, setFormData] = useState({
    name: location.name,
    type: location.type,
    address: location.address || '',
    coordinates: location.coordinates,
    routeChangeFrequency: location.routeChangeFrequency
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleLocationSelect = (locationData: { lat: number; lng: number; address: string }) => {
    setFormData(prev => ({
      ...prev,
      coordinates: { lat: locationData.lat, lng: locationData.lng },
      address: locationData.address
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-slate-300">Location Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="type" className="text-slate-300">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: 'gym' | 'outdoor') => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="gym" className="text-white">Gym</SelectItem>
                <SelectItem value="outdoor" className="text-white">Outdoor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="frequency" className="text-slate-300">Route Change Frequency</Label>
            <Select 
              value={formData.routeChangeFrequency} 
              onValueChange={(value: 'weekly' | 'monthly' | 'rarely' | 'never') => 
                setFormData(prev => ({ ...prev, routeChangeFrequency: value }))
              }
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                <SelectItem value="monthly" className="text-white">Monthly</SelectItem>
                <SelectItem value="rarely" className="text-white">Rarely</SelectItem>
                <SelectItem value="never" className="text-white">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300">Location</Label>
            <GoogleMapSelector
              onLocationSelect={handleLocationSelect}
              initialLocation={formData.coordinates || userLocation || undefined}
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-slate-300">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Address will be auto-filled from map selection"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLocationModal;
