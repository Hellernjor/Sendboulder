
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUserStats, getUserAttempts } from '@/lib/database-functions';

const KPISection = () => {
  // Get user stats
  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => getUserStats(),
  });

  // Get user attempts for session count
  const { data: attempts } = useQuery({
    queryKey: ['user-attempts'],
    queryFn: () => getUserAttempts(),
  });

  // Calculate sessions (group attempts by date)
  const totalSessions = React.useMemo(() => {
    if (!attempts) return 0;
    const sessionDates = new Set(
      attempts.map(attempt => new Date(attempt.date).toDateString())
    );
    return sessionDates.size;
  }, [attempts]);

  const kpis = {
    totalSessions: totalSessions,
    totalRoutes: stats?.completedAttempts || 0,
    successRate: Math.round(stats?.successRate || 0),
    improvementScore: stats?.totalAttempts || 0
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
            <p className="text-slate-400 text-xs">Routes Sent</p>
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
            <p className="text-xl font-bold text-white">{kpis.improvementScore}</p>
            <p className="text-slate-400 text-xs">Total Attempts</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPISection;
