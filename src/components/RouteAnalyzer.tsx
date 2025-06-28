import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Smartphone } from 'lucide-react';
import { CameraService } from '@/services/cameraService';
import CameraView from './analyzer/CameraView';
import CameraControls from './analyzer/CameraControls';

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
    console.log('Starting camera...');
    
    // Log debug info internally
    console.log('Debug Info:', {
      protocol: location.protocol,
      hostname: location.hostname,
      isSecure: location.protocol === 'https:' || location.hostname === 'localhost',
      userAgent: navigator.userAgent
    });
    
    try {
      // Check permission status first
      const permissionStatus = await cameraServiceRef.current.checkCameraPermission();
      console.log('Current camera permission:', permissionStatus);
      
      const hasAccess = await cameraServiceRef.current.requestCameraAccess();
      if (hasAccess && videoRef.current) {
        cameraServiceRef.current.attachToVideo(videoRef.current);
        setIsCameraActive(true);
        console.log('Camera started successfully');
      } else {
        const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
        let errorMessage = 'Camera access denied. ';
        
        if (!isSecure) {
          errorMessage += 'Camera requires HTTPS connection. ';
        } else {
          errorMessage += 'Please enable camera permissions in your browser settings. ';
        }
        
        errorMessage += `Current URL: ${location.protocol}//${location.hostname}`;
        setCameraError(errorMessage);
        console.error('Camera access failed:', errorMessage);
      }
    } catch (error) {
      const errorMessage = `Failed to access camera: ${error}`;
      setCameraError(errorMessage);
      console.error('Camera startup error:', error);
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
    // No fake route detection - only real AI analysis will set detectedRoute
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
      // When real AI analysis is implemented, it would call setDetectedRoute() with results
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
        <CameraView
          videoRef={videoRef}
          isCameraActive={isCameraActive}
          isRecording={isRecording}
          detectedRoute={detectedRoute}
          cameraError={cameraError}
          onStartCamera={startCamera}
        />

        <CameraControls
          isRecording={isRecording}
          isCameraActive={isCameraActive}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          onSwitchCamera={switchCamera}
          onCapturePhoto={capturePhoto}
          onReset={stopCamera}
        />

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
            <li>• Grant camera permission when prompted</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteAnalyzer;
