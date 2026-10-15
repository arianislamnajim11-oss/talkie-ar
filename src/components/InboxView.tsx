import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Mic,
  MicOff,
  Phone,
  Video,
  Pin,
  CheckCheck,
  Smile,
  Paperclip,
  MoreVertical,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DirectConversation } from '../types/index';

export const InboxView: React.FC = () => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    directMessages,
    sendDirectMessage,
    currentUser
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [search, setSearch] = useState('');
  const [isRecordingVoiceNote, setIsRecordingVoiceNote] = useState(false);

  const activeMessages = activeConversation ? (directMessages[activeConversation.id] || []) : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;
    sendDirectMessage(activeConversation.id, messageInput.trim());
    setMessageInput('');
  };

  const handleSendVoiceNote = () => {
    if (!activeConversation) return;
    setIsRecordingVoiceNote(true);

    // Simulate 2s recording then send audio message
    setTimeout(() => {
      setIsRecordingVoiceNote(false);
      sendDirectMessage(activeConversation.id, '🎙️ Voice note (0:15) — "Thanks for the feedback on my speaking fluency!"');
    }, 1800);
  };

  const filteredConversations = conversations.filter(c =>
    c.recipient.displayName.toLowerCase().includes(search.toLowerCase()) ||
    c.recipient.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="h-full bg-[#111827] rounded-3xl border border-slate-800 overflow-hidden flex shadow-2xl">
        
        {/* 1. CONVERSATIONS LIST SIDEBAR */}
        <div className="w-full sm:w-80 md:w-96 border-r border-slate-800 flex flex-col bg-[#0E1528] shrink-0">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#22D3EE]" />
                <span>Messages & Inquiries</span>
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#635BFF]/20 text-[#22D3EE]">
                {conversations.length} Active
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#635BFF]"
              />
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredConversations.map((conv) => {
              const isSelected = activeConversation?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-[#635BFF]/15 border-l-4 border-[#635BFF]' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.recipient.avatar}
                      alt={conv.recipient.displayName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#0E1528] ${
                        conv.recipient.presence === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-white truncate">{conv.recipient.displayName}</p>
                      <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. CHAT FEED & MESSAGE AREA */}
        {activeConversation ? (
          <div className="hidden sm:flex flex-1 flex-col bg-[#0B1020] overflow-hidden">
            
            {/* Header */}
            <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-[#111827]/80">
              <div className="flex items-center gap-3">
                <img
                  src={activeConversation.recipient.avatar}
                  alt={activeConversation.recipient.displayName}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                />
                <div>
                  <h3 className="font-bold text-sm text-white">{activeConversation.recipient.displayName}</h3>
                  <p className="text-[10px] text-emerald-400 font-semibold">
                    {activeConversation.recipient.country} • {activeConversation.recipient.englishLevel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendVoiceNote}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Send Voice Note"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {activeMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-[#635BFF] text-white shadow-md'
                          : 'bg-[#111827] text-slate-200 border border-slate-800'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span className="text-[10px] opacity-70 mt-1 block text-right font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-[#0E1528] flex items-center gap-2">
              <button
                type="button"
                onClick={handleSendVoiceNote}
                className={`p-2.5 rounded-xl transition-all ${
                  isRecordingVoiceNote
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-[#111827] text-slate-400 hover:text-white'
                }`}
                title="Record short audio voice note"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder={isRecordingVoiceNote ? 'Recording voice note...' : `Message ${activeConversation.recipient.displayName}...`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#111827] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#635BFF]"
              />

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#22D3EE] text-white disabled:opacity-50 transition-all shadow-md shadow-[#635BFF]/25"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
            Select a conversation to start chatting
          </div>
        )}

      </div>
    </div>
  );
};
