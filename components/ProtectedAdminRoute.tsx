import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { isAuthorizedAdmin } from "../config/admin";
import { motion } from "motion/react";
import { Shield, Lock } from "lucide-react";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give a moment to check auth
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Still checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-full mb-4">
            <Shield size={32} className="text-slate-300 animate-pulse" />
          </div>
          <p className="text-slate-400">Verifying admin access...</p>
        </motion.div>
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to="/admin/signin" replace />;
  }

  // Logged in but not authorized admin email
  if (!isAuthorizedAdmin(user.email || "")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-red-800/50 backdrop-blur-xl border border-red-700/50 rounded-2xl shadow-2xl p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-6">
            <Lock size={40} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-3">Access Denied</h1>
          <p className="text-red-200 mb-6">
            You do not have permission to access the admin portal. This area is restricted to authorized administrators only.
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-white text-red-900 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // Authorized admin - show the protected content
  return <>{children}</>;
}
