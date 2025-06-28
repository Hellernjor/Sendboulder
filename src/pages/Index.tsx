
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, TrendingUp, Target, Users, ArrowRight, Mountain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Camera,
      title: 'Route Detection',
      description: 'AI-powered camera analysis to identify climbing routes by color and track your movements in real-time.'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Detailed insights into your climbing progress with success rates, difficulty trends, and improvement suggestions.'
    },
    {
      icon: Target,
      title: 'Movement Analysis',
      description: 'Get personalized feedback on your technique and movement efficiency to climb more effectively.'
    },
    {
      icon: Users,
      title: 'Session Tracking',
      description: 'Log your climbing sessions, track attempts, and monitor your progression over time.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Mountain className="h-12 w-12 text-blue-400 mr-3" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Bouldering Tracker
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            Elevate your climbing performance with AI-powered route analysis and personalized training insights
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/dashboard')}
            >
              Start Tracking
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg transition-all duration-300"
            >
              Watch Demo
              <Camera className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

        {/* Stats Section */}
        <div className="bg-slate-800/30 rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-400 mb-2">85%</p>
              <p className="text-slate-300">Average improvement in success rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-400 mb-2">3.2x</p>
              <p className="text-slate-300">Faster progression tracking</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-400 mb-2">500+</p>
              <p className="text-slate-300">Routes analyzed per session</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Climbing?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of climbers already improving their performance with AI-powered analysis
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg transition-all duration-300 hover:scale-105"
            onClick={() => navigate('/dashboard')}
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
