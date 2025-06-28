import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { GradeLevel } from '@/types/location';

interface GradeSystemManagerProps {
  grades: GradeLevel[];
  onGradesChange: (grades: GradeLevel[]) => void;
}

const GradeSystemManager = ({ grades, onGradesChange }: GradeSystemManagerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newGrade, setNewGrade] = useState({
    color: '',
    name: '',
    difficulty: 'beginner' as const
  });

  const difficulties = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-500' },
    { value: 'easy', label: 'Easy', color: 'bg-blue-500' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
    { value: 'advanced', label: 'Advanced', color: 'bg-orange-500' },
    { value: 'expert', label: 'Expert', color: 'bg-red-500' }
  ];

  const handleAddGrade = () => {
    if (!newGrade.color || !newGrade.name) return;

    const grade: GradeLevel = {
      id: Date.now().toString(),
      color: newGrade.color,
      name: newGrade.name,
      difficulty: newGrade.difficulty,
      order: grades.length
    };

    onGradesChange([...grades, grade]);
    setNewGrade({ color: '', name: '', difficulty: 'beginner' });
  };

  const handleDeleteGrade = (gradeId: string) => {
    onGradesChange(grades.filter(g => g.id !== gradeId));
  };

  if (!isEditing) {
    return (
      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white text-sm">
            <span>Grade System ({grades.length} levels)</span>
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit Grades
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2">
            {grades.sort((a, b) => a.order - b.order).map((grade) => (
              <Badge
                key={grade.id}
                className="bg-slate-600 text-white border-slate-500"
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: grade.color }}
                />
                {grade.name}
              </Badge>
            ))}
            {grades.length === 0 && (
              <p className="text-slate-400 text-sm">No grades defined yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-700/50 border-slate-600">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white text-sm">
          <span>Manage Grade System</span>
          <Button
            size="sm"
            onClick={() => setIsEditing(false)}
            variant="outline"
            className="border-slate-600 text-slate-300"
          >
            Done
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new grade form */}
        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label htmlFor="grade-name" className="text-white text-xs">Grade Name</Label>
              <Input
                id="grade-name"
                value={newGrade.name}
                onChange={(e) => setNewGrade({...newGrade, name: e.target.value})}
                placeholder="e.g., Green, Yellow"
                className="bg-slate-800 border-slate-600 text-white text-sm h-8"
              />
            </div>
            <div>
              <Label htmlFor="grade-color" className="text-white text-xs">Color</Label>
              <input
                id="grade-color"
                type="color"
                value={newGrade.color}
                onChange={(e) => setNewGrade({...newGrade, color: e.target.value})}
                className="w-full h-8 bg-slate-800 border border-slate-600 rounded"
              />
            </div>
          </div>
          <div className="mb-3">
            <Label htmlFor="grade-difficulty" className="text-white text-xs">Difficulty Level</Label>
            <select
              id="grade-difficulty"
              value={newGrade.difficulty}
              onChange={(e) => setNewGrade({...newGrade, difficulty: e.target.value as any})}
              className="w-full h-8 bg-slate-800 border border-slate-600 rounded px-2 text-white text-sm"
            >
              {difficulties.map(diff => (
                <option key={diff.value} value={diff.value}>{diff.label}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleAddGrade} size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-3 w-3 mr-1" />
            Add Grade
          </Button>
        </div>

        {/* Existing grades list */}
        <div className="space-y-2">
          {grades.sort((a, b) => a.order - b.order).map((grade) => (
            <div key={grade.id} className="flex items-center justify-between bg-slate-800/30 border border-slate-600 rounded p-2">
              <div className="flex items-center space-x-2">
                <GripVertical className="h-4 w-4 text-slate-400" />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: grade.color }}
                />
                <span className="text-white text-sm">{grade.name}</span>
                <Badge className={`text-xs ${difficulties.find(d => d.value === grade.difficulty)?.color || 'bg-gray-500'}`}>
                  {difficulties.find(d => d.value === grade.difficulty)?.label}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteGrade(grade.id)}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/30"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeSystemManager;
