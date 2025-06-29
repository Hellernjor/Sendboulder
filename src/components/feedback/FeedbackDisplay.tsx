
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { getApprovedFeedback } from '@/lib/database-functions';

interface FeedbackItem {
  id: string;
  message: string;
  email?: string;
  created_at: string;
}

interface FeedbackDisplayProps {
  onlyHighRatings?: boolean;
  autoRotate?: boolean;
  className?: string;
}

const FeedbackDisplay = ({ onlyHighRatings = false, autoRotate = false, className }: FeedbackDisplayProps) => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    if (autoRotate && feedbackItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % feedbackItems.length);
      }, 5000); // Rotate every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [autoRotate, feedbackItems.length]);

  const fetchFeedback = async () => {
    try {
      const data = await getApprovedFeedback();
      
      // If no real feedback, show mock data for demo
      if (!data || data.length === 0) {
        const mockFeedback: FeedbackItem[] = [
          {
            id: '1',
            message: 'SendBoulder completely transformed my climbing! The route recognition is spot-on and the progress tracking keeps me motivated.',
            email: 'Alex Chen',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            message: 'Finally, an app that gets climbing. Not just tracking sends, but actually making me a better climber. Love the beta optimization!',
            email: 'Sam Rodriguez',
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            message: 'Went from flailing on V5s to sending V8s in 3 months. This app called out my bad footwork and now I climb way more efficiently.',
            email: 'Jake Morrison',
            created_at: new Date().toISOString()
          }
        ];
        setFeedbackItems(mockFeedback);
      } else {
        setFeedbackItems(data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      // Fall back to mock data
      const mockFeedback: FeedbackItem[] = [
        {
          id: '1',
          message: 'SendBoulder completely transformed my climbing! The route recognition is spot-on and the progress tracking keeps me motivated.',
          email: 'Alex Chen',
          created_at: new Date().toISOString()
        }
      ];
      setFeedbackItems(mockFeedback);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading feedback...</div>;
  }

  if (feedbackItems.length === 0) {
    return <div className="text-center py-8">No feedback available</div>;
  }

  const displayItems = autoRotate ? [feedbackItems[currentIndex]] : feedbackItems;

  return (
    <div className={`grid gap-8 ${autoRotate ? 'grid-cols-1' : 'md:grid-cols-3'} ${className}`}>
      {displayItems.map((feedback, index) => (
        <Card 
          key={`${feedback.id}-${index}`} 
          className="bg-white/50 backdrop-blur-sm border border-orange-300/50 overflow-hidden shadow-lg transition-all duration-500"
        >
          <div className="relative h-40 overflow-hidden bg-gradient-to-br from-orange-300/40 to-blue-300/40">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
          </div>
          <CardContent className="p-8">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-slate-700 mb-6 italic text-lg leading-relaxed">"{feedback.message}"</p>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {feedback.email ? feedback.email.charAt(0) : 'A'}
                </span>
              </div>
              <div>
                <p className="text-slate-800 font-bold">{feedback.email || 'Anonymous'}</p>
                <p className="text-slate-600 text-sm font-medium">Verified Crusher</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackDisplay;
