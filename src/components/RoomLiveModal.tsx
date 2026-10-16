import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Hand,
  PhoneOff,
  Users,
  Clock,
  Send,
  Sparkles,
  ShieldAlert,
  Radio,
  Settings,
  X,
  Sliders,
  AlertTriangle,
  Lock,
  Trash2,
  Edit2,
  Check,
  Minimize2,
  Maximize2
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
    sendRoomMessage,
    closeRoom
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  const [chatInput, setChatInput] = useState('');
  
  // Real microphone audio level & permission state
  const [micAudioLevel, setMicAudioLevel] = useState(0);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [micGranted, setMicGranted] = useState(false);

  // Host editing topic state
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(room.topic);

  const [isMinimized, setIsMinimized] = useState(false);
  // Individual participant volumes (userId -> volume 0 to 100)
  const [volumes, setVolumes] = useState<Record<string, number>>({});

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const isHost = currentUser.id === room.hostId;

  // Real Microphone Capture via getUserMedia and Web Audio API
  useEffect(() => {
    let active = true;

    const initAudio = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        mediaStreamRef.current = stream;
        setMicGranted(true);
        setMicPermissionDenied(false);

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const checkLevel = () => {
            if (!active) return;
            if (!isMuted && analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              // Map to 0 - 100
              const level = Math.min(100, Math.round((avg / 128) * 100));
              setMicAudioLevel(level);
            } else {
              setMicAudioLevel(0);
            }
            animFrameRef.current = requestAnimationFrame(checkLevel);
          };
          checkLevel();
        }
      } catch (err) {
        console.warn('Microphone permission not granted or device unavailable:', err);
        if (active) {
          setMicPermissionDenied(true);
        }
      }
    };

    initAudio();

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isMuted]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    await sendRoomMessage(chatInput.trim());
    setChatInput('');
  };

  const handleCloseRoom = async () => {
    if (window.confirm('Are you sure you want to end and close this speaking room for all participants?')) {
      await closeRoom(room.id);
      onClose();
    }
  };

  const handleSaveTopic = () => {
    setIsEditingTopic(false);
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
          countryCode: currentUser.countryCode || 'US',
          level: currentUser.englishLevel,
          role: isHost ? 'host' : 'speaker',
          isMuted: isMuted,
          isDeafened: isDeafened,
          isSpeaking: micAudioLevel > 15 || (isSpeaking && !isMuted),
          raisedHand: hasRaisedHand,
          joinedAt: new Date().toISOString()
        }
      ];

  const speakers = allParticipants.filter((p: RoomParticipant) => p.role === 'host' || p.role === 'moderator' || p.role === 'speaker');

  if (isMinimized) {
    return (
      <aside aria-label="Active voice room mini player" className="fixed bottom-5 right-5 z-50 bg-[#111827]/95 border border-[#635BFF]/50 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex items-center gap-3 text-slate-100 animate-in fade-in slide-in-from-bottom-3 duration-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#635BFF]/20 border border-[#635BFF]/40 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 text-[#22D3EE] animate-pulse" />
          </div>
          <div className="max-w-[170px] truncate">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <p className="text-xs font-bold text-white truncate">{room.title}</p>
            </div>
            <p className="text-[10px] text-slate-400">{speakers.length} on stage</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={() => setIsMinimized(false)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#635BFF] hover:bg-[#5249f0] text-white flex items-center gap-1 transition-all shadow-sm"
            title="Expand to Full Stage"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Stage</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/20"
            title="Leave Room"
            aria-label="Leave room"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1020]/95 backdrop-blur-md flex flex-col overflow-hidden text-slate-100">
      
      {/* 1. ROOM HEADER */}
      <header className="h-16 px-4 sm:px-6 border-b border-slate-800 bg-[#111827]/90 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 truncate">
          <div className="w-10 h-10 rounded-2xl bg-[#635BFF]/20 border border-[#635BFF]/40 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 text-[#22D3EE] animate-pulse" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                Live Voice Room
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {room.language || 'English'} • {room.level}
              </span>
              {room.isPrivate && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Private</span>
                </span>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-white truncate mt-0.5">
              {room.title}
            </h2>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Host Close Room Button */}
          {isHost && (
            <button
              onClick={handleCloseRoom}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-red-300 bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Close Room (Host)</span>
            </button>
          )}

          {/* Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            title="Minimize to background bar"
            aria-label="Minimize stage"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          {/* Leave Room Button */}
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <PhoneOff className="w-3.5 h-3.5 text-red-400" />
            <span>Leave</span>
          </button>
        </div>
      </header>

      {/* Mic Permission Banner if Denied */}
      {micPermissionDenied && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Microphone access was denied. You can listen to other participants, or allow microphone permissions in browser settings to speak.</span>
          </div>
        </div>
      )}

      {/* 2. MAIN WORKSPACE (STAGE + RIGHT PANEL) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* STAGE & SPEAKERS VIEW */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            
            {/* Active Topic Banner with Host Edit */}
            <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 shadow-md mb-6">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-bold text-[#22D3EE] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Conversation Topic:
                </span>
                {isHost && (
                  <button
                    onClick={() => setIsEditingTopic(!isEditingTopic)}
                    className="text-[11px] font-bold text-[#635BFF] hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{isEditingTopic ? 'Cancel' : 'Edit Topic'}</span>
                  </button>
                )}
              </div>

              {isEditingTopic ? (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={currentTopic}
                    onChange={(e) => setCurrentTopic(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#0B1020] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  />
                  <button
                    onClick={handleSaveTopic}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  "{currentTopic}"
                </p>
              )}

              {room.rules && (
                <p className="text-xs text-slate-400 mt-2 p-2 rounded-xl bg-[#0B1020] border border-slate-800">
                  📋 Room Rules: {room.rules}
                </p>
              )}
            </div>

            {/* Stage Speakers Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Participants on Stage ({speakers.length}/{room.capacity})</span>
                </h3>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Real-Time Audio Channel
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {speakers.map((participant) => {
                  const isCurrent = participant.userId === currentUser.id;
                  const activeSpeaking = isCurrent 
                    ? (!isMuted && (micAudioLevel > 15 || isSpeaking))
                    : participant.isSpeaking;

                  const userVol = volumes[participant.userId] !== undefined ? volumes[participant.userId] : 100;

                  return (
                    <div
                      key={participant.userId}
                      className={`relative rounded-3xl p-4 flex flex-col items-center text-center transition-all ${
                        activeSpeaking
                          ? 'bg-[#635BFF]/20 border-2 border-[#22D3EE] shadow-lg shadow-[#635BFF]/30'
                          : 'bg-[#111827] border border-slate-800'
                      }`}
                    >
                      {/* Avatar with live speaking pulse ring */}
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

                      {/* Live Web Audio Meter Bars */}
                      {activeSpeaking && (
                        <div className="flex items-center gap-1 mt-2 h-3">
                          <span className="w-1 bg-[#22D3EE] rounded-full animate-bounce h-2" />
                          <span className="w-1 bg-[#22D3EE] rounded-full animate-bounce h-3 delay-75" />
                          <span className="w-1 bg-[#22D3EE] rounded-full animate-bounce h-2 delay-150" />
                        </div>
                      )}

                      {/* Individual Participant Volume Slider */}
                      {!isCurrent && (
                        <div className="mt-3 w-full pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Volume2 className="w-3 h-3 text-slate-500" />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={userVol}
                            onChange={(e) => setVolumes(prev => ({ ...prev, [participant.userId]: parseInt(e.target.value) }))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#635BFF]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* BOTTOM AUDIO TOOLBAR */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mute Toggle */}
              <button
                onClick={toggleMute}
                className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
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
                className={`p-2.5 rounded-2xl text-xs sm:text-sm border transition-colors ${
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
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border flex items-center gap-1.5 transition-colors ${
                  hasRaisedHand
                    ? 'bg-amber-500 text-slate-900 border-amber-400 font-bold'
                    : 'bg-[#111827] text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                <Hand className="w-4 h-4" />
                <span>{hasRaisedHand ? 'Hand Raised' : 'Raise Hand'}</span>
              </button>
            </div>

            {/* Real Hardware Microphone Meter */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Live Mic Level:</span>
              <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-[#22D3EE] h-full transition-all duration-100"
                  style={{ width: `${isMuted ? 0 : micAudioLevel}%` }}
                />
              </div>
              <span className="font-mono text-[11px]">{isMuted ? 'Muted' : `${micAudioLevel}%`}</span>
            </div>

          </div>
        </div>

        {/* 3. RIGHT PANEL: IN-ROOM TEXT CHAT & MEMBERS */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0E1528] flex flex-col h-72 lg:h-auto shrink-0">
          
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
              Participants ({speakers.length})
            </button>
          </div>

          {/* Chat Feed */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {roomMessages.map((msg) => (
                  <div key={msg.id} className="text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="font-bold text-slate-200">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5 leading-relaxed bg-[#111827] p-2.5 rounded-xl border border-slate-800/80">
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
                  className="flex-1 px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#635BFF]"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-[#635BFF] text-white hover:bg-[#5249e0] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Participants list */}
          {activeTab === 'participants' && (
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {speakers.map((p) => (
                <div
                  key={p.userId}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-[#111827] border border-slate-800/80"
                >
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={p.avatar}
                      alt={p.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{p.displayName}</p>
                      <p className="text-[10px] text-slate-400">{p.level}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
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
