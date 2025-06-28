
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Camera, TrendingUp, Target, Users, ArrowRight, Mountain, Play, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '@/components/ui/signup-form';

const Index = () => {
  const navigate = useNavigate();
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const features = [
    {
      icon: Camera,
      title: 'AI Route Detection',
      description: 'Advanced computer vision instantly identifies climbing routes by color and difficulty, tracking your every move with precision.'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Comprehensive insights into your climbing progress with success rates, difficulty trends, and personalized improvement suggestions.'
    },
    {
      icon: Target,
      title: 'Movement Analysis',
      description: 'Get real-time feedback on your technique and movement efficiency to climb smarter, not just harder.'
    },
    {
      icon: Users,
      title: 'Session Tracking',
      description: 'Detailed logging of your climbing sessions with attempt tracking and progress monitoring over time.'
    }
  ];

  const benefits = [
    'Improve success rate by 85% on average',
    'Track 500+ routes per session automatically',
    '3.2x faster progression with AI insights',
    'Personalized training recommendations',
    'Detailed movement efficiency analysis',
    'Compare performance across different routes'
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      grade: 'V8 Climber',
      text: 'This app transformed my training. I went from struggling with V5s to sending V8s in just 3 months!',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      grade: 'V6 Climber',
      text: 'The route detection is incredibly accurate. I love seeing my progress mapped out so clearly.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      grade: 'V7 Climber',
      text: 'Finally, a climbing app that actually helps improve technique, not just track sends.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Mountain className="h-12 w-12 text-blue-400 mr-3" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Boulder<span className="text-blue-400">Flow</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-4 leading-relaxed">
            The AI-Powered Climbing Coach That Transforms Your Performance
          </p>
          
          <p className="text-lg text-slate-400 mb-8 max-w-3xl mx-auto">
            Join thousands of climbers using advanced computer vision and AI to track routes, analyze movement, and accelerate their progression. Turn your phone into the ultimate climbing companion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md">
                <SignupForm />
              </DialogContent>
            </Dialog>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg transition-all duration-300"
              onClick={() => navigate('/dashboard')}
            >
              <Play className="mr-2 h-5 w-5" />
              View Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-6 text-slate-400 mb-16">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="font-semibold">4.9/5</span>
              <span className="ml-1">rating</span>
            </div>
            <div className="h-4 w-px bg-slate-600"></div>
            <div>
              <span className="font-semibold text-white">10,000+</span>
              <span className="ml-1">active climbers</span>
            </div>
            <div className="h-4 w-px bg-slate-600"></div>
            <div>
              <span className="font-semibold text-white">1M+</span>
              <span className="ml-1">routes tracked</span>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Why Climbers Choose BoulderFlow
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                <span className="text-slate-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Powerful Features for Serious Climbers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <feature.icon className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Loved by Climbers Worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-200 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-slate-400 text-sm">{testimonial.grade}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-slate-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Proven Results</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-400 mb-2">85%</p>
              <p className="text-slate-300">Average improvement in success rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-400 mb-2">3.2x</p>
              <p className="text-slate-300">Faster progression with AI insights</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-400 mb-2">500+</p>
              <p className="text-slate-300">Routes analyzed per session</p>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Unlock Your Climbing Potential?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join the climbing revolution. Start your free trial today and see why thousands of climbers trust BoulderFlow to elevate their performance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Start Free Trial - No Credit Card Required
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md">
                <SignupForm />
              </DialogContent>
            </Dialog>
          </div>
          
          <p className="text-sm text-slate-400 mt-4">
            14-day free trial • Cancel anytime • No hidden fees
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
