
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Navigation, Loader2 } from 'lucide-react';
import { Location } from '@/types/location';
import AddLocationModal from './AddLocationModal';
import EditLocationModal from './EditLocationModal';
import { getLocations, updateLocation, deleteLocation } from '@/lib/database-functions';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
    loadLocations();
    getUserLocation();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error loading locations:', error);
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
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoadingLocation(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
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
    return distance;
  };

  const handleEditLocation = async (locationData: Partial<Location>) => {
    if (!editingLocation) return;
    
    try {
      await updateLocation(editingLocation.id, locationData);
      await loadLocations();
      setEditingLocation(null);
      toast({
        title: "Success",
        description: "Location updated successfully!",
      });
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Error",
        description: "Failed to update location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    try {
      await deleteLocation(locationId);
      setLocations(locations.filter(loc => loc.id !== locationId));
      toast({
        title: "Success",
        description: "Location deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting location:', error);
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

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-white text-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Choose Location</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={getUserLocation}
              disabled={loadingLocation}
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
              <MapPin className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm mb-3">No locations available</p>
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
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex-1 cursor-pointer">
                        <h3 className="text-white font-medium text-sm">{location.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={location.type === 'gym' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {location.type}
                          </Badge>
                          {distance && (
                            <span className="text-slate-400 text-xs">
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
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 h-8 w-8 p-0"
                          >
                            <MapPin className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLocation(location.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30 h-8 w-8 p-0"
                          >
                            ×
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
          onClose={() => setShowAddLocation(false)}
          onAdd={(newLocation) => {
            setLocations([...locations, newLocation]);
            setShowAddLocation(false);
          }}
          userLocation={userLocation}
        />
      )}

      {editingLocation && (
        <EditLocationModal
          location={editingLocation}
          onClose={() => setEditingLocation(null)}
          onSave={handleEditLocation}
          userLocation={userLocation}
        />
      )}
    </>
  );
};

export default LocationChoice;
