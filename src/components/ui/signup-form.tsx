
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CameraService } from '@/services/cameraService';
import CameraPermissionScreen from '@/components/auth/CameraPermissionScreen';
import IOSInstructionsScreen from '@/components/auth/IOSInstructionsScreen';
import EmailSignupForm from '@/components/auth/EmailSignupForm';
import GoogleSignupButton from '@/components/auth/GoogleSignupButton';

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestingCamera, setRequestingCamera] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const requestCameraPermissions = async () => {
    setRequestingCamera(true);
    console.log('Starting camera permission request');
    
    try {
      const cameraService = new CameraService();
      const result = await cameraService.requestCameraAccess();
      
      if (result.success) {
        console.log('Camera access granted, navigating to dashboard');
        toast({
          title: "Camera access granted!",
          description: "You're all set to analyze climbing routes.",
        });
        cameraService.stopCamera();
        setRequestingCamera(false);
        navigate('/dashboard');
      } else {
        console.log('Camera access failed:', result.error);
        setRequestingCamera(false);
        
        // Show iOS instructions only if it's an iOS device and permission was denied
        if (cameraService.isIOSDevice() && result.error?.includes('denied')) {
          setShowIOSInstructions(true);
        } else {
          toast({
            title: "Camera access needed",
            description: result.error || "You can enable camera access later in your browser settings.",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Camera permission error:', error);
      setRequestingCamera(false);
      toast({
        title: "Camera setup incomplete",
        description: "Don't worry, you can enable camera access later for route analysis.",
      });
      navigate('/dashboard');
    }
  };

  const handleEmailSignup = async (email: string, password: string) => {
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
    } catch (error: any) {
      console.error('Google signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign up with Google",
        variant: "destructive",
      });
    }
  };

  const handleRetryCamera = () => {
    setShowIOSInstructions(false);
    requestCameraPermissions();
  };

  const handleBackToSignup = () => {
    setShowIOSInstructions(false);
  };

  if (showIOSInstructions) {
    return (
      <IOSInstructionsScreen 
        onRetryCamera={handleRetryCamera}
        onBack={handleBackToSignup}
      />
    );
  }

  if (requestingCamera) {
    return <CameraPermissionScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-slate-800/90 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Start Your Journey</CardTitle>
          <p className="text-slate-400">Join thousands of climbers improving their performance</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleSignupButton onGoogleSignup={handleGoogleSignup} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-400">Or continue with email</span>
            </div>
          </div>

          <EmailSignupForm 
            onSubmit={handleEmailSignup}
            isLoading={isLoading}
          />

          <p className="text-xs text-slate-400 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;
