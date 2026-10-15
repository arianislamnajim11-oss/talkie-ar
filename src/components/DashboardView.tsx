import React from 'react';
import {
  Mic,
  Flame,
  Award,
  BookOpen,
  Users,
  Gamepad2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Volume2,
  Clock,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_USERS } from '../services/mockData';

interface DashboardViewProps {
  navigate: (route: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ navigate }) => {
  const { currentUser, speakingRooms, joinRoom, events } = useApp();

  const dailyGoalMinutes = 45;
  const currentDailyMinutes = 28;
  const goalPercentage = Math.min(100, Math.round((currentDailyMinutes / dailyGoalMinutes) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. WELCOME HERO & STATS BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#161F37] via-[#111827] to-[#0E1528] border border-slate-800 p-6 sm:p-8 shadow-xl overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#635BFF]/15 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#22D3EE] uppercase tracking-wider">
              <span>{currentUser.country} {currentUser.countryCode === 'BD' ? '🇧🇩' : '🌍'}</span>
              <span>•</span>
              <span>{currentUser.englishLevel} ({currentUser.cefrLevel || 'B2'})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Welcome back, {currentUser.displayName}! 🎙️
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              You are on a <strong className="text-amber-400">{currentUser.streakDays}-day speaking streak</strong>. Ready for a quick conversation today?
            </p>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('rooms')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE] hover:opacity-95 shadow-lg shadow-[#635BFF]/25 transition-all flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Join Live Room</span>
            </button>
            <button
              onClick={() => navigate('ai-coach')}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              <span>Practice with AI Coach</span>
            </button>
          </div>
        </div>

        {/* Daily Goal & Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Today's Speaking Goal</span>
              <span className="font-bold text-white">{currentDailyMinutes} / {dailyGoalMinutes} min</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#635BFF] to-[#22D3EE] h-full transition-all duration-300"
                style={{ width: `${goalPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              🔥
            </div>
            <div>
              <p className="text-xs font-bold text-white">{currentUser.streakDays} Days Active</p>
              <p className="text-[10px] text-slate-400">Keep up the daily momentum</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/20 text-[#22D3EE] flex items-center justify-center font-bold text-lg">
              ⏱️
            </div>
            <div>
              <p className="text-xs font-bold text-white">{currentUser.totalPracticeMinutes} Total Mins</p>
              <p className="text-[10px] text-slate-400">Verified speaking time</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ACTIVE LIVE ROOMS */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="font-extrabold text-lg text-white">Live Rooms Happening Now</h2>
            </div>
            <button
              onClick={() => navigate('rooms')}
              className="text-xs font-bold text-[#22D3EE] hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {speakingRooms.slice(0, 4).map((room) => (
              <div
                key={room.id}
                className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {room.category}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Users className="w-3 h-3 text-[#22D3EE]" />
                      {room.participants.length}/{room.capacity}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-3 group-hover:text-[#22D3EE] transition-colors leading-snug">
                    {room.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {room.topic}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 truncate max-w-[120px]">
                    Host: {room.hostName.split(' ')[0]}
                  </span>
                  <button
                    onClick={() => {
                      joinRoom(room);
                      navigate('rooms');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5249e0] transition-colors"
                  >
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Learning & Games Banner */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl shrink-0">
                🎮
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Play Word Guessing & Taboo</h3>
                <p className="text-xs text-slate-400 mt-0.5">Test your quick thinking without using forbidden taboo words!</p>
              </div>
            </div>
            <button
              onClick={() => navigate('games')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors whitespace-nowrap"
            >
              Play with Friends
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: EVENTS & FRIENDS ONLINE */}
        <div className="space-y-6">
          
          {/* Upcoming Events */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#22D3EE]" />
                <span>Upcoming Speaking Events</span>
              </h3>
              <button
                onClick={() => navigate('events')}
                className="text-[11px] font-bold text-[#22D3EE] hover:underline"
              >
                All Events
              </button>
            </div>

            <div className="space-y-3">
              {events.slice(0, 2).map((ev) => (
                <div key={ev.id} className="p-3 rounded-xl bg-[#0B1020] border border-slate-800/80">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#635BFF]/20 text-[#22D3EE]">
                    {ev.category}
                  </span>
                  <p className="text-xs font-bold text-white mt-1 leading-snug">{ev.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{ev.startTime} • {ev.attendeesCount} Attending</p>
                </div>
              ))}
            </div>
          </div>

          {/* Online Friends Quick List */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Friends Online</span>
              </h3>
              <button
                onClick={() => navigate('friends')}
                className="text-[11px] font-bold text-[#22D3EE] hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2">
              {INITIAL_USERS.slice(1, 4).map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => navigate('inbox')}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="relative">
                      <img
                        src={friend.avatar}
                        alt={friend.displayName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#111827]" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{friend.displayName}</p>
                      <p className="text-[10px] text-slate-400">{friend.country}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Chat
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
