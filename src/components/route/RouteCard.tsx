
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Route, Attempt } from '@/types/route';

interface RouteCardProps {
  route: Route;
  attempts: Attempt[];
}

const RouteCard = ({ route, attempts }: RouteCardProps) => {
  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'Red': 'bg-red-500',
      'Blue': 'bg-blue-500',
      'Green': 'bg-green-500',
      'Yellow': 'bg-yellow-500',
      'Purple': 'bg-purple-500',
      'Black': 'bg-gray-800',
      'White': 'bg-gray-100',
      'Orange': 'bg-orange-500',
      'Pink': 'bg-pink-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const routeAttempts = attempts.filter(a => a.routeId === route.id);
  const lastAttempt = routeAttempts[routeAttempts.length - 1];

  return (
    <Card className="bg-slate-700/30 border-slate-600">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${getColorClass(route.color)}`} />
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-white font-medium">{route.name}</p>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  Personal
                </Badge>
                {!route.isActive && (
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                    Removed from gym
                  </Badge>
                )}
              </div>
              <p className="text-slate-400 text-sm">
                {route.difficulty} • {route.color}
                {lastAttempt && (
                  <span className="ml-2">
                    • Last: {lastAttempt.attempts} attempts 
                    {lastAttempt.completed ? ' ✓' : ' ✗'}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right text-sm">
              <p className="text-slate-400">
                <Calendar className="h-3 w-3 inline mr-1" />
                {route.createdAt.toLocaleDateString()}
              </p>
              {routeAttempts.length > 0 && (
                <p className="text-slate-500">
                  {routeAttempts.length} session{routeAttempts.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            {lastAttempt && (
              lastAttempt.completed ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteCard;
