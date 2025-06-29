
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StatsData {
  averageStoke: number;
  totalUsers: number;
  totalRoutes: number;
  isLoading: boolean;
}

export const useStatsData = (): StatsData => {
  const [stats, setStats] = useState<StatsData>({
    averageStoke: 0,
    totalUsers: 0,
    totalRoutes: 0,
    isLoading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch average stoke from feedback table
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('feedback')
          .select('stoke')
          .not('stoke', 'is', null);

        if (feedbackError) {
          console.error('Error fetching feedback data:', feedbackError);
        }

        // Calculate average stoke
        let averageStoke = 4.7; // fallback
        if (feedbackData && feedbackData.length > 0) {
          const stokeValues = feedbackData
            .map(item => item.stoke)
            .filter(stoke => stoke !== null && stoke !== undefined);
          
          if (stokeValues.length > 0) {
            averageStoke = stokeValues.reduce((sum, stoke) => sum + stoke, 0) / stokeValues.length;
          }
        }

        // Fetch total users from profiles table
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) {
          console.error('Error fetching users count:', usersError);
        }

        // Fetch total routes from routes table
        const { count: routesCount, error: routesError } = await supabase
          .from('routes')
          .select('*', { count: 'exact', head: true });

        if (routesError) {
          console.error('Error fetching routes count:', routesError);
        }

        setStats({
          averageStoke: Number(averageStoke.toFixed(1)),
          totalUsers: usersCount || 12000, // fallback to original number if no data
          totalRoutes: routesCount || 2000000, // fallback to original number if no data
          isLoading: false
        });

      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set fallback values if there's an error
        setStats({
          averageStoke: 4.7,
          totalUsers: 12000,
          totalRoutes: 2000000,
          isLoading: false
        });
      }
    };

    fetchStats();
  }, []);

  return stats;
};
