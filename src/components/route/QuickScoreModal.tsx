
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Plus } from 'lucide-react';
import { Location, GradeLevel } from '@/types/location';

interface QuickScoreModalProps {
  gradeInfo: GradeLevel | undefined;
  location: Location;
  isOpen: boolean;
  onClose: () => void;
  onLogAttempt: (gradeId: string, attempts: number, completed: boolean, notes?: string) => Promise<void>;
}

const QuickScoreModal = ({ gradeInfo, location, isOpen, onClose, onLogAttempt }: QuickScoreModalProps) => {
  const [attempts, setAttempts] = useState(1);
  const [completed, setCompleted] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!gradeInfo) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onLogAttempt(gradeInfo.id, attempts, completed, notes.trim() || undefined);
      onClose();
      // Reset form
      setAttempts(1);
      setCompleted(true);
      setNotes('');
    } catch (error) {
      console.error('Error logging quick score:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setAttempts(1);
    setCompleted(true);
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div 
              className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm" 
              style={{ backgroundColor: gradeInfo.color }}
            />
            <span>Quick Score - {gradeInfo.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="attempts">Number of attempts</Label>
            <Input
              id="attempts"
              type="number"
              min="1"
              value={attempts}
              onChange={(e) => setAttempts(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label>Result</Label>
            <div className="flex space-x-2">
              <Button
                variant={completed ? "default" : "outline"}
                onClick={() => setCompleted(true)}
                className={`flex-1 ${completed ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Sent
              </Button>
              <Button
                variant={!completed ? "default" : "outline"}
                onClick={() => setCompleted(false)}
                className={`flex-1 ${!completed ? 'bg-rose-600 hover:bg-rose-700' : ''}`}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Failed
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about the attempt..."
              className="w-full"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Logging...' : 'Log Score'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickScoreModal;
