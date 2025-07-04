
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, User, Loader2, MapPin, Settings, Zap } from 'lucide-react';
import { Location, GradeLevel } from '@/types/location';
import { Route, Attempt } from '@/types/route';
import LocationSelector from './route/LocationSelector';
import LocationInfo from './route/LocationInfo';
import AddRouteForm from './route/AddRouteForm';
import RoutesList from './route/RoutesList';
import QuickScoreSection from './route/QuickScoreSection';
import SimpleLoggingMode from './route/SimpleLoggingMode';
import AddLocationForm from './location/AddLocationForm';
import GradeSystemManager from './location/GradeSystemManager';
import { getLocations, createRoute, getUserRoutes, getUserAttempts, createAttempt, createLocation, updateLocation } from '@/lib/database-functions';
import { useToast } from '@/hooks/use-toast';

const RouteTracker = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showGradeSetup, setShowGradeSetup] = useState(false);
  const [isSimpleMode, setIsSimpleMode] = useState(false);
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
        personalRoute: false
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
        personalRoute: false
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

  const handleQuickSession = async (gradeId: string, totalAttempts: number, completedCount: number, notes?: string) => {
    try {
      const gradeName = selectedLocationData?.gradeSystem?.find(g => g.id === gradeId)?.name || 'Unknown';
      
      // Create a session route entry
      const sessionRoute = await createRoute({
        name: `${gradeName} Session - ${new Date().toLocaleDateString()}`,
        color: selectedLocationData?.gradeSystem?.find(g => g.id === gradeId)?.color || '#666666',
        gradeId,
        locationId: selectedLocation,
        isActive: true,
        personalRoute: false
      });

      // Log completed attempts
      if (completedCount > 0) {
        await createAttempt({
          routeId: sessionRoute.id,
          locationId: selectedLocation,
          completed: true,
          attempts: completedCount,
          date: new Date(),
          notes: notes ? `${notes} (${completedCount}/${totalAttempts} completed)` : `${completedCount}/${totalAttempts} completed`
        });
      }

      // Log failed attempts if any
      const failedCount = totalAttempts - completedCount;
      if (failedCount > 0) {
        await createAttempt({
          routeId: sessionRoute.id,
          locationId: selectedLocation,
          completed: false,
          attempts: failedCount,
          date: new Date(),
          notes: notes ? `${notes} (${failedCount}/${totalAttempts} failed)` : `${failedCount}/${totalAttempts} failed`
        });
      }

      await loadRoutes();
      await loadAttempts();
      
      toast({
        title: "Session Logged! 🎉",
        description: `${completedCount}/${totalAttempts} ${gradeName} routes completed`,
      });
    } catch (error) {
      console.error('Error logging session:', error);
      toast({
        title: "Error",
        description: "Failed to log session. Please try again.",
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

  const handleGradeSetupComplete = async (updatedGrades: GradeLevel[]) => {
    if (selectedLocationData) {
      try {
        // Update the location with new grade system
        await updateLocation(selectedLocationData.id, {
          ...selectedLocationData,
          gradeSystem: updatedGrades
        });
        await loadLocations();
        setShowGradeSetup(false);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Route Tracking</span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                Public routes
              </Badge>
            </div>
            {selectedLocation && (
              <div className="flex items-center space-x-2">
                <Button
                  variant={isSimpleMode ? "outline" : "default"}
                  size="sm"
                  onClick={() => setIsSimpleMode(false)}
                  className={!isSimpleMode ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-slate-300"}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Advanced
                </Button>
                <Button
                  variant={isSimpleMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsSimpleMode(true)}
                  className={isSimpleMode ? "bg-yellow-600 hover:bg-yellow-700" : "border-slate-600 text-slate-300"}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Simple
                </Button>
              </div>
            )}
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

                {isSimpleMode ? (
                  <SimpleLoggingMode 
                    location={selectedLocationData}
                    onLogQuickSession={handleQuickSession}
                  />
                ) : (
                  <>
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
                        Add Public Route at {selectedLocationData.name}
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
              grades={selectedLocationData.gradeSystem || []}
              onGradesChange={handleGradeSetupComplete}
            />
            <Button 
              onClick={() => setShowGradeSetup(false)}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteTracker;
