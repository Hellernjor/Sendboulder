
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface FeedbackButtonProps {
  onClick: () => void;
}

const FeedbackButton = ({ onClick }: FeedbackButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-2 border-orange-400 text-white hover:text-white shadow-2xl rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
    >
      <MessageCircle className="h-5 w-5 mr-2" />
      Feedback
    </Button>
  );
};

export default FeedbackButton;
