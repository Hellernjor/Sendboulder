
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Play, Zap, User, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '@/components/ui/signup-form';
import ShareButton from '@/components/ui/ShareButton';

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
    <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 md:p-4 rounded-2xl shadow-lg mr-3 md:mr-4 relative">
              {/* Boulder with climber representation */}
              <div className="relative">
                <div className="h-10 w-10 md:h-14 md:w-14 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg transform rotate-12 shadow-lg"></div>
                <User className="h-4 w-4 md:h-6 md:w-6 text-orange-100 absolute -top-1 -right-1 transform -rotate-12" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Send<span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Boulder</span>
            </h1>
          </div>
          
          <p className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-800 mb-4 md:mb-6 leading-relaxed">
            Your AI Climbing Coach
          </p>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed font-medium px-4">
            Stop guessing, start sending. Turn your phone into the ultimate climbing companion that reads routes, tracks your moves, and helps you level up faster than ever.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-8 md:mb-12 px-4">
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 sm:px-12 md:px-16 py-6 md:py-8 text-lg sm:text-xl md:text-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg border-0 rounded-2xl"
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
              className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-8 sm:px-10 md:px-12 py-6 md:py-8 text-lg sm:text-xl md:text-2xl font-semibold transition-all duration-300 bg-white shadow-lg rounded-2xl"
              onClick={() => navigate('/dashboard')}
            >
              <Play className="mr-2 md:mr-3 h-5 w-5 md:h-7 md:w-7" />
              See It Work
            </Button>
          </div>

          {/* Share Button */}
          <div className="flex justify-center mb-12 md:mb-16">
            <ShareButton 
              size="lg"
              variant="outline"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 px-8 py-4 text-lg font-semibold shadow-lg rounded-2xl transition-all duration-300 hover:scale-105"
            />
          </div>

          {/* Enhanced Social Proof */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 text-slate-900 mb-16 md:mb-20 px-4">
            <div className="flex flex-col items-center bg-white backdrop-blur-sm px-3 md:px-6 py-3 md:py-4 rounded-xl shadow-lg border border-orange-200">
              <div className="flex items-center mb-1">
                <Star className="h-4 w-4 md:h-6 md:w-6 text-yellow-500 mr-1 md:mr-2" />
                <span className="font-bold text-slate-900 text-sm md:text-lg">{userStats.averageRating.toFixed(1)}/5</span>
              </div>
              <span className="text-xs md:text-sm font-medium text-center text-slate-600">app rating</span>
            </div>
            <div className="flex flex-col items-center bg-white backdrop-blur-sm px-3 md:px-6 py-3 md:py-4 rounded-xl shadow-lg border border-orange-200">
              <div className="flex items-center mb-1">
                <Star className="h-4 w-4 md:h-6 md:w-6 text-red-500 mr-1 md:mr-2" />
                <span className="font-bold text-slate-900 text-sm md:text-lg">{userStats.averageStoke.toFixed(1)}/5</span>
              </div>
              <span className="text-xs md:text-sm font-medium text-center text-slate-600">stoke level</span>
            </div>
            <div className="flex flex-col items-center bg-white backdrop-blur-sm px-3 md:px-6 py-3 md:py-4 rounded-xl shadow-lg border border-orange-200">
              <span className="font-bold text-slate-900 text-sm md:text-lg">{(userStats.totalUsers / 1000).toFixed(0)}K+</span>
              <span className="text-xs md:text-sm font-medium text-center text-slate-600">crushers</span>
            </div>
            <div className="flex flex-col items-center bg-white backdrop-blur-sm px-3 md:px-6 py-3 md:py-4 rounded-xl shadow-lg border border-orange-200">
              <span className="font-bold text-slate-900 text-sm md:text-lg">{(userStats.totalRoutes / 1000000).toFixed(0)}M+</span>
              <span className="text-xs md:text-sm font-medium text-center text-slate-600">routes sent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
