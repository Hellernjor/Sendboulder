
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Smartphone } from 'lucide-react';
import { CameraService } from '@/services/cameraService';
import CameraView from './analyzer/CameraView';
import CameraControls from './analyzer/CameraControls';
import RouteAnalysisModal from './analyzer/RouteAnalysisModal';

const RouteAnalyzer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedRoute, setDetectedRoute] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
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
    setIsInitializing(true);
    setCameraError(null);
    console.log('Starting camera...');
    
    try {
      const result = await cameraServiceRef.current.requestCameraAccess();
      
      if (result.success && videoRef.current) {
        console.log('Camera access granted, attaching to video element');
        const attached = await cameraServiceRef.current.attachToVideo(videoRef.current);
        
        if (attached) {
          setIsCameraActive(true);
          console.log('Camera started successfully');
        } else {
          setCameraError('Failed to attach camera to video element');
          console.error('Failed to attach camera to video element');
        }
      } else {
        setCameraError(result.error || 'Failed to access camera');
        console.error('Camera access failed:', result.error);
      }
    } catch (error) {
      const errorMessage = `Failed to access camera: ${error}`;
      setCameraError(errorMessage);
      console.error('Camera startup error:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    cameraServiceRef.current.stopCamera();
    setIsCameraActive(false);
    setIsRecording(false);
    setDetectedRoute(null);
    console.log('Camera stopped by user');
  };

  const handleStartRecording = async () => {
    if (!isCameraActive) {
      await startCamera();
    }
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleReset = () => {
    // Clear any detected route and restart camera for new photo
    setDetectedRoute(null);
    setCapturedImage(null);
    setShowAnalysisModal(false);
    
    // If camera is not active, restart it
    if (!isCameraActive) {
      startCamera();
    }
  };

  const switchCamera = async () => {
    setIsInitializing(true);
    try {
      const result = await cameraServiceRef.current.switchCamera();
      if (result.success && videoRef.current) {
        await cameraServiceRef.current.attachToVideo(videoRef.current);
      }
    } catch (error) {
      console.error('Error switching camera:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const capturePhoto = () => {
    const imageData = cameraServiceRef.current.captureFrame();
    if (imageData) {
      console.log('Captured photo for route documentation');
      setCapturedImage(imageData);
      setShowAnalysisModal(true);
      setIsRecording(false);
    } else {
      console.error('Failed to capture frame');
      setCameraError('Failed to capture photo. Please try again.');
    }
  };

  const handleAnalysisComplete = (routeName: string) => {
    setDetectedRoute(routeName);
    setShowAnalysisModal(false);
    setCapturedImage(null);
    console.log('Route documented:', routeName);
  };

  const handleAnalysisCancel = () => {
    setShowAnalysisModal(false);
    setCapturedImage(null);
  };

  useEffect(() => {
    return () => {
      cameraServiceRef.current.stopCamera();
    };
  }, []);

  return (
    <>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Camera className="h-5 w-5" />
            <span>Route Documentation</span>
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
            isInitializing={isInitializing}
          />

          <CameraControls
            isRecording={isRecording}
            isCameraActive={isCameraActive}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onSwitchCamera={switchCamera}
            onCapturePhoto={capturePhoto}
            onReset={handleReset}
            isInitializing={isInitializing}
            hasDetectedRoute={!!detectedRoute}
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
            <h4 className="text-blue-400 font-medium mb-2">Photo Tips</h4>
            <ul className="text-blue-300 text-sm space-y-1">
              <li>• Hold phone steady and keep the wall in frame</li>
              <li>• Ensure good lighting for clear documentation</li>
              <li>• Position camera 3-6 feet from the wall</li>
              <li>• Make sure route holds are clearly visible</li>
              <li>• Take picture to save route details</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {showAnalysisModal && capturedImage && (
        <RouteAnalysisModal
          image={capturedImage}
          onComplete={handleAnalysisComplete}
          onCancel={handleAnalysisCancel}
        />
      )}
    </>
  );
};

export default RouteAnalyzer;
