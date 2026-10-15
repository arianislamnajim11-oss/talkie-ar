import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Mic,
  AlertTriangle,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminView: React.FC = () => {
  const { speakingRooms } = useApp();

  const [metrics, setMetrics] = useState<any>({
    activeUsersNow: 482,
    liveSpeakingRoomsCount: 34,
    totalSessionsToday: 1290,
    practiceMinutesToday: 24500,
    certificatesIssued: 412,
    reportsPending: 2
  });

  const [reports, setReports] = useState<any[]>([
    {
      id: 'rep_101',
      targetType: 'user',
      targetName: 'SuspiciousBot#992',
      reason: 'Repetitive spam links in room chat',
      reporterName: 'Fatima Al-Sayed',
      timestamp: '2026-10-14 20:15',
      status: 'pending'
    },
    {
      id: 'rep_102',
      targetType: 'room',
      targetName: 'Random Screaming Room',
      reason: 'Disruptive audio and unmoderated noise',
      reporterName: 'Carlos Mendez',
      timestamp: '2026-10-14 18:40',
      status: 'reviewed'
    }
  ]);

  const [auditLog, setAuditLog] = useState<string[]>([]);

  const handleModerate = async (reportId: string, action: string) => {
    try {
      await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action })
      });
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
      setAuditLog(prev => [`[${new Date().toLocaleTimeString()}] Action "${action}" applied to report ${reportId}`, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Audited Platform Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Admin & Safety Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry, live speaking room moderation, and incident report triage.
          </p>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          Server Health: 100% Operational
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Users Now</p>
          <p className="text-2xl font-extrabold text-white mt-1">{metrics.activeUsersNow}</p>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 12% vs last hour</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Voice Rooms</p>
          <p className="text-2xl font-extrabold text-[#22D3EE] mt-1">{speakingRooms.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Peer WebRTC active</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sessions Today</p>
          <p className="text-2xl font-extrabold text-white mt-1">{metrics.totalSessionsToday}</p>
          <p className="text-[10px] text-slate-400 mt-1">Average: 24 mins</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Speaking Minutes</p>
          <p className="text-2xl font-extrabold text-[#F5C451] mt-1">{metrics.practiceMinutesToday.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 mt-1">Verified audio time</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Certificates Issued</p>
          <p className="text-2xl font-extrabold text-purple-400 mt-1">{metrics.certificatesIssued}</p>
          <p className="text-[10px] text-slate-400 mt-1">CEFR diagnostic</p>
        </div>

      </div>

      {/* Reports Queue */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 space-y-4">
        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Safety & Abuse Reports Queue ({reports.filter(r => r.status === 'pending').length} Pending)</span>
        </h3>

        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-2xl bg-[#0B1020] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                    {rep.targetType}
                  </span>
                  <span className="font-bold text-sm text-white">{rep.targetName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${rep.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {rep.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">Reason: <strong className="text-slate-200">{rep.reason}</strong></p>
                <p className="text-[10px] text-slate-500 mt-0.5">Reported by {rep.reporterName} • {rep.timestamp}</p>
              </div>

              {rep.status === 'pending' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleModerate(rep.id, 'Warned User')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30"
                  >
                    Issue Warning
                  </button>
                  <button
                    onClick={() => handleModerate(rep.id, 'Muted in Room')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-300 bg-red-500/20 hover:bg-red-500/30"
                  >
                    Mute / Kick
                  </button>
                  <button
                    onClick={() => handleModerate(rep.id, 'Dismissed')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail */}
      {auditLog.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#0B1020] border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
          <p className="text-slate-300 font-bold uppercase tracking-wider mb-2">Real-Time Moderation Audit Trail:</p>
          {auditLog.map((log, i) => (
            <p key={i}>{log}</p>
          ))}
        </div>
      )}

    </div>
  );
};
