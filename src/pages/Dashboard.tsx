import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Camera, Target, Clock, Award, BarChart3 } from 'lucide-react';
import SessionTracker from '@/components/SessionTracker';
import RouteAnalyzer from '@/components/RouteAnalyzer';
import PerformanceChart from '@/components/PerformanceChart';
import LocationManager from '@/components/LocationManager';
import RouteTracker from '@/components/RouteTracker';
import FeedbackButton from '@/components/feedback/FeedbackButton';

const Dashboard = () => {
  const weeklyStats = {
    sessionsCompleted: 3,
    totalRoutes: 24,
    successRate: 75,
    improvementScore: 12
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Bouldering Tracker
          </h1>
          <p className="text-slate-400 text-lg">Analyze your climbing performance and improve your technique</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{weeklyStats.sessionsCompleted}</p>
                <p className="text-slate-400 text-sm">Sessions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Target className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{weeklyStats.totalRoutes}</p>
                <p className="text-slate-400 text-sm">Routes</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{weeklyStats.successRate}%</p>
                <p className="text-slate-400 text-sm">Success</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">+{weeklyStats.improvementScore}</p>
                <p className="text-slate-400 text-sm">Score</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Location Manager */}
          <div className="lg:col-span-2">
            <LocationManager />
          </div>

          {/* Route Tracker */}
          <div>
            <RouteTracker />
          </div>

          {/* Route Analyzer */}
          <div className="lg:col-span-2">
            <RouteAnalyzer />
          </div>

          {/* Session Tracker */}
          <div>
            <SessionTracker />
          </div>

          {/* Performance Chart */}
          <div className="lg:col-span-3">
            <PerformanceChart />
          </div>
        </div>
      </div>
      
      {/* Floating Feedback Button */}
      <FeedbackButton />
    </div>
  );
};

export default Dashboard;
