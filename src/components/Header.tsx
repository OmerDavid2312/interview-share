import React, { useState } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenShareModal }) => {
  const { user } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await signOut(getAuth());
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <span className="text-emerald-400 text-xl leading-none">?</span>
          </div>
          <div>
            <h1 className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight leading-tight">
              שאלות ראיון
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              מאגר שאלות אמיתיות מראיונות עבודה בהייטק
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
            {user?.displayName && <span>{user.displayName}</span>}
          </div>
          <button
            id="btn-header-share"
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>שתפו שאלה</span>
          </button>
          <button
            onClick={handleLogout}
            disabled={isSigningOut}
            title="התנתק"
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors disabled:opacity-60"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
