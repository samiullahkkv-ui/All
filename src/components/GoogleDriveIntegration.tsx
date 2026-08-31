import React, { useState, useEffect } from 'react';
import { initAuth, googleSignIn, getAccessToken, logout } from '../auth';
import { User } from 'firebase/auth';
import { Loader2, File, Folder, LogOut, Trash2 } from 'lucide-react';

export default function GoogleDriveIntegration() {
  const [needsAuth, setNeedsAuth] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setUser(user);
        setToken(token);
        setNeedsAuth(false);
      },
      () => {
        setNeedsAuth(true);
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
        fetchFiles(result.accessToken);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError('Login failed: ' + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setFiles([]);
  };

  const fetchFiles = async (accessToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=20&orderBy=modifiedTime desc&fields=files(id,name,mimeType,modifiedTime,webViewLink)', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch files. Status: ' + res.status);
      }
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && files.length === 0 && !loading && !error) {
      fetchFiles(token);
    }
  }, [token]);

  const handleDelete = async (fileId: string, fileName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileName}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('Failed to delete file. Status: ' + res.status);
      }
      setFiles(files.filter(f => f.id !== fileId));
    } catch (err: any) {
      console.error('Delete error:', err);
      setError('Delete error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (needsAuth) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.01 2.06c-5.5 0-9.96 4.47-9.96 9.96s4.46 9.96 9.96 9.96c5.5 0 9.96-4.47 9.96-9.96s-4.46-9.96-9.96-9.96zm4.81 14.1l-2.02-3.5h-5.58l-2.02 3.5h9.62zm-8.83-1.07l-2.02-3.5 4.81-8.32 2.02 3.5-4.81 8.32zm9.64 0l-4.81-8.32-2.02 3.5 4.81 8.32 2.02-3.5z"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connect Google Drive</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">Connect your Google account to view and manage your recent files directly from this tool.</p>
        
        <button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="gsi-material-button relative border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 font-medium px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {isLoggingIn ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          )}
          <span>Sign in with Google</span>
        </button>
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full font-bold">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user?.displayName || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Files</h3>
          <button 
            onClick={() => token && fetchFiles(token)}
            disabled={loading}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {error && <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Folder className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No files found in your Drive.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 rounded-xl border border-transparent hover:border-gray-100 dark:border-gray-700 transition-colors group">
                <a 
                  href={file.webViewLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center space-x-3 flex-1 min-w-0"
                >
                  <File className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {new Date(file.modifiedTime).toLocaleDateString()}
                    </p>
                  </div>
                </a>
                <button
                  onClick={() => handleDelete(file.id, file.name)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all ml-2"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
