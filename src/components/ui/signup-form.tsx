import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Eye, EyeOff, Camera, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CameraService } from '@/services/cameraService';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requestingCamera, setRequestingCamera] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isIOSDevice = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    console.log('Device detection - iOS:', isIOS, 'User Agent:', navigator.userAgent);
    return isIOS;
  };

  const requestCameraPermissions = async () => {
    setRequestingCamera(true);
    const deviceIsIOS = isIOSDevice();
    console.log('Starting camera permission request - iOS device:', deviceIsIOS);
    
    try {
      const cameraService = new CameraService();
      const hasAccess = await cameraService.requestCameraAccess();
      console.log('Camera access result:', hasAccess);
      
      if (hasAccess) {
        console.log('Camera access granted, navigating to dashboard');
        toast({
          title: "Camera access granted!",
          description: "You're all set to analyze climbing routes.",
        });
        cameraService.stopCamera();
        setRequestingCamera(false);
        navigate('/dashboard');
      } else {
        console.log('Camera access denied - iOS device:', deviceIsIOS);
        setRequestingCamera(false);
        
        if (deviceIsIOS) {
          console.log('Showing iOS instructions');
          setShowIOSInstructions(true);
        } else {
          toast({
            title: "Camera access denied",
            description: "You can enable camera access later in your browser settings to use route analysis.",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Camera permission error:', error);
      setRequestingCamera(false);
      
      const deviceIsIOS = isIOSDevice();
      console.log('Camera error - iOS device:', deviceIsIOS);
      
      if (deviceIsIOS) {
        console.log('Camera error on iOS, showing instructions');
        setShowIOSInstructions(true);
      } else {
        toast({
          title: "Camera setup incomplete",
          description: "Don't worry, you can enable camera access later for route analysis.",
        });
        navigate('/dashboard');
      }
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Account created!",
          description: "Let's set up camera access for route analysis.",
        });
        setIsLoading(false);
        await requestCameraPermissions();
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        throw error;
      }
      
      // Camera permissions will be handled on dashboard for OAuth users
    } catch (error: any) {
      console.error('Google signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign up with Google",
        variant: "destructive",
      });
    }
  };

  if (showIOSInstructions) {
    console.log('Rendering iOS instructions screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto bg-slate-800/90 border-slate-700 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-6">
            <Settings className="h-16 w-16 text-blue-400" />
            <h3 className="text-2xl font-bold text-white text-center">Enable Camera Access</h3>
            <div className="text-slate-300 text-sm space-y-4">
              <p className="text-center font-medium">To use route analysis, please enable camera access in your iPhone settings:</p>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-3 text-left">
                  <li>Open your iPhone <strong className="text-white">Settings</strong> app</li>
                  <li>Scroll down and tap <strong className="text-white">Safari</strong></li>
                  <li>Tap <strong className="text-white">Camera</strong></li>
                  <li>Select <strong className="text-white">Allow</strong></li>
                  <li>Return to this page and refresh</li>
                </ol>
              </div>
              <p className="text-center text-xs text-slate-400">After enabling, refresh this page to continue</p>
            </div>
            <div className="flex flex-col space-y-3 w-full">
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue to Dashboard
              </Button>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="text-slate-400 text-sm hover:text-white transition-colors"
              >
                ← Back to signup
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requestingCamera) {
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
  }

  console.log('Rendering main signup form');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-slate-800/90 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Start Your Journey</CardTitle>
          <p className="text-slate-400">Join thousands of climbers improving their performance</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleSignup}
            variant="outline"
            className="w-full bg-white border-slate-300 text-black hover:bg-gray-50 hover:border-slate-400"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-slate-400 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;
