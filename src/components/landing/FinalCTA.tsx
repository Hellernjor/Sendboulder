
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';
import SignupForm from '@/components/ui/signup-form';

interface FinalCTAProps {
  isSignupOpen: boolean;
  setIsSignupOpen: (open: boolean) => void;
}

const FinalCTA = ({ isSignupOpen, setIsSignupOpen }: FinalCTAProps) => {
  return (
    <div className="relative text-center rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl border-2 border-slate-700">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-800/30 to-amber-800/30"></div>
      <div className="relative p-8 md:p-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
          Ready to Level Up Your Climbing?
        </h2>
        <p className="text-lg md:text-2xl text-orange-100 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Join thousands of climbers who've already unlocked their potential. Your next grade is waiting.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-6 md:mb-8">
          <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-700 to-amber-700 hover:from-orange-800 hover:to-amber-800 text-white px-12 md:px-16 py-6 md:py-8 text-lg md:text-2xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl rounded-2xl border-2 border-orange-600"
              >
                Start Free
                <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-7 md:w-7" />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md">
              <SignupForm />
            </DialogContent>
          </Dialog>
        </div>
        
        <p className="text-sm text-orange-200 font-medium">
          Completely free • No commitment • No hidden fees
        </p>
      </div>
    </div>
  );
};

export default FinalCTA;
