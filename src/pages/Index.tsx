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
      description: 'Point, shoot, climb. Our AI instantly reads routes by tape color and difficulty, so you can focus on the send.'
    },
    {
      icon: TrendingUp,
      title: 'Progress That Matters',
      description: 'See your climbing evolution with insights that actually help - success rates, weak points, and what to work on next.'
    },
    {
      icon: Target,
      title: 'Beta Optimization',
      description: 'Get real-time movement feedback. Learn the subtle tweaks that turn your projects into sends.'
    },
    {
      icon: Clock,
      title: 'Session Intel',
      description: 'Every attempt counts. Track your sessions like a pro and watch patterns emerge in your climbing.'
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
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-200 to-blue-200 text-slate-900 overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Mountain className="h-14 w-14 text-slate-800 mr-4" />
              <h1 className="text-6xl md:text-8xl font-bold text-slate-800 drop-shadow-lg">
                Send<span className="text-orange-600">Boulder</span>
              </h1>
            </div>
            
            <p className="text-2xl md:text-3xl text-slate-800 mb-6 leading-relaxed font-light drop-shadow-sm">
              Your AI Climbing Coach
            </p>
            
            <p className="text-xl text-slate-700 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-sm">
              Stop guessing, start sending. Turn your phone into the ultimate climbing companion that reads routes, tracks your moves, and helps you level up faster than ever.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="bg-slate-800 hover:bg-slate-700 text-white px-16 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-2xl border-0"
                  >
                    Start Crushing
                    <Zap className="ml-3 h-6 w-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md">
                  <SignupForm />
                </DialogContent>
              </Dialog>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-slate-800 text-slate-800 hover:bg-slate-800/10 px-12 py-6 text-xl transition-all duration-300 backdrop-blur-sm bg-white/60 shadow-lg"
                onClick={() => navigate('/dashboard')}
              >
                <Play className="mr-3 h-6 w-6" />
                See It Work
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-slate-800 mb-20">
              <div className="flex items-center">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                <span className="font-bold text-slate-900">{userStats.averageRating.toFixed(1)}/5</span>
                <span className="ml-2">app rating</span>
              </div>
              <div className="h-6 w-px bg-slate-700"></div>
              <div className="flex items-center">
                <Star className="h-6 w-6 text-red-500 mr-2" />
                <span className="font-bold text-slate-900">{userStats.averageStoke.toFixed(1)}/5</span>
                <span className="ml-2">stoke level</span>
              </div>
              <div className="h-6 w-px bg-slate-700"></div>
              <div>
                <span className="font-bold text-slate-900">{(userStats.totalUsers / 1000).toFixed(0)}K+</span>
                <span className="ml-2">crushers</span>
              </div>
              <div className="h-6 w-px bg-slate-700"></div>
              <div>
                <span className="font-bold text-slate-900">{(userStats.totalRoutes / 1000000).toFixed(0)}M+</span>
                <span className="ml-2">routes sent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Motivation Section */}
        <div className="relative mb-24 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-400/30 to-blue-300/30 backdrop-blur-sm border border-orange-300/50">
          <div className="relative p-16 text-center">
            <h2 className="text-5xl font-bold text-slate-800 mb-6">
              Your Next Send Awaits
            </h2>
            <p className="text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Every crusher knows the feeling - that moment when everything clicks and you stick the crux. 
              We're here to make those moments happen more often.
            </p>
          </div>
        </div>

        {/* Why Climbers Love Us */}
        <div className="max-w-6xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-slate-800">
            Why Crushers Choose SendBoulder
          </h2>
          <p className="text-xl text-slate-700 text-center mb-16 max-w-3xl mx-auto">
            Because sending is everything, and we help you send more.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-orange-300/50 shadow-lg">
                <CheckCircle className="h-7 w-7 text-slate-800 flex-shrink-0" />
                <span className="text-slate-800 text-lg font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-slate-800">
            Built for Climbers, By Climbers
          </h2>
          <p className="text-xl text-slate-700 text-center mb-16 max-w-3xl mx-auto">
            Every feature designed to make you a stronger, smarter climber.
          </p>
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white/50 backdrop-blur-sm border border-orange-300/50 hover:border-orange-400/70 transition-all duration-300 hover:scale-105 group overflow-hidden shadow-lg"
              >
                <div className="relative h-48 bg-gradient-to-br from-orange-300/40 to-blue-300/40 flex items-center justify-center">
                  <div className="p-6 bg-white/30 rounded-xl backdrop-blur-sm">
                    <feature.icon className="h-16 w-16 text-slate-800" />
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-700 leading-relaxed text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials - Now using FeedbackDisplay */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-slate-800">
            Real Climbers, Real Results
          </h2>
          <p className="text-xl text-slate-700 text-center mb-16">
            Don't just take our word for it - here's what the community says.
          </p>
          <FeedbackDisplay onlyHighRatings={true} autoRotate={true} />
        </div>

        {/* Stats */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 mb-24 border border-orange-300/50 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">The Numbers Don't Lie</h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="group">
              <div className="flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-yellow-500 mr-2" />
                <p className="text-5xl font-bold text-slate-800">85%</p>
              </div>
              <p className="text-slate-700 text-lg">Higher send rate after 30 days</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-green-600 mr-2" />
                <p className="text-5xl font-bold text-slate-800">3.2x</p>
              </div>
              <p className="text-slate-700 text-lg">Faster grade progression</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-blue-600 mr-2" />
                <p className="text-5xl font-bold text-slate-800">500+</p>
              </div>
              <p className="text-slate-700 text-lg">Routes analyzed per session</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="relative text-center rounded-3xl overflow-hidden bg-gradient-to-r from-slate-800/95 to-slate-700/95 backdrop-blur-sm">
          <div className="relative p-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Level Up Your Climbing?
            </h2>
            <p className="text-2xl text-orange-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of climbers who've already unlocked their potential. Your next grade is waiting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-500 hover:to-orange-400 text-slate-800 px-16 py-6 text-xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl"
                  >
                    Start Free
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md">
                  <SignupForm />
                </DialogContent>
              </Dialog>
            </div>
            
            <p className="text-sm text-orange-200">
              Completely free • No commitment • No hidden fees
            </p>
          </div>
        </div>
        
        <div className="py-16"></div>
      </div>

      {/* Feedback System */}
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
