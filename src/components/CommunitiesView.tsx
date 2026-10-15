import React, { useState } from 'react';
import {
  Hash,
  Volume2,
  Radio,
  FileText,
  BookOpen,
  MessageSquare,
  Users,
  Plus,
  Send,
  Smile,
  Paperclip,
  Check,
  Shield,
  Sparkles,
  ChevronDown,
  Search,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityServer, Channel } from '../types/index';

export const CommunitiesView: React.FC = () => {
  const {
    communities,
    activeCommunity,
    setActiveCommunity,
    activeChannel,
    setActiveChannel,
    channelMessages,
    sendChannelMessage,
    currentUser
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [showMemberSidebar, setShowMemberSidebar] = useState(true);

  const currentMessages = channelMessages[activeChannel.id] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendChannelMessage(activeChannel.id, messageText.trim());
    setMessageText('');
  };

  const getChannelIcon = (type: Channel['type']) => {
    switch (type) {
      case 'voice':
        return <Volume2 className="w-4 h-4 text-emerald-400" />;
      case 'stage':
        return <Radio className="w-4 h-4 text-purple-400" />;
      case 'forum':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'study':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'announcements':
        return <FileText className="w-4 h-4 text-red-400" />;
      default:
        return <Hash className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-[#0B1020] text-slate-100">
      
      {/* 1. DISCORD-STYLE SERVER SIDEBAR */}
      <div className="w-16 sm:w-18 bg-[#090D1A] border-r border-slate-800/80 p-2 sm:p-3 flex flex-col items-center gap-3 shrink-0">
        
        {communities.map((server) => {
          const isActive = activeCommunity.id === server.id;
          return (
            <button
              key={server.id}
              onClick={() => {
                setActiveCommunity(server);
                setActiveChannel(server.categories[0].channels[0]);
              }}
              title={server.name}
              className={`relative group w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-tr from-[#635BFF] to-[#22D3EE] text-white rounded-xl shadow-lg shadow-[#635BFF]/30'
                  : 'bg-[#111827] text-slate-300 hover:rounded-xl hover:bg-[#635BFF]/30 hover:text-white'
              }`}
            >
              {/* Active pill indicator */}
              <span
                className={`absolute left-0 -ml-2 sm:-ml-3 w-1 bg-white rounded-r transition-all ${
                  isActive ? 'h-8' : 'h-2 group-hover:h-5'
                }`}
              />
              <span>{server.icon}</span>
            </button>
          );
        })}

        {/* Add Server Button */}
        <button
          title="Explore / Create New Community Server"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#111827] hover:bg-emerald-500/20 text-emerald-400 hover:text-white border border-slate-800 flex items-center justify-center transition-all hover:rounded-xl"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* 2. SERVER CHANNELS COLUMN */}
      <div className="w-56 sm:w-64 bg-[#0E1528] border-r border-slate-800/80 flex flex-col shrink-0">
        
        {/* Server Header */}
        <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between font-bold text-sm text-white">
          <div className="flex items-center gap-2 truncate">
            <span className="truncate">{activeCommunity.name}</span>
            {activeCommunity.isVerified && (
              <span title="Verified Talkie AR Guild" className="text-[#22D3EE] text-xs">✓</span>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* Channels Tree */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {activeCommunity.categories.map((cat) => (
            <div key={cat.id}>
              <div className="px-2 mb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>{cat.name}</span>
                <span className="text-[9px] text-slate-400 font-normal">{cat.channels.length}</span>
              </div>
              <div className="space-y-0.5">
                {cat.channels.map((chan) => {
                  const isSelected = activeChannel.id === chan.id;
                  return (
                    <button
                      key={chan.id}
                      onClick={() => setActiveChannel(chan)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                        isSelected
                          ? 'bg-[#635BFF]/25 text-white font-bold border border-[#635BFF]/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      {getChannelIcon(chan.type)}
                      <span className="truncate">{chan.name}</span>
                      {chan.type === 'voice' && (
                        <span className="ml-auto text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-400 rounded font-bold">
                          VOICE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Current User Micro-Status Bar */}
        <div className="p-2 border-t border-slate-800 bg-[#090D1A] flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-7 h-7 rounded-lg object-cover"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{currentUser.displayName}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">{currentUser.presence}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CHANNEL CHAT WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0B1020]">
        
        {/* Channel Top Header */}
        <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            {getChannelIcon(activeChannel.type)}
            <h2 className="font-extrabold text-sm sm:text-base text-white truncate">
              {activeChannel.name}
            </h2>
            {activeChannel.topic && (
              <span className="hidden md:inline-block text-xs text-slate-400 truncate max-w-sm pl-2 border-l border-slate-700">
                {activeChannel.topic}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMemberSidebar(!showMemberSidebar)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Toggle Server Member Directory"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Welcome Channel Banner */}
          <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 mb-6">
            <div className="flex items-center gap-2 text-[#22D3EE] font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Welcome to #{activeChannel.name}!</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              This is the beginning of the #{activeChannel.name} channel. Speak freely, practice actively, and encourage fellow English speakers!
            </p>
          </div>

          {currentMessages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group">
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-800 shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-white">
                    {msg.senderName}
                  </span>
                  {msg.senderRole && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#635BFF]/20 text-[#22D3EE] border border-[#635BFF]/30">
                      {msg.senderRole}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                  {msg.content}
                </p>

                {/* Reactions */}
                {msg.reactions && (
                  <div className="flex items-center gap-1.5 mt-2">
                    {Object.entries(msg.reactions).map(([emoji, userList]) => (
                      <span
                        key={emoji}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300"
                      >
                        <span>{emoji}</span>
                        <span className="text-[10px] text-slate-400">{userList.length}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-[#0E1528] border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Message #${activeChannel.name}...`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#111827] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#635BFF]"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#22D3EE] text-white hover:opacity-95 shadow-md shadow-[#635BFF]/25 transition-all"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 4. SERVER MEMBERS LIST SIDEBAR */}
      {showMemberSidebar && (
        <div className="w-52 sm:w-60 bg-[#090D1A] border-l border-slate-800/80 p-3 overflow-y-auto hidden lg:block shrink-0">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-2">
            Server Roles & Members
          </p>

          <div className="space-y-4">
            {activeCommunity.roles.map((role) => (
              <div key={role.id}>
                <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: role.color }} />
                  <span>{role.name}</span>
                </div>
                
                {/* Sample member preview under role */}
                <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-800/40 cursor-pointer">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs">
                    🌟
                  </div>
                  <span className="text-xs text-slate-300 font-medium">Global Speaker</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
