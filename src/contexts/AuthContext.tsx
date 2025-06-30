
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Logger } from '@/lib/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    Logger.error('AuthContext', 'useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Logger.component('AuthProvider', 'Initializing auth state listener');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        Logger.auth('AuthProvider', `Auth state changed: ${event}`, {
          userEmail: session?.user?.email,
          userId: session?.user?.id,
          hasSession: !!session
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    Logger.auth('AuthProvider', 'Checking for existing session');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        Logger.error('AuthProvider', 'Error getting initial session', error);
      } else {
        Logger.auth('AuthProvider', 'Initial session check complete', {
          userEmail: session?.user?.email,
          userId: session?.user?.id,
          hasSession: !!session
        });
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      Logger.component('AuthProvider', 'Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    Logger.auth('AuthProvider', 'Signing out user');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Logger.error('AuthProvider', 'Sign out error', error);
      } else {
        Logger.success('AuthProvider', 'User signed out successfully');
      }
    } catch (err) {
      Logger.error('AuthProvider', 'Sign out exception', err);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  Logger.debug('AuthProvider', 'Rendering with state', {
    hasUser: !!user,
    loading,
    userEmail: user?.email
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
