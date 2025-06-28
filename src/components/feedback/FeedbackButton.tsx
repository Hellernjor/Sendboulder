
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
      className="fixed bottom-4 right-4 z-50 bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      Feedback
    </Button>
  );
};

export default FeedbackButton;
