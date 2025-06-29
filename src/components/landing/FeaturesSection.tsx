
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, TrendingUp, Target, Clock } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Camera,
      title: 'Route Documentation',
      description: 'Capture photos of routes, log details, and keep a visual record of every climb you tackle.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Watch your climbing evolution with detailed statistics, success rates, and grade progression over time.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Personal Goals',
      description: 'Set targets, track attempts, and celebrate when you finally stick that project you\'ve been working on.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: 'Session Logging',
      description: 'Record every climbing session with detailed logs of routes attempted, sends, and time spent climbing.',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="mb-16 md:mb-24">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
        Built for Climbers, By Climbers
      </h2>
      <p className="text-lg md:text-xl text-slate-600 text-center mb-12 md:mb-16 max-w-3xl mx-auto font-medium">
        Every feature designed to help you track, improve, and celebrate your climbing.
      </p>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="bg-white border border-gray-200 hover:border-orange-300 transition-all duration-300 hover:scale-105 group overflow-hidden shadow-lg hover:shadow-xl rounded-2xl"
          >
            <div className={`relative h-40 md:h-48 bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
              <div className="p-4 md:p-6 bg-white/30 rounded-2xl backdrop-blur-sm border border-white/40">
                <feature.icon className="h-12 w-12 md:h-16 md:w-16 text-white drop-shadow-lg" />
              </div>
            </div>
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 md:mb-4">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed text-base md:text-lg font-medium">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
