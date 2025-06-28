
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, SwitchCamera, RotateCcw, Camera } from 'lucide-react';

interface CameraControlsProps {
  isRecording: boolean;
  isCameraActive: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSwitchCamera: () => void;
  onCapturePhoto: () => void;
  onReset: () => void;
}

const CameraControls = ({
  isRecording,
  isCameraActive,
  onStartRecording,
  onStopRecording,
  onSwitchCamera,
  onCapturePhoto,
  onReset
}: CameraControlsProps) => {
  return (
    <div className="flex justify-center space-x-4">
      {!isCameraActive ? (
        <Button 
          onClick={onStartRecording}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Camera
        </Button>
      ) : (
        <>
          <Button 
            onClick={onCapturePhoto}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Picture of Route
          </Button>
          
          <Button 
            onClick={onSwitchCamera}
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <SwitchCamera className="h-4 w-4 mr-2" />
            Switch Camera
          </Button>
        </>
      )}
      
      <Button 
        onClick={onReset}
        variant="outline" 
        className="border-slate-600 text-slate-300 hover:bg-slate-700"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  );
};

export default CameraControls;
