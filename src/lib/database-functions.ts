
import { supabase } from '@/integrations/supabase/client';
import type { Location, GradeLevel } from '@/types/location';
import type { Route, Attempt } from '@/types/route';

// Location functions
export const createLocation = async (location: Omit<Location, 'id' | 'createdAt' | 'createdBy' | 'createdByUsername'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.user.id)
    .single();

  const { data, error } = await supabase
    .from('locations')
    .insert([{
      name: location.name,
      type: location.type,
      address: location.address,
      coordinates: location.coordinates,
      route_change_frequency: location.routeChangeFrequency,
      is_global: location.isGlobal || false,
      created_by: user.user.id,
      created_by_username: profile?.username || 'Anonymous'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getLocations = async () => {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      grade_levels (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data?.map(location => ({
    id: location.id,
    name: location.name,
    type: location.type as 'gym' | 'outdoor',
    address: location.address,
    coordinates: location.coordinates as { lat: number; lng: number } | undefined,
    createdBy: location.created_by,
    createdByUsername: location.created_by_username,
    createdAt: new Date(location.created_at),
    routeChangeFrequency: location.route_change_frequency as 'weekly' | 'monthly' | 'rarely' | 'never',
    isGlobal: location.is_global,
    gradeSystem: location.grade_levels?.map((grade: any) => ({
      id: grade.id,
      color: grade.color,
      name: grade.name,
      difficulty: grade.difficulty,
      order: grade.order_index
    }))
  })) || [];
};

export const getUserLocations = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      grade_levels (*)
    `)
    .eq('created_by', user.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data?.map(location => ({
    id: location.id,
    name: location.name,
    type: location.type as 'gym' | 'outdoor',
    address: location.address,
    coordinates: location.coordinates as { lat: number; lng: number } | undefined,
    createdBy: location.created_by,
    createdByUsername: location.created_by_username,
    createdAt: new Date(location.created_at),
    routeChangeFrequency: location.route_change_frequency as 'weekly' | 'monthly' | 'rarely' | 'never',
    isGlobal: location.is_global,
    gradeSystem: location.grade_levels?.map((grade: any) => ({
      id: grade.id,
      color: grade.color,
      name: grade.name,
      difficulty: grade.difficulty,
      order: grade.order_index
    }))
  })) || [];
};

// Grade functions
export const createGradeLevel = async (locationId: string, grade: Omit<GradeLevel, 'id'>) => {
  const { data, error } = await supabase
    .from('grade_levels')
    .insert([{
      location_id: locationId,
      color: grade.color,
      name: grade.name,
      difficulty: grade.difficulty,
      order_index: grade.order
    }])
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    color: data.color,
    name: data.name,
    difficulty: data.difficulty,
    order: data.order_index
  };
};

export const getGradeLevels = async (locationId: string) => {
  const { data, error } = await supabase
    .from('grade_levels')
    .select('*')
    .eq('location_id', locationId)
    .order('order_index');

  if (error) throw error;
  
  return data?.map(grade => ({
    id: grade.id,
    color: grade.color,
    name: grade.name,
    difficulty: grade.difficulty as 'beginner' | 'easy' | 'intermediate' | 'advanced' | 'expert',
    order: grade.order_index
  })) || [];
};

// Route functions
export const createRoute = async (route: Omit<Route, 'id' | 'createdAt' | 'createdBy'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('routes')
    .insert([{
      name: route.name,
      color: route.color,
      grade_id: route.gradeId,
      location_id: route.locationId,
      is_active: route.isActive,
      personal_route: route.personalRoute,
      created_by: user.user.id
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    color: data.color,
    gradeId: data.grade_id,
    locationId: data.location_id,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    removedAt: data.removed_at ? new Date(data.removed_at) : undefined,
    personalRoute: data.personal_route,
    createdBy: data.created_by
  };
};

export const getRoutes = async (locationId: string) => {
  const { data, error } = await supabase
    .from('routes')
    .select(`
      *,
      grade_levels (*)
    `)
    .eq('location_id', locationId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data?.map(route => ({
    id: route.id,
    name: route.name,
    color: route.color,
    gradeId: route.grade_id,
    locationId: route.location_id,
    isActive: route.is_active,
    createdAt: new Date(route.created_at),
    removedAt: route.removed_at ? new Date(route.removed_at) : undefined,
    personalRoute: route.personal_route,
    createdBy: route.created_by
  })) || [];
};

export const getUserRoutes = async (locationId?: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  let query = supabase
    .from('routes')
    .select(`
      *,
      grade_levels (*),
      locations (name)
    `)
    .eq('created_by', user.user.id)
    .eq('is_active', true);

  if (locationId) {
    query = query.eq('location_id', locationId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  
  return data?.map(route => ({
    id: route.id,
    name: route.name,
    color: route.color,
    gradeId: route.grade_id,
    locationId: route.location_id,
    isActive: route.is_active,
    createdAt: new Date(route.created_at),
    removedAt: route.removed_at ? new Date(route.removed_at) : undefined,
    personalRoute: route.personal_route,
    createdBy: route.created_by
  })) || [];
};

export const updateRoute = async (routeId: string, updates: Partial<Route>) => {
  const { data, error } = await supabase
    .from('routes')
    .update({
      name: updates.name,
      color: updates.color,
      grade_id: updates.gradeId,
      is_active: updates.isActive,
      removed_at: updates.removedAt?.toISOString()
    })
    .eq('id', routeId)
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    color: data.color,
    gradeId: data.grade_id,
    locationId: data.location_id,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    removedAt: data.removed_at ? new Date(data.removed_at) : undefined,
    personalRoute: data.personal_route,
    createdBy: data.created_by
  };
};

export const deactivateRoute = async (routeId: string) => {
  const { data, error } = await supabase
    .from('routes')
    .update({ 
      is_active: false, 
      removed_at: new Date().toISOString() 
    })
    .eq('id', routeId)
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    color: data.color,
    gradeId: data.grade_id,
    locationId: data.location_id,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    removedAt: data.removed_at ? new Date(data.removed_at) : undefined,
    personalRoute: data.personal_route,
    createdBy: data.created_by
  };
};

// Attempt functions
export const createAttempt = async (attempt: Omit<Attempt, 'id'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('attempts')
    .insert([{
      route_id: attempt.routeId,
      location_id: attempt.locationId,
      user_id: user.user.id,
      completed: attempt.completed,
      attempts: attempt.attempts,
      date: attempt.date.toISOString(),
      notes: attempt.notes
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    routeId: data.route_id,
    locationId: data.location_id,
    completed: data.completed,
    attempts: data.attempts,
    date: new Date(data.date),
    notes: data.notes
  };
};

export const getUserAttempts = async (locationId?: string, routeId?: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  let query = supabase
    .from('attempts')
    .select(`
      *,
      routes (*),
      locations (name)
    `)
    .eq('user_id', user.user.id);

  if (locationId) {
    query = query.eq('location_id', locationId);
  }

  if (routeId) {
    query = query.eq('route_id', routeId);
  }

  const { data, error } = await query.order('date', { ascending: false });

  if (error) throw error;
  
  return data?.map(attempt => ({
    id: attempt.id,
    routeId: attempt.route_id,
    locationId: attempt.location_id,
    completed: attempt.completed,
    attempts: attempt.attempts,
    date: new Date(attempt.date),
    notes: attempt.notes
  })) || [];
};

export const updateAttempt = async (attemptId: string, updates: Partial<Attempt>) => {
  const { data, error } = await supabase
    .from('attempts')
    .update({
      completed: updates.completed,
      attempts: updates.attempts,
      date: updates.date?.toISOString(),
      notes: updates.notes
    })
    .eq('id', attemptId)
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    routeId: data.route_id,
    locationId: data.location_id,
    completed: data.completed,
    attempts: data.attempts,
    date: new Date(data.date),
    notes: data.notes
  };
};

export const deleteAttempt = async (attemptId: string) => {
  const { data, error } = await supabase
    .from('attempts')
    .delete()
    .eq('id', attemptId);

  if (error) throw error;
  return data;
};

// Analytics functions
export const getUserStats = async (locationId?: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  let query = supabase
    .from('attempts')
    .select(`
      *,
      routes (
        *,
        grade_levels (*)
      )
    `)
    .eq('user_id', user.user.id);

  if (locationId) {
    query = query.eq('location_id', locationId);
  }

  const { data, error } = await query;

  if (error) throw error;
  
  const attempts = data || [];
  const totalAttempts = attempts.length;
  const completedAttempts = attempts.filter(attempt => attempt.completed).length;
  const successRate = totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0;
  
  const statsByDifficulty = attempts.reduce((acc, attempt) => {
    const difficulty = attempt.routes?.grade_levels?.difficulty || 'unknown';
    if (!acc[difficulty]) {
      acc[difficulty] = { total: 0, completed: 0 };
    }
    acc[difficulty].total++;
    if (attempt.completed) {
      acc[difficulty].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  return {
    totalAttempts,
    completedAttempts,
    successRate,
    statsByDifficulty
  };
};

// Profile functions
export const getCurrentUserProfile = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.user.id)
    .single();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (updates: { username?: string; full_name?: string; avatar_url?: string }) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
