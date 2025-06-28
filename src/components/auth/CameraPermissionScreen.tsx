
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';

const CameraPermissionScreen = () => {
  console.log('Rendering camera permission request screen');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-slate-800/90 border-slate-700 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Camera className="h-12 w-12 text-blue-400 animate-pulse" />
          <h3 className="text-xl font-semibold text-white">Setting up camera access</h3>
          <p className="text-slate-400 text-center text-sm">
            Please allow camera access to enable route analysis features
          </p>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span className="text-sm">Requesting permissions...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraPermissionScreen;
