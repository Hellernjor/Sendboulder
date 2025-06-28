
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Play, Square, RotateCcw, CheckCircle } from 'lucide-react';

const RouteAnalyzer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [detectedRoute, setDetectedRoute] = useState<string | null>(null);

  const routeColors = [
    { name: 'Red Route', color: 'bg-red-500', difficulty: 'V4' },
    { name: 'Blue Route', color: 'bg-blue-500', difficulty: 'V3' },
    { name: 'Green Route', color: 'bg-green-500', difficulty: 'V2' },
    { name: 'Yellow Route', color: 'bg-yellow-500', difficulty: 'V5' },
    { name: 'Purple Route', color: 'bg-purple-500', difficulty: 'V6' },
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate route detection after 2 seconds
    setTimeout(() => {
      setDetectedRoute('Red Route');
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Camera className="h-5 w-5" />
          <span>Route Analyzer</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Camera View Placeholder */}
        <div className="relative bg-slate-900 rounded-lg overflow-hidden">
          <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            {isRecording ? (
              <div className="text-center space-y-4">
                <div className="animate-pulse">
                  <Camera className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  <p className="text-white text-lg font-medium">Analyzing route...</p>
                  <p className="text-slate-400">Keep the wall in view</p>
                </div>
                {detectedRoute && (
                  <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <CheckCircle className="h-5 w-5 text-green-400 mx-auto mb-2" />
                    <p className="text-green-400 font-medium">Detected: {detectedRoute}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <Camera className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Camera feed will appear here</p>
                <p className="text-slate-500 text-sm">Point camera at climbing wall</p>
              </div>
            )}
          </div>
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm font-medium">REC</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <Button 
              onClick={handleStartRecording}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Analysis
            </Button>
          ) : (
            <Button 
              onClick={handleStopRecording}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Route Colors Reference */}
        <div>
          <h3 className="text-white font-medium mb-3">Route Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {routeColors.map((route, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className={`w-4 h-4 rounded-full ${route.color}`} />
                <div>
                  <p className="text-white text-sm font-medium">{route.name}</p>
                  <p className="text-slate-400 text-xs">{route.difficulty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteAnalyzer;
