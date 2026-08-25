import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import app from '../firebase';
import { AlertCircle, LogIn } from 'lucide-react';

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-in failed';
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-4xl shadow-lg">
            <span className="text-emerald-400">?</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
            שאלות ראיון
          </h1>
          <p className="text-sm text-slate-600 text-center mb-8">
            מאגר שאלות מראיונות עבודה בהייטק
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            <LogIn className="w-5 h-5" />
            {isLoading ? 'כניסה...' : 'התחברות עם Google'}
          </button>

          <p className="text-xs text-slate-500 text-center mt-6">
            התחברות דרך Google כדי לגשת למאגר השאלות
          </p>
        </div>
      </div>
    </div>
  );
}
