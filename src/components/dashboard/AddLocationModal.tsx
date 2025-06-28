
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Navigation } from 'lucide-react';
import { Location } from '@/types/location';

interface AddLocationModalProps {
  onClose: () => void;
  onAdd: (location: Location) => void;
  userLocation: {lat: number, lng: number} | null;
}

const AddLocationModal = ({ onClose, onAdd, userLocation }: AddLocationModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'gym' | 'outdoor'>('gym');
  const [address, setAddress] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLocation: Location = {
      id: Date.now().toString(),
      name,
      type,
      address,
      coordinates: useCurrentLocation && userLocation ? userLocation : undefined,
      createdBy: 'current-user', // This will be replaced with actual user ID
      createdByUsername: 'You', // This will be replaced with actual username
      createdAt: new Date(),
      routeChangeFrequency: 'monthly',
      isGlobal: true // All locations are global for community use
    };

    onAdd(newLocation);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Add New Location</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-slate-300">Location Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Downtown Climbing Gym"
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="type" className="text-slate-300">Type</Label>
            <Select value={type} onValueChange={(value: 'gym' | 'outdoor') => setType(value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="gym">Gym</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address" className="text-slate-300">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, City, State"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {userLocation && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useLocation"
                checked={useCurrentLocation}
                onChange={(e) => setUseCurrentLocation(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="useLocation" className="text-slate-300 text-sm flex items-center">
                <Navigation className="h-4 w-4 mr-1" />
                Use my current GPS location
              </Label>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!name.trim()}
            >
              Add Location
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationModal;
