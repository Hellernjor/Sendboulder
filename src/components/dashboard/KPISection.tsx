
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUserStats, getUserAttempts } from '@/lib/database-functions';
import { Logger } from '@/lib/logger';

const KPISection = () => {
  Logger.component('KPISection', 'Component mounted');

  // Get user stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => {
      Logger.db('KPISection', 'Fetching user stats');
      return getUserStats();
    },
    onSuccess: (data) => {
      Logger.success('KPISection', 'User stats loaded', data);
    },
    onError: (error) => {
      Logger.error('KPISection', 'Failed to load user stats', error);
    }
  });

  // Get user attempts for session count
  const { data: attempts, isLoading: attemptsLoading, error: attemptsError } = useQuery({
    queryKey: ['user-attempts'],
    queryFn: () => {
      Logger.db('KPISection', 'Fetching user attempts');
      return getUserAttempts();
    },
    onSuccess: (data) => {
      Logger.success('KPISection', `Loaded ${data?.length || 0} attempts`, data);
    },
    onError: (error) => {
      Logger.error('KPISection', 'Failed to load user attempts', error);
    }
  });

  // Calculate sessions (group attempts by date)
  const totalSessions = React.useMemo(() => {
    if (!attempts) {
      Logger.debug('KPISection', 'No attempts data available for session calculation');
      return 0;
    }
    
    const sessionDates = new Set(
      attempts.map(attempt => new Date(attempt.date).toDateString())
    );
    
    const sessionCount = sessionDates.size;
    Logger.debug('KPISection', `Calculated ${sessionCount} unique sessions`, {
      totalAttempts: attempts.length,
      uniqueDates: Array.from(sessionDates)
    });
    
    return sessionCount;
  }, [attempts]);

  const kpis = {
    totalSessions: totalSessions,
    totalRoutes: stats?.completedAttempts || 0,
    successRate: Math.round(stats?.successRate || 0),
    improvementScore: stats?.totalAttempts || 0
  };

  Logger.debug('KPISection', 'Calculated KPIs', {
    kpis,
    statsLoading,
    attemptsLoading,
    hasStatsError: !!statsError,
    hasAttemptsError: !!attemptsError
  });

  return (
    <Card className="bg-white/80 border-blue-200 shadow-sm backdrop-blur-sm mb-6">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Your Progress
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-blue-500 mr-1" />
            </div>
            <p className="text-xl font-bold text-slate-800">{kpis.totalSessions}</p>
            <p className="text-slate-600 text-xs">Sessions</p>
          </div>
          
          <div className="text-center p-3 bg-green-50/50 rounded-lg border border-green-100">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-green-500 mr-1" />
            </div>
            <p className="text-xl font-bold text-slate-800">{kpis.totalRoutes}</p>
            <p className="text-slate-600 text-xs">Routes Sent</p>
          </div>
          
          <div className="text-center p-3 bg-yellow-50/50 rounded-lg border border-yellow-100">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-4 w-4 text-yellow-500 mr-1" />
            </div>
            <p className="text-xl font-bold text-slate-800">{kpis.successRate}%</p>
            <p className="text-slate-600 text-xs">Success</p>
          </div>
          
          <div className="text-center p-3 bg-purple-50/50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
            </div>
            <p className="text-xl font-bold text-slate-800">{kpis.improvementScore}</p>
            <p className="text-slate-600 text-xs">Total Attempts</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPISection;
