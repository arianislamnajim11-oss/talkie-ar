import React, { useState } from 'react';
import {
  X,
  UserCheck,
  UserPlus,
  LogIn,
  Globe2,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EnglishLevel } from '../types/index';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    allUsers,
    switchUser,
    registerUser,
    loginUser,
    currentUser
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Registration form state
  const [regUsername, setRegUsername] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCountry, setRegCountry] = useState('United States');
  const [regLevel, setRegLevel] = useState<EnglishLevel>('Intermediate');

  // Login form state
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await registerUser({
      username: regUsername.trim(),
      displayName: regDisplayName.trim() || regUsername.trim(),
      email: regEmail.trim(),
      password: regPassword,
      country: regCountry,
      englishLevel: regLevel
    });

    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await loginUser(loginInput.trim());
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#635BFF] to-[#22D3EE] flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {mode === 'login' ? 'Sign in to Talkie AR' : 'Create Free Account'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Open global speaking platform • No invitations required
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-xl bg-[#0B1020] p-1 mt-4 border border-slate-800">
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
              mode === 'login' ? 'bg-[#635BFF] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
              mode === 'register' ? 'bg-[#635BFF] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Free
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Demo Switcher (Helps testing multiple users in room) */}
        <div className="mt-4 p-3 rounded-2xl bg-[#0E1528] border border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            One-Click Account Switcher (For Multi-User Voice Testing):
          </p>
          <div className="flex flex-wrap gap-2">
            {allUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  switchUser(u);
                  setIsAuthModalOpen(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  currentUser.id === u.id
                    ? 'bg-[#635BFF]/30 border-[#22D3EE] text-white font-bold'
                    : 'bg-[#111827] border-slate-700/60 text-slate-300 hover:text-white'
                }`}
              >
                <img src={u.avatar} alt={u.displayName} className="w-4 h-4 rounded-full object-cover" />
                <span>{u.displayName.split(' ')[0]}</span>
                <span className="text-[9px] text-[#22D3EE] font-mono">({u.countryCode})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 1. SIGN IN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Username or Email
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. arian_global or arian@talkiear.com"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0B1020] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#635BFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0B1020] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#635BFF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE] hover:opacity-95 shadow-md shadow-[#635BFF]/30 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>
        ) : (
          /* 2. REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. alex_tokyo"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Display Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Tanaka"
                  value={regDisplayName}
                  onChange={(e) => setRegDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. alex@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Country</label>
                <input
                  type="text"
                  placeholder="e.g. Brazil, Germany, Japan"
                  value={regCountry}
                  onChange={(e) => setRegCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">English Level</label>
                <select
                  value={regLevel}
                  onChange={(e) => setRegLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Elementary">Elementary</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Upper-Intermediate">Upper-Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Proficient">Proficient</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE] hover:opacity-95 shadow-md shadow-[#635BFF]/30 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Creating Account...' : 'Create Free Account & Start Speaking'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
