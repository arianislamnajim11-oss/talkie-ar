import React, { useState } from 'react';
import {
  Award,
  Globe2,
  Calendar,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  Edit3,
  Check,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileView: React.FC = () => {
  const { currentUser, setCurrentUser } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser.bio);
  const [statusInput, setStatusInput] = useState(currentUser.customStatus || '');

  const handleSave = () => {
    setCurrentUser(prev => ({
      ...prev,
      bio: bioInput.trim(),
      customStatus: statusInput.trim()
    }));
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="relative rounded-3xl bg-[#111827] border border-slate-800 overflow-hidden shadow-2xl">
        
        {/* Banner image background */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-[#635BFF]/30 via-[#22D3EE]/20 to-[#A855F7]/30 relative">
          <div className="absolute inset-0 bg-pattern opacity-10" />
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-[#111827] shadow-xl"
              />
              <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-[#111827]" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile details */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-white">{currentUser.displayName}</h1>
              <span className="text-xs text-slate-400">@{currentUser.username}</span>
              {currentUser.isPremium && (
                <span className="px-2 py-0.5 rounded-full bg-[#F5C451]/15 text-[#F5C451] border border-[#F5C451]/30 text-[10px] font-bold">
                  PRO MEMBER
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-[#635BFF]/20 text-[#22D3EE] border border-[#635BFF]/40 text-[10px] font-bold">
                {currentUser.englishLevel} (CEFR {currentUser.cefrLevel || 'B2'})
              </span>
            </div>

            {/* Status */}
            {isEditing ? (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Custom status message..."
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white"
                />
                <textarea
                  rows={2}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white"
                />
              </div>
            ) : (
              <>
                {currentUser.customStatus && (
                  <p className="text-xs text-[#22D3EE] font-medium mt-1">"{currentUser.customStatus}"</p>
                )}
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  {currentUser.bio}
                </p>
              </>
            )}

            {/* Meta tags */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-slate-400" />
                <span>{currentUser.country} (Native: {currentUser.nativeLanguage})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Member since {currentUser.joinedDate}</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Stats & Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl font-bold">
            🔥
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{currentUser.streakDays} Days</p>
            <p className="text-xs text-slate-400">Current Daily Streak</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#635BFF]/20 text-[#22D3EE] flex items-center justify-center text-2xl font-bold">
            🎙️
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{currentUser.totalPracticeMinutes} Mins</p>
            <p className="text-xs text-slate-400">Validated Speaking Time</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold">
            📜
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">CEFR {currentUser.cefrLevel || 'B2'}</p>
            <p className="text-xs text-slate-400">Assessed Proficiency</p>
          </div>
        </div>

      </div>

      {/* Achievements Showcase */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-slate-800 space-y-4">
        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-[#F5C451]" />
          <span>Earned Milestones & Badges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {currentUser.achievements.map((ach) => (
            <div key={ach.id} className="p-4 rounded-2xl bg-[#0B1020] border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-2xl">{ach.icon}</span>
                <p className="font-bold text-xs text-white mt-2">{ach.title}</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
              </div>
              <span className="mt-3 text-[10px] font-bold text-emerald-400">
                {ach.progress >= ach.maxProgress ? '✓ Unlocked' : `${ach.progress}/${ach.maxProgress}`}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
