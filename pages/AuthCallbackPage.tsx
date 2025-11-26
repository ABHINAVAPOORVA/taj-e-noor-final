import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { createClient } from "../utils/supabase/client";
import { setAuthToken } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    console.log('[AuthCallback] ===== CALLBACK PAGE MOUNTED =====');
    console.log('[AuthCallback] Full URL:', window.location.href);
    console.log('[AuthCallback] Hash:', window.location.hash);
    console.log('[AuthCallback] Search:', window.location.search);
    
    let hasHandledAuth = false;
    const supabase = createClient();

    const handleAuthCallback = async () => {
      try {
        // CRITICAL: Check for hash parameters that Supabase OAuth adds
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasAuthHash = hashParams.has('access_token') || hashParams.has('error');
        
        console.log('[AuthCallback] Has auth hash params:', hasAuthHash);
        console.log('[AuthCallback] Hash params:', Object.fromEntries(hashParams.entries()));

        // Check for error in hash
        if (hashParams.has('error')) {
          const error = hashParams.get('error');
          const errorDescription = hashParams.get('error_description');
          console.error('[AuthCallback] ❌ OAuth Error:', error, errorDescription);
          setStatus('error');
          toast.error(`Authentication failed: ${errorDescription || error}`);
          setTimeout(() => navigate("/signin", { replace: true }), 3000);
          return;
        }

        // If there's a hash, Supabase should process it automatically
        if (hasAuthHash) {
          console.log('[AuthCallback] OAuth hash detected, waiting for Supabase to process...');
          // Give Supabase time to process the hash
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Now check for session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        console.log('[AuthCallback] Session check:', {
          hasSession: !!sessionData?.session,
          error: sessionError,
          user: sessionData?.session?.user?.email
        });

        if (sessionData?.session?.access_token && !hasHandledAuth) {
          hasHandledAuth = true;
          console.log('[AuthCallback] ✅ Session found!');
          console.log('[AuthCallback] User:', sessionData.session.user.email);
          console.log('[AuthCallback] Metadata:', sessionData.session.user.user_metadata);
          
          // Store token
          setAuthToken(sessionData.session.access_token);
          console.log('[AuthCallback] Token stored');
          
          // Update status
          setStatus('success');
          
          // Refresh user
          console.log('[AuthCallback] Refreshing user...');
          await refreshUser();
          console.log('[AuthCallback] User refreshed');
          
          // Success message
          const userName = sessionData.session.user.user_metadata?.name 
            || sessionData.session.user.user_metadata?.full_name 
            || sessionData.session.user.email?.split('@')[0];
          
          toast.success(`Welcome, ${userName}!`);
          
          // Navigate
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1000);
        } else if (!sessionData?.session && !hasAuthHash) {
          // No session and no hash means something went wrong
          console.log('[AuthCallback] ❌ No session or hash found');
          console.log('[AuthCallback] 🚨 This means Google redirected back WITHOUT tokens');
          console.log('[AuthCallback] 🚨 Common causes:');
          console.log('[AuthCallback] 1. Wrong Redirect URI in Google Cloud Console');
          console.log('[AuthCallback] 2. Supabase Google provider not properly configured');
          console.log('[AuthCallback] 3. Redirect URL mismatch');
          console.log('[AuthCallback] Expected redirect URI: https://fupgiyzqmaalvozhvjxq.supabase.co/auth/v1/callback');
          setStatus('error');
          toast.error("Google OAuth configuration error. Check the diagnostic page for setup instructions.");
          setTimeout(() => navigate("/diagnostic", { replace: true }), 3000);
        }
      } catch (error) {
        console.error('[AuthCallback] Error in handleAuthCallback:', error);
        if (!hasHandledAuth) {
          setStatus('error');
          toast.error("An error occurred. Please try again.");
          setTimeout(() => navigate("/signin", { replace: true }), 2000);
        }
      }
    };

    // Also listen for auth state changes as backup
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthCallback] 🔔 Auth event:', event, session?.user?.email || 'no session');
      
      if (event === 'SIGNED_IN' && session?.access_token && !hasHandledAuth) {
        hasHandledAuth = true;
        console.log('[AuthCallback] ✅ SIGNED_IN event!');
        
        setAuthToken(session.access_token);
        setStatus('success');
        await refreshUser();
        
        const userName = session.user.user_metadata?.name 
          || session.user.user_metadata?.full_name 
          || session.user.email?.split('@')[0];
        
        toast.success(`Welcome, ${userName}!`);
        setTimeout(() => navigate("/", { replace: true }), 1000);
      }
    });

    // Start the auth callback handling
    handleAuthCallback();

    // Fallback timeout
    const timeout = setTimeout(() => {
      if (!hasHandledAuth && status === 'processing') {
        console.log('[AuthCallback] ⏱️ Timeout');
        setStatus('error');
        toast.error("Authentication timeout. Please check your Supabase configuration.");
        navigate("/signin", { replace: true });
      }
    }, 15000);

    return () => {
      authListener?.subscription?.unsubscribe();
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Loader2 size={40} className="text-white" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl text-gray-800 mb-2"
        >
          Completing Sign In...
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600"
        >
          Please wait while we verify your account
        </motion.p>
      </motion.div>
    </div>
  );
}