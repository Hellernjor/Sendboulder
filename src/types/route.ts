
export interface Route {
  id: string;
  name: string;
  color: string;
  gradeId: string; // References the gym's specific grade
  locationId: string;
  isActive: boolean;
  createdAt: Date;
  removedAt?: Date;
  personalRoute: boolean;
  createdBy: string;
}

export interface Attempt {
  id: string;
  routeId: string;
  locationId: string;
  completed: boolean;
  attempts: number;
  date: Date;
  notes?: string;
}
