import React, { useState } from 'react';
import {
  Mic,
  MessageSquare,
  Users,
  Compass,
  Gamepad2,
  BookOpen,
  Bot,
  Award,
  Calendar,
  Sparkles,
  ShieldAlert,
  Search,
  Bell,
  Check,
  ChevronDown,
  Volume2,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate, onOpenSearch }) => {
  const {
    currentUser,
    activeRoom,
    leaveRoom,
    isMuted,
    toggleMute,
    theme,
    setTheme,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    updatePresence
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const navItems = [
    { id: 'rooms', label: 'Speaking Rooms', icon: Mic, badge: 'Live' },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'inbox', label: 'Messages', icon: MessageSquare },
    { id: 'discover', label: 'Find Partners', icon: Compass },
    { id: 'games', label: 'Speaking Games', icon: Gamepad2 },
    { id: 'ai-coach', label: 'AI Coach', icon: Bot, isHot: true },
    { id: 'learn', label: 'Learn & Vocab', icon: BookOpen },
    { id: 'assessments', label: 'Certificates', icon: Award },
    { id: 'events', label: 'Events', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B1020]/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="Talkie AR Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#635BFF] via-[#A855F7] to-[#22D3EE] p-[2px] shadow-lg shadow-[#635BFF]/25">
              <div className="w-full h-full bg-[#0B1020] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#635BFF] text-xl tracking-tight">T</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-[#22D3EE] transition-colors">
                  Talkie <span className="text-[#22D3EE]">AR</span>
                </span>
                <span className="text-[10px] font-semibold bg-[#635BFF]/20 text-[#22D3EE] border border-[#635BFF]/40 px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  Global
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Speak. Connect. Flourish.</p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'text-white bg-slate-800/90 shadow-sm border border-slate-700/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#22D3EE]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1 rounded-sm font-bold uppercase tracking-wider animate-pulse">
                    {item.badge}
                  </span>
                )}
                {item.isHot && (
                  <span className="text-[9px] bg-gradient-to-r from-[#635BFF] to-[#A855F7] text-white px-1 rounded-sm font-bold uppercase">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Speaking Room Mini Pill */}
          {activeRoom && (
            <div className="flex items-center gap-2 bg-[#635BFF]/15 border border-[#635BFF]/40 text-slate-200 px-3 py-1 rounded-full text-xs animate-in fade-in duration-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-xs text-white truncate max-w-[110px] sm:max-w-[150px]">
                {activeRoom.title}
              </span>
              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                className={`p-1 rounded-full transition-colors ${
                  isMuted ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-slate-700/60 text-slate-200 hover:bg-slate-600'
                }`}
              >
                <Mic className="w-3 h-3" />
              </button>
              <button
                onClick={leaveRoom}
                aria-label="Leave room"
                className="text-slate-400 hover:text-red-400 text-[10px] font-bold uppercase ml-1 px-1 py-0.5 rounded"
              >
                Leave
              </button>
            </div>
          )}

          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Search Talkie AR"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowProfileMenu(false);
              }}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#635BFF] ring-2 ring-[#0B1020]" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111827] border border-slate-800 rounded-xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <span className="text-[10px] bg-[#635BFF] text-white px-1.5 py-0.2 rounded-full font-bold">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-[#22D3EE] hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 hover:bg-slate-800/50 transition-colors cursor-pointer ${
                          !notif.read ? 'bg-[#635BFF]/5' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Premium Upgrade CTA */}
          {!currentUser.isPremium ? (
            <button
              onClick={() => navigate('premium')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-gradient-to-r from-[#F5C451] to-[#F59E0B] hover:brightness-110 shadow-md shadow-[#F5C451]/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-900" />
              <span>Get Pro</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#F5C451] bg-[#F5C451]/10 border border-[#F5C451]/30">
              <Sparkles className="w-3 h-3 text-[#F5C451]" />
              <span>PRO</span>
            </div>
          )}

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-800 border border-slate-800 transition-colors focus:outline-none"
              aria-label="User account menu"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#0B1020] ${
                    currentUser.presence === 'online'
                      ? 'bg-emerald-500'
                      : currentUser.presence === 'busy'
                      ? 'bg-red-500'
                      : currentUser.presence === 'idle'
                      ? 'bg-amber-500'
                      : 'bg-slate-500'
                  }`}
                />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#111827] border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-800">
                  <div className="font-bold text-sm text-white flex items-center justify-between">
                    <span>{currentUser.displayName}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#635BFF]/20 text-[#22D3EE] rounded border border-[#635BFF]/30">
                      {currentUser.englishLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">@{currentUser.username}</p>
                  {currentUser.customStatus && (
                    <p className="text-xs text-[#22D3EE] mt-1 font-medium italic">
                      "{currentUser.customStatus}"
                    </p>
                  )}
                </div>

                {/* Status Switcher */}
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                    Set Presence
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {(['online', 'busy', 'idle', 'invisible'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updatePresence(status)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md capitalize font-medium ${
                          currentUser.presence === status
                            ? 'bg-slate-800 text-white font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            status === 'online'
                              ? 'bg-emerald-500'
                              : status === 'busy'
                              ? 'bg-red-500'
                              : status === 'idle'
                              ? 'bg-amber-500'
                              : 'bg-slate-500'
                          }`}
                        />
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      navigate('dashboard');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                  >
                    <span>📊</span>
                    <span>Learner Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                  >
                    <span>👤</span>
                    <span>My Public Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('friends');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                  >
                    <span>🌍</span>
                    <span>Friends & Global Contacts</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                  >
                    <span>⚙️</span>
                    <span>Account & Audio Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('admin');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 hover:text-white flex items-center gap-2 text-indigo-400"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin & Safety Center</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#111827] border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                  isActive
                    ? 'text-white bg-[#635BFF]/20 border border-[#635BFF]/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#22D3EE]" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                navigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-300 hover:text-white font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate('admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-indigo-400 hover:underline font-medium"
            >
              Admin & Safety
            </button>
            <button
              onClick={() => {
                navigate('premium');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#F5C451] font-bold"
            >
              Talkie Pro
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
