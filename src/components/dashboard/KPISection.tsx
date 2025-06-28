
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';

const KPISection = () => {
  // These will be calculated from real user data
  const kpis = {
    totalSessions: 0,
    totalRoutes: 0,
    successRate: 0,
    improvementScore: 0
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Your Progress
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-blue-400 mr-1" />
            </div>
            <p className="text-xl font-bold text-white">{kpis.totalSessions}</p>
            <p className="text-slate-400 text-xs">Sessions</p>
          </div>
          
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-green-400 mr-1" />
            </div>
            <p className="text-xl font-bold text-white">{kpis.totalRoutes}</p>
            <p className="text-slate-400 text-xs">Routes</p>
          </div>
          
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-4 w-4 text-yellow-400 mr-1" />
            </div>
            <p className="text-xl font-bold text-white">{kpis.successRate}%</p>
            <p className="text-slate-400 text-xs">Success</p>
          </div>
          
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-purple-400 mr-1" />
            </div>
            <p className="text-xl font-bold text-white">+{kpis.improvementScore}</p>
            <p className="text-slate-400 text-xs">Score</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPISection;
