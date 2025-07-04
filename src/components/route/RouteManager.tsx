import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Route, Attempt } from '@/types/route';
import { Location, GradeLevel } from '@/types/location';
import AddRouteForm from './AddRouteForm';
import RoutesList from './RoutesList';
import QuickScoreSection from './QuickScoreSection';
import GradeSystemManager from '../location/GradeSystemManager';

interface RouteManagerProps {
  location: Location;
  routes: Route[];
  attempts: Attempt[];
  onAddRoute: (routeData: Omit<Route, 'id' | 'createdAt' | 'isActive' | 'personalRoute' | 'createdBy'>) => Promise<void>;
  onLogAttempt: (routeId: string, attempts: number, completed: boolean, notes?: string) => Promise<void>;
  onQuickScore: (gradeId: string, attemptCount: number, completed: boolean, notes?: string) => Promise<void>;
  onUpdateGrades: (locationId: string, grades: GradeLevel[]) => Promise<void>;
}

const RouteManager = ({ 
  location, 
  routes, 
  attempts, 
  onAddRoute, 
  onLogAttempt, 
  onQuickScore, 
  onUpdateGrades 
}: RouteManagerProps) => {
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [showGradeSetup, setShowGradeSetup] = useState(false);

  const handleAddRoute = async (routeData: Omit<Route, 'id' | 'createdAt' | 'isActive' | 'personalRoute' | 'createdBy'>) => {
    await onAddRoute(routeData);
    setShowAddRoute(false);
  };

  const handleSetupGrades = () => {
    setShowGradeSetup(true);
  };

  const handleGradeSetupComplete = async (updatedGrades: GradeLevel[]) => {
    await onUpdateGrades(location.id, updatedGrades);
    setShowGradeSetup(false);
  };

  const filteredRoutes = routes.filter(route => route.locationId === location.id);

  return (
    <div className="space-y-4">
      {location.type === 'gym' && (
        <QuickScoreSection 
          location={location}
          onLogAttempt={onQuickScore}
          onSetupGrades={handleSetupGrades}
        />
      )}

      {showGradeSetup && (
        <div className="space-y-4">
          <GradeSystemManager
            grades={location.gradeSystem || []}
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

      {showAddRoute && (
        <AddRouteForm
          onAdd={handleAddRoute}
          onCancel={() => setShowAddRoute(false)}
          location={location}
        />
      )}

      {!showAddRoute && !showGradeSetup && (
        <Button 
          onClick={() => setShowAddRoute(true)}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={location.type === 'gym' && (!location.gradeSystem || location.gradeSystem.length === 0)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Public Route at {location.name}
        </Button>
      )}

      <RoutesList 
        routes={filteredRoutes}
        attempts={attempts}
        locationName={location.name}
        location={location}
        onLogAttempt={onLogAttempt}
      />
    </div>
  );
};

export default RouteManager;