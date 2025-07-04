import { useState, useEffect } from 'react';
import { Route, Attempt } from '@/types/route';
import { Location, GradeLevel } from '@/types/location';
import { 
  getLocations, 
  createRoute, 
  getUserRoutes, 
  getUserAttempts, 
  createAttempt, 
  createLocation, 
  updateLocation 
} from '@/lib/database-functions';
import { useToast } from '@/hooks/use-toast';

export const useRouteData = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoutes = async () => {
    if (!selectedLocation) return;
    try {
      const data = await getUserRoutes(selectedLocation);
      setRoutes(data);
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  };

  const loadAttempts = async () => {
    if (!selectedLocation) return;
    try {
      const data = await getUserAttempts(selectedLocation);
      setAttempts(data);
    } catch (error) {
      console.error('Error loading attempts:', error);
    }
  };

  const handleAddRoute = async (routeData: Omit<Route, 'id' | 'createdAt' | 'isActive' | 'personalRoute' | 'createdBy'>) => {
    try {
      await createRoute({
        ...routeData,
        isActive: true,
        personalRoute: false
      });
      await loadRoutes();
      toast({
        title: "Success",
        description: "Route added successfully!",
      });
    } catch (error) {
      console.error('Error adding route:', error);
      toast({
        title: "Error",
        description: "Failed to add route. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogAttempt = async (routeId: string, attemptCount: number, completed: boolean, notes?: string) => {
    try {
      await createAttempt({
        routeId,
        locationId: selectedLocation,
        completed,
        attempts: attemptCount,
        date: new Date(),
        notes
      });
      await loadAttempts();
      toast({
        title: "Success",
        description: `Attempt logged successfully! ${completed ? '🎉' : 'Keep trying!'}`,
      });
    } catch (error) {
      console.error('Error logging attempt:', error);
      toast({
        title: "Error",
        description: "Failed to log attempt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddLocation = async (locationData: Omit<Location, 'id' | 'createdBy' | 'createdByUsername' | 'createdAt' | 'isGlobal'>) => {
    try {
      const newLocation = await createLocation({
        ...locationData,
        isGlobal: true
      });
      await loadLocations();
      setSelectedLocation(newLocation.id);
      toast({
        title: "Success",
        description: "Location added successfully!",
      });
    } catch (error) {
      console.error('Error adding location:', error);
      toast({
        title: "Error",
        description: "Failed to add location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateGrades = async (locationId: string, updatedGrades: GradeLevel[]) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      try {
        await updateLocation(locationId, {
          ...location,
          gradeSystem: updatedGrades
        });
        await loadLocations();
        toast({
          title: "Success",
          description: "Grade system updated successfully!",
        });
      } catch (error) {
        console.error('Error updating grade system:', error);
        toast({
          title: "Error",
          description: "Failed to update grade system. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      loadRoutes();
      loadAttempts();
    }
  }, [selectedLocation]);

  return {
    selectedLocation,
    setSelectedLocation,
    locations,
    routes,
    attempts,
    loading,
    handleAddRoute,
    handleLogAttempt,
    handleAddLocation,
    handleUpdateGrades
  };
};