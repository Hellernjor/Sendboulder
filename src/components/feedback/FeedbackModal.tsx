
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Heart } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: { rating: number; stoke: number; comment: string }) => void;
}

const FeedbackModal = ({ isOpen, onClose, onSubmit }: FeedbackModalProps) => {
  const [rating, setRating] = useState(0);
  const [stoke, setStoke] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit({ rating, stoke, comment });
    onClose();
    // Reset form
    setRating(0);
    setStoke(0);
    setComment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">How's your climbing going?</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overall Rating */}
          <div>
            <p className="text-slate-300 mb-3">How would you rate BoulderFlow overall?</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= rating ? 'text-yellow-400 fill-current' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Stoke Level */}
          <div>
            <p className="text-slate-300 mb-3">What's your stoke level? (How excited are you about your climbing progress?)</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setStoke(value)}
                  className="transition-colors"
                >
                  <Heart
                    className={`h-8 w-8 ${
                      value <= stoke ? 'text-red-400 fill-current' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-slate-500 text-sm mt-1">1 = Not stoked, 5 = Super stoked!</p>
          </div>

          {/* Comment */}
          <div>
            <p className="text-slate-300 mb-3">Tell us more about your experience:</p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How has BoulderFlow helped your climbing? Any suggestions?"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || stoke === 0}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              Send Feedback
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
