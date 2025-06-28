
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3 } from 'lucide-react';

const PerformanceChart = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Progress Trend */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <TrendingUp className="h-5 w-5" />
            <span>Progress Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <TrendingUp className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">No session data yet</p>
            <p className="text-slate-500 text-sm">Start tracking your climbing sessions to see your progress over time</p>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Breakdown */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <BarChart3 className="h-5 w-5" />
            <span>Difficulty Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <BarChart3 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">No route data yet</p>
            <p className="text-slate-500 text-sm">Add routes and track attempts to see your performance by difficulty</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceChart;
