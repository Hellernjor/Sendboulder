
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Camera, TrendingUp, Target, Users, ArrowRight, Mountain, Play, CheckCircle, Star, Zap, Award, Clock } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-amber-200 text-slate-900 overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 rounded-2xl shadow-2xl mr-4">
                <Mountain className="h-14 w-14 text-white" />
              </div>
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent drop-shadow-lg">
                Send<span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Boulder</span>
              </h1>
            </div>
            
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6 leading-relaxed drop-shadow-sm">
              Your AI Climbing Coach
            </p>
            
            <p className="text-xl text-slate-700 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-sm font-medium">
              Stop guessing, start sending. Turn your phone into the ultimate climbing companion that reads routes, tracks your moves, and helps you level up faster than ever.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-16 py-8 text-2xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl border-0 rounded-2xl"
                  >
                    Start Crushing
                    <Zap className="ml-3 h-7 w-7" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md">
                  <SignupForm />
                </DialogContent>
              </Dialog>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-3 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white px-12 py-8 text-2xl font-semibold transition-all duration-300 backdrop-blur-sm bg-white/80 shadow-xl rounded-2xl"
                onClick={() => navigate('/dashboard')}
              >
                <Play className="mr-3 h-7 w-7" />
                See It Work
              </Button>
            </div>

            {/* Enhanced Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-slate-800 mb-20">
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border border-orange-300">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                <span className="font-bold text-slate-900 text-lg">{userStats.averageRating.toFixed(1)}/5</span>
                <span className="ml-2 font-medium">app rating</span>
              </div>
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border border-orange-300">
                <Star className="h-6 w-6 text-red-500 mr-2" />
                <span className="font-bold text-slate-900 text-lg">{userStats.averageStoke.toFixed(1)}/5</span>
                <span className="ml-2 font-medium">stoke level</span>
              </div>
              <div className="bg-white/60 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border border-orange-300">
                <span className="font-bold text-slate-900 text-lg">{(userStats.totalUsers / 1000).toFixed(0)}K+</span>
                <span className="ml-2 font-medium">crushers</span>
              </div>
              <div className="bg-white/60 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border border-orange-300">
                <span className="font-bold text-slate-900 text-lg">{(userStats.totalRoutes / 1000000).toFixed(0)}M+</span>
                <span className="ml-2 font-medium">routes sent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Enhanced Motivation Section */}
        <div className="relative mb-24 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500/40 to-amber-400/40 backdrop-blur-sm border-2 border-orange-400/60 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-amber-600/10"></div>
          <div className="relative p-16 text-center">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              Your Next Send Awaits
            </h2>
            <p className="text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-medium">
              Every crusher knows the feeling - that moment when everything clicks and you stick the crux. 
              We're here to make those moments happen more often.
            </p>
          </div>
        </div>

        {/* Enhanced Benefits Section */}
        <div className="max-w-6xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Why Crushers Choose SendBoulder
          </h2>
          <p className="text-xl text-slate-700 text-center mb-16 max-w-3xl mx-auto font-medium">
            Because sending is everything, and we help you send more.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm p-8 rounded-2xl border-2 border-orange-300/60 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-xl">
                  <CheckCircle className="h-7 w-7 text-white flex-shrink-0" />
                </div>
                <span className="text-slate-800 text-lg font-semibold">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Built for Climbers, By Climbers
          </h2>
          <p className="text-xl text-slate-700 text-center mb-16 max-w-3xl mx-auto font-medium">
            Every feature designed to make you a stronger, smarter climber.
          </p>
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white/70 backdrop-blur-sm border-2 border-orange-300/60 hover:border-orange-400/80 transition-all duration-300 hover:scale-105 group overflow-hidden shadow-xl hover:shadow-2xl rounded-2xl"
              >
                <div className={`relative h-48 bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                  <div className="p-6 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                    <feature.icon className="h-16 w-16 text-white drop-shadow-lg" />
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-700 leading-relaxed text-lg font-medium">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Real Climbers, Real Results
          </h2>
          <p className="text-xl text-slate-700 text-center mb-16 font-medium">
            Don't just take our word for it - here's what the community says.
          </p>
          <FeedbackDisplay onlyHighRatings={true} autoRotate={true} />
        </div>

        {/* Enhanced Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 mb-24 border-2 border-orange-300/60 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">The Numbers Don't Lie</h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="group">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl mr-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <p className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">85%</p>
              </div>
              <p className="text-slate-700 text-lg font-semibold">Higher send rate after 30 days</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-xl mr-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <p className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">3.2x</p>
              </div>
              <p className="text-slate-700 text-lg font-semibold">Faster grade progression</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-3 rounded-xl mr-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <p className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">500+</p>
              </div>
              <p className="text-slate-700 text-lg font-semibold">Routes analyzed per session</p>
            </div>
          </div>
        </div>

        {/* Enhanced Final CTA */}
        <div className="relative text-center rounded-3xl overflow-hidden bg-gradient-to-r from-slate-800 to-slate-700 shadow-2xl border-2 border-slate-600">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20"></div>
          <div className="relative p-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Level Up Your Climbing?
            </h2>
            <p className="text-2xl text-orange-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Join thousands of climbers who've already unlocked their potential. Your next grade is waiting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-16 py-8 text-2xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl rounded-2xl border-2 border-orange-400"
                  >
                    Start Free
                    <ArrowRight className="ml-3 h-7 w-7" />
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
        
        <div className="py-16"></div>
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
