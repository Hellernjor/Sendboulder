
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import { Location } from '@/types/location';
import AddLocationModal from './AddLocationModal';
import EditLocationModal from './EditLocationModal';
import LocationList from './location/LocationList';
import UserLocationButton from './location/UserLocationButton';
import { getLocations, updateLocation, deleteLocation } from '@/lib/database-functions';
import { useToast } from '@/hooks/use-toast';
import { Logger } from '@/lib/logger';

const LocationChoice = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    Logger.component('LocationChoice', 'Component mounted, loading initial data');
    loadLocations();
    getUserLocation();
  }, []);

  const loadLocations = async () => {
    Logger.db('LocationChoice', 'Loading locations from database');
    try {
      const data = await getLocations();
      Logger.success('LocationChoice', `Loaded ${data.length} locations`, { locations: data });
      setLocations(data);
    } catch (error) {
      Logger.error('LocationChoice', 'Failed to load locations', error);
      toast({
        title: "Error",
        description: "Failed to load locations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get user's GPS location
  const getUserLocation = () => {
    Logger.debug('LocationChoice', 'Requesting user GPS location');
    setLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          Logger.success('LocationChoice', 'Got user GPS location', location);
          setUserLocation(location);
          setLoadingLocation(false);
        },
        (error) => {
          Logger.error('LocationChoice', 'Failed to get GPS location', {
            code: error.code,
            message: error.message
          });
          setLoadingLocation(false);
        }
      );
    } else {
      Logger.error('LocationChoice', 'Geolocation not supported by browser');
      setLoadingLocation(false);
    }
  };

  const handleEditLocation = async (locationData: Partial<Location>) => {
    if (!editingLocation) return;
    
    Logger.db('LocationChoice', 'Updating location', { locationId: editingLocation.id, data: locationData });
    
    try {
      await updateLocation(editingLocation.id, locationData);
      Logger.success('LocationChoice', 'Location updated successfully');
      await loadLocations();
      setEditingLocation(null);
      toast({
        title: "Success",
        description: "Location updated successfully!",
      });
    } catch (error) {
      Logger.error('LocationChoice', 'Failed to update location', error);
      toast({
        title: "Error",
        description: "Failed to update location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    Logger.db('LocationChoice', 'Deleting location', { locationId });
    
    try {
      await deleteLocation(locationId);
      Logger.success('LocationChoice', 'Location deleted successfully');
      setLocations(locations.filter(loc => loc.id !== locationId));
      toast({
        title: "Success",
        description: "Location deleted successfully!",
      });
    } catch (error) {
      Logger.error('LocationChoice', 'Failed to delete location', error);
      toast({
        title: "Error",
        description: "Failed to delete location. Please try again.",
        variant: "destructive",
      });
    }
  };

  Logger.debug('LocationChoice', 'Rendering component', {
    locationsCount: locations.length,
    hasUserLocation: !!userLocation,
    loading,
    showAddLocation,
    editingLocation: !!editingLocation
  });

  if (loading) {
    return (
      <Card className="bg-white/80 border-blue-200 shadow-sm backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/80 border-blue-200 shadow-sm backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-slate-800 text-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Choose Location</span>
            </div>
            <UserLocationButton
              loadingLocation={loadingLocation}
              onGetLocation={getUserLocation}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <LocationList
            locations={locations}
            userLocation={userLocation}
            onAddLocation={() => setShowAddLocation(true)}
            onEditLocation={setEditingLocation}
            onDeleteLocation={handleDeleteLocation}
          />
        </CardContent>
      </Card>

      {showAddLocation && (
        <AddLocationModal
          onClose={() => {
            Logger.debug('LocationChoice', 'Closing add location modal');
            setShowAddLocation(false);
          }}
          onAdd={(newLocation) => {
            Logger.success('LocationChoice', 'New location added', newLocation);
            setLocations([...locations, newLocation]);
            setShowAddLocation(false);
          }}
          userLocation={userLocation}
        />
      )}

      {editingLocation && (
        <EditLocationModal
          location={editingLocation}
          onClose={() => {
            Logger.debug('LocationChoice', 'Closing edit location modal');
            setEditingLocation(null);
          }}
          onSave={handleEditLocation}
          userLocation={userLocation}
        />
      )}
    </>
  );
};

export default LocationChoice;
