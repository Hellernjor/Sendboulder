
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';

const PerformanceChart = () => {
  const progressData = [
    { week: 'Week 1', successRate: 65, routesCompleted: 18 },
    { week: 'Week 2', successRate: 70, routesCompleted: 22 },
    { week: 'Week 3', successRate: 68, routesCompleted: 25 },
    { week: 'Week 4', successRate: 75, routesCompleted: 24 },
    { week: 'Week 5', successRate: 78, routesCompleted: 28 },
    { week: 'Week 6', successRate: 82, routesCompleted: 30 },
  ];

  const difficultyData = [
    { difficulty: 'V1', completed: 15, attempted: 16 },
    { difficulty: 'V2', completed: 12, attempted: 15 },
    { difficulty: 'V3', completed: 8, attempted: 12 },
    { difficulty: 'V4', completed: 5, attempted: 10 },
    { difficulty: 'V5', completed: 2, attempted: 8 },
    { difficulty: 'V6', completed: 1, attempted: 5 },
  ];

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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="week" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="successRate" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Success Rate (%)"
              />
              <Line 
                type="monotone" 
                dataKey="routesCompleted" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Routes Completed"
              />
            </LineChart>
          </ResponsiveContainer>
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="difficulty" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar 
                dataKey="attempted" 
                fill="#6B7280" 
                name="Attempted"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="completed" 
                fill="#10B981" 
                name="Completed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Success Rate Indicators */}
          <div className="mt-4 space-y-2">
            <p className="text-slate-400 text-sm font-medium">Success Rates by Difficulty</p>
            {difficultyData.map((item) => {
              const successRate = Math.round((item.completed / item.attempted) * 100);
              return (
                <div key={item.difficulty} className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">{item.difficulty}</span>
                  <span className={`text-sm font-medium ${
                    successRate >= 80 ? 'text-green-400' : 
                    successRate >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {successRate}%
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceChart;
