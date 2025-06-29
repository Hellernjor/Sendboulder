
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Route, Attempt } from '@/types/route';
import { Location } from '@/types/location';
import GradeBadge from './GradeBadge';
import RouteAttemptsModal from './RouteAttemptsModal';

interface RouteCardProps {
  route: Route;
  attempts: Attempt[];
  location: Location;
}

const RouteCard = ({ route, attempts, location }: RouteCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const routeAttempts = attempts.filter(a => a.routeId === route.id);
  const lastAttempt = routeAttempts[routeAttempts.length - 1];
  
  // Find the grade info from the location's grade system
  const gradeInfo = location.gradeSystem?.find(g => g.id === route.gradeId);
  const gradeName = gradeInfo?.name || 'Unknown Grade';
  const difficultyLabel = gradeInfo?.difficulty || 'unknown';

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card 
        className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-600 hover:shadow-lg transition-all cursor-pointer"
        onClick={handleCardClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm hover:scale-110 transition-transform" 
                style={{ backgroundColor: route.color }}
              />
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-indigo-800 dark:text-indigo-200 font-medium">{route.name}</p>
                  <GradeBadge 
                    gradeName={gradeName}
                    difficultyLabel={difficultyLabel}
                    isPersonal={true}
                    isActive={route.isActive}
                  />
                </div>
                {lastAttempt && (
                  <p className="text-indigo-600 dark:text-indigo-300 text-sm">
                    Last: {lastAttempt.attempts} attempts 
                    {lastAttempt.completed ? ' ✓' : ' ✗'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right text-sm">
                <p className="text-indigo-500 dark:text-indigo-400">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {route.createdAt.toLocaleDateString()}
                </p>
                {routeAttempts.length > 0 && (
                  <p className="text-indigo-400 dark:text-indigo-500">
                    {routeAttempts.length} session{routeAttempts.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              {lastAttempt && (
                lastAttempt.completed ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-500" />
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <RouteAttemptsModal
        route={route}
        attempts={attempts}
        location={location}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default RouteCard;
