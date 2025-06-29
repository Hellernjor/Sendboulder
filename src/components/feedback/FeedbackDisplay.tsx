
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface FeedbackItem {
  id: string;
  rating: number;
  stoke: number;
  comment: string;
  image_url?: string;
  display_name?: string;
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
      // Mock data for now - in real app this would fetch from Supabase
      const mockFeedback: FeedbackItem[] = [
        {
          id: '1',
          rating: 6,
          stoke: 5,
          comment: 'BoulderFlow completely transformed my climbing! The route recognition is spot-on and the progress tracking keeps me motivated.',
          display_name: 'Alex Chen',
          created_at: new Date().toISOString(),
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
          id: '2',
          rating: 5,
          stoke: 5,
          comment: 'Finally, an app that gets climbing. Not just tracking sends, but actually making me a better climber. Love the beta optimization!',
          display_name: 'Sam Rodriguez',
          created_at: new Date().toISOString(),
          image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
          id: '3',
          rating: 6,
          stoke: 4,
          comment: 'Went from flailing on V5s to sending V8s in 3 months. This app called out my bad footwork and now I climb way more efficiently.',
          display_name: 'Jake Morrison',
          created_at: new Date().toISOString(),
          image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
      ];

      const filteredFeedback = onlyHighRatings 
        ? mockFeedback.filter(item => item.rating >= 5)
        : mockFeedback;

      setFeedbackItems(filteredFeedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
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
          {feedback.image_url && (
            <div className="relative h-40 overflow-hidden">
              <img 
                src={feedback.image_url} 
                alt={feedback.display_name || 'User photo'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
            </div>
          )}
          <CardContent className="p-8">
            <div className="flex mb-4">
              {[...Array(feedback.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-slate-700 mb-6 italic text-lg leading-relaxed">"{feedback.comment}"</p>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {feedback.display_name ? feedback.display_name.charAt(0) : 'A'}
                </span>
              </div>
              <div>
                <p className="text-slate-800 font-bold">{feedback.display_name || 'Anonymous'}</p>
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
