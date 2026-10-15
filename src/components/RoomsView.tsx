import React, { useState } from 'react';
import {
  Mic,
  Plus,
  Search,
  Filter,
  Users,
  Clock,
  Sparkles,
  Shield,
  Volume2,
  Tag,
  CheckCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpeakingRoom, EnglishLevel } from '../types/index';
import { filterSpeakingRooms } from '../utils/rules';

interface RoomsViewProps {
  onJoinRoom: (room: SpeakingRoom) => void;
}

export const RoomsView: React.FC<RoomsViewProps> = ({ onJoinRoom }) => {
  const { speakingRooms, createSpeakingRoom, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New room form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newCategory, setNewCategory] = useState('Everyday English');
  const [newLevel, setNewLevel] = useState<EnglishLevel | 'All Levels'>('All Levels');
  const [newMode, setNewMode] = useState<'free' | 'two-minute' | 'debate' | 'interview' | 'storytelling'>('free');
  const [newCapacity, setNewCapacity] = useState(6);
  const [newIsBeginner, setNewIsBeginner] = useState(true);

  const categories = [
    'All',
    'Everyday English',
    'IELTS Practice',
    'Debate',
    'Travel English',
    'Job Interview',
    'Technology',
    'Culture Exchange',
  ];

  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Upper-Intermediate', 'Advanced'];

  const filteredRooms = filterSpeakingRooms(speakingRooms, {
    search,
    category: selectedCategory,
    level: selectedLevel,
    beginnerOnly,
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = createSpeakingRoom({
      title: newTitle.trim(),
      description: newDescription.trim() || 'Join in to talk and practice together!',
      topic: newTopic.trim() || 'Open spoken conversation',
      category: newCategory,
      level: newLevel,
      speakingMode: newMode,
      capacity: newCapacity,
      isBeginnerFriendly: newIsBeginner,
      tags: [newCategory, newMode, newLevel],
    });

    setShowCreateModal(false);
    onJoinRoom(created);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#22D3EE] uppercase tracking-wider">
            <Mic className="w-4 h-4" />
            <span>Live International Audio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Speaking Rooms
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse active drop-in voice rooms. Listen in or take the mic to practice English in real time.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE] hover:opacity-95 shadow-lg shadow-[#635BFF]/20 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Speaking Room</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 space-y-4">
        
        {/* Search input & Quick toggles */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search rooms by title, topic, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#111827] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#635BFF]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#111827] border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-[#635BFF]"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>

            <button
              onClick={() => setBeginnerOnly(!beginnerOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                beginnerOnly
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-[#111827] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span>🌱</span>
              <span className="whitespace-nowrap">Beginner Friendly</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#635BFF] text-white shadow-sm'
                  : 'bg-[#111827] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span>Showing <strong className="text-white">{filteredRooms.length}</strong> active rooms</span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live audio servers operational
          </span>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-[#111827] rounded-2xl border border-slate-800">
            <Mic className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No rooms matched your criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms, removing filters, or create your own room right now!
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedLevel('All Levels');
                setBeginnerOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/30 hover:bg-[#22D3EE]/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRooms.map((room) => {
              const activeCount = room.participants.length;
              const hasSpeakingNow = room.participants.some(p => p.isSpeaking);

              return (
                <div
                  key={room.id}
                  className="bg-[#111827] rounded-2xl p-5 border border-slate-800 hover:border-slate-700 hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {room.category}
                        </span>
                        {room.speakingMode === 'two-minute' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            ⏱️ 2-Min Mode
                          </span>
                        )}
                        {room.isBeginnerFriendly && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            🌱 Beginner Friendly
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#22D3EE]" />
                        <span>{activeCount}/{room.capacity}</span>
                      </div>
                    </div>

                    {/* Room Title */}
                    <h3 className="text-base font-bold text-white mt-3 group-hover:text-[#22D3EE] transition-colors leading-snug">
                      {room.title}
                    </h3>

                    {/* Topic Box */}
                    <div className="mt-3 p-2.5 rounded-xl bg-[#0B1020]/90 border border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        Current Topic:
                      </p>
                      <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-medium">
                        {room.topic}
                      </p>
                    </div>

                    {/* Live Speaking Indicator & Participants */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center -space-x-2">
                        {room.participants.slice(0, 4).map((p) => (
                          <img
                            key={p.userId}
                            src={p.avatar}
                            alt={p.displayName}
                            title={`${p.displayName} (${p.level})`}
                            className={`w-7 h-7 rounded-full object-cover ring-2 ${
                              p.isSpeaking ? 'ring-emerald-400 animate-pulse' : 'ring-[#111827]'
                            }`}
                          />
                        ))}
                        {room.participants.length > 4 && (
                          <div className="w-7 h-7 rounded-full bg-slate-800 ring-2 ring-[#111827] flex items-center justify-center text-[10px] font-bold text-slate-300">
                            +{room.participants.length - 4}
                          </div>
                        )}
                      </div>

                      {hasSpeakingNow && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>Speaking...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Room Footer Action */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={room.hostAvatar}
                        alt={room.hostName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs text-slate-400 truncate max-w-[100px]">
                        Host: {room.hostName.split(' ')[0]}
                      </span>
                    </div>

                    <button
                      onClick={() => onJoinRoom(room)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#635BFF] to-[#7C3AED] hover:opacity-95 shadow-md shadow-[#635BFF]/25 transition-all flex items-center gap-1.5"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Join Room</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE ROOM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#22D3EE]" />
                <h3 className="font-extrabold text-lg text-white">Create a Speaking Room</h3>
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
                  placeholder="e.g. 🎯 IELTS Cue Card Masterclass & Friendly Feedback"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Conversation Topic *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is one piece of technology that changed your daily routine?"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Speaking Mode
                  </label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  >
                    <option value="free">Free Conversation</option>
                    <option value="two-minute">2-Minute Speaking Challenge</option>
                    <option value="debate">Debate Mode</option>
                    <option value="interview">Interview & Feedback</option>
                    <option value="storytelling">Storytelling Round</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Target Level
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

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Max Capacity
                  </label>
                  <select
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  >
                    <option value={4}>4 participants</option>
                    <option value={6}>6 participants</option>
                    <option value={8}>8 participants</option>
                    <option value={12}>12 participants</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="beginnerCheck"
                  checked={newIsBeginner}
                  onChange={(e) => setNewIsBeginner(e.target.checked)}
                  className="rounded border-slate-700 bg-[#0B1020] text-[#635BFF] focus:ring-0"
                />
                <label htmlFor="beginnerCheck" className="text-xs text-slate-300 font-medium">
                  Mark as Beginner Friendly (Patient pacing, encouraging tone)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE] hover:opacity-95 shadow-md shadow-[#635BFF]/30"
                >
                  Launch Room & Start Speaking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
