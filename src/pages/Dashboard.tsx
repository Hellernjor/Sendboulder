
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Clock, Award, Mountain, Calendar, MapPin } from 'lucide-react';
import KPISection from '@/components/dashboard/KPISection';
import RouteAnalyzer from '@/components/RouteAnalyzer';
import LocationChoice from '@/components/dashboard/LocationChoice';
import SessionTracker from '@/components/SessionTracker';
import FeedbackButton from '@/components/feedback/FeedbackButton';
import FeedbackModal from '@/components/feedback/FeedbackModal';

const Dashboard = () => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleFeedbackSubmit = (feedback: { stoke: number; comment: string }) => {
    console.log('Feedback submitted:', feedback);
    // Here you would typically save the feedback to your database
  };

  // Fake data for demonstration
  const fakeStats = {
    totalRoutes: 47,
    completedRoutes: 32,
    averageGrade: "V4",
    weeklyProgress: 8,
    currentStreak: 5
  };

  const recentSessions = [
    {
      date: "Today",
      location: "Brooklyn Boulders",
      routes: 6,
      sends: 4,
      highestGrade: "V5"
    },
    {
      date: "Yesterday", 
      location: "Central Rock Gym",
      routes: 8,
      sends: 5,
      highestGrade: "V4"
    },
    {
      date: "2 days ago",
      location: "Movement Climbing",
      routes: 5,
      sends: 3,
      highestGrade: "V6"
    }
  ];

  const currentProjects = [
    {
      name: "Crimpy Overhang",
      grade: "V6",
      location: "Brooklyn Boulders",
      attempts: 12,
      color: "bg-red-500"
    },
    {
      name: "Slopey Nightmare", 
      grade: "V5",
      location: "Central Rock Gym",
      attempts: 8,
      color: "bg-blue-500"
    },
    {
      name: "Compression Beast",
      grade: "V7",
      location: "Movement Climbing", 
      attempts: 15,
      color: "bg-black"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="container mx-auto px-4 py-4">
        {/* Header - Mobile Optimized */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Boulder Flow Coach
          </h1>
          <p className="text-slate-600 text-sm md:text-lg">Track your climbing progress</p>
        </div>

        {/* Demo Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border-2 border-orange-200">
          <div className="flex items-center space-x-2">
            <Mountain className="h-5 w-5 text-orange-600" />
            <p className="text-orange-800 font-semibold">Demo Mode - Sample climbing data shown below</p>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Target className="h-4 w-4 text-blue-600 mr-1" />
              </div>
              <p className="text-xl font-bold text-blue-800">{fakeStats.totalRoutes}</p>
              <p className="text-xs text-blue-600">Total Routes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Award className="h-4 w-4 text-green-600 mr-1" />
              </div>
              <p className="text-xl font-bold text-green-800">{fakeStats.completedRoutes}</p>
              <p className="text-xs text-green-600">Completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-purple-600 mr-1" />
              </div>
              <p className="text-xl font-bold text-purple-800">{fakeStats.averageGrade}</p>
              <p className="text-xs text-purple-600">Avg Grade</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-orange-600 mr-1" />
              </div>
              <p className="text-xl font-bold text-orange-800">{fakeStats.weeklyProgress}</p>
              <p className="text-xs text-orange-600">This Week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Mountain className="h-4 w-4 text-red-600 mr-1" />
              </div>
              <p className="text-xl font-bold text-red-800">{fakeStats.currentStreak}</p>
              <p className="text-xs text-red-600">Day Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-slate-600" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-slate-800">{session.date}</p>
                    <p className="text-sm text-slate-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {session.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-800">{session.sends}/{session.routes} sends</p>
                    <p className="text-xs text-slate-600">Best: {session.highestGrade}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Projects */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-slate-600" />
              Current Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentProjects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${project.color}`}></div>
                    <div>
                      <p className="font-semibold text-slate-800">{project.name}</p>
                      <p className="text-sm text-slate-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {project.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{project.grade}</p>
                    <p className="text-xs text-slate-600">{project.attempts} attempts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile-First Flow */}
        <div className="space-y-6">
          {/* 1. KPIs - All efforts over time */}
          <KPISection />

          {/* 2. Take picture of route */}
          <RouteAnalyzer />

          {/* 3. Location choice with GPS sorting */}
          <LocationChoice />

          {/* 4. Session tracker */}
          <SessionTracker />
        </div>
      </div>
      
      {/* Floating Feedback Button */}
      <FeedbackButton onClick={() => setIsFeedbackModalOpen(true)} />
      
      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default Dashboard;
