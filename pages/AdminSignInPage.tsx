import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight, Home, Crown, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { signInWithEmail } from "../utils/supabase/client";
import { setAuthToken } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { isAuthorizedAdmin } from "../config/admin";

export function AdminSignInPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!formData.email || !formData.password) {
      setErrorMessage("Please enter your admin credentials");
      toast.error("Please enter your admin credentials");
      return;
    }

    // Check if email is authorized BEFORE attempting sign-in
    if (!isAuthorizedAdmin(formData.email)) {
      console.error('[AdminSignIn] ❌ Unauthorized email attempt:', formData.email);
      setErrorMessage("Access denied. This email is not authorized for admin access.");
      toast.error("Access denied. This email is not authorized for admin access.");
      setFailedAttempts(prev => prev + 1);
      return;
    }
    
    setIsLoading(true);
    console.log('[AdminSignIn] ===== ADMIN SIGN-IN ATTEMPT =====');
    console.log('[AdminSignIn] Email:', formData.email);
    console.log('[AdminSignIn] Email is authorized:', true);

    try {
      const { data, error } = await signInWithEmail(formData.email, formData.password);

      console.log('[AdminSignIn] ===== SIGN-IN RESPONSE =====');
      console.log('[AdminSignIn] Error:', error);
      console.log('[AdminSignIn] User exists:', !!data?.user);
      console.log('[AdminSignIn] Session exists:', !!data?.session);

      if (error) {
        console.error("[AdminSignIn] ❌ Sign in error:", error.message);
        
        // Specific error messages based on error type
        let errorMsg = "Invalid admin credentials";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMsg = "Incorrect password. Please try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMsg = "Email not confirmed. Please check your email.";
        } else if (error.message.includes("User not found")) {
          errorMsg = "Admin account not found. Please contact support.";
        }
        
        setErrorMessage(errorMsg);
        toast.error(errorMsg, {
          description: "Please verify your credentials and try again.",
          duration: 5000,
        });
        
        setFailedAttempts(prev => prev + 1);
        setIsLoading(false);
        return;
      }

      if (data?.session?.access_token) {
        console.log('[AdminSignIn] ✅ Admin sign-in successful!');
        console.log('[AdminSignIn] Access token received:', data.session.access_token.substring(0, 20) + '...');
        
        // Store the access token
        setAuthToken(data.session.access_token);
        
        // Wait for user to be refreshed in context
        console.log('[AdminSignIn] Refreshing user context...');
        await refreshUser();
        console.log('[AdminSignIn] User context refreshed!');
        
        // Clear error state
        setErrorMessage(null);
        setFailedAttempts(0);
        
        toast.success("Welcome, Admin!", {
          description: "Access granted. Redirecting to dashboard...",
        });
        
        console.log('[AdminSignIn] Navigating to /admin/dashboard...');
        
        // Small delay to ensure state is fully updated
        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 100);
      } else {
        console.error('[AdminSignIn] ❌ No session in response');
        setErrorMessage("Sign in failed. Please try again.");
        toast.error("Sign in failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("[AdminSignIn] ❌ Sign in exception:", error);
      setErrorMessage("An error occurred during sign in. Please try again.");
      toast.error("An error occurred during sign in. Please try again.");
      setFailedAttempts(prev => prev + 1);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F5F5DC]">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000] via-[#A52A2A] to-[#8B0000]">
        {/* Animated patterns */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #FFD700 1px, transparent 1px),
                             radial-gradient(circle at 80% 80%, #FFD700 1px, transparent 1px),
                             radial-gradient(circle at 40% 20%, #FFD700 1px, transparent 1px)`,
            backgroundSize: "50px 50px, 80px 80px, 60px 60px",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Gradient orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#B8860B] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back to Home Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <Home size={18} />
            <span className="text-sm font-medium">Back to Main Site</span>
            <motion.div
              className="w-0 h-0.5 bg-white group-hover:w-full transition-all"
            />
          </motion.button>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] rounded-3xl blur-xl opacity-50" />
            
            {/* Card content */}
            <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden">
              {/* Top accent bar */}
              <div className="h-2 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />
              
              <div className="p-10">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.3,
                    }}
                    className="inline-flex items-center justify-center w-20 h-20 mb-6 relative"
                  >
                    {/* Shield background with glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000] to-[#B22222] rounded-2xl shadow-lg" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Shield className="relative z-10 text-white" size={40} />
                    
                    {/* Decorative crown */}
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <Crown className="text-[#FFD700]" size={20} />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#8B0000] via-[#B22222] to-[#8B0000] bg-clip-text text-transparent">
                      TAJ-E-NOOR
                    </h1>
                    <p className="text-[#8B0000] font-semibold text-lg mb-1">
                      Administrative Portal
                    </p>
                    <p className="text-gray-600 text-sm">
                      Secure access for authorized personnel
                    </p>
                  </motion.div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  <Lock className="text-[#8B0000]" size={16} />
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Alert Banner */}
                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                              <AlertTriangle className="text-white" size={20} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-red-900 font-semibold text-sm mb-1">
                              Authentication Failed
                            </h3>
                            <p className="text-red-700 text-sm leading-relaxed">
                              {errorMessage}
                            </p>
                            {failedAttempts > 2 && (
                              <div className="mt-3 pt-3 border-t border-red-200">
                                <p className="text-xs text-red-600 flex items-center gap-2">
                                  <Shield size={14} />
                                  <span>
                                    <strong>Multiple failed attempts detected.</strong> Need help? 
                                    <button
                                      type="button"
                                      onClick={() => navigate("/admin/fix")}
                                      className="ml-1 underline hover:text-red-800 font-medium"
                                    >
                                      Reset your password
                                    </button>
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setErrorMessage(null)}
                            className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <Label 
                      htmlFor="email" 
                      className="text-gray-700 font-medium flex items-center gap-2"
                    >
                      <Mail size={16} className="text-[#8B0000]" />
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="admin@taj-e-noor.com"
                        className="h-12 pl-4 pr-4 bg-gray-50 border-2 border-gray-200 focus:border-[#8B0000] focus:bg-white transition-all rounded-xl text-gray-900 placeholder:text-gray-400"
                        required
                        disabled={isLoading}
                      />
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#8B0000] to-[#FFD700] rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-2"
                  >
                    <Label 
                      htmlFor="password" 
                      className="text-gray-700 font-medium flex items-center gap-2"
                    >
                      <Lock size={16} className="text-[#8B0000]" />
                      Password
                    </Label>
                    <div className="relative group">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="h-12 pl-4 pr-12 bg-gray-50 border-2 border-gray-200 focus:border-[#8B0000] focus:bg-white transition-all rounded-xl text-gray-900 placeholder:text-gray-400"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B0000] transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#8B0000] to-[#FFD700] rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-14 bg-gradient-to-r from-[#8B0000] via-[#B22222] to-[#8B0000] hover:from-[#A52A2A] hover:via-[#C82333] hover:to-[#A52A2A] text-white font-semibold text-lg rounded-xl shadow-lg shadow-[#8B0000]/30 transition-all duration-300 group relative overflow-hidden"
                      disabled={isLoading}
                    >
                      {/* Button shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />
                      
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-3">
                          <motion.span
                            className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Authenticating...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Access Dashboard
                          <ArrowRight 
                            size={20} 
                            className="group-hover:translate-x-1 transition-transform" 
                          />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Security notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-8 pt-6 border-t border-gray-200"
                >
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <Shield className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs font-semibold text-amber-900 mb-1">
                        Restricted Access
                      </p>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        This portal is protected. Only authorized administrators with valid credentials can access this system. All login attempts are monitored and logged.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />
            </div>
          </motion.div>

          {/* Footer text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center text-sm text-white/70 mt-8"
          >
            <span className="inline-flex items-center gap-2">
              <Lock size={12} />
              Secured by enterprise-grade encryption
            </span>
          </motion.p>
        </div>
      </div>
    </div>
  );
}