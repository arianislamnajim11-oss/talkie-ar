import React, { useState, useEffect } from 'react';
import {
  Mic,
  Volume2,
  Shield,
  Bell,
  Sliders,
  Check,
  Moon,
  Sun,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    updatePresence
  } = useApp();

  const [micTesting, setMicTesting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [readReceipts, setReadReceipts] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Audio level simulation when testing mic
  useEffect(() => {
    let interval: any = null;
    if (micTesting) {
      interval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 80) + 15);
      }, 150);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [micTesting]);

  const handleSavePreferences = () => {
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your audio devices, privacy visibility, notifications, and interface themes.
        </p>
      </div>

      {successToast && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Your settings have been saved successfully!</span>
        </div>
      )}

      {/* 1. AUDIO & MICROPHONE HARDWARE TEST */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#22D3EE] uppercase tracking-wider">
          <Mic className="w-4 h-4" />
          <span>Audio & Voice Diagnostics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Microphone Input</label>
            <select className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white">
              <option>Default - Built-in Microphone (System)</option>
              <option>External USB Headset Mic</option>
              <option>Studio Condenser Mic</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Speaker Output</label>
            <select className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white">
              <option>Default - Built-in Speakers (System)</option>
              <option>Headphones / Earphones</option>
            </select>
          </div>
        </div>

        {/* Live Audio Level Meter */}
        <div className="p-4 rounded-2xl bg-[#0B1020] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Live Input Level Meter</span>
            <span className="font-mono text-emerald-400 font-bold">{micTesting ? `${audioLevel}%` : 'Inactive'}</span>
          </div>

          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-emerald-500 via-[#22D3EE] to-[#635BFF] h-full rounded-full transition-all duration-150"
              style={{ width: `${audioLevel}%` }}
            />
          </div>

          <button
            onClick={() => setMicTesting(!micTesting)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              micTesting
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-[#635BFF] text-white hover:bg-[#5249e0]'
            }`}
          >
            {micTesting ? 'Stop Mic Diagnostic' : 'Test Microphone & Noise Floor'}
          </button>
        </div>
      </div>

      {/* 2. PRIVACY & SOCIAL PRESENCE */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Privacy & Online Presence</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0B1020] border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Read Receipts</p>
              <p className="text-[10px] text-slate-400">Let conversation partners know when you have read their direct messages</p>
            </div>
            <input
              type="checkbox"
              checked={readReceipts}
              onChange={(e) => setReadReceipts(e.target.checked)}
              className="rounded bg-slate-800 text-[#635BFF]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0B1020] border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Invisible Presence Mode</p>
              <p className="text-[10px] text-slate-400">Browse rooms without appearing online in the international directory</p>
            </div>
            <button
              onClick={() => updatePresence(currentUser.presence === 'invisible' ? 'online' : 'invisible')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                currentUser.presence === 'invisible'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {currentUser.presence === 'invisible' ? 'Invisible Active' : 'Off'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. APPEARANCE & THEME */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#A855F7] uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>Design Tokens & Theme</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">Accent Color Palette</label>
          <div className="flex items-center gap-3">
            {[
              { id: 'indigo', name: 'Electric Indigo (#635BFF)', color: '#635BFF' },
              { id: 'cyan', name: 'Cyan Glow (#22D3EE)', color: '#22D3EE' },
              { id: 'violet', name: 'Royal Violet (#A855F7)', color: '#A855F7' }
            ].map((acc) => (
              <button
                key={acc.id}
                onClick={() => setAccentColor(acc.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  accentColor === acc.id
                    ? 'border-white bg-slate-800 text-white shadow-md'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: acc.color }} />
                <span>{acc.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSavePreferences}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE] hover:opacity-95 shadow-md shadow-[#635BFF]/30"
        >
          Save All Preferences
        </button>
      </div>

    </div>
  );
};
