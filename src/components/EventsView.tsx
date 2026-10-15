import React from 'react';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Share2,
  Mic,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EventsView: React.FC = () => {
  const { events, toggleEventRsvp } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#22D3EE] uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>International Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Speaking Events & Clubs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Join moderated speaking clubs, weekend debate tournaments, and cultural language exchanges.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="p-6 rounded-3xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[10px] px-2.5 py-0.5 rounded-full bg-[#635BFF]/20 text-[#22D3EE] border border-[#635BFF]/30">
                  {ev.category}
                </span>
                <span className="text-slate-400 font-medium">
                  {ev.level}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-4 group-hover:text-[#22D3EE] transition-colors leading-snug">
                {ev.title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {ev.description}
              </p>

              <div className="mt-4 p-3 rounded-xl bg-[#0B1020] border border-slate-800 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>{ev.startTime} ({ev.durationMinutes} mins)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>{ev.attendeesCount} learners attending</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Host: {ev.hostName}</span>
              <button
                onClick={() => toggleEventRsvp(ev.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  ev.isAttending
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#635BFF] text-white hover:bg-[#5249e0] shadow-md shadow-[#635BFF]/25'
                }`}
              >
                {ev.isAttending ? '✓ RSVP Confirmed' : 'RSVP to Attend'}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
