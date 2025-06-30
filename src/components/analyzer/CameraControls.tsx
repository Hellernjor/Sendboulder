
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, SwitchCamera, RotateCcw, Camera, Loader2, RefreshCw } from 'lucide-react';

interface CameraControlsProps {
  isRecording: boolean;
  isCameraActive: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSwitchCamera: () => void;
  onCapturePhoto: () => void;
  onReset: () => void;
  isInitializing?: boolean;
  hasDetectedRoute?: boolean;
}

const CameraControls = ({
  isRecording,
  isCameraActive,
  onStartRecording,
  onStopRecording,
  onSwitchCamera,
  onCapturePhoto,
  onReset,
  isInitializing = false,
  hasDetectedRoute = false
}: CameraControlsProps) => {
  return (
    <div className="flex justify-center space-x-4">
      {!isCameraActive ? (
        <Button 
          onClick={onStartRecording}
          disabled={isInitializing}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 disabled:opacity-50 border-0"
        >
          {isInitializing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          {isInitializing ? 'Starting...' : 'Start Camera'}
        </Button>
      ) : (
        <>
          {hasDetectedRoute ? (
            <Button 
              onClick={onReset}
              disabled={isInitializing}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 disabled:opacity-50 border-0"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Take New Photo
            </Button>
          ) : (
            <Button 
              onClick={onCapturePhoto}
              disabled={isInitializing}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 disabled:opacity-50 border-0"
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Picture of Route
            </Button>
          )}
          
          <Button 
            onClick={onSwitchCamera}
            disabled={isInitializing}
            variant="outline" 
            className="border-gray-300 text-slate-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {isInitializing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <SwitchCamera className="h-4 w-4 mr-2" />
            )}
            Switch Camera
          </Button>
        </>
      )}
      
      <Button 
        onClick={onReset}
        disabled={isInitializing}
        variant="outline" 
        className="border-gray-300 text-slate-700 hover:bg-gray-50 disabled:opacity-50"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  );
};

export default CameraControls;
