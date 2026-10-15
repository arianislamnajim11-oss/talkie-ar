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
  INITIAL_EVENTS
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
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  accentColor: 'indigo' | 'cyan' | 'violet';
  setAccentColor: (c: 'indigo' | 'cyan' | 'violet') => void;
  
  // Voice & Room
  activeRoom: SpeakingRoom | null;
  speakingRooms: SpeakingRoom[];
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  hasRaisedHand: boolean;
  roomMessages: ChatMessage[];
  joinRoom: (room: SpeakingRoom) => void;
  leaveRoom: () => void;
  toggleMute: () => void;
  toggleDeafen: () => void;
  toggleRaiseHand: () => void;
  sendRoomMessage: (text: string) => void;
  createSpeakingRoom: (newRoom: Partial<SpeakingRoom>) => SpeakingRoom;
  
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
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
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
        content: 'Hi Arian! Did you check out the 2-minute tech challenge room?',
        timestamp: '10:30 AM'
      },
      {
        id: 'dm_2',
        senderId: 'usr_me_001',
        senderName: 'Arian Islam',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        content: 'Hey Maya! Yes, I hosted it earlier. You should definitely join the next session, it really forces you to structure thoughts quickly!',
        timestamp: '10:38 AM'
      },
      {
        id: 'dm_3',
        senderId: 'usr_maya_002',
        senderName: 'Maya Tanaka',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
        content: 'Thanks for the pronunciation tips! See you in the speaking room tomorrow.',
        timestamp: '10:42 AM'
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
    },
    {
      id: 'notif_3',
      title: 'New Friend Request',
      message: 'Elena from Brazil sent you a friend request.',
      type: 'friend_request',
      timestamp: '1d ago',
      read: true
    }
  ]);

  // Voice room simulator effect
  useEffect(() => {
    if (!activeRoom || isMuted) {
      setIsSpeaking(false);
      return;
    }

    // Gentle speaking pulse to simulate real voice presence
    const interval = setInterval(() => {
      setIsSpeaking(prev => !prev);
    }, 2800);
    return () => clearInterval(interval);
  }, [activeRoom, isMuted]);

  const joinRoom = (room: SpeakingRoom) => {
    setActiveRoom(room);
    setIsMuted(false);
    setIsDeafened(false);
    setHasRaisedHand(false);
    setRoomMessages([
      {
        id: 'sys_' + Date.now(),
        senderId: 'sys',
        senderName: 'Talkie AR Room Bot',
        senderAvatar: '',
        content: `Welcome to "${room.title}". Please respect speaking turns and encourage fellow international learners! 🎙️`,
        timestamp: 'Just now'
      }
    ]);
  };

  const leaveRoom = () => {
    setActiveRoom(null);
    setIsMuted(false);
    setIsDeafened(false);
    setHasRaisedHand(false);
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

  const sendRoomMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: 'rmsg_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.isPremium ? 'Talkie Pro' : undefined,
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRoomMessages(prev => [...prev, newMsg]);
  };

  const createSpeakingRoom = (roomData: Partial<SpeakingRoom>): SpeakingRoom => {
    const newRoom: SpeakingRoom = {
      id: 'rm_' + Date.now(),
      title: roomData.title || 'Casual Global English Chat',
      description: roomData.description || 'Open speaking session for global learners.',
      topic: roomData.topic || 'General conversation',
      category: roomData.category || 'Everyday English',
      level: roomData.level || 'All Levels',
      hostId: currentUser.id,
      hostName: currentUser.displayName,
      hostAvatar: currentUser.avatar,
      capacity: roomData.capacity || 6,
      isPrivate: !!roomData.isPrivate,
      isBeginnerFriendly: !!roomData.isBeginnerFriendly,
      speakingMode: roomData.speakingMode || 'free',
      activeTopicPrompt: roomData.activeTopicPrompt || roomData.topic || 'Share your thoughts!',
      participants: [
        {
          userId: currentUser.id,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
          countryCode: currentUser.countryCode,
          level: currentUser.englishLevel,
          role: 'host',
          isMuted: false,
          isDeafened: false,
          isSpeaking: false,
          raisedHand: false,
          joinedAt: new Date().toISOString()
        }
      ],
      tags: roomData.tags || ['Global', 'Live'],
      createdAt: new Date().toISOString()
    };

    setSpeakingRooms(prev => [newRoom, ...prev]);
    return newRoom;
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
        theme,
        setTheme,
        accentColor,
        setAccentColor,
        activeRoom,
        speakingRooms,
        isMuted,
        isDeafened,
        isSpeaking,
        hasRaisedHand,
        roomMessages,
        joinRoom,
        leaveRoom,
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
