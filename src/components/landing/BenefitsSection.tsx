
import React from 'react';
import { CheckCircle } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    'Send rate jumps 85% on average',
    'Auto-track 500+ routes per session',
    '3x faster grade progression',
    'Personalized training insights',
    'Movement efficiency analysis',
    'Cross-route performance comparison'
  ];

  return (
    <div className="max-w-6xl mx-auto mb-16 md:mb-24">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
        Why Crushers Choose SendBoulder
      </h2>
      <p className="text-lg md:text-xl text-slate-600 text-center mb-12 md:mb-16 max-w-3xl mx-auto font-medium">
        Because sending is everything, and we help you send more.
      </p>
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center space-x-4 bg-white p-6 md:p-8 rounded-2xl border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-xl">
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
