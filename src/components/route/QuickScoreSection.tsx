
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Plus, Settings } from 'lucide-react';
import { Location } from '@/types/location';
import QuickScoreModal from './QuickScoreModal';

interface QuickScoreSectionProps {
  location: Location;
  onLogAttempt: (gradeId: string, attempts: number, completed: boolean, notes?: string) => Promise<void>;
  onSetupGrades?: () => void;
}

const QuickScoreSection = ({ location, onLogAttempt, onSetupGrades }: QuickScoreSectionProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If no grade system is set up, show setup prompt
  if (!location.gradeSystem || location.gradeSystem.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Trophy className="h-5 w-5" />
            <span>Quick Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Settings className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-lg mb-2">No grades configured</p>
            <p className="text-slate-500 text-sm mb-4">
              Set up the grade system for {location.name} to start logging quick scores.
            </p>
            {onSetupGrades && (
              <Button 
                onClick={onSetupGrades}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Settings className="h-4 w-4 mr-2" />
                Setup Grades for {location.name}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleGradeClick = (gradeId: string) => {
    setSelectedGrade(gradeId);
    setIsModalOpen(true);
  };

  const handleLogAttempt = async (gradeId: string, attempts: number, completed: boolean, notes?: string) => {
    await onLogAttempt(gradeId, attempts, completed, notes);
    setIsModalOpen(false);
    setSelectedGrade(null);
  };

  const selectedGradeInfo = location.gradeSystem.find(g => g.id === selectedGrade);

  return (
    <>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Trophy className="h-5 w-5" />
            <span>Quick Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {location.gradeSystem
              .sort((a, b) => a.order - b.order)
              .map((grade) => (
                <Button
                  key={grade.id}
                  onClick={() => handleGradeClick(grade.id)}
                  className="h-12 text-white font-medium border-2 transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: grade.color,
                    borderColor: grade.color,
                  }}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {grade.name}
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>

      <QuickScoreModal
        gradeInfo={selectedGradeInfo}
        location={location}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGrade(null);
        }}
        onLogAttempt={handleLogAttempt}
      />
    </>
  );
};

export default QuickScoreSection;
