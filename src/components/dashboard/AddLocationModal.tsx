
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { Location } from '@/types/location';
import GoogleMapSelector from '@/components/maps/GoogleMapSelector';

interface AddLocationModalProps {
  onClose: () => void;
  onAdd: (location: Location) => void;
  userLocation: {lat: number, lng: number} | null;
}

const AddLocationModal = ({ onClose, onAdd, userLocation }: AddLocationModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'gym' | 'outdoor'>('gym');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(userLocation);

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setCoordinates({ lat: location.lat, lng: location.lng });
    setAddress(location.address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLocation: Location = {
      id: Date.now().toString(),
      name,
      type,
      address,
      coordinates: coordinates || undefined,
      createdBy: 'current-user',
      createdByUsername: 'You',
      createdAt: new Date(),
      routeChangeFrequency: 'monthly',
      isGlobal: true
    };

    onAdd(newLocation);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Add New Location</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-slate-700">Location Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Downtown Climbing Gym"
              className="bg-white border-slate-300 text-slate-900"
              required
            />
          </div>

          <div>
            <Label htmlFor="type" className="text-slate-700">Type</Label>
            <Select value={type} onValueChange={(value: 'gym' | 'outdoor') => setType(value)}>
              <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300">
                <SelectItem value="gym">Gym</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location" className="text-slate-700">Location</Label>
            <GoogleMapSelector
              onLocationSelect={handleLocationSelect}
              initialLocation={userLocation || undefined}
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-slate-700">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address will be filled automatically from map selection"
              className="bg-slate-50 border-slate-300 text-slate-900"
              readOnly
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!name.trim() || !coordinates}
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
