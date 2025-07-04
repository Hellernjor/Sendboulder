import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Loader2 } from 'lucide-react';
import { createRoute, createAttempt } from '@/lib/database-functions';
import { useToast } from '@/hooks/use-toast';
import { useRouteData } from '@/hooks/useRouteData';
import LocationManager from './route/LocationManager';
import RouteManager from './route/RouteManager';
import SimpleLoggingMode from './route/SimpleLoggingMode';
import ModeSelector from './route/ModeSelector';

const RouteTracker = () => {
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const { toast } = useToast();
  
  const {
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
  } = useRouteData();

  const selectedLocationData = locations.find(loc => loc.id === selectedLocation);

  const handleQuickScore = async (gradeId: string, attemptCount: number, completed: boolean, notes?: string) => {
    try {
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
      
      const sessionRoute = await createRoute({
        name: `${gradeName} Session - ${new Date().toLocaleDateString()}`,
        color: selectedLocationData?.gradeSystem?.find(g => g.id === gradeId)?.color || '#666666',
        gradeId,
        locationId: selectedLocation,
        isActive: true,
        personalRoute: false
      });

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
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Route Tracking</span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                Public routes
              </Badge>
            </div>
            {selectedLocation && (
              <ModeSelector 
                isSimpleMode={isSimpleMode}
                onModeChange={setIsSimpleMode}
              />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LocationManager
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          onAddLocation={handleAddLocation}
          onUpdateGrades={handleUpdateGrades}
        />

        {selectedLocation && selectedLocationData && (
          <>
            {isSimpleMode ? (
              <SimpleLoggingMode 
                location={selectedLocationData}
                onLogQuickSession={handleQuickSession}
              />
            ) : (
              <RouteManager
                location={selectedLocationData}
                routes={routes}
                attempts={attempts}
                onAddRoute={handleAddRoute}
                onLogAttempt={handleLogAttempt}
                onQuickScore={handleQuickScore}
                onUpdateGrades={handleUpdateGrades}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteTracker;