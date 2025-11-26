import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export const createClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    });
  }
  return supabaseInstance;
};

// Helper to get the current session
export const getSession = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

// Helper to sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Helper to sign out
export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Helper to get the current user
export const getCurrentUser = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

// Helper to sign in with Google OAuth
export const signInWithGoogle = async () => {
  const supabase = createClient();
  
  // Get the current origin (works in both localhost and production)
  const currentOrigin = window.location.origin;
  const redirectUrl = `${currentOrigin}/auth/callback`;
  
  console.log('[signInWithGoogle] ===== GOOGLE OAUTH SETUP =====');
  console.log('[signInWithGoogle] Current origin:', currentOrigin);
  console.log('[signInWithGoogle] Redirect URL:', redirectUrl);
  console.log('[signInWithGoogle] ⚠️ MAKE SURE THIS URL IS IN SUPABASE DASHBOARD:');
  console.log('[signInWithGoogle] Dashboard → Authentication → URL Configuration → Redirect URLs');
  console.log('[signInWithGoogle] Add exactly:', redirectUrl);
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  
  console.log('[signInWithGoogle] OAuth response:', { data, error });
  
  return { data, error };
};