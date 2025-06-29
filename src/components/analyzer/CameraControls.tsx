
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, SwitchCamera, RotateCcw, Camera, Loader2 } from 'lucide-react';

interface CameraControlsProps {
  isRecording: boolean;
  isCameraActive: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSwitchCamera: () => void;
  onCapturePhoto: () => void;
  onReset: () => void;
  isInitializing?: boolean;
}

const CameraControls = ({
  isRecording,
  isCameraActive,
  onStartRecording,
  onStopRecording,
  onSwitchCamera,
  onCapturePhoto,
  onReset,
  isInitializing = false
}: CameraControlsProps) => {
  return (
    <div className="flex justify-center space-x-4">
      {!isCameraActive ? (
        <Button 
          onClick={onStartRecording}
          disabled={isInitializing}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 disabled:opacity-50"
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
          <Button 
            onClick={onCapturePhoto}
            disabled={isInitializing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 disabled:opacity-50"
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Picture of Route
          </Button>
          
          <Button 
            onClick={onSwitchCamera}
            disabled={isInitializing}
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
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
        className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  );
};

export default CameraControls;
