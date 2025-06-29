
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface GradeBadgeProps {
  gradeName: string;
  difficultyLabel: string;
  isPersonal?: boolean;
  isActive?: boolean;
}

const GradeBadge = ({ gradeName, difficultyLabel, isPersonal = false, isActive = true }: GradeBadgeProps) => {
  return (
    <div className="flex items-center space-x-2">
      {isPersonal && (
        <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
          Personal
        </Badge>
      )}
      {!isActive && (
        <Badge className="bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30 text-xs">
          Removed from gym
        </Badge>
      )}
      <span className="text-indigo-600 dark:text-indigo-300 text-sm">
        {gradeName} • {difficultyLabel}
      </span>
    </div>
  );
};

export default GradeBadge;
