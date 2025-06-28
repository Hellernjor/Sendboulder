
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Play, Square } from 'lucide-react';

const SessionTracker = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [todaysSessions, setTodaysSessions] = useState(0);

  // Update session duration every minute
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && sessionStartTime) {
      interval = setInterval(() => {
        const duration = Math.floor((Date.now() - sessionStartTime.getTime()) / (1000 * 60));
        setSessionDuration(duration);
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime]);

  const startSession = () => {
    const now = new Date();
    setIsSessionActive(true);
    setSessionStartTime(now);
    setSessionDuration(0);
  };

  const endSession = () => {
    setIsSessionActive(false);
    setSessionStartTime(null);
    setSessionDuration(0);
    setTodaysSessions(prev => prev + 1);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white text-lg">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Session Tracker</span>
          </div>
          {isSessionActive && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              {formatDuration(sessionDuration)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <p className="text-lg font-bold text-white">{todaysSessions}</p>
            <p className="text-slate-400 text-xs">Today's Sessions</p>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <p className="text-lg font-bold text-white">0</p>
            <p className="text-slate-400 text-xs">Routes Attempted</p>
          </div>
        </div>

        {/* Session Controls */}
        {!isSessionActive ? (
          <Button 
            onClick={startSession}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Climbing Session
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="text-center py-2">
              <p className="text-slate-300 text-sm">Session in progress...</p>
              <p className="text-slate-400 text-xs">
                Started at {sessionStartTime?.toLocaleTimeString()}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => console.log('Adding route to session...')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={endSession}
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionTracker;
