
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

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
            webkit-playsinline="true"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            {isInitializing ? (
              <div className="text-center text-orange-500 p-6">
                <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium mb-2 text-slate-900">Starting Camera</p>
                <p className="text-sm text-slate-600">Please allow camera access...</p>
                <p className="text-xs text-slate-500 mt-2">This may take a few seconds</p>
              </div>
            ) : cameraError ? (
              <div className="text-center text-red-500 p-6 max-w-md">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                <p className="text-lg font-medium mb-2 text-slate-900">Camera Access Issue</p>
                <p className="text-sm mb-4 text-slate-600 leading-relaxed">{cameraError}</p>
                
                {/* Helpful tips based on error type */}
                {cameraError.includes('denied') && (
                  <div className="text-xs text-slate-500 mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                    <p className="font-medium text-blue-800 mb-1">💡 Quick Fix:</p>
                    <p className="text-blue-700">
                      Look for a camera icon in your browser's address bar and click "Allow", 
                      or check your browser settings to enable camera access for this site.
                    </p>
                  </div>
                )}
                
                {cameraError.includes('HTTPS') && (
                  <div className="text-xs text-slate-500 mb-4 p-3 bg-amber-50 rounded border-l-4 border-amber-400">
                    <p className="font-medium text-amber-800 mb-1">🔒 Security Note:</p>
                    <p className="text-amber-700">
                      Camera access requires a secure connection (HTTPS). 
                      This app should work on the deployed version.
                    </p>
                  </div>
                )}
                
                <Button 
                  onClick={onStartCamera} 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0"
                >
                  <Camera className="h-4 w-4 mr-2" />
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
          <span className="text-red-600 text-sm font-medium">READY TO CAPTURE</span>
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
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 text-xs bg-black/50 text-white p-1 rounded">
          Camera: {isCameraActive ? 'Active' : 'Inactive'} | 
          Init: {isInitializing ? 'Yes' : 'No'} |
          Protocol: {window.location.protocol}
        </div>
      )}
    </div>
  );
};

export default CameraView;
