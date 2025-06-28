
import { supabase } from './supabase';
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
      ...location,
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
  return data;
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
  return data;
};

// Grade functions
export const createGradeLevel = async (locationId: string, grade: Omit<GradeLevel, 'id'>) => {
  const { data, error } = await supabase
    .from('grade_levels')
    .insert([{
      ...grade,
      location_id: locationId
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getGradeLevels = async (locationId: string) => {
  const { data, error } = await supabase
    .from('grade_levels')
    .select('*')
    .eq('location_id', locationId)
    .order('order_index');

  if (error) throw error;
  return data;
};

// Route functions
export const createRoute = async (route: Omit<Route, 'id' | 'createdAt' | 'createdBy'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('routes')
    .insert([{
      ...route,
      created_by: user.user.id
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
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
  return data;
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
  return data;
};

export const updateRoute = async (routeId: string, updates: Partial<Route>) => {
  const { data, error } = await supabase
    .from('routes')
    .update(updates)
    .eq('id', routeId)
    .select()
    .single();

  if (error) throw error;
  return data;
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
  return data;
};

// Attempt functions
export const createAttempt = async (attempt: Omit<Attempt, 'id'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('attempts')
    .insert([{
      ...attempt,
      user_id: user.user.id
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
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
  return data;
};

export const updateAttempt = async (attemptId: string, updates: Partial<Attempt>) => {
  const { data, error } = await supabase
    .from('attempts')
    .update(updates)
    .eq('id', attemptId)
    .select()
    .single();

  if (error) throw error;
  return data;
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
  
  // Calculate stats
  const totalAttempts = data.length;
  const completedAttempts = data.filter(attempt => attempt.completed).length;
  const successRate = totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0;
  
  // Group by difficulty
  const statsByDifficulty = data.reduce((acc, attempt) => {
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
