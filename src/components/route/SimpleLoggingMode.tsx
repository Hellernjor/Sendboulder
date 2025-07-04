import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, CheckCircle, Plus } from 'lucide-react';
import { Location } from '@/types/location';

interface SimpleLoggingModeProps {
  location: Location;
  onLogQuickSession: (gradeId: string, attempts: number, completedCount: number, notes?: string) => Promise<void>;
}

const SimpleLoggingMode = ({ location, onLogQuickSession }: SimpleLoggingModeProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [attempts, setAttempts] = useState(1);
  const [completedCount, setCompletedCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gymGrades = location.gradeSystem || [];

  const handleSubmit = async () => {
    if (!selectedGrade) return;
    
    setIsSubmitting(true);
    try {
      await onLogQuickSession(selectedGrade, attempts, completedCount, notes.trim() || undefined);
      // Reset form
      setSelectedGrade('');
      setAttempts(1);
      setCompletedCount(1);
      setNotes('');
    } catch (error) {
      console.error('Error logging session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (gymGrades.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4 text-center">
          <p className="text-slate-400">No grade system set up for quick logging</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Zap className="h-5 w-5 text-yellow-400" />
          <span>Quick Session Logger</span>
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
            Cardio Mode
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-slate-300 mb-3 block">Select Grade</Label>
          <div className="grid grid-cols-2 gap-2">
            {gymGrades.sort((a, b) => a.order - b.order).map(grade => (
              <Button
                key={grade.id}
                variant={selectedGrade === grade.id ? "default" : "outline"}
                onClick={() => setSelectedGrade(grade.id)}
                className={`h-12 flex items-center justify-center space-x-2 ${
                  selectedGrade === grade.id 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full ring-2 ring-white" 
                  style={{ backgroundColor: grade.color }}
                />
                <span className="font-medium">{grade.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {selectedGrade && (
          <div className="space-y-3 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="attempts" className="text-slate-300">Total Attempts</Label>
                <Input
                  id="attempts"
                  type="number"
                  min="1"
                  value={attempts}
                  onChange={(e) => setAttempts(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="completed" className="text-slate-300">Completed</Label>
                <Input
                  id="completed"
                  type="number"
                  min="0"
                  max={attempts}
                  value={completedCount}
                  onChange={(e) => setCompletedCount(Math.max(0, Math.min(attempts, parseInt(e.target.value) || 0)))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="session-notes" className="text-slate-300">Session Notes (optional)</Label>
              <Input
                id="session-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did the session feel?"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Logging Session...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Log Quick Session
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleLoggingMode;