import { useState } from "react";
import { Button } from "../components/ui/button";
import { CheckCircle, XCircle, Loader2, Play } from "lucide-react";
import { projectId } from "../utils/supabase/info";

export function BackendTestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e031cba6`;

  const tests = [
    {
      name: "Health Check",
      endpoint: "/health",
      method: "GET",
      requiresAuth: false,
    },
    {
      name: "Get Rooms",
      endpoint: "/rooms",
      method: "GET",
      requiresAuth: false,
    },
    {
      name: "Get Services",
      endpoint: "/services",
      method: "GET",
      requiresAuth: false,
    },
  ];

  const runTest = async (test: any) => {
    try {
      const response = await fetch(`${API_BASE}${test.endpoint}`, {
        method: test.method,
      });

      const data = await response.json();

      return {
        success: response.ok,
        status: response.status,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setResults({});

    for (const test of tests) {
      const result = await runTest(test);
      setResults((prev) => ({
        ...prev,
        [test.name]: result,
      }));
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          <h1 className="text-white text-3xl font-bold mb-2">
            Backend Connection Test
          </h1>
          <p className="text-slate-400 mb-6">
            Test all backend endpoints after Supabase reconnection
          </p>

          {/* Project Info */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">Project ID:</span>{" "}
              {projectId}
            </p>
            <p className="text-sm text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">API Base:</span>{" "}
              {API_BASE}
            </p>
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-slate-300">Status:</span>{" "}
              <span className="text-green-400">Connected</span>
            </p>
          </div>

          {/* Run Tests Button */}
          <Button
            onClick={runAllTests}
            disabled={testing}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white mb-6"
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>

          {/* Test Results */}
          <div className="space-y-4">
            {tests.map((test) => {
              const result = results[test.name];
              const isComplete = !!result;
              const isSuccess = result?.success;

              return (
                <div
                  key={test.name}
                  className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!isComplete ? (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                        ) : isSuccess ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : (
                          <XCircle className="text-red-500" size={20} />
                        )}
                        <h3 className="text-white font-semibold">
                          {test.name}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-400">
                        {test.method} {test.endpoint}
                      </p>
                    </div>
                    {isComplete && (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isSuccess
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {result.status || "ERROR"}
                      </span>
                    )}
                  </div>

                  {/* Result Details */}
                  {isComplete && (
                    <div className="mt-3 bg-slate-950/50 rounded p-3">
                      {isSuccess ? (
                        <div>
                          <p className="text-xs text-slate-400 mb-2">
                            Response:
                          </p>
                          <pre className="text-xs text-green-400 overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-red-400">
                            Error: {result.error || "Request failed"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {Object.keys(results).length === tests.length && !testing && (
            <div className="mt-6 bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Summary</h3>
              <p className="text-sm text-slate-400">
                {Object.values(results).filter((r: any) => r.success).length} /{" "}
                {tests.length} tests passed
              </p>
              {Object.values(results).every((r: any) => r.success) ? (
                <p className="text-sm text-green-400 mt-2">
                  ✅ All backend connections are working correctly!
                </p>
              ) : (
                <p className="text-sm text-red-400 mt-2">
                  ⚠️ Some tests failed. Check the errors above.
                </p>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-300 font-semibold mb-2 text-sm">
              ℹ️ What to do next:
            </h3>
            <ul className="text-xs text-blue-200/80 space-y-1">
              <li>• If all tests pass, your backend is connected correctly</li>
              <li>• Test authentication by signing up/in</li>
              <li>
                • Create a test booking to verify the full flow
              </li>
              <li>• Set up admin account at /admin/setup</li>
              <li>
                • Check BACKEND_CONNECTION_CHECK.md for detailed info
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
