import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Zap } from 'lucide-react';

interface ModeSelectorProps {
  isSimpleMode: boolean;
  onModeChange: (isSimple: boolean) => void;
}

const ModeSelector = ({ isSimpleMode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={isSimpleMode ? "outline" : "default"}
        size="sm"
        onClick={() => onModeChange(false)}
        className={!isSimpleMode ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-slate-300"}
      >
        <Settings className="h-3 w-3 mr-1" />
        Advanced
      </Button>
      <Button
        variant={isSimpleMode ? "default" : "outline"}
        size="sm"
        onClick={() => onModeChange(true)}
        className={isSimpleMode ? "bg-yellow-600 hover:bg-yellow-700" : "border-slate-600 text-slate-300"}
      >
        <Zap className="h-3 w-3 mr-1" />
        Simple
      </Button>
    </div>
  );
};

export default ModeSelector;