
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
      {!isRecording ? (
        <Button 
          onClick={onStartRecording}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
        >
          <Play className="h-4 w-4 mr-2" />
          {isCameraActive ? 'Start Analysis' : 'Start Camera'}
        </Button>
      ) : (
        <Button 
          onClick={onStopRecording}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
        >
          <Square className="h-4 w-4 mr-2" />
          Stop Analysis
        </Button>
      )}
      
      {isCameraActive && (
        <>
          <Button 
            onClick={onSwitchCamera}
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <SwitchCamera className="h-4 w-4 mr-2" />
            Switch
          </Button>
          
          <Button 
            onClick={onCapturePhoto}
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Camera className="h-4 w-4 mr-2" />
            Capture
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
