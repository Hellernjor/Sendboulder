
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Camera, TrendingUp, Target, Users, ArrowRight, Mountain, Play, CheckCircle, Star, Zap, Award, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '@/components/ui/signup-form';

const Index = () => {
  const navigate = useNavigate();
  const [isSignupOpen, setIsSignupOpen] = useState(false);

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

  const testimonials = [
    {
      name: 'Jake Morrison',
      grade: 'V8 Crusher',
      text: 'Went from flailing on V5s to sending V8s in 3 months. This app called out my bad footwork and now I climb way more efficiently.',
      rating: 5
    },
    {
      name: 'Alex Chen',
      grade: 'V6 Regular',
      text: 'The route detection is spot-on. Love seeing my beta mapped out - helps me remember sequences for my projects.',
      rating: 5
    },
    {
      name: 'Sam Rodriguez',
      grade: 'V7 Sender',
      text: 'Finally, an app that gets climbing. Not just tracking sends, but actually making me a better climber.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Hero Section with Background */}
      <div className="relative">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90" />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Mountain className="h-14 w-14 text-orange-400 mr-4" />
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent">
                Boulder<span className="text-orange-400">Flow</span>
              </h1>
            </div>
            
            <p className="text-2xl md:text-3xl text-slate-200 mb-6 leading-relaxed font-light">
              Your AI Climbing Coach
            </p>
            
            <p className="text-xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Stop guessing, start sending. Turn your phone into the ultimate climbing companion that reads routes, tracks your moves, and helps you level up faster than ever.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-16 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-2xl border-0"
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
                className="border-slate-500 text-slate-200 hover:bg-slate-800/60 px-12 py-6 text-xl transition-all duration-300 backdrop-blur-sm"
                onClick={() => navigate('/dashboard')}
              >
                <Play className="mr-3 h-6 w-6" />
                See It Work
              </Button>
            </div>

            {/* Social Proof - More Climbing Focused */}
            <div className="flex items-center justify-center space-x-8 text-slate-300 mb-20">
              <div className="flex items-center">
                <Star className="h-6 w-6 text-yellow-400 mr-2" />
                <span className="font-bold text-white">4.9/5</span>
                <span className="ml-2">stoke level</span>
              </div>
              <div className="h-6 w-px bg-slate-500"></div>
              <div>
                <span className="font-bold text-white">12K+</span>
                <span className="ml-2">crushers</span>
              </div>
              <div className="h-6 w-px bg-slate-500"></div>
              <div>
                <span className="font-bold text-white">2M+</span>
                <span className="ml-2">routes sent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Why Climbers Love Us */}
        <div className="max-w-6xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Why Crushers Choose BoulderFlow
          </h2>
          <p className="text-xl text-slate-400 text-center mb-16 max-w-3xl mx-auto">
            Because sending is everything, and we help you send more.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4 bg-gradient-to-r from-slate-800/40 to-slate-700/40 p-6 rounded-xl backdrop-blur-sm border border-slate-600/30">
                <CheckCircle className="h-7 w-7 text-orange-400 flex-shrink-0" />
                <span className="text-slate-200 text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features - More Visual */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Built for Climbers, By Climbers
          </h2>
          <p className="text-xl text-slate-400 text-center mb-16 max-w-3xl mx-auto">
            Every feature designed to make you a stronger, smarter climber.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 border border-slate-600/40 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm group"
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-colors duration-300">
                      <feature.icon className="h-10 w-10 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials - More Authentic */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Real Climbers, Real Results
          </h2>
          <p className="text-xl text-slate-400 text-center mb-16">
            Don't just take our word for it - here's what the community says.
          </p>
          <div className="grid md:font-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 border border-slate-600/40 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-200 mb-6 italic text-lg leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-white font-bold">{testimonial.name}</p>
                      <p className="text-orange-400 text-sm font-medium">{testimonial.grade}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats - More Climbing Language */}
        <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-3xl p-12 mb-24 backdrop-blur-sm border border-slate-600/30">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">The Numbers Don't Lie</h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="group">
              <div className="flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-orange-400 mr-2" />
                <p className="text-5xl font-bold text-orange-400">85%</p>
              </div>
              <p className="text-slate-300 text-lg">Higher send rate after 30 days</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-green-400 mr-2" />
                <p className="text-5xl font-bold text-green-400">3.2x</p>
              </div>
              <p className="text-slate-300 text-lg">Faster grade progression</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-blue-400 mr-2" />
                <p className="text-5xl font-bold text-blue-400">500+</p>
              </div>
              <p className="text-slate-300 text-lg">Routes analyzed per session</p>
            </div>
          </div>
        </div>

        {/* Final CTA - More Engaging */}
        <div className="text-center bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-3xl p-16 backdrop-blur-sm border border-orange-500/20">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Level Up Your Climbing?
          </h2>
          <p className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of climbers who've already unlocked their potential. Your next grade is waiting.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-16 py-6 text-xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md">
                <SignupForm />
              </DialogContent>
            </Dialog>
          </div>
          
          <p className="text-sm text-slate-400">
            14-day free trial • No commitment • Cancel anytime
          </p>
        </div>
        
        <div className="py-16"></div>
      </div>
    </div>
  );
};

export default Index;
