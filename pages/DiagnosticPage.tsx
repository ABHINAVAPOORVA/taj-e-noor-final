import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { createClient } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { CheckCircle2, XCircle, AlertCircle, Copy } from "lucide-react";
import { toast } from "sonner";

export function DiagnosticPage() {
  const [checks, setChecks] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const currentOrigin = window.location.origin;
  const supabaseUrl = `https://${projectId}.supabase.co`;
  const redirectUrl = `${currentOrigin}/auth/callback`;
  const googleRedirectUri = `${supabaseUrl}/auth/v1/callback`;

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Check 1: Supabase connection
    const supabaseConnected = !!supabase;
    
    // Check 2: Session
    const { data: sessionData } = await supabase.auth.getSession();
    const hasSession = !!sessionData?.session;
    
    // Check 3: Environment
    const hasProjectId = !!projectId;
    const hasAnonKey = !!publicAnonKey;

    setChecks({
      supabaseConnected,
      hasSession,
      hasProjectId,
      hasAnonKey,
      currentOrigin,
      supabaseUrl,
      redirectUrl,
      googleRedirectUri,
    });
    
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const ConfigItem = ({ label, value, copyable = true }: { label: string; value: string; copyable?: boolean }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="text-sm font-medium text-gray-600 mb-2">{label}</div>
      <div className="flex items-center justify-between gap-2">
        <code className="text-sm bg-white px-3 py-2 rounded border flex-1 break-all">
          {value}
        </code>
        {copyable && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(value)}
            className="shrink-0"
          >
            <Copy size={14} />
          </Button>
        )}
      </div>
    </div>
  );

  const StatusItem = ({ label, status }: { label: string; status: boolean }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-sm">{label}</span>
      {status ? (
        <CheckCircle2 className="text-green-500" size={20} />
      ) : (
        <XCircle className="text-red-500" size={20} />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Running diagnostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OAuth Diagnostic Tool</h1>
          <p className="text-gray-600">Use this information to configure Google OAuth</p>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="text-blue-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <StatusItem label="Supabase Connected" status={checks.supabaseConnected} />
            <StatusItem label="Has Project ID" status={checks.hasProjectId} />
            <StatusItem label="Has Anon Key" status={checks.hasAnonKey} />
            <StatusItem label="Has Active Session" status={checks.hasSession} />
          </CardContent>
        </Card>

        {/* Current Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="text-amber-600" />
              Current Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConfigItem label="Current Origin (Your App)" value={checks.currentOrigin} />
            <ConfigItem label="Supabase Project URL" value={checks.supabaseUrl} />
            <ConfigItem label="App Redirect URL" value={checks.redirectUrl} />
          </CardContent>
        </Card>

        {/* Google Cloud Console Setup */}
        <Card className="border-2 border-blue-500">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              🔧 Google Cloud Console Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Step 1: Authorized JavaScript Origins</h3>
              <p className="text-sm text-gray-600 mb-3">
                Add BOTH of these URLs to "Authorized JavaScript origins":
              </p>
              <div className="space-y-2">
                <ConfigItem label="Origin 1" value={checks.currentOrigin} />
                <ConfigItem label="Origin 2" value={checks.supabaseUrl} />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-3">Step 2: Authorized Redirect URIs</h3>
              <p className="text-sm text-gray-600 mb-3">
                Add this ONE URL to "Authorized redirect URIs":
              </p>
              <ConfigItem label="Redirect URI" value={checks.googleRedirectUri} />
            </div>
          </CardContent>
        </Card>

        {/* Supabase Dashboard Setup */}
        <Card className="border-2 border-green-500">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-green-900">
              ⚙️ Supabase Dashboard Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Authentication → URL Configuration</h3>
              <div className="space-y-2">
                <ConfigItem label="Site URL" value={checks.currentOrigin} />
                <ConfigItem label="Redirect URLs (add this pattern)" value={`${checks.currentOrigin}/**`} />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-3">Authentication → Providers → Google</h3>
              <p className="text-sm text-gray-600 mb-3">
                Make sure you've added your Google OAuth Client ID and Secret from Google Cloud Console
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ After adding the Client ID and Secret, make sure to click "Save" in Supabase
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button onClick={runDiagnostics} variant="outline">
            Refresh Diagnostics
          </Button>
          <Button onClick={() => window.location.href = "/signin"} className="bg-amber-900 hover:bg-amber-800">
            Go to Sign In
          </Button>
        </div>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>🔍 Troubleshooting Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Verify all URLs are copied <strong>exactly</strong> (no extra spaces or characters)</li>
              <li>In Google Cloud Console, make sure OAuth consent screen is configured</li>
              <li>In Google Cloud Console, make sure the OAuth client type is "Web application"</li>
              <li>In Supabase, make sure Google provider is enabled with Client ID and Secret</li>
              <li>After making changes in either platform, wait 1-2 minutes for propagation</li>
              <li>Clear browser cache/cookies or use Incognito mode when testing</li>
              <li>Check that your Google Cloud project has Google+ API enabled</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
