import React, { useState } from 'react';
import {
  Compass,
  Search,
  Filter,
  Users,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Globe2,
  ArrowRight,
  Flame,
  Radio,
  Check
} from 'lucide-react';
import { INITIAL_USERS } from '../services/mockData';
import { User, EnglishLevel } from '../types/index';
import { useApp } from '../context/AppContext';

interface DiscoverViewProps {
  navigate: (route: string) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({ navigate }) => {
  const { currentUser, setActiveConversation, conversations } = useApp();

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [interestFilter, setInterestFilter] = useState('All');
  const [matchingModal, setMatchingModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);

  const partners = INITIAL_USERS.filter(u => u.id !== currentUser.id);

  const filteredPartners = partners.filter((user) => {
    if (search) {
      const q = search.toLowerCase();
      const match = user.displayName.toLowerCase().includes(q) ||
        user.country.toLowerCase().includes(q) ||
        user.bio.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (levelFilter !== 'All Levels') {
      if (user.englishLevel !== levelFilter) return false;
    }

    if (interestFilter !== 'All') {
      if (!user.interests.includes(interestFilter)) return false;
    }

    return true;
  });

  const handleQuickMatch = () => {
    setMatchingModal(true);
    setMatchedUser(null);

    // Simulate smart matching algorithm
    setTimeout(() => {
      const eligible = partners.filter(p => p.presence === 'online' || p.presence === 'busy');
      const chosen = eligible[Math.floor(Math.random() * eligible.length)] || partners[0];
      setMatchedUser(chosen);
    }, 1800);
  };

  const handleStartChat = (user: User) => {
    const existingConv = conversations.find(c => c.recipient.id === user.id);
    if (existingConv) {
      setActiveConversation(existingConv);
    }
    navigate('inbox');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#22D3EE] uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Smart Partner Recommendation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Find Conversation Partners
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover international practice buddies matched by English goals, interests, and availability.
          </p>
        </div>

        <button
          onClick={handleQuickMatch}
          className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE] hover:opacity-95 shadow-lg shadow-[#635BFF]/25 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[#22D3EE]" />
          <span>Quick Match Now</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partners by name, country, or interests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111827] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#635BFF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#111827] border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-[#635BFF]"
          >
            <option value="All Levels">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Upper-Intermediate">Upper-Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Proficient">Proficient</option>
          </select>

          <select
            value={interestFilter}
            onChange={(e) => setInterestFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#111827] border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-[#635BFF]"
          >
            <option value="All">All Topics</option>
            <option value="Technology">Technology</option>
            <option value="Travel">Travel</option>
            <option value="Design">Design</option>
            <option value="Medicine">Medicine</option>
            <option value="Literature">Literature</option>
            <option value="Music Production">Music</option>
          </select>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((user) => (
          <div
            key={user.id}
            className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-[#111827] ${
                        user.presence === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-[#22D3EE] transition-colors">
                      {user.displayName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {user.country} • Native: {user.nativeLanguage}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#635BFF]/20 text-[#22D3EE] border border-[#635BFF]/30">
                  {user.englishLevel}
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 mt-4 leading-relaxed line-clamp-3">
                "{user.bio}"
              </p>

              {/* Interests Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {user.interests.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#0B1020] text-slate-300 border border-slate-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {user.streakDays}d streak
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartChat(user)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5249e0] transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK MATCH MODAL */}
      {matchingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl w-full max-w-md p-6 text-center shadow-2xl animate-in zoom-in-95 duration-150">
            {!matchedUser ? (
              <div className="py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#635BFF]/20 border-2 border-[#22D3EE] flex items-center justify-center mx-auto text-2xl animate-spin">
                  🌐
                </div>
                <h3 className="font-extrabold text-lg text-white">Matching Global Partners...</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Scanning active international speakers with compatible language levels and timezone alignment.
                </p>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl">
                  ✨
                </div>
                <h3 className="font-extrabold text-xl text-white">Compatible Partner Found!</h3>
                
                <div className="p-4 rounded-2xl bg-[#0B1020] border border-slate-800 text-left flex items-center gap-3">
                  <img
                    src={matchedUser.avatar}
                    alt={matchedUser.displayName}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{matchedUser.displayName}</h4>
                    <p className="text-xs text-slate-400">{matchedUser.country} • {matchedUser.englishLevel}</p>
                    <p className="text-[11px] text-[#22D3EE] mt-0.5 font-medium">96% Compatibility Match</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => setMatchingModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => {
                      setMatchingModal(false);
                      handleStartChat(matchedUser);
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE]"
                  >
                    Start Direct Conversation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
