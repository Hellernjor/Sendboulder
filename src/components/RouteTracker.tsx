import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, User, Loader2, MapPin } from 'lucide-react';
import { Location } from '@/types/location';
import { Route, Attempt } from '@/types/route';
import LocationSelector from './route/LocationSelector';
import LocationInfo from './route/LocationInfo';
import AddRouteForm from './route/AddRouteForm';
import RoutesList from './route/RoutesList';
import QuickScoreSection from './route/QuickScoreSection';
import AddLocationForm from './location/AddLocationForm';
import GradeSystemManager from './location/GradeSystemManager';
import { getLocations, createRoute, getUserRoutes, getUserAttempts, createAttempt, createLocation } from '@/lib/database-functions';
import { useToast } from '@/hooks/use-toast';

const RouteTracker = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showGradeSetup, setShowGradeSetup] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      loadRoutes();
      loadAttempts();
    }
  }, [selectedLocation]);

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
    try {
      const data = await getUserRoutes(selectedLocation);
      setRoutes(data);
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  };

  const loadAttempts = async () => {
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
        personalRoute: true
      });
      await loadRoutes();
      setShowAddRoute(false);
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

  const handleQuickScore = async (gradeId: string, attemptCount: number, completed: boolean, notes?: string) => {
    try {
      // Create a temporary route entry for quick scores
      const quickScoreRoute = await createRoute({
        name: `Quick Score - ${new Date().toLocaleTimeString()}`,
        color: selectedLocationData?.gradeSystem?.find(g => g.id === gradeId)?.color || '#666666',
        gradeId,
        locationId: selectedLocation,
        isActive: true,
        personalRoute: true
      });

      await createAttempt({
        routeId: quickScoreRoute.id,
        locationId: selectedLocation,
        completed,
        attempts: attemptCount,
        date: new Date(),
        notes
      });

      await loadRoutes();
      await loadAttempts();
      
      toast({
        title: "Success",
        description: `Quick score logged! ${completed ? '🎉' : 'Keep trying!'}`,
      });
    } catch (error) {
      console.error('Error logging quick score:', error);
      toast({
        title: "Error",
        description: "Failed to log quick score. Please try again.",
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
      setShowAddLocation(false);
      // Automatically select the new location
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

  const handleSetupGrades = () => {
    setShowGradeSetup(true);
  };

  const handleGradeSetupComplete = async () => {
    setShowGradeSetup(false);
    await loadLocations(); // Reload to get updated grade system
  };

  const filteredRoutes = selectedLocation 
    ? routes.filter(route => route.locationId === selectedLocation)
    : [];

  const selectedLocationData = locations.find(loc => loc.id === selectedLocation);

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
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Your Personal Routes</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              <User className="h-3 w-3 mr-1" />
              Personal tracking
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {locations.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-lg mb-2">No locations available</p>
            <p className="text-slate-500 text-sm mb-4">Add a climbing location to start tracking routes and logging scores.</p>
            <Button 
              onClick={() => setShowAddLocation(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Location
            </Button>
          </div>
        ) : (
          <>
            <LocationSelector 
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
            />

            {selectedLocation && selectedLocationData && (
              <>
                <LocationInfo location={selectedLocationData} />

                {selectedLocationData.type === 'gym' && (
                  <QuickScoreSection 
                    location={selectedLocationData}
                    onLogAttempt={handleQuickScore}
                    onSetupGrades={handleSetupGrades}
                  />
                )}

                {showAddRoute && (
                  <AddRouteForm
                    onAdd={handleAddRoute}
                    onCancel={() => setShowAddRoute(false)}
                    location={selectedLocationData}
                  />
                )}

                {!showAddRoute && (
                  <Button 
                    onClick={() => setShowAddRoute(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={selectedLocationData.type === 'gym' && (!selectedLocationData.gradeSystem || selectedLocationData.gradeSystem.length === 0)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Personal Route at {selectedLocationData.name}
                  </Button>
                )}

                <RoutesList 
                  routes={filteredRoutes}
                  attempts={attempts}
                  locationName={selectedLocationData.name}
                  location={selectedLocationData}
                  onLogAttempt={handleLogAttempt}
                />
              </>
            )}
          </>
        )}

        {showAddLocation && (
          <div className="space-y-4">
            <AddLocationForm
              onAdd={handleAddLocation}
              onCancel={() => setShowAddLocation(false)}
            />
          </div>
        )}

        {showGradeSetup && selectedLocationData && (
          <div className="space-y-4">
            <GradeSystemManager
              location={selectedLocationData}
              onComplete={handleGradeSetupComplete}
              onCancel={() => setShowGradeSetup(false)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteTracker;
