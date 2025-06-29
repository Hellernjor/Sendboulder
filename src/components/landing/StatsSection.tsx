
import React from 'react';
import { Award, TrendingUp, Target } from 'lucide-react';

const StatsSection = () => {
  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 mb-16 md:mb-24 border border-gray-200 shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">The Numbers Don't Lie</h2>
      <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center">
        <div className="group">
          <div className="flex flex-col items-center mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl mb-4">
              <Award className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">85%</p>
          </div>
          <p className="text-slate-600 text-base md:text-lg font-semibold">More consistent tracking</p>
        </div>
        <div className="group">
          <div className="flex flex-col items-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl mb-4">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">3.2x</p>
          </div>
          <p className="text-slate-600 text-base md:text-lg font-semibold">Better progress visibility</p>
        </div>
        <div className="group">
          <div className="flex flex-col items-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mb-4">
              <Target className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">500+</p>
          </div>
          <p className="text-slate-600 text-base md:text-lg font-semibold">Routes tracked per climber</p>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
