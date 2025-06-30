import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Check, RotateCcw, Loader2 } from 'lucide-react';
import GradeSelector from './GradeSelector';
import GripSelector from './GripSelector';
import { GripDetectionService, DetectedGrip } from '@/services/gripDetectionService';
import { Logger } from '@/lib/logger';

interface RouteAnalysisModalProps {
  image: string;
  onComplete: (routeName: string) => void;
  onCancel: () => void;
}

const RouteAnalysisModal = ({ image, onComplete, onCancel }: RouteAnalysisModalProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedGrips, setSelectedGrips] = useState<Array<{x: number, y: number}>>([]);
  const [detectedGrips, setDetectedGrips] = useState<DetectedGrip[]>([]);
  const [isDetecting, setIsDetecting] = useState(true);
  
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    Logger.component('RouteAnalysisModal', 'Component mounted, starting grip detection');
    
    const detectGrips = async () => {
      setIsDetecting(true);
      try {
        Logger.debug('RouteAnalysisModal', 'Starting grip detection process', {
          imageLength: image.length,
          hasImageRef: !!imageRef.current
        });
        
        const grips = await GripDetectionService.detectGrips(image);
        Logger.success('RouteAnalysisModal', `Detected ${grips.length} grips`, grips);
        
        setDetectedGrips(grips);
        // Pre-select detected grips
        const preselectedGrips = grips.map(grip => ({x: grip.x, y: grip.y}));
        setSelectedGrips(preselectedGrips);
        Logger.debug('RouteAnalysisModal', 'Pre-selected detected grips', preselectedGrips);
        
      } catch (error) {
        Logger.error('RouteAnalysisModal', 'Grip detection failed', error);
        // Continue without detected grips
        setDetectedGrips([]);
      } finally {
        setIsDetecting(false);
        Logger.debug('RouteAnalysisModal', 'Grip detection process completed');
      }
    };

    detectGrips();
  }, [image]);

  const handleComplete = () => {
    Logger.debug('RouteAnalysisModal', 'Completing route analysis', {
      selectedGrade,
      gripsCount: selectedGrips.length,
      canComplete: !!(selectedGrade && selectedGrips.length > 0)
    });
    
    if (!selectedGrade || selectedGrips.length === 0) {
      Logger.warn('RouteAnalysisModal', 'Cannot complete - missing grade or grips');
      return;
    }
    
    const routeName = `${selectedGrade} Route`;
    Logger.success('RouteAnalysisModal', `Route analysis completed: ${routeName}`);
    onComplete(routeName);
  };

  const handleReset = () => {
    Logger.debug('RouteAnalysisModal', 'Resetting grip selection');
    setSelectedGrips([]);
    setIsDetecting(false);
  };

  const handleCancel = () => {
    Logger.debug('RouteAnalysisModal', 'Route analysis cancelled');
    onCancel();
  };

  const handleGradeSelect = (grade: string) => {
    Logger.debug('RouteAnalysisModal', `Grade selected: ${grade}`);
    setSelectedGrade(grade);
  };

  const handleGripsChange = (grips: Array<{x: number, y: number}>) => {
    Logger.debug('RouteAnalysisModal', `Grips updated - count: ${grips.length}`, grips);
    setSelectedGrips(grips);
  };

  Logger.debug('RouteAnalysisModal', 'Rendering modal', {
    isDetecting,
    selectedGrade,
    gripsCount: selectedGrips.length,
    detectedGripsCount: detectedGrips.length
  });

  return (
    <Dialog open={true} onOpenChange={handleCancel}>
      <DialogContent className="max-w-full h-full bg-slate-900 border-slate-700 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Document Route</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
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
                alt="Route documentation"
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Detection Loading Overlay */}
              {isDetecting && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Detecting climbing holds...</p>
                  </div>
                </div>
              )}
              
              {/* Grip Overlay */}
              {!isDetecting && (
                <GripSelector
                  imageRef={imageRef}
                  detectedGrips={detectedGrips}
                  selectedGrips={selectedGrips}
                  onGripsChange={handleGripsChange}
                />
              )}
            </div>

            {/* Controls Section */}
            <div className="w-full lg:w-80 bg-slate-800 border-l border-slate-700 p-4 space-y-6">
              <div>
                <h3 className="text-white font-medium mb-3">Select Grade</h3>
                <GradeSelector
                  selectedGrade={selectedGrade}
                  onGradeSelect={handleGradeSelect}
                />
              </div>

              <div>
                <h3 className="text-white font-medium mb-3">Route Holds</h3>
                {isDetecting ? (
                  <p className="text-slate-400 text-sm">Detecting holds...</p>
                ) : (
                  <>
                    <p className="text-slate-400 text-sm mb-3">
                      {selectedGrips.length} holds selected
                    </p>
                    <p className="text-slate-300 text-xs">
                      Tap on the image to add/remove holds. Detection has pre-selected likely holds.
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  disabled={isDetecting}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Selection
                </Button>
                
                <Button
                  onClick={handleComplete}
                  disabled={!selectedGrade || selectedGrips.length === 0 || isDetecting}
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
