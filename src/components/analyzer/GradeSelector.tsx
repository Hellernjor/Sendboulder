
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { GradeLevel } from '@/types/location';
import { getGradeLevels } from '@/lib/database-functions';

interface GradeSelectorProps {
  selectedGrade: string | null;
  onGradeSelect: (grade: string) => void;
  locationId?: string;
}

const GradeSelector = ({ selectedGrade, onGradeSelect, locationId }: GradeSelectorProps) => {
  const [grades, setGrades] = useState<GradeLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        // For now, use mock data. In real implementation, load from selected gym
        const mockGrades: GradeLevel[] = [
          { id: '1', color: '#22c55e', name: 'Green', difficulty: 'beginner', order: 0 },
          { id: '2', color: '#3b82f6', name: 'Blue', difficulty: 'easy', order: 1 },
          { id: '3', color: '#ef4444', name: 'Red', difficulty: 'intermediate', order: 2 },
          { id: '4', color: '#eab308', name: 'Yellow', difficulty: 'advanced', order: 3 },
          { id: '5', color: '#8b5cf6', name: 'Purple', difficulty: 'expert', order: 4 },
        ];
        
        setGrades(mockGrades);
        setLoading(false);
      } catch (error) {
        console.error('Error loading grades:', error);
        setLoading(false);
      }
    };

    loadGrades();
  }, [locationId]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-slate-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {grades.map((grade) => (
        <Button
          key={grade.id}
          variant={selectedGrade === grade.name ? "default" : "outline"}
          className={`w-full justify-start p-3 h-auto ${
            selectedGrade === grade.name
              ? 'bg-blue-600 hover:bg-blue-700 border-blue-500'
              : 'border-slate-600 text-slate-300 hover:bg-slate-700'
          }`}
          onClick={() => onGradeSelect(grade.name)}
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: grade.color }}
            />
            <div className="flex-1 text-left">
              <p className="font-medium">{grade.name}</p>
              <p className="text-xs opacity-70 capitalize">{grade.difficulty}</p>
            </div>
          </div>
        </Button>
      ))}
      
      <Button
        variant="outline"
        className="w-full border-dashed border-slate-600 text-slate-400 hover:text-slate-300 hover:bg-slate-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Grade
      </Button>
    </div>
  );
};

export default GradeSelector;
