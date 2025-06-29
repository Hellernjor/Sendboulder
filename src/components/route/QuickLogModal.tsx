
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Plus } from 'lucide-react';
import { Route } from '@/types/route';
import { Location } from '@/types/location';
import GradeBadge from './GradeBadge';

interface QuickLogModalProps {
  route: Route | null;
  location: Location;
  isOpen: boolean;
  onClose: () => void;
  onLogAttempt: (routeId: string, attempts: number, completed: boolean, notes?: string) => Promise<void>;
}

const QuickLogModal = ({ route, location, isOpen, onClose, onLogAttempt }: QuickLogModalProps) => {
  const [attempts, setAttempts] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!route) return null;

  const gradeInfo = location.gradeSystem?.find(g => g.id === route.gradeId);
  const gradeName = gradeInfo?.name || 'Unknown Grade';
  const difficultyLabel = gradeInfo?.difficulty || 'unknown';

  const handleSubmit = async () => {
    if (!route) return;
    
    setIsSubmitting(true);
    try {
      await onLogAttempt(route.id, attempts, completed, notes.trim() || undefined);
      onClose();
      // Reset form
      setAttempts(1);
      setCompleted(false);
      setNotes('');
    } catch (error) {
      console.error('Error logging attempt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setAttempts(1);
    setCompleted(false);
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div 
              className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm" 
              style={{ backgroundColor: route.color }}
            />
            <span>{route.name}</span>
            <GradeBadge 
              gradeName={gradeName}
              difficultyLabel={difficultyLabel}
              isPersonal={route.personalRoute}
              isActive={route.isActive}
            />
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
              {isSubmitting ? 'Logging...' : 'Log Attempt'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickLogModal;
