export type EnglishLevel = 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper-Intermediate' | 'Advanced' | 'Proficient';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  country: string;
  countryCode: string;
  nativeLanguage: string;
  targetLanguage: string;
  englishLevel: EnglishLevel;
  cefrLevel?: CEFRLevel;
  bio: string;
  speakingGoals: string[];
  interests: string[];
  streakDays: number;
  totalPracticeMinutes: number;
  isPremium: boolean;
  premiumTier?: 'pro' | 'unlimited';
  role: 'user' | 'mentor' | 'moderator' | 'admin';
  presence: 'online' | 'busy' | 'idle' | 'invisible';
  customStatus?: string;
  joinedDate: string;
  achievements: Achievement[];
  badges: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface RoomParticipant {
  userId: string;
  displayName: string;
  avatar: string;
  countryCode: string;
  level: EnglishLevel;
  role: 'host' | 'moderator' | 'speaker' | 'listener';
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  raisedHand: boolean;
  joinedAt: string;
}

export interface SpeakingRoom {
  id: string;
  title: string;
  description: string;
  topic: string;
  category: string;
  language?: string;
  level: EnglishLevel | 'All Levels';
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostCountryCode?: string;
  capacity: number;
  isPrivate: boolean;
  password?: string;
  rules?: string;
  isBeginnerFriendly: boolean;
  speakingMode: 'free' | 'two-minute' | 'debate' | 'interview' | 'storytelling';
  status?: 'active' | 'closed';
  timerSeconds?: number;
  activeTopicPrompt?: string;
  participants: RoomParticipant[];
  tags: string[];
  createdAt: string;
}

export interface CommunityServer {
  id: string;
  name: string;
  description: string;
  icon: string;
  banner: string;
  isVerified: boolean;
  memberCount: number;
  categories: {
    id: string;
    name: string;
    channels: Channel[];
  }[];
  roles: {
    id: string;
    name: string;
    color: string;
    isHoist: boolean;
  }[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'stage' | 'forum' | 'announcements' | 'study';
  topic?: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  channelId?: string;
  conversationId?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string;
  content: string;
  timestamp: string;
  reactions?: Record<string, string[]>; // emoji -> array of userIds
  isPinned?: boolean;
  attachment?: {
    type: 'image' | 'audio' | 'file';
    url: string;
    name: string;
  };
}

export interface DirectConversation {
  id: string;
  recipient: User;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isPinned?: boolean;
}

export interface SpeakingGame {
  id: string;
  title: string;
  slug: string;
  description: string;
  playersCount: string;
  minPlayers: number;
  maxPlayers: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All';
  category: string;
  rounds: number;
  icon: string;
}

export interface GameState {
  gameId: string;
  gameSlug: string;
  currentRound: number;
  totalRounds: number;
  timer: number;
  prompt: string;
  hints?: string[];
  options?: string[];
  forbiddenWords?: string[];
  scores: Record<string, number>;
  status: 'lobby' | 'playing' | 'round-end' | 'game-over';
}

export interface CEFRAssessmentQuestion {
  id: number;
  type: 'multiple-choice' | 'grammar' | 'listening' | 'speaking-prompt';
  question: string;
  options?: string[];
  correctAnswer?: number;
  audioText?: string;
  explanation: string;
  skill: 'Grammar' | 'Vocabulary' | 'Listening' | 'Fluency';
}

export interface AssessmentResult {
  id: string;
  userId: string;
  userName: string;
  score: number;
  maxScore: number;
  percentage: number;
  assessedLevel: CEFRLevel;
  levelTitle: string;
  skillsBreakdown: {
    grammar: number;
    vocabulary: number;
    listening: number;
    speaking: number;
  };
  feedback: string;
  completedAt: string;
  certificateId?: string;
}

export interface Certificate {
  id: string;
  candidateName: string;
  userId: string;
  cefrLevel: CEFRLevel;
  levelTitle: string;
  scorePercentage: number;
  issueDate: string;
  verificationCode: string;
  status: 'valid' | 'revoked';
  issuer: string;
  skills: {
    name: string;
    score: number;
  }[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: 'Speaking Club' | 'Debate' | 'Workshop' | 'Language Exchange' | 'Tournament';
  hostName: string;
  hostAvatar: string;
  startTime: string;
  durationMinutes: number;
  attendeesCount: number;
  isAttending?: boolean;
  level: EnglishLevel | 'All Levels';
  capacity: number;
}

export interface VocabularyItem {
  id: string;
  word: string;
  partOfSpeech: string;
  phonetic: string;
  definition: string;
  example: string;
  level: CEFRLevel;
  mastered: boolean;
  nextReviewDate: string;
}
