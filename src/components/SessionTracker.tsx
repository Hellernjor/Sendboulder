
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

const SessionTracker = () => {
  const [currentSession, setCurrentSession] = useState({
    startTime: new Date(),
    routes: [
      { id: 1, color: 'Red', difficulty: 'V4', attempts: 3, completed: true },
      { id: 2, color: 'Blue', difficulty: 'V3', attempts: 2, completed: true },
      { id: 3, color: 'Green', difficulty: 'V2', attempts: 1, completed: true },
      { id: 4, color: 'Yellow', difficulty: 'V5', attempts: 4, completed: false },
    ]
  });

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'Red': 'bg-red-500',
      'Blue': 'bg-blue-500',
      'Green': 'bg-green-500',
      'Yellow': 'bg-yellow-500',
      'Purple': 'bg-purple-500',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const sessionDuration = Math.floor((Date.now() - currentSession.startTime.getTime()) / (1000 * 60));
  const completedRoutes = currentSession.routes.filter(route => route.completed).length;
  const totalAttempts = currentSession.routes.reduce((sum, route) => sum + route.attempts, 0);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Current Session</span>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            {sessionDuration}m
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <p className="text-2xl font-bold text-white">{completedRoutes}</p>
            <p className="text-slate-400 text-sm">Completed</p>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <p className="text-2xl font-bold text-white">{totalAttempts}</p>
            <p className="text-slate-400 text-sm">Total Attempts</p>
          </div>
        </div>

        {/* Routes List */}
        <div className="space-y-2">
          <h3 className="text-white font-medium">Routes Attempted</h3>
          {currentSession.routes.map((route) => (
            <div 
              key={route.id}
              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getColorClass(route.color)}`} />
                <div>
                  <p className="text-white font-medium">{route.color} Route</p>
                  <p className="text-slate-400 text-sm">{route.difficulty} • {route.attempts} attempts</p>
                </div>
              </div>
              <div>
                {route.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Route Button */}
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => console.log('Adding new route...')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Route
        </Button>

        {/* Session Actions */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Pause Session
          </Button>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            End Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionTracker;
