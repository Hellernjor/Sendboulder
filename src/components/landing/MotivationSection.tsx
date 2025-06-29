
import React from 'react';

const MotivationSection = () => {
  return (
    <div className="relative mb-16 md:mb-24 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-700/60 to-amber-600/60 backdrop-blur-sm border-2 border-orange-700/80 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-800/20 to-amber-800/20"></div>
      <div className="relative p-8 md:p-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 md:mb-6">
          Your Next Send Awaits
        </h2>
        <p className="text-lg md:text-2xl text-slate-800 max-w-3xl mx-auto leading-relaxed font-medium">
          Every crusher knows the feeling - that moment when everything clicks and you stick the crux. 
          We're here to make those moments happen more often.
        </p>
      </div>
    </div>
  );
};

export default MotivationSection;
