
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';

const CameraPermissionScreen = () => {
  console.log('Rendering camera permission request screen');
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white border-gray-200 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Camera className="h-12 w-12 text-orange-500 animate-pulse" />
          <h3 className="text-xl font-semibold text-slate-900">Setting up camera access</h3>
          <p className="text-slate-600 text-center text-sm">
            Please allow camera access to enable route documentation features
          </p>
          <div className="flex items-center space-x-2 text-slate-700">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
            <span className="text-sm">Requesting permissions...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraPermissionScreen;
