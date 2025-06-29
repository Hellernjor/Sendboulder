
import React, { useState, useEffect } from 'react';
import { submitFeedback } from '@/lib/database-functions';
import FeedbackButton from '@/components/feedback/FeedbackButton';
import FeedbackModal from '@/components/feedback/FeedbackModal';
import FeedbackDisplay from '@/components/feedback/FeedbackDisplay';
import HeroSection from '@/components/landing/HeroSection';
import MotivationSection from '@/components/landing/MotivationSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import StatsSection from '@/components/landing/StatsSection';
import FinalCTA from '@/components/landing/FinalCTA';
import { useStatsData } from '@/hooks/useStatsData';

const Index = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  
  // Use real stats data from the database
  const { averageStoke, totalUsers, totalRoutes, isLoading } = useStatsData();

  const userStats = {
    averageRating: 4.9, // This can be removed since we removed app rating
    averageStoke,
    totalUsers,
    totalRoutes
  };

  // Check if user should see feedback prompt (after a week of usage)
  useEffect(() => {
    const checkFeedbackPrompt = () => {
      const firstVisit = localStorage.getItem('boulderflow_first_visit');
      if (!firstVisit) {
        localStorage.setItem('boulderflow_first_visit', Date.now().toString());
        return;
      }

      const hasGivenFeedback = localStorage.getItem('boulderflow_feedback_given');
      if (hasGivenFeedback) return;

      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      const timeSinceFirstVisit = Date.now() - parseInt(firstVisit);
      
      if (timeSinceFirstVisit > weekInMs) {
        setShowFeedbackPrompt(true);
      }
    };

    checkFeedbackPrompt();
  }, []);

  const handleFeedbackSubmit = async (feedback: { rating: number; stoke: number; comment: string; image?: File; displayName?: string }) => {
    try {
      await submitFeedback({
        rating: feedback.rating,
        stoke: feedback.stoke,
        comment: feedback.comment,
        displayName: feedback.displayName,
        imageFile: feedback.image
      });
      
      console.log('Feedback submitted successfully');
      localStorage.setItem('boulderflow_feedback_given', 'true');
      localStorage.setItem('boulderflow_user_feedback', JSON.stringify(feedback));
      setShowFeedbackPrompt(false);
      
      // The stats will automatically update on next page load/component mount
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  // Show loading state if stats are still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center">
        <div className="text-slate-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-slate-900 overflow-hidden">
      {/* Hero Section */}
      <HeroSection 
        isSignupOpen={isSignupOpen}
        setIsSignupOpen={setIsSignupOpen}
        userStats={userStats}
      />

      <div className="container mx-auto px-4">
        {/* Enhanced Motivation Section */}
        <MotivationSection />

        {/* Enhanced Benefits Section */}
        <BenefitsSection />

        {/* Enhanced Features */}
        <FeaturesSection />

        {/* Testimonials */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Real Climbers, Real Results
          </h2>
          <p className="text-lg md:text-xl text-slate-600 text-center mb-12 md:mb-16 font-medium">
            Don't just take our word for it - here's what the community says.
          </p>
          <FeedbackDisplay onlyHighRatings={true} autoRotate={true} />
        </div>

        {/* Enhanced Stats */}
        <StatsSection />

        {/* Enhanced Final CTA */}
        <FinalCTA 
          isSignupOpen={isSignupOpen}
          setIsSignupOpen={setIsSignupOpen}
        />
        
        <div className="py-8 md:py-16"></div>
      </div>

      {/* Enhanced Feedback System */}
      <FeedbackButton onClick={() => setIsFeedbackOpen(true)} />
      
      <FeedbackModal 
        isOpen={isFeedbackOpen || showFeedbackPrompt}
        onClose={() => {
          setIsFeedbackOpen(false);
          setShowFeedbackPrompt(false);
        }}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default Index;
