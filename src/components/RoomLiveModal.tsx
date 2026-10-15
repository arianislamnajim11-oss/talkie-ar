import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Hand,
  PhoneOff,
  MessageSquare,
  Users,
  Clock,
  Send,
  Sparkles,
  ShieldAlert,
  Flame,
  ChevronRight,
  Radio,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpeakingRoom, RoomParticipant } from '../types/index';

interface RoomLiveModalProps {
  room: SpeakingRoom;
  onClose: () => void;
}

export const RoomLiveModal: React.FC<RoomLiveModalProps> = ({ room, onClose }) => {
  const {
    currentUser,
    isMuted,
    toggleMute,
    isDeafened,
    toggleDeafen,
    isSpeaking,
    hasRaisedHand,
    toggleRaiseHand,
    roomMessages,
    sendRoomMessage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'participants' | 'mode'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(room.speakingMode === 'two-minute' ? 120 : 0);
  const [isTimerRunning, setIsTimerRunning] = useState(room.speakingMode === 'two-minute');

  // Speaking timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendRoomMessage(chatInput.trim());
    setChatInput('');
  };

  // Merge current user into participant list if not already present
  const allParticipants: RoomParticipant[] = room.participants.some(p => p.userId === currentUser.id)
    ? room.participants
    : [
        ...room.participants,
        {
          userId: currentUser.id,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
          countryCode: currentUser.countryCode,
          level: currentUser.englishLevel,
          role: 'speaker',
          isMuted: isMuted,
          isDeafened: isDeafened,
          isSpeaking: isSpeaking && !isMuted,
          raisedHand: hasRaisedHand,
          joinedAt: new Date().toISOString()
        }
      ];

  const speakers = allParticipants.filter(p => p.role === 'host' || p.role === 'moderator' || p.role === 'speaker');
  const listeners = allParticipants.filter(p => p.role === 'listener');

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1020]/95 backdrop-blur-md flex flex-col overflow-hidden text-slate-100">
      
      {/* 1. ROOM HEADER */}
      <header className="h-16 px-4 sm:px-6 border-b border-slate-800 bg-[#111827]/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 truncate">
          <div className="w-10 h-10 rounded-xl bg-[#635BFF]/20 border border-[#635BFF]/40 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 text-[#22D3EE] animate-pulse" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                Live Room
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {room.category} • {room.level}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-white truncate mt-0.5">
              {room.title}
            </h2>
          </div>
        </div>

        {/* Center Timer when in 2-Min or Debate mode */}
        {room.speakingMode === 'two-minute' && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <Clock className="w-4 h-4 animate-spin text-amber-400" />
            <span>Speaker Time: {formatTimer(timerSeconds)}</span>
            <button
              onClick={() => {
                setTimerSeconds(120);
                setIsTimerRunning(true);
              }}
              className="text-[10px] text-amber-300 hover:underline uppercase ml-1"
            >
              Reset
            </button>
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-red-400 bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 transition-colors flex items-center gap-1.5"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Leave Room</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (STAGE + RIGHT PANEL) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* STAGE & SPEAKERS VIEW */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            
            {/* Active Topic Banner */}
            <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 shadow-md mb-6">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-bold text-[#22D3EE] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Active Speaking Prompt:
                </span>
                <span className="text-[11px] font-medium">Mode: {room.speakingMode}</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                "{room.topic}"
              </p>
              {room.activeTopicPrompt && (
                <p className="text-xs text-slate-300 mt-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60 leading-relaxed font-mono">
                  💡 Tip: {room.activeTopicPrompt}
                </p>
              )}
            </div>

            {/* Stage Speakers Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Speakers on Stage ({speakers.length})</span>
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Web Audio Active
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {speakers.map((participant) => {
                  const isCurrent = participant.userId === currentUser.id;
                  const activeSpeaking = isCurrent ? (isSpeaking && !isMuted) : participant.isSpeaking;

                  return (
                    <div
                      key={participant.userId}
                      className={`relative rounded-2xl p-4 flex flex-col items-center text-center transition-all ${
                        activeSpeaking
                          ? 'bg-[#635BFF]/20 border-2 border-[#22D3EE] shadow-lg shadow-[#635BFF]/30'
                          : 'bg-[#111827] border border-slate-800'
                      }`}
                    >
                      {/* Avatar with speaking wave ring */}
                      <div className="relative my-2">
                        <img
                          src={participant.avatar}
                          alt={participant.displayName}
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 transition-all ${
                            activeSpeaking
                              ? 'ring-[#22D3EE] scale-105 animate-pulse'
                              : 'ring-slate-700'
                          }`}
                        />
                        {/* Audio Status Pill */}
                        <div
                          className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow-md ${
                            (isCurrent && isMuted) || participant.isMuted
                              ? 'bg-red-500'
                              : 'bg-emerald-500'
                          }`}
                        >
                          {(isCurrent && isMuted) || participant.isMuted ? (
                            <MicOff className="w-3 h-3" />
                          ) : (
                            <Mic className="w-3 h-3" />
                          )}
                        </div>

                        {participant.raisedHand && (
                          <div className="absolute -top-1 -left-1 p-1 rounded-full bg-amber-500 text-slate-900 shadow-md animate-bounce">
                            <Hand className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div className="w-full truncate mt-1">
                        <p className="text-xs font-bold text-white truncate">
                          {participant.displayName}
                          {isCurrent && ' (You)'}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {participant.role.toUpperCase()} • {participant.level}
                        </p>
                      </div>

                      {/* Real-time sound wave bars when active speaking */}
                      {activeSpeaking && (
                        <div className="flex items-center gap-1 mt-2 h-3">
                          <span className="w-1 bg-[#22D3EE] rounded-full animate-bounce h-2" />
                          <span className="w-1 bg-[#22D3EE] rounded-full animate-bounce h-3 delay-75" />
                          <span className="w-1 bg-[#22D3EE] rounded-full animate-bounce h-2 delay-150" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Listeners Section */}
            {listeners.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Listeners ({listeners.length})
                </h3>
                <div className="flex flex-wrap gap-3">
                  {listeners.map((listener) => (
                    <div
                      key={listener.userId}
                      className="flex items-center gap-2 p-2 rounded-xl bg-[#111827] border border-slate-800"
                    >
                      <img
                        src={listener.avatar}
                        alt={listener.displayName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-xs text-slate-300 font-medium">
                        {listener.displayName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM AUDIO TOOLBAR */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mute Toggle */}
              <button
                onClick={toggleMute}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  isMuted
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                    : 'bg-[#635BFF] text-white hover:bg-[#5249e0] shadow-md shadow-[#635BFF]/25'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>

              {/* Deafen Toggle */}
              <button
                onClick={toggleDeafen}
                className={`p-2.5 rounded-xl text-xs sm:text-sm border transition-colors ${
                  isDeafened
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-[#111827] text-slate-300 border-slate-800 hover:text-white'
                }`}
                aria-label="Deafen audio"
              >
                {isDeafened ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Raise Hand Toggle */}
              <button
                onClick={toggleRaiseHand}
                className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-1.5 transition-colors ${
                  hasRaisedHand
                    ? 'bg-amber-500 text-slate-900 border-amber-400 font-bold'
                    : 'bg-[#111827] text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                <Hand className="w-4 h-4" />
                <span>{hasRaisedHand ? 'Hand Raised' : 'Raise Hand'}</span>
              </button>
            </div>

            {/* Quick helper tip */}
            <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
              <span className="font-semibold text-[#22D3EE]">Microphone Status:</span>
              <span>{isMuted ? 'Muted' : 'Live & Active'}</span>
            </div>
          </div>
        </div>

        {/* 3. RIGHT PANEL: IN-ROOM TEXT CHAT & RULES */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0E1528] flex flex-col h-72 lg:h-auto">
          
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-[#111827]">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-[#635BFF] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Room Chat
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                activeTab === 'participants'
                  ? 'border-[#635BFF] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Members ({allParticipants.length})
            </button>
          </div>

          {/* Tab 1: Chat Feed */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {roomMessages.map((msg) => (
                  <div key={msg.id} className="text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="font-bold text-slate-200">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5 leading-relaxed bg-[#111827] p-2 rounded-lg border border-slate-800/80">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-[#111827] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Send message to room..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#0B1020] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#635BFF]"
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-[#635BFF] text-white hover:bg-[#5249e0] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Participants list */}
          {activeTab === 'participants' && (
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {allParticipants.map((p) => (
                <div
                  key={p.userId}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#111827] border border-slate-800/80"
                >
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={p.avatar}
                      alt={p.displayName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{p.displayName}</p>
                      <p className="text-[10px] text-slate-400">{p.level}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                    {p.role}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
