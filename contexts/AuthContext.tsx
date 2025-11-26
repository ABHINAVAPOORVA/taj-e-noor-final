import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSession, signOut as supabaseSignOut, getCurrentUser } from '../utils/supabase/client';
import { getAuthToken, removeAuthToken, setAuthToken } from '../utils/api';
import { createClient } from '../utils/supabase/client';

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  age?: string;
  gender?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      // First, check if there's a session in Supabase (for OAuth)
      const { data: sessionData, error: sessionError } = await getSession();
      
      // If there's an error or no session, check for stored token
      if (sessionError || !sessionData?.session?.access_token) {
        // Check for stored token
        const token = getAuthToken();
        
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Try to get user with stored token
        try {
          const { data, error } = await getCurrentUser();
          
          if (error) {
            // If error is about missing session, just clear and continue
            if (error.message?.includes('session') || error.name === 'AuthSessionMissingError') {
              setUser(null);
              removeAuthToken();
              setIsLoading(false);
              return;
            }
            throw error;
          }
          
          if (!data.user) {
            setUser(null);
            removeAuthToken();
            setIsLoading(false);
            return;
          }
          
          const fullName = data.user.user_metadata?.full_name 
            || data.user.user_metadata?.name 
            || data.user.user_metadata?.display_name
            || '';
          
          const newUser = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: fullName,
            phone: data.user.user_metadata?.phone,
            age: data.user.user_metadata?.age,
            gender: data.user.user_metadata?.gender,
          };
          
          setUser(newUser);
          setIsLoading(false);
        } catch (userError: any) {
          // Handle auth session errors gracefully
          if (userError.message?.includes('session') || userError.name === 'AuthSessionMissingError') {
            // Session missing - user not signed in
          }
          setUser(null);
          removeAuthToken();
          setIsLoading(false);
        }
        return;
      }
      
      // We have a valid session
      setAuthToken(sessionData.session.access_token);
      
      try {
        const { data, error } = await getCurrentUser();
        
        if (error) {
          setUser(null);
          removeAuthToken();
          setIsLoading(false);
          return;
        }
        
        if (!data.user) {
          setUser(null);
          removeAuthToken();
          setIsLoading(false);
          return;
        }
        
        // Google OAuth provides name in user_metadata.full_name or user_metadata.name
        const fullName = data.user.user_metadata?.full_name 
          || data.user.user_metadata?.name 
          || data.user.user_metadata?.display_name
          || '';
        
        const newUser = {
          id: data.user.id,
          email: data.user.email || '',
          full_name: fullName,
          phone: data.user.user_metadata?.phone,
          age: data.user.user_metadata?.age,
          gender: data.user.user_metadata?.gender,
        };
        
        setUser(newUser);
        setIsLoading(false);
      } catch (userError: any) {
        // Handle auth session errors gracefully
        setUser(null);
        removeAuthToken();
        setIsLoading(false);
      }
    } catch (error: any) {
      // Handle auth session errors gracefully
      setUser(null);
      removeAuthToken();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    // Listen for auth state changes (important for OAuth redirects!)
    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        setAuthToken(session.access_token);
        // Don't await, just trigger refresh
        refreshUser();
      } else if (event === 'SIGNED_OUT') {
        removeAuthToken();
        setUser(null);
      }
    });

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabaseSignOut();
    removeAuthToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}