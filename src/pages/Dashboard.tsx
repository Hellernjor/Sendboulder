
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-4">
        {/* Header - Mobile Optimized */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Boulder Flow Coach
          </h1>
          <p className="text-slate-400 text-sm md:text-lg">Track your climbing progress</p>
        </div>

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
