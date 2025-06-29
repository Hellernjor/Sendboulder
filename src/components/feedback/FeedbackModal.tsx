import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Heart, Star, Upload, X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: { rating: number; stoke: number; comment: string; image?: File; displayName?: string }) => void;
}

const FeedbackModal = ({ isOpen, onClose, onSubmit }: FeedbackModalProps) => {
  const [rating, setRating] = useState(0);
  const [stoke, setStoke] = useState(0);
  const [comment, setComment] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    onSubmit({ 
      rating, 
      stoke, 
      comment, 
      image: image || undefined,
      displayName: displayName || undefined
    });
    onClose();
    // Reset form
    setRating(0);
    setStoke(0);
    setComment('');
    setDisplayName('');
    setImage(null);
    setImagePreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-orange-50 to-blue-50 border-orange-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-xl">How's your climbing going?</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overall Rating */}
          <div>
            <p className="text-slate-700 mb-3">Overall rating for SendBoulder:</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5, 6].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= rating ? 'text-orange-400 fill-current' : 'text-slate-400'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-slate-600 text-sm mt-1">1 = Poor, 6 = Outstanding</p>
          </div>

          {/* Stoke Level */}
          <div>
            <p className="text-slate-700 mb-3">What's your stoke level? (How excited are you about your climbing progress?)</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setStoke(value)}
                  className="transition-colors"
                >
                  <Heart
                    className={`h-8 w-8 ${
                      value <= stoke ? 'text-red-400 fill-current' : 'text-slate-400'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-slate-600 text-sm mt-1">1 = Not stoked, 5 = Super stoked!</p>
          </div>

          {/* Display Name */}
          <div>
            <p className="text-slate-700 mb-3">Your name (optional):</p>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How should we display your name?"
              className="bg-white/80 border-orange-200 text-slate-800 placeholder-slate-500"
              maxLength={50}
            />
          </div>

          {/* Comment */}
          <div>
            <p className="text-slate-700 mb-3">Tell us more about your experience:</p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How has SendBoulder helped your climbing? Any suggestions?"
              className="bg-white/80 border-orange-200 text-slate-800 placeholder-slate-500"
              rows={4}
              maxLength={500}
            />
            <p className="text-slate-600 text-sm mt-1">{comment.length}/500</p>
          </div>

          {/* Image Upload */}
          <div>
            <p className="text-slate-700 mb-3">Add a photo (optional):</p>
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-orange-200 border-dashed rounded-lg cursor-pointer bg-white/60 hover:bg-white/80 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-slate-600" />
                  <p className="text-sm text-slate-600">Click to upload image</p>
                  <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || stoke === 0 || comment.length < 10}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Send Feedback
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-orange-300 text-slate-700 hover:bg-orange-50"
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
