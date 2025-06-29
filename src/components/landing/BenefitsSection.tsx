
import React from 'react';
import { CheckCircle } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    'Track all your routes in one place',
    'Log attempts and sends instantly',
    'Monitor your grade progression',
    'View detailed climbing statistics',
    'Compare performance across locations',
    'Share achievements with friends'
  ];

  return (
    <div className="max-w-6xl mx-auto mb-16 md:mb-24">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
        Why Climbers Choose SendBoulder
      </h2>
      <p className="text-lg md:text-xl text-slate-600 text-center mb-12 md:mb-16 max-w-3xl mx-auto font-medium">
        Because progress matters, and we help you track every step of your journey.
      </p>
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-xl shadow-md">
              <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-white flex-shrink-0" />
            </div>
            <span className="text-slate-800 text-base md:text-lg font-semibold">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsSection;
