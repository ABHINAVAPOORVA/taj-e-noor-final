import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Shield, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { signInWithEmail } from "../utils/supabase/client";

const ADMIN_EMAILS = [
  "admin@hotel.com",
  "admin@hotel123",
  "superadmin@hotel.com"
];

export function AdminFixPage() {
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState(ADMIN_EMAILS[0]);
  const [password, setPassword] = useState("");
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e031cba6`;

  const testCredentials = async () => {
    if (!password) {
      toast.error("Enter a password to test");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signInWithEmail(selectedEmail, password);

      setTestResults({
        email: selectedEmail,
        success: !error && !!data?.session,
        message: error ? "❌ Invalid credentials" : "✅ Credentials work!",
        hasSession: !!data?.session,
      });

      if (!error && data?.session) {
        toast.success("Credentials are valid!");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      setTestResults({
        email: selectedEmail,
        success: false,
        message: "❌ Test failed",
      });
      toast.error("Test failed");
    }
    setLoading(false);
  };

  const createAccount = async () => {
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: selectedEmail,
          password: password,
          fullName: "Hotel Admin",
          phone: "",
          age: "",
          gender: "",
          isAdmin: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Account created successfully!");
        setTimeout(() => testCredentials(), 1000);
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch (error: any) {
      toast.error("Failed to create account");
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: selectedEmail,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Password reset successfully!");
        setTimeout(() => testCredentials(), 1000);
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error("Failed to reset password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">Fix Admin Account</h1>
            <p className="text-slate-400">Create account, reset password, or test credentials</p>
          </div>

          {/* Main Panel */}
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <div className="space-y-6">
              {/* Email Selection */}
              <div>
                <label className="text-slate-300 text-sm block mb-2">Admin Email</label>
                <select
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                >
                  {ADMIN_EMAILS.map((email) => (
                    <option key={email} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-slate-300 text-sm block mb-2">Password (min 8 characters)</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                  placeholder="Enter password"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={testCredentials}
                  disabled={loading || !password}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Test Login
                </Button>

                <Button
                  onClick={createAccount}
                  disabled={loading || !password}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Create Account
                </Button>

                <Button
                  onClick={resetPassword}
                  disabled={loading || !password}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Reset Password
                </Button>
              </div>

              {/* Test Results */}
              {testResults && (
                <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3 mb-3">
                    {testResults.success ? (
                      <CheckCircle className="text-green-500" size={24} />
                    ) : (
                      <XCircle className="text-red-500" size={24} />
                    )}
                    <div>
                      <p className="text-white font-semibold">{testResults.email}</p>
                      <p className={testResults.success ? "text-green-400" : "text-red-400"}>
                        {testResults.message}
                      </p>
                    </div>
                  </div>
                  {testResults.success && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-sm text-green-400">
                        ✅ Your credentials work! You can now sign in.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="pt-6 border-t border-slate-700 space-y-2">
                <Button
                  onClick={() => navigate("/admin/sign-in")}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Go to Admin Sign In
                </Button>
                <button
                  onClick={() => navigate("/")}
                  className="block w-full text-center text-sm text-slate-400 hover:text-white"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-300 font-semibold mb-2">How to use:</h3>
            <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
              <li>Select an admin email from the dropdown</li>
              <li>Enter a password (at least 8 characters)</li>
              <li>Click "Create Account" if you don't have one yet</li>
              <li>Click "Reset Password" if you forgot your password</li>
              <li>Click "Test Login" to verify your credentials work</li>
              <li>Once test passes ✅, go to Admin Sign In</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
