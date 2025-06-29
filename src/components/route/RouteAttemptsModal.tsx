
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Calendar, Target } from 'lucide-react';
import { Route, Attempt } from '@/types/route';
import { Location } from '@/types/location';
import GradeBadge from './GradeBadge';

interface RouteAttemptsModalProps {
  route: Route | null;
  attempts: Attempt[];
  location: Location;
  isOpen: boolean;
  onClose: () => void;
}

const RouteAttemptsModal = ({ route, attempts, location, isOpen, onClose }: RouteAttemptsModalProps) => {
  if (!route) return null;

  const routeAttempts = attempts
    .filter(a => a.routeId === route.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Descending order

  const gradeInfo = location.gradeSystem?.find(g => g.id === route.gradeId);
  const gradeName = gradeInfo?.name || 'Unknown Grade';
  const difficultyLabel = gradeInfo?.difficulty || 'unknown';

  const completedAttempts = routeAttempts.filter(a => a.completed).length;
  const totalSessions = routeAttempts.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div 
              className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm" 
              style={{ backgroundColor: route.color }}
            />
            <span>{route.name}</span>
            <GradeBadge 
              gradeName={gradeName}
              difficultyLabel={difficultyLabel}
              isPersonal={route.personalRoute}
              isActive={route.isActive}
            />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{completedAttempts}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">{totalSessions}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalSessions > 0 ? Math.round((completedAttempts / totalSessions) * 100) : 0}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Success Rate</div>
            </div>
          </div>

          {/* Attempts History */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Attempt History</span>
            </h3>
            
            {routeAttempts.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No attempts logged yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {routeAttempts.map((attempt, index) => (
                  <div 
                    key={attempt.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {attempt.completed ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-500" />
                        )}
                        <Badge variant={attempt.completed ? "default" : "secondary"}>
                          {attempt.completed ? "Sent" : "Failed"}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">
                          {attempt.attempts} attempt{attempt.attempts !== 1 ? 's' : ''}
                        </p>
                        {attempt.notes && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {attempt.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(attempt.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteAttemptsModal;
