
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Play, Zap, User, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '@/components/ui/signup-form';

interface HeroSectionProps {
  isSignupOpen: boolean;
  setIsSignupOpen: (open: boolean) => void;
  userStats: {
    averageRating: number;
    averageStoke: number;
    totalUsers: number;
    totalRoutes: number;
  };
}

const HeroSection = ({ isSignupOpen, setIsSignupOpen, userStats }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-800/30 to-amber-800/30 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-orange-700 to-amber-700 p-3 md:p-4 rounded-2xl shadow-2xl mr-3 md:mr-4 relative">
              {/* Boulder with climber representation */}
              <div className="relative">
                <div className="h-10 w-10 md:h-14 md:w-14 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg transform rotate-12 shadow-lg"></div>
                <User className="h-4 w-4 md:h-6 md:w-6 text-orange-400 absolute -top-1 -right-1 transform -rotate-12" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent drop-shadow-lg">
              Send<span className="bg-gradient-to-r from-orange-800 to-amber-800 bg-clip-text text-transparent">Boulder</span>
            </h1>
          </div>
          
          <p className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 md:mb-6 leading-relaxed drop-shadow-sm">
            Your AI Climbing Coach
          </p>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-800 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-sm font-medium px-4">
            Stop guessing, start sending. Turn your phone into the ultimate climbing companion that reads routes, tracks your moves, and helps you level up faster than ever.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-16 px-4">
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-orange-800 to-amber-800 hover:from-orange-900 hover:to-amber-900 text-white px-8 sm:px-12 md:px-16 py-6 md:py-8 text-lg sm:text-xl md:text-2xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl border-0 rounded-2xl"
                >
                  Start Crushing
                  <Zap className="ml-2 md:ml-3 h-5 w-5 md:h-7 md:w-7" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md">
                <SignupForm />
              </DialogContent>
            </Dialog>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-3 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 sm:px-10 md:px-12 py-6 md:py-8 text-lg sm:text-xl md:text-2xl font-semibold transition-all duration-300 backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl"
              onClick={() => navigate('/dashboard')}
            >
              <Play className="mr-2 md:mr-3 h-5 w-5 md:h-7 md:w-7" />
              See It Work
            </Button>
          </div>

          {/* Enhanced Social Proof */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 text-slate-900 mb-16 md:mb-20 px-4">
            <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm px-3 md:px-6 py-3 md:py-4 rounded-xl shadow-lg border-2 border-orange-600">
              <div className="flex items-center mb-1">
                <Star className="h-4 w-4 md:h-6 md:w-6 text-yellow-500 mr-1 md:mr-2" />
                <span className="font-bold text-slate-900 text-sm md:text-lg">{userStats.averageRating.toFixed(1)}/5</span>
              </div>
              <span className="text-xs md:text-sm font-medium text-center">app rating</span>
            </div>
            <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm px-3 md:px-6 py-3 md:py-4 rounded-xl shadow-lg border-2 border-orange-600">
              <div className="flex items-center mb-1">
                <Star className="h-4 w-4 md:h-6 md:w-6 text-red-500 mr-1 md:mr-2" />
                <span className="font-bold text-slate-900 text-sm md:text-lg">{userStats.averageStoke.toFixed(1)}/5</span>
              </div>
              <span className="text-xs md:text-sm font-medium text-center">stoke level</span>
            </div>
            <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm px-3 md:px-6 py-3 md:py-4 rounded-xl shadow-lg border-2 border-orange-600">
              <span className="font-bold text-slate-900 text-sm md:text-lg">{(userStats.totalUsers / 1000).toFixed(0)}K+</span>
              <span className="text-xs md:text-sm font-medium text-center">crushers</span>
            </div>
            <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm px-3 md:px-6 py-3 md:py-4 rounded-xl shadow-lg border-2 border-orange-600">
              <span className="font-bold text-slate-900 text-sm md:text-lg">{(userStats.totalRoutes / 1000000).toFixed(0)}M+</span>
              <span className="text-xs md:text-sm font-medium text-center">routes sent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
