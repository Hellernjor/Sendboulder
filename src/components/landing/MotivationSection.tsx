
import React from 'react';

const MotivationSection = () => {
  return (
    <div className="relative mb-16 md:mb-24 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-blue-100/30"></div>
      <div className="relative p-8 md:p-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 md:mb-6">
          Your Climbing Journey, Documented
        </h2>
        <p className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
          Every route tells a story. Every attempt builds strength. Track your progress, 
          celebrate your sends, and watch yourself become the climber you've always wanted to be.
        </p>
      </div>
    </div>
  );
};

export default MotivationSection;
