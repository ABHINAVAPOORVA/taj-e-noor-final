import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAuthToken } from '../utils/api';
import { getSession } from '../utils/supabase/client';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export function AuthStatusDebug() {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const checkStatus = async () => {
    const currentToken = getAuthToken();
    setToken(currentToken);
    
    const { data } = await getSession();
    setSession(data?.session);
  };
  
  useEffect(() => {
    checkStatus();
  }, [user]);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUser();
    await checkStatus();
    setIsRefreshing(false);
  };
  
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="p-4 bg-white shadow-lg border-2 border-gray-200 max-w-xs">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Auth Status</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-6 w-6 p-0"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </Button>
          </div>
          
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <XCircle size={14} className="text-red-500" />
              )}
              <span className="font-medium">Authenticated:</span>
              <span>{isAuthenticated ? 'Yes' : 'No'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {session ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <XCircle size={14} className="text-red-500" />
              )}
              <span className="font-medium">Session:</span>
              <span>{session ? 'Active' : 'None'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {token ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <XCircle size={14} className="text-red-500" />
              )}
              <span className="font-medium">Token:</span>
              <span>{token ? 'Stored' : 'Missing'}</span>
            </div>
            
            {user && (
              <div className="pt-2 border-t mt-2">
                <div className="font-medium mb-1">User Info:</div>
                <div className="text-gray-600">
                  <div>Email: {user.email}</div>
                  {user.full_name && <div>Name: {user.full_name}</div>}
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="pt-2 border-t mt-2 text-gray-500">
                Loading user...
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
