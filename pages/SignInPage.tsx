import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { PageTransition } from "../components/PageTransition";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff, Hotel, ArrowLeft } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { signInWithEmail, signInWithGoogle, getSession } from "../utils/supabase/client";
import { setAuthToken } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: (location.state as any)?.email || "",
    password: "",
    rememberMe: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please enter your email and password");
      return;
    }
    
    setIsLoading(true);
    console.log('[SignInPage] ===== SIGN-IN ATTEMPT =====');
    console.log('[SignInPage] Email:', formData.email);
    console.log('[SignInPage] Password length:', formData.password.length);
    console.log('[SignInPage] Timestamp:', new Date().toISOString());

    try {
      const { data, error } = await signInWithEmail(formData.email, formData.password);

      console.log('[SignInPage] ===== SIGN-IN RESPONSE =====');
      console.log('[SignInPage] Error:', error);
      console.log('[SignInPage] Data:', data);
      console.log('[SignInPage] Session exists:', !!data?.session);
      console.log('[SignInPage] User exists:', !!data?.user);

      if (error) {
        console.error("[SignInPage] ❌ Sign in error details:", {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        
        // Provide more helpful error messages
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Please verify your email address before signing in.");
        } else {
          toast.error(error.message || "Failed to sign in. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      if (data?.session?.access_token) {
        console.log('[SignInPage] ✅ Sign-in successful!');
        console.log('[SignInPage] User:', data.user?.email);
        console.log('[SignInPage] User ID:', data.user?.id);
        console.log('[SignInPage] Access token received:', data.session.access_token.substring(0, 20) + '...');
        
        // Store the access token
        setAuthToken(data.session.access_token);
        console.log('[SignInPage] Token stored in localStorage');
        
        // Refresh user in context (but don't wait for it)
        console.log('[SignInPage] Refreshing user context...');
        refreshUser().catch(err => console.error('[SignInPage] Error refreshing user:', err));
        
        toast.success("Welcome back!");
        
        // Navigate to home immediately
        console.log('[SignInPage] Navigating to home...');
        navigate("/", { replace: true });
      } else {
        console.error('[SignInPage] ❌ No session in response');
        toast.error("Sign in failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("[SignInPage] ❌ Sign in exception:", error);
      toast.error("An error occurred during sign in. Please try again.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('[SignInPage] ===== GOOGLE SIGN-IN CLICKED =====');
      console.log('[SignInPage] Current origin:', window.location.origin);
      console.log('[SignInPage] Current URL:', window.location.href);
      
      setIsLoading(true);
      toast.info("Redirecting to Google sign-in...");
      
      const { data, error } = await signInWithGoogle();
      
      console.log('[SignInPage] Google sign-in result:', { data, error });
      
      if (error) {
        console.error('[SignInPage] Google sign-in error:', error);
        toast.error(`Failed to sign in with Google: ${error.message}`);
        setIsLoading(false);
      } else if (data?.url) {
        console.log('[SignInPage] ✅ Redirecting to:', data.url);
        // Supabase will redirect automatically, but we can also do it manually
        window.location.href = data.url;
      } else {
        console.log('[SignInPage] No URL returned, data:', data);
        toast.error("Failed to initiate Google sign-in");
        setIsLoading(false);
      }
    } catch (error) {
      console.error('[SignInPage] Google sign-in exception:', error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-amber-900"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Home
            </Button>
          </motion.div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-3 pb-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex justify-center"
              >
                <div className="w-16 h-16 bg-amber-900 rounded-full flex items-center justify-center">
                  <Hotel size={32} className="text-white" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <CardTitle className="text-3xl text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center text-base mt-2">
                  Sign in to access your account and manage your bookings
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                      }
                    />
                    <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-amber-900 hover:underline">
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-amber-900 hover:bg-amber-800 h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="relative"
                >
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleGoogleSignIn()}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => toast.info("Facebook sign-in coming soon!")}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                </motion.div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="text-sm text-gray-600"
              >
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-amber-900 hover:underline">
                  Sign up
                </Link>
              </motion.p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}