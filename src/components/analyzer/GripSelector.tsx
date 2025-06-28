
import React, { useEffect, useState } from 'react';

interface Grip {
  x: number;
  y: number;
  confidence?: number;
}

interface GripSelectorProps {
  imageRef: React.RefObject<HTMLImageElement>;
  detectedGrips: Array<Grip & { confidence: number }>;
  selectedGrips: Grip[];
  onGripsChange: (grips: Grip[]) => void;
}

const GripSelector = ({ imageRef, detectedGrips, selectedGrips, onGripsChange }: GripSelectorProps) => {
  const [imageRect, setImageRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateImageRect = () => {
      if (imageRef.current) {
        setImageRect(imageRef.current.getBoundingClientRect());
      }
    };

    updateImageRect();
    window.addEventListener('resize', updateImageRect);
    return () => window.removeEventListener('resize', updateImageRect);
  }, [imageRef]);

  const handleImageClick = (event: React.MouseEvent) => {
    if (!imageRef.current || !imageRect) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    // Check if clicking near an existing grip (remove it)
    const existingGripIndex = selectedGrips.findIndex(
      grip => Math.abs(grip.x - x) < 0.05 && Math.abs(grip.y - y) < 0.05
    );

    if (existingGripIndex !== -1) {
      // Remove existing grip
      const newGrips = selectedGrips.filter((_, index) => index !== existingGripIndex);
      onGripsChange(newGrips);
    } else {
      // Add new grip
      onGripsChange([...selectedGrips, { x, y }]);
    }
  };

  const convertToPixels = (grip: Grip) => {
    if (!imageRect) return { x: 0, y: 0 };
    return {
      x: grip.x * imageRect.width,
      y: grip.y * imageRect.height,
    };
  };

  return (
    <div
      className="absolute inset-0 cursor-crosshair"
      onClick={handleImageClick}
    >
      {/* Render selected grips */}
      {selectedGrips.map((grip, index) => {
        const pixels = convertToPixels(grip);
        const isDetected = detectedGrips.some(
          detected => Math.abs(detected.x - grip.x) < 0.02 && Math.abs(detected.y - grip.y) < 0.02
        );
        
        return (
          <div
            key={index}
            className={`absolute w-6 h-6 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
              isDetected 
                ? 'bg-green-500/70 border-green-300' 
                : 'bg-blue-500/70 border-blue-300'
            }`}
            style={{
              left: `${grip.x * 100}%`,
              top: `${grip.y * 100}%`,
            }}
          >
            <div className="absolute inset-0 rounded-full animate-ping bg-current opacity-30" />
          </div>
        );
      })}

      {/* Render detected but unselected grips */}
      {detectedGrips.map((grip, index) => {
        const isSelected = selectedGrips.some(
          selected => Math.abs(selected.x - grip.x) < 0.02 && Math.abs(selected.y - grip.y) < 0.02
        );
        
        if (isSelected) return null;
        
        return (
          <div
            key={`detected-${index}`}
            className="absolute w-4 h-4 rounded-full bg-yellow-400/50 border border-yellow-300 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${grip.x * 100}%`,
              top: `${grip.y * 100}%`,
            }}
          >
            <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-400/30" />
          </div>
        );
      })}
    </div>
  );
};

export default GripSelector;
