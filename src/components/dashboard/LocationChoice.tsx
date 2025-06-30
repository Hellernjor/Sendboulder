
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Navigation, Loader2, Edit, Trash2 } from 'lucide-react';
import { Location } from '@/types/location';
import AddLocationModal from './AddLocationModal';
import EditLocationModal from './EditLocationModal';
import { getLocations, updateLocation, deleteLocation } from '@/lib/database-functions';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Logger } from '@/lib/logger';

const LocationChoice = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
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

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    Logger.debug('LocationChoice', `Calculated distance: ${distance.toFixed(2)}km`, {
      from: { lat: lat1, lng: lng1 },
      to: { lat: lat2, lng: lng2 }
    });
    
    return distance;
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

  // Sort locations by distance from user
  const sortedLocations = userLocation ? 
    [...locations].sort((a, b) => {
      if (!a.coordinates || !b.coordinates) return 0;
      const distanceA = calculateDistance(
        userLocation.lat, userLocation.lng,
        a.coordinates.lat, a.coordinates.lng
      );
      const distanceB = calculateDistance(
        userLocation.lat, userLocation.lng,
        b.coordinates.lat, b.coordinates.lng
      );
      return distanceA - distanceB;
    }) : locations;

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
            <Button
              variant="ghost"
              size="sm"
              onClick={getUserLocation}
              disabled={loadingLocation}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              {loadingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {locations.length === 0 ? (
            <div className="text-center py-6">
              <MapPin className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 text-sm mb-3">No locations available</p>
              <Button 
                onClick={() => setShowAddLocation(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Location
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sortedLocations.map((location) => {
                  const distance = userLocation && location.coordinates ? 
                    calculateDistance(
                      userLocation.lat, userLocation.lng,
                      location.coordinates.lat, location.coordinates.lng
                    ) : null;

                  const canEdit = user && location.createdBy === user.id;

                  return (
                    <div 
                      key={location.id}
                      className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg hover:bg-blue-100/50 transition-colors border border-blue-100"
                    >
                      <div className="flex-1 cursor-pointer">
                        <h3 className="text-slate-800 font-medium text-sm">{location.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={location.type === 'gym' ? 'default' : 'secondary'}
                            className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                          >
                            {location.type}
                          </Badge>
                          {distance && (
                            <span className="text-slate-500 text-xs">
                              {distance < 1 ? 
                                `${Math.round(distance * 1000)}m` : 
                                `${distance.toFixed(1)}km`
                              }
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {canEdit && (
                        <div className="flex space-x-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingLocation(location)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLocation(location.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <Button 
                onClick={() => setShowAddLocation(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Location
              </Button>
            </>
          )}
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
