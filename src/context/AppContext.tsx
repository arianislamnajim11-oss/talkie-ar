import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  SpeakingRoom,
  CommunityServer,
  Channel,
  ChatMessage,
  DirectConversation,
  VocabularyItem,
  EventItem
} from '../types/index';
import {
  CURRENT_USER,
  INITIAL_ROOMS,
  INITIAL_COMMUNITIES,
  INITIAL_CHANNEL_MESSAGES,
  INITIAL_CONVERSATIONS,
  INITIAL_VOCABULARY,
  INITIAL_EVENTS,
  INITIAL_USERS
} from '../services/mockData';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'room_invite' | 'friend_request' | 'achievement' | 'system';
  timestamp: string;
  read: boolean;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  allUsers: User[];
  registerUser: (data: { username: string; email: string; displayName: string; password?: string; country: string; englishLevel: string }) => Promise<{ success: boolean; error?: string }>;
  loginUser: (usernameOrEmail: string) => Promise<{ success: boolean; error?: string }>;
  switchUser: (user: User) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  accentColor: 'indigo' | 'cyan' | 'violet';
  setAccentColor: (c: 'indigo' | 'cyan' | 'violet') => void;
  
  // Voice & Room
  activeRoom: SpeakingRoom | null;
  speakingRooms: SpeakingRoom[];
  refreshRooms: () => Promise<void>;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  hasRaisedHand: boolean;
  roomMessages: ChatMessage[];
  joinRoom: (room: SpeakingRoom, password?: string) => Promise<{ success: boolean; error?: string }>;
  leaveRoom: () => Promise<void>;
  closeRoom: (roomId: string) => Promise<{ success: boolean; error?: string }>;
  toggleMute: () => void;
  toggleDeafen: () => void;
  toggleRaiseHand: () => void;
  sendRoomMessage: (text: string) => Promise<void>;
  createSpeakingRoom: (newRoom: Partial<SpeakingRoom>) => Promise<{ success: boolean; room?: SpeakingRoom; error?: string }>;
  
  // Communities
  communities: CommunityServer[];
  activeCommunity: CommunityServer;
  setActiveCommunity: (comm: CommunityServer) => void;
  activeChannel: Channel;
  setActiveChannel: (chan: Channel) => void;
  channelMessages: Record<string, ChatMessage[]>;
  sendChannelMessage: (channelId: string, content: string) => void;
  
  // Direct Messaging
  conversations: DirectConversation[];
  activeConversation: DirectConversation | null;
  setActiveConversation: (c: DirectConversation | null) => void;
  directMessages: Record<string, ChatMessage[]>;
  sendDirectMessage: (convId: string, content: string) => void;
  
  // Learning & Vocabulary
  vocabulary: VocabularyItem[];
  addVocabularyWord: (word: VocabularyItem) => void;
  events: EventItem[];
  toggleEventRsvp: (eventId: string) => void;
  
  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Premium
  upgradeToPremium: (tier: 'pro' | 'unlimited') => void;
  updatePresence: (presence: 'online' | 'busy' | 'idle' | 'invisible') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accentColor, setAccentColor] = useState<'indigo' | 'cyan' | 'violet'>('indigo');

  // Rooms & Voice
  const [speakingRooms, setSpeakingRooms] = useState<SpeakingRoom[]>(INITIAL_ROOMS);
  const [activeRoom, setActiveRoom] = useState<SpeakingRoom | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);

  // Communities
  const [communities] = useState<CommunityServer[]>(INITIAL_COMMUNITIES);
  const [activeCommunity, setActiveCommunity] = useState<CommunityServer>(INITIAL_COMMUNITIES[0]);
  const [activeChannel, setActiveChannel] = useState<Channel>(INITIAL_COMMUNITIES[0].categories[1].channels[0]);
  const [channelMessages, setChannelMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHANNEL_MESSAGES);

  // Direct messaging
  const [conversations, setConversations] = useState<DirectConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState<DirectConversation | null>(INITIAL_CONVERSATIONS[0]);
  const [directMessages, setDirectMessages] = useState<Record<string, ChatMessage[]>>({
    conv_maya: [
      {
        id: 'dm_1',
        senderId: 'usr_maya_002',
        senderName: 'Maya Tanaka',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
        content: 'Hi! Ready to practice some casual conversation today? ☕',
        timestamp: '10:30 AM'
      }
    ]
  });

  // Learning & Events
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(INITIAL_VOCABULARY);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_1',
      title: 'Speaking Room Invitation',
      message: 'Fatima invited you to join "IELTS Speaking Band 7.5+ Practice"',
      type: 'room_invite',
      timestamp: '15m ago',
      read: false
    },
    {
      id: 'notif_2',
      title: 'Streak Maintained! 🔥',
      message: 'You have reached 14 consecutive days of English practice. Keep the fire burning!',
      type: 'achievement',
      timestamp: '2h ago',
      read: false
    }
  ]);

  // Initial fetch of rooms from backend
  const refreshRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      if (res.ok) {
        const data = await res.json();
        setSpeakingRooms(data);
      }
    } catch (e) {
      console.warn('Error fetching rooms from server:', e);
    }
  };

  useEffect(() => {
    refreshRooms();
  }, []);

  // Poll active room messages when in a room
  useEffect(() => {
    if (!activeRoom) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/rooms/${activeRoom.id}/messages`);
        if (res.ok) {
          const msgs = await res.json();
          if (msgs.length > 0) {
            setRoomMessages(msgs);
          }
        }
      } catch (e) {}
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeRoom]);

  // Voice room speaking pulse simulation if real microphone is quiet
  useEffect(() => {
    if (!activeRoom || isMuted) {
      setIsSpeaking(false);
      return;
    }

    const interval = setInterval(() => {
      setIsSpeaking(prev => !prev);
    }, 2800);
    return () => clearInterval(interval);
  }, [activeRoom, isMuted]);

  // Authentication Handlers
  const registerUser = async (data: {
    username: string;
    email: string;
    displayName: string;
    password?: string;
    country: string;
    englishLevel: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Registration failed' };
      }
      setAllUsers(prev => [...prev, resData.user]);
      setCurrentUser(resData.user);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  };

  const loginUser = async (usernameOrEmail: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setCurrentUser(data.user);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
  };

  // Room Handlers
  const joinRoom = async (room: SpeakingRoom, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/rooms/${room.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Cannot join room' };
      }

      setActiveRoom(data.room);
      setIsMuted(false);
      setIsDeafened(false);
      setHasRaisedHand(false);

      // Refresh directory
      refreshRooms();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error joining room' };
    }
  };

  const leaveRoom = async () => {
    if (!activeRoom) return;
    try {
      await fetch(`/api/rooms/${activeRoom.id}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
    } catch (e) {}

    setActiveRoom(null);
    setIsMuted(false);
    setIsDeafened(false);
    setHasRaisedHand(false);
    refreshRooms();
  };

  const closeRoom = async (roomId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostId: currentUser.id })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to close room' };
      }

      setActiveRoom(null);
      refreshRooms();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error closing room' };
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleDeafen = () => {
    setIsDeafened(prev => {
      const next = !prev;
      if (next) setIsMuted(true);
      return next;
    });
  };

  const toggleRaiseHand = () => {
    setHasRaisedHand(prev => !prev);
  };

  const sendRoomMessage = async (text: string) => {
    if (!text.trim() || !activeRoom) return;

    try {
      const res = await fetch(`/api/rooms/${activeRoom.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          senderName: currentUser.displayName,
          senderAvatar: currentUser.avatar,
          content: text.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRoomMessages(prev => [...prev, data.message]);
      }
    } catch (e) {
      // Local fallback
      const newMsg: ChatMessage = {
        id: 'rmsg_' + Date.now(),
        senderId: currentUser.id,
        senderName: currentUser.displayName,
        senderAvatar: currentUser.avatar,
        content: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setRoomMessages(prev => [...prev, newMsg]);
    }
  };

  const createSpeakingRoom = async (roomData: Partial<SpeakingRoom>): Promise<{ success: boolean; room?: SpeakingRoom; error?: string }> => {
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...roomData,
          hostUser: currentUser
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Room creation failed' };
      }

      setSpeakingRooms(prev => [data.room, ...prev]);
      setActiveRoom(data.room);
      return { success: true, room: data.room };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error creating room' };
    }
  };

  const sendChannelMessage = (channelId: string, content: string) => {
    if (!content.trim()) return;
    const msg: ChatMessage = {
      id: 'chm_' + Date.now(),
      channelId,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.isPremium ? 'Talkie Pro' : undefined,
      content: content.trim(),
      timestamp: 'Just now'
    };
    setChannelMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), msg]
    }));
  };

  const sendDirectMessage = (convId: string, content: string) => {
    if (!content.trim()) return;
    const msg: ChatMessage = {
      id: 'dmm_' + Date.now(),
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      content: content.trim(),
      timestamp: 'Just now'
    };
    setDirectMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), msg]
    }));
  };

  const addVocabularyWord = (item: VocabularyItem) => {
    setVocabulary(prev => [item, ...prev]);
  };

  const toggleEventRsvp = (eventId: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const nextAttending = !ev.isAttending;
        return {
          ...ev,
          isAttending: nextAttending,
          attendeesCount: nextAttending ? ev.attendeesCount + 1 : ev.attendeesCount - 1
        };
      }
      return ev;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const upgradeToPremium = (tier: 'pro' | 'unlimited') => {
    setCurrentUser(prev => ({
      ...prev,
      isPremium: true,
      premiumTier: tier,
      badges: Array.from(new Set([...prev.badges, 'Talkie Pro', 'Gold Member']))
    }));
  };

  const updatePresence = (presence: 'online' | 'busy' | 'idle' | 'invisible') => {
    setCurrentUser(prev => ({ ...prev, presence }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allUsers,
        registerUser,
        loginUser,
        switchUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        theme,
        setTheme,
        accentColor,
        setAccentColor,
        activeRoom,
        speakingRooms,
        refreshRooms,
        isMuted,
        isDeafened,
        isSpeaking,
        hasRaisedHand,
        roomMessages,
        joinRoom,
        leaveRoom,
        closeRoom,
        toggleMute,
        toggleDeafen,
        toggleRaiseHand,
        sendRoomMessage,
        createSpeakingRoom,
        communities,
        activeCommunity,
        setActiveCommunity,
        activeChannel,
        setActiveChannel,
        channelMessages,
        sendChannelMessage,
        conversations,
        activeConversation,
        setActiveConversation,
        directMessages,
        sendDirectMessage,
        vocabulary,
        addVocabularyWord,
        events,
        toggleEventRsvp,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        upgradeToPremium,
        updatePresence
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
