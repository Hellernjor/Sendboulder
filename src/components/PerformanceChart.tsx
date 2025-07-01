
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUserAttempts, getUserStats } from '@/lib/database-functions';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Logger } from '@/lib/logger';

const PerformanceChart = () => {
  Logger.component('PerformanceChart', 'Component mounted');

  // Get user attempts for progress trend
  const { data: attempts, isLoading: attemptsLoading } = useQuery({
    queryKey: ['user-attempts'],
    queryFn: async () => {
      Logger.db('PerformanceChart', 'Fetching user attempts');
      const result = await getUserAttempts();
      Logger.success('PerformanceChart', `Loaded ${result?.length || 0} attempts`, result);
      return result;
    },
  });

  // Get user stats for difficulty breakdown
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      Logger.db('PerformanceChart', 'Fetching user stats');
      const result = await getUserStats();
      Logger.success('PerformanceChart', 'User stats loaded', result);
      return result;
    },
  });

  // Process attempts data for progress trend
  const progressData = React.useMemo(() => {
    if (!attempts || attempts.length === 0) return [];
    
    // Group attempts by date and calculate success rate
    const dateGroups = attempts.reduce((acc, attempt) => {
      const date = new Date(attempt.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { completed: 0, total: 0 };
      }
      acc[date].total++;
      if (attempt.completed) {
        acc[date].completed++;
      }
      return acc;
    }, {} as Record<string, { completed: number; total: number }>);

    return Object.entries(dateGroups)
      .map(([date, data]) => ({
        date,
        successRate: Math.round((data.completed / data.total) * 100),
        attempts: data.total
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days
  }, [attempts]);

  // Process difficulty breakdown
  const difficultyData = React.useMemo(() => {
    if (!attempts || attempts.length === 0) return [];
    
    // Group by route grade/difficulty
    const gradeGroups = attempts.reduce((acc, attempt) => {
      // This would need route data to get actual grades
      // For now, we'll use a simple difficulty estimation
      const difficulty = attempt.completed ? 'Completed' : 'Attempted';
      if (!acc[difficulty]) {
        acc[difficulty] = 0;
      }
      acc[difficulty]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(gradeGroups).map(([difficulty, count]) => ({
      difficulty,
      count
    }));
  }, [attempts]);

  const isLoading = attemptsLoading || statsLoading;

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
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-slate-400">Loading progress data...</p>
            </div>
          ) : progressData.length === 0 ? (
            <div className="text-center py-16">
              <TrendingUp className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">No session data yet</p>
              <p className="text-slate-500 text-sm">Start tracking your climbing sessions to see your progress over time</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
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
                />
                <Line 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Difficulty Breakdown */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <BarChart3 className="h-5 w-5" />
            <span>Activity Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-slate-400">Loading activity data...</p>
            </div>
          ) : difficultyData.length === 0 ? (
            <div className="text-center py-16">
              <BarChart3 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">No route data yet</p>
              <p className="text-slate-500 text-sm">Add routes and track attempts to see your performance breakdown</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
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
                />
                <Bar 
                  dataKey="count" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceChart;
