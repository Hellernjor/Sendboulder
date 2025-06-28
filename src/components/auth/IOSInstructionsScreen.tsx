
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IOSInstructionsScreenProps {
  onRetryCamera: () => void;
  onBack: () => void;
}

const IOSInstructionsScreen: React.FC<IOSInstructionsScreenProps> = ({
  onRetryCamera,
  onBack
}) => {
  const navigate = useNavigate();

  console.log('Rendering iOS instructions screen');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-slate-800/95 border-slate-700 backdrop-blur-sm shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-6">
          <div className="relative">
            <Settings className="h-16 w-16 text-blue-400" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Camera Access Required</h3>
            <p className="text-slate-300 text-sm">To analyze climbing routes, we need camera permission</p>
          </div>
          
          <div className="w-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 space-y-4">
            <h4 className="text-white font-semibold text-center mb-4">Follow these steps:</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">1</div>
                <p className="text-slate-200 text-sm">Open your iPhone <strong className="text-white">Settings</strong> app</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">2</div>
                <p className="text-slate-200 text-sm">Scroll down and tap <strong className="text-white">Safari</strong></p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">3</div>
                <p className="text-slate-200 text-sm">Tap <strong className="text-white">Camera</strong></p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">4</div>
                <p className="text-slate-200 text-sm">Select <strong className="text-white">Allow</strong></p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">✓</div>
                <p className="text-slate-200 text-sm">Return here and refresh the page</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3 w-full">
            <Button
              onClick={onRetryCamera}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            >
              <Camera className="w-4 h-4 mr-2" />
              Try Camera Again
            </Button>
            
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Skip for Now - Go to Dashboard
            </Button>
            
            <button
              onClick={onBack}
              className="text-slate-400 text-sm hover:text-white transition-colors"
            >
              ← Back to signup
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IOSInstructionsScreen;
