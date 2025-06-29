
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
    <div className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            {isInitializing ? (
              <div className="text-center text-orange-500 p-6">
                <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium mb-2 text-slate-900">Starting Camera</p>
                <p className="text-sm text-slate-600">Please allow camera access...</p>
              </div>
            ) : cameraError ? (
              <div className="text-center text-red-500 p-6">
                <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2 text-slate-900">Camera Error</p>
                <p className="text-sm mb-4 text-slate-600">{cameraError}</p>
                <Button 
                  onClick={onStartCamera} 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">Ready to document routes</p>
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
          <span className="text-red-600 text-sm font-medium">RECORDING</span>
        </div>
      )}

      {/* Detection overlay */}
      {detectedRoute && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-green-500/20 rounded-lg border border-green-500/30 p-3">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-700 font-medium">Documented: {detectedRoute}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;
