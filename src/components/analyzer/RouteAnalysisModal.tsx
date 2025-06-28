
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Check, RotateCcw } from 'lucide-react';
import GradeSelector from './GradeSelector';
import GripSelector from './GripSelector';

interface RouteAnalysisModalProps {
  image: string;
  onComplete: (routeName: string) => void;
  onCancel: () => void;
}

const RouteAnalysisModal = ({ image, onComplete, onCancel }: RouteAnalysisModalProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedGrips, setSelectedGrips] = useState<Array<{x: number, y: number}>>([]);
  const [detectedGrips, setDetectedGrips] = useState<Array<{x: number, y: number, confidence: number}>>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Simulate AI grip detection
    const simulateGripDetection = () => {
      // This would be replaced with actual AI analysis
      const mockGrips = [
        { x: 0.2, y: 0.3, confidence: 0.9 },
        { x: 0.4, y: 0.5, confidence: 0.8 },
        { x: 0.6, y: 0.4, confidence: 0.85 },
        { x: 0.3, y: 0.7, confidence: 0.75 },
      ];
      setDetectedGrips(mockGrips);
      setSelectedGrips(mockGrips.map(grip => ({x: grip.x, y: grip.y})));
    };

    // Simulate processing delay
    setTimeout(simulateGripDetection, 1500);
  }, []);

  const handleComplete = () => {
    if (!selectedGrade || selectedGrips.length === 0) return;
    
    const routeName = `${selectedGrade} Route`;
    onComplete(routeName);
  };

  const handleReset = () => {
    setSelectedGrips([]);
    setDetectedGrips([]);
    setAnalysisComplete(false);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-full h-full bg-slate-900 border-slate-700 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Analyze Route</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Image Section */}
            <div className="flex-1 relative bg-black flex items-center justify-center">
              <img
                ref={imageRef}
                src={image}
                alt="Route analysis"
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Grip Overlay */}
              <GripSelector
                imageRef={imageRef}
                detectedGrips={detectedGrips}
                selectedGrips={selectedGrips}
                onGripsChange={setSelectedGrips}
              />
            </div>

            {/* Controls Section */}
            <div className="w-full lg:w-80 bg-slate-800 border-l border-slate-700 p-4 space-y-6">
              <div>
                <h3 className="text-white font-medium mb-3">Select Grade</h3>
                <GradeSelector
                  selectedGrade={selectedGrade}
                  onGradeSelect={setSelectedGrade}
                />
              </div>

              <div>
                <h3 className="text-white font-medium mb-3">Route Grips</h3>
                <p className="text-slate-400 text-sm mb-3">
                  {selectedGrips.length} grips selected
                </p>
                <p className="text-slate-300 text-xs">
                  Tap on the image to add/remove grips. AI has pre-selected likely holds.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Selection
                </Button>
                
                <Button
                  onClick={handleComplete}
                  disabled={!selectedGrade || selectedGrips.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save Route
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteAnalysisModal;
