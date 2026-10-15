import React, { useState } from 'react';
import {
  Users,
  Search,
  MessageSquare,
  UserPlus,
  Check,
  X,
  Flame,
  Shield,
  MoreVertical
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_USERS } from '../services/mockData';
import { User } from '../types/index';

interface FriendsViewProps {
  navigate: (route: string) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({ navigate }) => {
  const { currentUser, setActiveConversation, conversations } = useApp();

  const [filter, setFilter] = useState<'all' | 'online' | 'pending'>('all');
  const [search, setSearch] = useState('');

  const friends = INITIAL_USERS.filter(u => u.id !== currentUser.id);

  const filteredFriends = friends.filter(f => {
    if (search) {
      const q = search.toLowerCase();
      if (!f.displayName.toLowerCase().includes(q) && !f.country.toLowerCase().includes(q)) return false;
    }
    if (filter === 'online') {
      return f.presence === 'online' || f.presence === 'busy';
    }
    return true;
  });

  const handleMessage = (user: User) => {
    const existing = conversations.find(c => c.recipient.id === user.id);
    if (existing) {
      setActiveConversation(existing);
    }
    navigate('inbox');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Social Network & Contacts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Friends & Global Learners
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stay connected with language exchange partners and see when they are online to speak.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-[#111827] p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'all' ? 'bg-[#635BFF] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Friends ({friends.length})
          </button>
          <button
            onClick={() => setFilter('online')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'online' ? 'bg-[#635BFF] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Online Now (3)
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'pending' ? 'bg-[#635BFF] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Requests (1)
          </button>
        </div>
      </div>

      {/* Friends list */}
      {filter === 'pending' ? (
        <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 max-w-xl mx-auto text-center space-y-4">
          <h3 className="font-extrabold text-base text-white">Pending Friend Request</h3>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0B1020] border border-slate-800 text-left">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                alt="Elena"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-sm text-white">Elena Santos</p>
                <p className="text-xs text-slate-400">Brazil • Elementary (A2)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Friend request accepted!')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600"
              >
                Accept
              </button>
              <button
                onClick={() => alert('Friend request declined.')}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="relative shrink-0">
                  <img
                    src={friend.avatar}
                    alt={friend.displayName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-[#111827] ${
                      friend.presence === 'online'
                        ? 'bg-emerald-500'
                        : friend.presence === 'busy'
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                    }`}
                  />
                </div>
                <div className="truncate">
                  <h3 className="font-extrabold text-sm text-white truncate">{friend.displayName}</h3>
                  <p className="text-xs text-slate-400">{friend.country} • {friend.englishLevel}</p>
                  {friend.customStatus && (
                    <p className="text-[11px] text-[#22D3EE] truncate mt-0.5">{friend.customStatus}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <button
                  onClick={() => handleMessage(friend)}
                  className="p-2 rounded-xl bg-[#635BFF] hover:bg-[#5249e0] text-white transition-colors"
                  title="Direct Message"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
