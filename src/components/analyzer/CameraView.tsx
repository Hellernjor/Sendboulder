
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, Loader2 } from 'lucide-react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isCameraActive: boolean;
  isRecording: boolean;
  detectedRoute: string | null;
  cameraError: string | null;
  onStartCamera: () => void;
  isInitializing?: boolean;
}

const CameraView = ({
  videoRef,
  isCameraActive,
  isRecording,
  detectedRoute,
  cameraError,
  onStartCamera,
  isInitializing = false
}: CameraViewProps) => {
  return (
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
            {isInitializing ? (
              <div className="text-center text-blue-400 p-6">
                <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium mb-2">Starting Camera</p>
                <p className="text-sm">Please allow camera access...</p>
              </div>
            ) : cameraError ? (
              <div className="text-center text-red-400 p-6">
                <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Camera Error</p>
                <p className="text-sm mb-4">{cameraError}</p>
                <Button 
                  onClick={onStartCamera} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Ready to analyze routes</p>
                <p className="text-slate-500 text-sm">Tap "Start Camera" to begin</p>
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
  );
};

export default CameraView;
