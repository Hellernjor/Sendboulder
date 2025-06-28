
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const SessionTracker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todaysRoutes, setTodaysRoutes] = useState(0);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate session duration (last 24 hours)
  const sessionStartTime = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white text-lg">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Current Session</span>
          </div>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
            24h Rolling
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Session Info */}
        <div className="text-center py-2 bg-slate-700/30 rounded-lg">
          <p className="text-slate-300 text-sm">Session Period</p>
          <p className="text-slate-400 text-xs">
            {formatTime(sessionStartTime)} - {formatTime(currentTime)}
          </p>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <p className="text-lg font-bold text-white">{todaysRoutes}</p>
            <p className="text-slate-400 text-xs">Routes Attempted</p>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <p className="text-lg font-bold text-white">0</p>
            <p className="text-slate-400 text-xs">Routes Completed</p>
          </div>
        </div>

        {/* Session Note */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <p className="text-blue-300 text-sm text-center">
            All activity in the last 24 hours counts as your current session
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionTracker;
