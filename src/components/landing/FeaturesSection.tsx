
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, TrendingUp, Target, Clock } from 'lucide-react';

const FeaturesSection = () => {
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

  return (
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
  );
};

export default FeaturesSection;
