import React, { useState } from 'react';
import {
  Mic,
  Plus,
  Search,
  Users,
  Lock,
  Globe2,
  Sparkles,
  Shield,
  Volume2,
  AlertCircle,
  X,
  Radio,
  Clock,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpeakingRoom, EnglishLevel } from '../types/index';
import { filterSpeakingRooms } from '../utils/rules';

interface RoomsViewProps {
  onJoinRoom: (room: SpeakingRoom, password?: string) => void;
}

export const RoomsView: React.FC<RoomsViewProps> = ({ onJoinRoom }) => {
  const { speakingRooms, createSpeakingRoom, currentUser, setIsAuthModalOpen } = useApp();

  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Private room password prompt modal
  const [passwordModalRoom, setPasswordModalRoom] = useState<SpeakingRoom | null>(null);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Create Room form state
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLanguage, setNewLanguage] = useState('English');
  const [newLevel, setNewLevel] = useState<EnglishLevel | 'All Levels'>('All Levels');
  const [newCapacity, setNewCapacity] = useState(6);
  const [newIsPrivate, setNewIsPrivate] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newRules, setNewRules] = useState('');
  const [newIsBeginner, setNewIsBeginner] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const languages = ['All', 'English', 'Spanish', 'Japanese', 'French', 'German', 'Arabic', 'Bengali'];
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Upper-Intermediate', 'Advanced'];

  const filteredRooms = filterSpeakingRooms(speakingRooms, {
    search,
    level: selectedLevel,
    beginnerOnly,
  }).filter(r => {
    if (selectedLanguage !== 'All') {
      return (r.language || 'English').toLowerCase() === selectedLanguage.toLowerCase();
    }
    return true;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    const res = await createSpeakingRoom({
      title: newTitle.trim(),
      topic: newTopic.trim() || 'Casual open conversation',
      description: newDescription.trim() || 'Join in to talk and practice together!',
      language: newLanguage,
      level: newLevel,
      capacity: newCapacity,
      isPrivate: newIsPrivate,
      password: newIsPrivate ? newPassword.trim() : undefined,
      rules: newRules.trim() || undefined,
      isBeginnerFriendly: newIsBeginner,
      tags: [newLanguage, newLevel, newIsPrivate ? 'Private' : 'Public']
    });

    setIsSubmitting(false);
    if (res.success && res.room) {
      setShowCreateModal(false);
      // Reset form
      setNewTitle('');
      setNewTopic('');
      setNewDescription('');
      setNewPassword('');
    } else {
      alert(res.error || 'Failed to create room.');
    }
  };

  const handleJoinClick = (room: SpeakingRoom) => {
    if (room.isPrivate && room.password) {
      setPasswordModalRoom(room);
      setEnteredPassword('');
      setPasswordError(null);
    } else {
      onJoinRoom(room);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalRoom) return;

    if (passwordModalRoom.password !== enteredPassword.trim()) {
      setPasswordError('Incorrect room password. Please try again.');
      return;
    }

    const targetRoom = passwordModalRoom;
    setPasswordModalRoom(null);
    onJoinRoom(targetRoom, enteredPassword.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* 1. TOP HERO BAR (Free4Talk Inspired with Modern Talkie AR Styling) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#161F37] via-[#111827] to-[#0E1528] border border-slate-800 shadow-xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#635BFF]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#635BFF]/20 border border-[#635BFF]/40 text-[#22D3EE] text-xs font-bold mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#22D3EE]" />
            <span>Open Global Speaking Platform • 100% Free For Everyone</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live Speaking Room Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            Jump into any active room with one click, or create your own room for free. Talk to learners and native speakers from around the world.
          </p>
        </div>

        {/* PRIMARY "CREATE ROOM" BUTTON */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3.5 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-[#635BFF] via-[#7C3AED] to-[#22D3EE] hover:opacity-95 shadow-xl shadow-[#635BFF]/30 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5 text-white stroke-[3]" />
            <span>Create Speaking Room</span>
          </button>
        </div>

      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by room title, topic, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#111827] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#635BFF]"
            />
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-[#111827] border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-[#635BFF]"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>

          {/* Beginner Friendly Toggle */}
          <button
            onClick={() => setBeginnerOnly(!beginnerOnly)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all flex items-center gap-1.5 whitespace-nowrap ${
              beginnerOnly
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                : 'bg-[#111827] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <span>🌱</span>
            <span>Beginner Friendly</span>
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">Language:</span>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedLanguage === lang
                  ? 'bg-[#635BFF] text-white shadow'
                  : 'bg-[#111827] text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* 3. LIVE SPEAKING ROOMS DIRECTORY GRID */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span className="font-medium">
            Showing <strong className="text-white">{filteredRooms.length}</strong> active rooms in global directory
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Voice Nodes Operational</span>
          </span>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-[#111827] rounded-3xl border border-slate-800 p-8 space-y-4">
            <Mic className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No active rooms found matching your filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Be the first to open a room! Anyone can create a speaking room for free in seconds.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE]"
            >
              Create Free Room Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRooms.map((room) => {
              const currentCount = room.participants.length;
              const isFull = currentCount >= room.capacity;
              const hasSpeaking = room.participants.some(p => p.isSpeaking);

              return (
                <div
                  key={room.id}
                  className="bg-[#111827] rounded-3xl p-5 border border-slate-800 hover:border-slate-700 hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#635BFF]/20 text-[#22D3EE] border border-[#635BFF]/30">
                          {room.language || 'English'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                          {room.level}
                        </span>
                        {room.isPrivate && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Private</span>
                          </span>
                        )}
                        {room.isBeginnerFriendly && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            🌱 Beginner
                          </span>
                        )}
                      </div>

                      {/* Participant Capacity Pill */}
                      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                        isFull ? 'bg-red-500/20 text-red-400' : 'bg-slate-800/80 text-slate-300'
                      }`}>
                        <Users className="w-3.5 h-3.5 text-[#22D3EE]" />
                        <span>{currentCount}/{room.capacity}</span>
                      </div>
                    </div>

                    {/* Room Title */}
                    <h3 className="text-base font-extrabold text-white mt-3 group-hover:text-[#22D3EE] transition-colors leading-snug">
                      {room.title}
                    </h3>

                    {/* Topic Box */}
                    <div className="mt-3 p-3 rounded-2xl bg-[#0B1020] border border-slate-800/80">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                        Current Topic:
                      </p>
                      <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-medium">
                        "{room.topic}"
                      </p>
                    </div>

                    {/* Participant Avatars */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center -space-x-2">
                        {room.participants.slice(0, 5).map((p) => (
                          <img
                            key={p.userId}
                            src={p.avatar}
                            alt={p.displayName}
                            title={`${p.displayName} (${p.level})`}
                            className={`w-8 h-8 rounded-full object-cover ring-2 ${
                              p.isSpeaking ? 'ring-emerald-400 animate-pulse' : 'ring-[#111827]'
                            }`}
                          />
                        ))}
                        {room.participants.length > 5 && (
                          <div className="w-8 h-8 rounded-full bg-slate-800 ring-2 ring-[#111827] flex items-center justify-center text-[10px] font-bold text-slate-300">
                            +{room.participants.length - 5}
                          </div>
                        )}
                      </div>

                      {hasSpeaking && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>Speaking...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Room Card Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={room.hostAvatar}
                        alt={room.hostName}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <span className="text-xs text-slate-400 truncate">
                        Host: <strong className="text-slate-300">{room.hostName.split(' ')[0]}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleJoinClick(room)}
                      disabled={isFull}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        isFull
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'text-white bg-gradient-to-r from-[#635BFF] to-[#7C3AED] hover:opacity-95 shadow-md shadow-[#635BFF]/25'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{isFull ? 'Room Full' : 'Join Room'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. FREE ROOM CREATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#635BFF] to-[#22D3EE] flex items-center justify-center text-white">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">Create a Speaking Room</h3>
                  <p className="text-[11px] text-[#22D3EE] font-semibold">100% Free • Open to all registered learners</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Room Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ☕ Casual English & Travel Chat (Everyone Welcome)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1020] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Conversation Topic *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Favorite foods, hobbies, culture shock, or daily life"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1020] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Language
                  </label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Japanese">Japanese</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Bengali">Bengali</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Suggested Level
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  >
                    {levels.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Max Capacity
                  </label>
                  <select
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  >
                    <option value={2}>2 (1-on-1 Practice)</option>
                    <option value={4}>4 participants</option>
                    <option value={6}>6 participants (Recommended)</option>
                    <option value={8}>8 participants</option>
                    <option value={12}>12 participants</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Visibility
                  </label>
                  <select
                    value={newIsPrivate ? 'private' : 'public'}
                    onChange={(e) => setNewIsPrivate(e.target.value === 'private')}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  >
                    <option value="public">Public (In Directory)</option>
                    <option value="private">Private (Password Protected)</option>
                  </select>
                </div>
              </div>

              {/* Password field if private */}
              {newIsPrivate && (
                <div className="p-3 rounded-2xl bg-[#0B1020] border border-amber-500/30">
                  <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    Room Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password for room entry..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="beginnerBox"
                  checked={newIsBeginner}
                  onChange={(e) => setNewIsBeginner(e.target.checked)}
                  className="rounded border-slate-700 bg-[#0B1020] text-[#635BFF]"
                />
                <label htmlFor="beginnerBox" className="text-xs text-slate-300 font-medium">
                  Mark as Beginner Friendly (Patient pacing, zero judgment)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[#635BFF] via-[#7C3AED] to-[#22D3EE] hover:opacity-95 shadow-lg shadow-[#635BFF]/30 transition-all"
                >
                  {isSubmitting ? 'Creating Room...' : 'Create & Start Speaking Free'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 5. PRIVATE ROOM PASSWORD PROMPT MODAL */}
      {passwordModalRoom && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-white">Private Speaking Room</h3>
            <p className="text-xs text-slate-400 mt-1">
              "{passwordModalRoom.title}" requires a password to join.
            </p>

            {passwordError && (
              <div className="mt-3 p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter room password..."
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white text-center focus:outline-none focus:border-[#635BFF]"
              />

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalRoom(null)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5249e0]"
                >
                  Enter Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
