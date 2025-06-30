
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus, Settings } from 'lucide-react';
import LocationChoice from '@/components/dashboard/LocationChoice';
import RouteTracker from '@/components/RouteTracker';
import PerformanceChart from '@/components/PerformanceChart';
import KPISection from '@/components/dashboard/KPISection';
import { supabase } from '@/lib/supabase';

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      // Fetch or create user profile
      const fetchUserProfile = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile) {
          // Create profile if it doesn't exist
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.email?.split('@')[0] || 'climber',
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New Climber'
            })
            .select()
            .single();
          
          setUserProfile(newProfile);
        } else {
          setUserProfile(profile);
        }
      };

      fetchUserProfile();
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              SendBoulder
            </h1>
            <p className="text-slate-300 mt-1">
              Welcome back, {userProfile?.full_name || user.email?.split('@')[0] || 'Climber'}!
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/account')}
              className="border-slate-600 bg-slate-800 hover:bg-slate-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Account
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
              className="border-slate-600 bg-slate-800 hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* KPI Section */}
        <KPISection />

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="locations" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="locations" className="data-[state=active]:bg-slate-700">
              Locations
            </TabsTrigger>
            <TabsTrigger value="routes" className="data-[state=active]:bg-slate-700">
              Track Routes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="locations" className="space-y-6">
            <LocationChoice />
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <RouteTracker />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <PerformanceChart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
