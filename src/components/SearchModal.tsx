import React, { useState } from 'react';
import {
  Search,
  Mic,
  Users,
  Compass,
  Gamepad2,
  Award,
  X,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_USERS } from '../services/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (route: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, navigate }) => {
  const { speakingRooms, communities } = useApp();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingRooms = q ? speakingRooms.filter(r => r.title.toLowerCase().includes(q) || r.topic.toLowerCase().includes(q)) : [];
  const matchingCommunities = q ? communities.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) : [];
  const matchingUsers = q ? INITIAL_USERS.filter(u => u.displayName.toLowerCase().includes(q) || u.country.toLowerCase().includes(q)) : [];

  const handleSelect = (route: string) => {
    navigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-[#111827] border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Search input bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search speaking rooms, servers, learners, or topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Type to search rooms, international communities, or friends...
            </div>
          ) : matchingRooms.length === 0 && matchingCommunities.length === 0 && matchingUsers.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Rooms */}
              {matchingRooms.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Live Speaking Rooms</p>
                  <div className="space-y-1">
                    {matchingRooms.map(r => (
                      <button
                        key={r.id}
                        onClick={() => handleSelect('rooms')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between text-xs text-slate-200"
                      >
                        <span className="font-bold text-white truncate">{r.title}</span>
                        <span className="text-[10px] text-[#22D3EE] font-semibold">{r.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Communities */}
              {matchingCommunities.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Community Guilds</p>
                  <div className="space-y-1">
                    {matchingCommunities.map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleSelect('communities')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between text-xs text-slate-200"
                      >
                        <span className="font-bold text-white truncate">{c.name}</span>
                        <span className="text-[10px] text-slate-400">{c.memberCount} members</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {matchingUsers.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">International Learners</p>
                  <div className="space-y-1">
                    {matchingUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => handleSelect('discover')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between text-xs text-slate-200"
                      >
                        <span className="font-bold text-white truncate">{u.displayName} ({u.country})</span>
                        <span className="text-[10px] text-purple-400 font-bold">{u.englishLevel}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
