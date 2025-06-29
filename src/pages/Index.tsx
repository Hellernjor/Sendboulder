import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Camera, TrendingUp, Target, Users, ArrowRight, Play, CheckCircle, Star, Zap, Award, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '@/components/ui/signup-form';
import FeedbackButton from '@/components/feedback/FeedbackButton';
import FeedbackModal from '@/components/feedback/FeedbackModal';
import FeedbackDisplay from '@/components/feedback/FeedbackDisplay';
import { submitFeedback } from '@/lib/database-functions';

const Index = () => {
  const navigate = useNavigate();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [userStats, setUserStats] = useState({
    averageRating: 4.9,
    averageStoke: 4.7,
    totalUsers: 12000,
    totalRoutes: 2000000
  });

  // Check if user should see feedback prompt (after a week of usage)
  useEffect(() => {
    const checkFeedbackPrompt = () => {
      const firstVisit = localStorage.getItem('boulderflow_first_visit');
      if (!firstVisit) {
        localStorage.setItem('boulderflow_first_visit', Date.now().toString());
        return;
      }

      const hasGivenFeedback = localStorage.getItem('boulderflow_feedback_given');
      if (hasGivenFeedback) return;

      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      const timeSinceFirstVisit = Date.now() - parseInt(firstVisit);
      
      if (timeSinceFirstVisit > weekInMs) {
        setShowFeedbackPrompt(true);
      }
    };

    checkFeedbackPrompt();
  }, []);

  const handleFeedbackSubmit = async (feedback: { rating: number; stoke: number; comment: string; image?: File; displayName?: string }) => {
    try {
      await submitFeedback({
        rating: feedback.rating,
        stoke: feedback.stoke,
        comment: feedback.comment,
        displayName: feedback.displayName,
        imageFile: feedback.image
      });
      
      console.log('Feedback submitted successfully');
      localStorage.setItem('boulderflow_feedback_given', 'true');
      localStorage.setItem('boulderflow_user_feedback', JSON.stringify(feedback));
      setShowFeedbackPrompt(false);
      
      // Update local stats
      const newStats = {
        ...userStats,
        averageRating: ((userStats.averageRating * userStats.totalUsers) + feedback.rating) / (userStats.totalUsers + 1),
        averageStoke: ((userStats.averageStoke * userStats.totalUsers) + feedback.stoke) / (userStats.totalUsers + 1),
        totalUsers: userStats.totalUsers + 1
      };
      setUserStats(newStats);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const features = [
    {
      icon: Camera,
      title: 'Smart Route Vision',
      description: 'Point, shoot, climb. Our AI instantly reads routes by tape color and difficulty, so you can focus on the send.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: TrendingUp,
      title: 'Progress That Matters',
      description: 'See your climbing evolution with insights that actually help - success rates, weak points, and what to work on next.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Beta Optimization',
      description: 'Get real-time movement feedback. Learn the subtle tweaks that turn your projects into sends.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: 'Session Intel',
      description: 'Every attempt counts. Track your sessions like a pro and watch patterns emerge in your climbing.',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const benefits = [
    'Send rate jumps 85% on average',
    'Auto-track 500+ routes per session',
    '3x faster grade progression',
    'Personalized training insights',
    'Movement efficiency analysis',
    'Cross-route performance comparison'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 text-slate-900 overflow-hidden">
      {/* Hero Section */}
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

      <div className="container mx-auto px-4">
        {/* Enhanced Motivation Section */}
        <div className="relative mb-16 md:mb-24 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-700/60 to-amber-600/60 backdrop-blur-sm border-2 border-orange-700/80 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-800/20 to-amber-800/20"></div>
          <div className="relative p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 md:mb-6">
              Your Next Send Awaits
            </h2>
            <p className="text-lg md:text-2xl text-slate-800 max-w-3xl mx-auto leading-relaxed font-medium">
              Every crusher knows the feeling - that moment when everything clicks and you stick the crux. 
              We're here to make those moments happen more often.
            </p>
          </div>
        </div>

        {/* Enhanced Benefits Section */}
        <div className="max-w-6xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Why Crushers Choose SendBoulder
          </h2>
          <p className="text-lg md:text-xl text-slate-800 text-center mb-12 md:mb-16 max-w-3xl mx-auto font-medium">
            Because sending is everything, and we help you send more.
          </p>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border-2 border-orange-600/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-r from-orange-700 to-amber-700 p-2 rounded-xl">
                  <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-white flex-shrink-0" />
                </div>
                <span className="text-slate-900 text-base md:text-lg font-semibold">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Built for Climbers, By Climbers
          </h2>
          <p className="text-lg md:text-xl text-slate-800 text-center mb-12 md:mb-16 max-w-3xl mx-auto font-medium">
            Every feature designed to make you a stronger, smarter climber.
          </p>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white/80 backdrop-blur-sm border-2 border-orange-600/80 hover:border-orange-700/90 transition-all duration-300 hover:scale-105 group overflow-hidden shadow-xl hover:shadow-2xl rounded-2xl"
              >
                <div className={`relative h-40 md:h-48 bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                  <div className="p-4 md:p-6 bg-white/30 rounded-2xl backdrop-blur-sm border border-white/40">
                    <feature.icon className="h-12 w-12 md:h-16 md:w-16 text-white drop-shadow-lg" />
                  </div>
                </div>
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 md:mb-4">{feature.title}</h3>
                  <p className="text-slate-800 leading-relaxed text-base md:text-lg font-medium">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Real Climbers, Real Results
          </h2>
          <p className="text-lg md:text-xl text-slate-800 text-center mb-12 md:mb-16 font-medium">
            Don't just take our word for it - here's what the community says.
          </p>
          <FeedbackDisplay onlyHighRatings={true} autoRotate={true} />
        </div>

        {/* Enhanced Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-16 md:mb-24 border-2 border-orange-600/80 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">The Numbers Don't Lie</h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="group">
              <div className="flex flex-col items-center mb-4">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-xl mb-4">
                  <Award className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-800 to-amber-800 bg-clip-text text-transparent">85%</p>
              </div>
              <p className="text-slate-800 text-base md:text-lg font-semibold">Higher send rate after 30 days</p>
            </div>
            <div className="group">
              <div className="flex flex-col items-center mb-4">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-xl mb-4">
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-800 to-amber-800 bg-clip-text text-transparent">3.2x</p>
              </div>
              <p className="text-slate-800 text-base md:text-lg font-semibold">Faster grade progression</p>
            </div>
            <div className="group">
              <div className="flex flex-col items-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mb-4">
                  <Target className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-800 to-amber-800 bg-clip-text text-transparent">500+</p>
              </div>
              <p className="text-slate-800 text-base md:text-lg font-semibold">Routes analyzed per session</p>
            </div>
          </div>
        </div>

        {/* Enhanced Final CTA */}
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
        
        <div className="py-8 md:py-16"></div>
      </div>

      {/* Enhanced Feedback System */}
      <FeedbackButton onClick={() => setIsFeedbackOpen(true)} />
      
      <FeedbackModal 
        isOpen={isFeedbackOpen || showFeedbackPrompt}
        onClose={() => {
          setIsFeedbackOpen(false);
          setShowFeedbackPrompt(false);
        }}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default Index;
