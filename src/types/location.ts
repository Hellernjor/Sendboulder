
export interface GradeLevel {
  id: string;
  color: string;
  name: string;
  difficulty: 'beginner' | 'easy' | 'intermediate' | 'advanced' | 'expert';
  order: number;
}

export interface Location {
  id: string;
  name: string;
  type: 'gym' | 'outdoor';
  address?: string;
  coordinates?: { lat: number; lng: number };
  createdBy: string;
  createdByUsername: string;
  createdAt: Date;
  routeChangeFrequency: 'weekly' | 'monthly' | 'rarely' | 'never';
  isGlobal: boolean;
  gradeSystem?: GradeLevel[];
}
