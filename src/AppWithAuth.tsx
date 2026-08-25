import React from 'react';
import { useAuth } from './context/AuthContext';
import App from './App';
import { LoginPage } from './pages/LoginPage';

export function AppWithAuth() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-200 animate-pulse mx-auto mb-4"></div>
          <p className="text-slate-600">טוען...</p>
        </div>
      </div>
    );
  }

  return user ? <App /> : <LoginPage />;
}
