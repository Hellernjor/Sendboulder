
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Play, Square, RotateCcw, CheckCircle, SwitchCamera, Smartphone } from 'lucide-react';
import { CameraService } from '@/services/cameraService';

const RouteAnalyzer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedRoute, setDetectedRoute] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraServiceRef = useRef<CameraService>(new CameraService());

  const routeColors = [
    { name: 'Red Route', color: 'bg-red-500', difficulty: 'V4' },
    { name: 'Blue Route', color: 'bg-blue-500', difficulty: 'V3' },
    { name: 'Green Route', color: 'bg-green-500', difficulty: 'V2' },
    { name: 'Yellow Route', color: 'bg-yellow-500', difficulty: 'V5' },
    { name: 'Purple Route', color: 'bg-purple-500', difficulty: 'V6' },
  ];

  const startCamera = async () => {
    setCameraError(null);
    try {
      const hasAccess = await cameraServiceRef.current.requestCameraAccess();
      if (hasAccess && videoRef.current) {
        cameraServiceRef.current.attachToVideo(videoRef.current);
        setIsCameraActive(true);
      } else {
        setCameraError('Camera access denied. Please enable camera permissions.');
      }
    } catch (error) {
      setCameraError('Failed to access camera. Make sure you\'re using HTTPS.');
    }
  };

  const stopCamera = () => {
    cameraServiceRef.current.stopCamera();
    setIsCameraActive(false);
    setIsRecording(false);
    setDetectedRoute(null);
  };

  const handleStartRecording = () => {
    if (!isCameraActive) {
      startCamera();
    }
    setIsRecording(true);
    // Simulate route detection after 3 seconds
    setTimeout(() => {
      if (Math.random() > 0.3) { // 70% success rate
        const randomRoute = routeColors[Math.floor(Math.random() * routeColors.length)];
        setDetectedRoute(randomRoute.name);
      }
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const switchCamera = async () => {
    await cameraServiceRef.current.switchCamera();
  };

  const capturePhoto = () => {
    const imageData = cameraServiceRef.current.captureFrame();
    if (imageData) {
      console.log('Captured frame for analysis:', imageData);
      // Here you would typically send the image for AI analysis
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup camera on component unmount
      cameraServiceRef.current.stopCamera();
    };
  }, []);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Camera className="h-5 w-5" />
          <span>Route Analyzer</span>
          <Smartphone className="h-4 w-4 text-blue-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Camera View */}
        <div className="relative bg-slate-900 rounded-lg overflow-hidden">
          <div className="aspect-video">
            {isCameraActive ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                {cameraError ? (
                  <div className="text-center text-red-400 p-6">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Camera Error</p>
                    <p className="text-sm">{cameraError}</p>
                    <Button 
                      onClick={startCamera} 
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">Tap to start camera</p>
                    <p className="text-slate-500 text-sm">Point at climbing wall for analysis</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm font-medium">ANALYZING</span>
            </div>
          )}

          {/* Detection overlay */}
          {detectedRoute && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-green-500/20 rounded-lg border border-green-500/30 p-3">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <p className="text-green-400 font-medium">Detected: {detectedRoute}</p>
                </div>
              </div>
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
              {isCameraActive ? 'Start Analysis' : 'Start Camera'}
            </Button>
          ) : (
            <Button 
              onClick={handleStopRecording}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Analysis
            </Button>
          )}
          
          {isCameraActive && (
            <>
              <Button 
                onClick={switchCamera}
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <SwitchCamera className="h-4 w-4 mr-2" />
                Switch
              </Button>
              
              <Button 
                onClick={capturePhoto}
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
            </>
          )}
          
          <Button 
            onClick={stopCamera}
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

        {/* Camera Tips */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-2">Camera Tips</h4>
          <ul className="text-blue-300 text-sm space-y-1">
            <li>• Hold phone steady and keep the wall in frame</li>
            <li>• Ensure good lighting for better detection</li>
            <li>• Position camera 3-6 feet from the wall</li>
            <li>• Make sure route holds are clearly visible</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteAnalyzer;
