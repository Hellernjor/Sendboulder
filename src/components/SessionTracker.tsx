
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock } from 'lucide-react';

const SessionTracker = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentSession, setCurrentSession] = useState({
    startTime: new Date(),
    routes: []
  });

  const startSession = () => {
    setIsSessionActive(true);
    setCurrentSession({
      startTime: new Date(),
      routes: []
    });
  };

  const endSession = () => {
    setIsSessionActive(false);
    setCurrentSession({
      startTime: new Date(),
      routes: []
    });
  };

  if (!isSessionActive) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Clock className="h-5 w-5" />
            <span>Session Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <p className="text-slate-400 mb-4">No active session</p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={startSession}
            >
              Start Climbing Session
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sessionDuration = Math.floor((Date.now() - currentSession.startTime.getTime()) / (1000 * 60));

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
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-slate-400 text-sm">Completed</p>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-slate-400 text-sm">Total Attempts</p>
          </div>
        </div>

        {/* Routes List */}
        <div className="space-y-2">
          <h3 className="text-white font-medium">Routes Attempted</h3>
          <div className="text-center py-4">
            <p className="text-slate-400 text-sm">No routes attempted yet</p>
          </div>
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
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={endSession}
          >
            End Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionTracker;
