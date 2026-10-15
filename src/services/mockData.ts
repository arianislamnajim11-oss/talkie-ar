import {
  User,
  SpeakingRoom,
  CommunityServer,
  ChatMessage,
  DirectConversation,
  SpeakingGame,
  CEFRAssessmentQuestion,
  Certificate,
  EventItem,
  VocabularyItem
} from '../types/index';

export const CURRENT_USER: User = {
  id: 'usr_me_001',
  username: 'arian_global',
  displayName: 'Arian Islam',
  email: 'arian@talkiear.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  country: 'Bangladesh',
  countryCode: 'BD',
  nativeLanguage: 'Bengali',
  targetLanguage: 'English',
  englishLevel: 'Upper-Intermediate',
  cefrLevel: 'B2',
  bio: 'International software engineer & English enthusiast. Practicing for public speaking and tech conference talks!',
  speakingGoals: ['IELTS 7.5+', 'Fluency in Tech Debates', 'Accent Softening'],
  interests: ['Technology', 'Travel', 'Cinema', 'Artificial Intelligence', 'Philosophy'],
  streakDays: 14,
  totalPracticeMinutes: 840,
  isPremium: true,
  premiumTier: 'pro',
  role: 'user',
  presence: 'online',
  customStatus: 'Practicing for conference debate 🎙️',
  joinedDate: '2026-01-15',
  achievements: [
    { id: 'ach_1', title: 'First Conversation', description: 'Completed first 10-minute live speaking room', icon: '🎙️', unlockedAt: '2026-01-16', progress: 1, maxProgress: 1 },
    { id: 'ach_2', title: 'Globetrotter', description: 'Spoke with learners from 5 different continents', icon: '🌍', unlockedAt: '2026-02-10', progress: 5, maxProgress: 5 },
    { id: 'ach_3', title: 'Streak Master', description: 'Maintained a 14-day daily practice streak', icon: '🔥', unlockedAt: '2026-10-14', progress: 14, maxProgress: 14 },
    { id: 'ach_4', title: 'Debate Champion', description: 'Won 3 community debate rounds', icon: '🏆', progress: 2, maxProgress: 3 },
  ],
  badges: ['Early Pioneer', 'Talkie Pro', 'B2 Certified', 'Helpful Speaker'],
};

export const INITIAL_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'usr_maya_002',
    username: 'maya_tokyo',
    displayName: 'Maya Tanaka',
    email: 'maya@talkiear.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    country: 'Japan',
    countryCode: 'JP',
    nativeLanguage: 'Japanese',
    targetLanguage: 'English',
    englishLevel: 'Intermediate',
    cefrLevel: 'B1',
    bio: 'Tokyo graphic designer preparing for international freelance projects. Loves photography & ramen!',
    speakingGoals: ['Client communication', 'Casual small talk'],
    interests: ['Design', 'Art', 'Travel', 'Anime'],
    streakDays: 9,
    totalPracticeMinutes: 420,
    isPremium: false,
    role: 'user',
    presence: 'online',
    customStatus: 'Coffee & English practice ☕',
    joinedDate: '2026-03-01',
    achievements: [],
    badges: ['Friendly Listener', 'Daily Learner'],
  },
  {
    id: 'usr_carlos_003',
    username: 'carlos_madrid',
    displayName: 'Carlos Mendez',
    email: 'carlos@talkiear.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    country: 'Spain',
    countryCode: 'ES',
    nativeLanguage: 'Spanish',
    targetLanguage: 'English',
    englishLevel: 'Advanced',
    cefrLevel: 'C1',
    bio: 'Hospital doctor in Madrid. Looking to master medical presentations and debate literature.',
    speakingGoals: ['Medical conferences', 'Vocabulary precision'],
    interests: ['Medicine', 'Soccer', 'History', 'Cooking'],
    streakDays: 28,
    totalPracticeMinutes: 1650,
    isPremium: true,
    premiumTier: 'unlimited',
    role: 'mentor',
    presence: 'busy',
    customStatus: 'Hosting Medicine & Science Club tonight',
    joinedDate: '2025-11-20',
    achievements: [],
    badges: ['Verified Mentor', 'C1 Certified', 'Host Elite'],
  },
  {
    id: 'usr_fatima_004',
    username: 'fatima_cairo',
    displayName: 'Fatima Al-Sayed',
    email: 'fatima@talkiear.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    country: 'Egypt',
    countryCode: 'EG',
    nativeLanguage: 'Arabic',
    targetLanguage: 'English',
    englishLevel: 'Upper-Intermediate',
    cefrLevel: 'B2',
    bio: 'University literature student in Cairo. Preparing for IELTS academic test next month.',
    speakingGoals: ['IELTS 8.0', 'Fluency in Idioms'],
    interests: ['Literature', 'Archaeology', 'Cinema', 'Writing'],
    streakDays: 21,
    totalPracticeMinutes: 980,
    isPremium: true,
    premiumTier: 'pro',
    role: 'moderator',
    presence: 'online',
    customStatus: 'Practicing IELTS Part 3 speaking questions',
    joinedDate: '2026-02-05',
    achievements: [],
    badges: ['Community Mod', 'IELTS Ace'],
  },
  {
    id: 'usr_lars_005',
    username: 'lars_stockholm',
    displayName: 'Lars Lindqvist',
    email: 'lars@talkiear.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    country: 'Sweden',
    countryCode: 'SE',
    nativeLanguage: 'Swedish',
    targetLanguage: 'English',
    englishLevel: 'Proficient',
    cefrLevel: 'C2',
    bio: 'Sound designer & podcaster. Native bilingual Swedish/English speaker helping learners gain confidence!',
    speakingGoals: ['Mentor other learners', 'Accent coaching'],
    interests: ['Music Production', 'Podcasting', 'Hiking', 'Gaming'],
    streakDays: 60,
    totalPracticeMinutes: 3400,
    isPremium: true,
    premiumTier: 'unlimited',
    role: 'mentor',
    presence: 'online',
    customStatus: 'Audio workshop starting soon 🎧',
    joinedDate: '2025-08-14',
    achievements: [],
    badges: ['Senior Mentor', 'C2 Mastery', 'Voice Master'],
  },
  {
    id: 'usr_elena_006',
    username: 'elena_sao_paulo',
    displayName: 'Elena Santos',
    email: 'elena@talkiear.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    country: 'Brazil',
    countryCode: 'BR',
    nativeLanguage: 'Portuguese',
    targetLanguage: 'English',
    englishLevel: 'Beginner',
    cefrLevel: 'A2',
    bio: 'Elementary English learner from São Paulo! Trying to speak without fear. Please be patient with me :)',
    speakingGoals: ['Overcome speaking anxiety', 'Learn daily travel phrases'],
    interests: ['Bossa Nova', 'Coffee', 'Beach', 'Languages'],
    streakDays: 5,
    totalPracticeMinutes: 190,
    isPremium: false,
    role: 'user',
    presence: 'idle',
    customStatus: 'Reviewing beginner vocabulary 📖',
    joinedDate: '2026-04-01',
    achievements: [],
    badges: ['Brave Beginner', 'Active Listener'],
  }
];

export const INITIAL_ROOMS: SpeakingRoom[] = [
  {
    id: 'rm_ielts_01',
    title: '🎯 IELTS Speaking Band 7.5+ Practice & Feedback',
    description: 'We take turns answering Part 2 cue cards and Part 3 abstract questions. Friendly feedback on vocabulary, fluency, and coherence.',
    topic: 'Cue Cards: Describe an ambitious project you completed',
    category: 'IELTS Practice',
    level: 'Upper-Intermediate',
    hostId: 'usr_fatima_004',
    hostName: 'Fatima Al-Sayed',
    hostAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    capacity: 6,
    isPrivate: false,
    isBeginnerFriendly: false,
    speakingMode: 'interview',
    timerSeconds: 120,
    activeTopicPrompt: 'Describe a memorable journey you went on. You should say: where you went, whom you went with, what you did, and explain why it was memorable.',
    participants: [
      {
        userId: 'usr_fatima_004',
        displayName: 'Fatima Al-Sayed',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
        countryCode: 'EG',
        level: 'Upper-Intermediate',
        role: 'host',
        isMuted: false,
        isDeafened: false,
        isSpeaking: true,
        raisedHand: false,
        joinedAt: '2026-10-14T21:40:00Z'
      },
      {
        userId: 'usr_maya_002',
        displayName: 'Maya Tanaka',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
        countryCode: 'JP',
        level: 'Intermediate',
        role: 'speaker',
        isMuted: true,
        isDeafened: false,
        isSpeaking: false,
        raisedHand: false,
        joinedAt: '2026-10-14T21:45:00Z'
      },
      {
        userId: 'usr_carlos_003',
        displayName: 'Carlos Mendez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        countryCode: 'ES',
        level: 'Advanced',
        role: 'moderator',
        isMuted: true,
        isDeafened: false,
        isSpeaking: false,
        raisedHand: false,
        joinedAt: '2026-10-14T21:42:00Z'
      }
    ],
    tags: ['IELTS', 'Exam Prep', 'Cue Cards', 'Feedback'],
    createdAt: '2026-10-14T21:30:00Z'
  },
  {
    id: 'rm_coffee_02',
    title: '☕ Cozy Morning Coffee & Casual Chats (All Levels)',
    description: 'No pressure, zero judgment! Grab your favorite drink, share how your week went, discuss favorite foods and weekend plans.',
    topic: 'What is your absolute favorite comfort food from your country?',
    category: 'Everyday English',
    level: 'All Levels',
    hostId: 'usr_lars_005',
    hostName: 'Lars Lindqvist',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    capacity: 8,
    isPrivate: false,
    isBeginnerFriendly: true,
    speakingMode: 'free',
    activeTopicPrompt: 'Introduce yourself, what time is it where you are, and what dish do you crave when you are tired?',
    participants: [
      {
        userId: 'usr_lars_005',
        displayName: 'Lars Lindqvist',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
        countryCode: 'SE',
        level: 'Proficient',
        role: 'host',
        isMuted: false,
        isDeafened: false,
        isSpeaking: true,
        raisedHand: false,
        joinedAt: '2026-10-14T21:50:00Z'
      },
      {
        userId: 'usr_elena_006',
        displayName: 'Elena Santos',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
        countryCode: 'BR',
        level: 'Beginner',
        role: 'speaker',
        isMuted: true,
        isDeafened: false,
        isSpeaking: false,
        raisedHand: true,
        joinedAt: '2026-10-14T21:55:00Z'
      }
    ],
    tags: ['Casual', 'Beginner Friendly', 'Culture', 'Food'],
    createdAt: '2026-10-14T21:48:00Z'
  },
  {
    id: 'rm_tech_03',
    title: '⚡ 2-Minute Tech Pitch & Future of AI Debate',
    description: 'Rapid speaking challenge: pitch an idea or give your stance on artificial intelligence and automation in exactly 120 seconds!',
    topic: 'Will generative AI replace or enhance human creative workers?',
    category: 'Debate',
    level: 'Upper-Intermediate',
    hostId: 'usr_me_001',
    hostName: 'Arian Islam',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    capacity: 6,
    isPrivate: false,
    isBeginnerFriendly: false,
    speakingMode: 'two-minute',
    timerSeconds: 120,
    activeTopicPrompt: 'State your 3 main arguments clearly within 2 minutes. Focus on transition words (Furthermore, Consequently, On the other hand).',
    participants: [
      {
        userId: 'usr_me_001',
        displayName: 'Arian Islam',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        countryCode: 'BD',
        level: 'Upper-Intermediate',
        role: 'host',
        isMuted: false,
        isDeafened: false,
        isSpeaking: false,
        raisedHand: false,
        joinedAt: '2026-10-14T21:30:00Z'
      }
    ],
    tags: ['Tech', 'Debate', 'Timed Speaking', 'AI'],
    createdAt: '2026-10-14T21:30:00Z'
  },
  {
    id: 'rm_travel_04',
    title: '✈️ Travel Stories & Cultural Misunderstandings',
    description: 'Fun anecdotes from traveling abroad. What culture shock surprised you the most, and how did you manage it in English?',
    topic: 'Hilarious or eye-opening travel experiences',
    category: 'Travel English',
    level: 'Intermediate',
    hostId: 'usr_carlos_003',
    hostName: 'Carlos Mendez',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    capacity: 8,
    isPrivate: false,
    isBeginnerFriendly: true,
    speakingMode: 'storytelling',
    activeTopicPrompt: 'Tell a story: The time I got lost or ordered the wrong food in a foreign city!',
    participants: [],
    tags: ['Travel', 'Storytelling', 'Culture Shock', 'Funny'],
    createdAt: '2026-10-14T21:15:00Z'
  }
];

export const INITIAL_COMMUNITIES: CommunityServer[] = [
  {
    id: 'comm_global_01',
    name: 'Talkie Global Guild',
    description: 'The official international headquarters of Talkie AR. Daily speaking circles, cultural events, and language exchanges.',
    icon: '🌐',
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    memberCount: 14280,
    categories: [
      {
        id: 'cat_welcome',
        name: 'WELCOME & RULES',
        channels: [
          { id: 'ch_rules', name: 'community-guidelines', type: 'announcements', topic: 'Official safety and etiquette guidelines' },
          { id: 'ch_announcements', name: 'platform-updates', type: 'announcements', topic: 'Feature updates and upcoming tournaments' },
          { id: 'ch_introductions', name: 'introductions', type: 'text', topic: 'Introduce yourself to learners worldwide!' },
        ]
      },
      {
        id: 'cat_chat',
        name: 'GENERAL LOUNGE',
        channels: [
          { id: 'ch_general', name: 'global-chat', type: 'text', topic: 'Casual English conversation 24/7' },
          { id: 'ch_voice_main', name: 'Main Speaking Circle', type: 'voice', topic: 'Open voice room' },
          { id: 'ch_stage_weekend', name: 'Weekend Stage & Debate', type: 'stage', topic: 'Moderated public discussions' },
        ]
      },
      {
        id: 'cat_learning',
        name: 'LEARNING LABS',
        channels: [
          { id: 'ch_vocab', name: 'daily-vocabulary', type: 'study', topic: 'Share new words, collocations, and idioms' },
          { id: 'ch_grammar', name: 'grammar-clinic', type: 'study', topic: 'Ask tricky grammar questions' },
          { id: 'ch_forum_questions', name: 'questions-answers', type: 'forum', topic: 'Community Q&A forum' },
        ]
      }
    ],
    roles: [
      { id: 'r_admin', name: 'Talkie Admin', color: '#635BFF', isHoist: true },
      { id: 'r_mentor', name: 'Certified Mentor', color: '#22D3EE', isHoist: true },
      { id: 'r_mod', name: 'Community Moderator', color: '#16A34A', isHoist: true },
      { id: 'r_pro', name: 'Talkie Pro', color: '#F5C451', isHoist: false },
      { id: 'r_member', name: 'Global Citizen', color: '#94A3B8', isHoist: false }
    ]
  },
  {
    id: 'comm_ielts_02',
    name: 'IELTS Band 8+ Masterminds',
    description: 'Dedicated preparation server for IELTS Academic and General. Daily Part 2 cue cards, essay reviews, and mock interview rooms.',
    icon: '🎯',
    banner: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    memberCount: 8920,
    categories: [
      {
        id: 'cat_speaking',
        name: 'SPEAKING PRACTICE',
        channels: [
          { id: 'ch_cuecards', name: 'daily-cue-cards', type: 'announcements', topic: 'Fresh Part 2 cue cards updated every morning' },
          { id: 'ch_mock_room_1', name: 'Mock Exam Room 1', type: 'voice', topic: 'Strict 15-minute simulated test' },
          { id: 'ch_mock_room_2', name: 'Mock Exam Room 2', type: 'voice', topic: 'Part 3 abstract debate' },
        ]
      },
      {
        id: 'cat_writing',
        name: 'RESOURCES & STUDY',
        channels: [
          { id: 'ch_task2', name: 'task-2-essays', type: 'study', topic: 'Vocabulary lists for task 2 topics' },
          { id: 'ch_vocab_ielts', name: 'high-band-vocabulary', type: 'text', topic: 'C1 and C2 collocations for IELTS' },
        ]
      }
    ],
    roles: [
      { id: 'r_examiner', name: 'Examiner Coach', color: '#A855F7', isHoist: true },
      { id: 'r_target8', name: 'Target 8.0+', color: '#22D3EE', isHoist: false },
    ]
  },
  {
    id: 'comm_tech_03',
    name: 'Tech & Devs in English',
    description: 'Software engineers, designers, product managers, and founders practicing English for international tech roles.',
    icon: '💻',
    banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    isVerified: false,
    memberCount: 6310,
    categories: [
      {
        id: 'cat_tech',
        name: 'DISCUSSIONS',
        channels: [
          { id: 'ch_tech_general', name: 'general-tech', type: 'text', topic: 'Discuss frameworks, cloud, and open source' },
          { id: 'ch_mock_interviews', name: 'System Design Voice', type: 'voice', topic: 'Practice explaining architecture in English' },
          { id: 'ch_job_tips', name: 'resume-and-interviews', type: 'forum', topic: 'Tips for remote jobs and international visas' }
        ]
      }
    ],
    roles: [
      { id: 'r_lead', name: 'Tech Lead', color: '#3B82F6', isHoist: true },
      { id: 'r_dev', name: 'Software Engineer', color: '#10B981', isHoist: false }
    ]
  }
];

export const INITIAL_CHANNEL_MESSAGES: Record<string, ChatMessage[]> = {
  ch_general: [
    {
      id: 'msg_1',
      senderId: 'usr_lars_005',
      senderName: 'Lars Lindqvist',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      senderRole: 'Certified Mentor',
      content: 'Welcome to all our new members who joined today! Don’t forget: consistency beats perfection. Even speaking 10 minutes a day changes everything. 🌟',
      timestamp: 'Today at 09:15 AM',
      reactions: { '❤️': ['usr_me_001', 'usr_maya_002'], '🔥': ['usr_fatima_004'] }
    },
    {
      id: 'msg_2',
      senderId: 'usr_maya_002',
      senderName: 'Maya Tanaka',
      senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
      content: 'Konbanwa from Tokyo! Just completed my 9-day streak. Who wants to practice casual conversational English in the voice circle later?',
      timestamp: 'Today at 10:20 AM',
      reactions: { '🙌': ['usr_me_001'] }
    },
    {
      id: 'msg_3',
      senderId: 'usr_me_001',
      senderName: 'Arian Islam',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      senderRole: 'Talkie Pro',
      content: 'I would love to! I am also setting up a 2-minute tech speaking challenge room in about an hour if anyone wants to join. 🎙️',
      timestamp: 'Today at 10:35 AM'
    }
  ]
};

export const INITIAL_CONVERSATIONS: DirectConversation[] = [
  {
    id: 'conv_maya',
    recipient: INITIAL_USERS[1],
    lastMessage: 'Thanks for the pronunciation tips! See you in the speaking room tomorrow.',
    lastMessageTime: '10:42 AM',
    unreadCount: 1,
    isPinned: true
  },
  {
    id: 'conv_fatima',
    recipient: INITIAL_USERS[3],
    lastMessage: 'Here is the IELTS cue card sample we practiced yesterday.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isPinned: false
  },
  {
    id: 'conv_lars',
    recipient: INITIAL_USERS[4],
    lastMessage: 'Awesome job on your C1 assessment! Proud of your progress.',
    lastMessageTime: 'Oct 12',
    unreadCount: 0,
    isPinned: false
  }
];

export const INITIAL_GAMES: SpeakingGame[] = [
  {
    id: 'game_word_guess',
    title: 'Word Guessing & Taboo',
    slug: 'taboo',
    description: 'Describe the secret word to your teammates without saying any of the 3 forbidden taboo words! Fast, hilarious, and builds vocabulary.',
    playersCount: '2-8 Players',
    minPlayers: 2,
    maxPlayers: 8,
    difficulty: 'All',
    category: 'Vocabulary & Fluency',
    rounds: 5,
    icon: '🤐'
  },
  {
    id: 'game_would_you_rather',
    title: 'Would You Rather? (Debate)',
    slug: 'would-you-rather',
    description: 'Pick between two impossible, absurd, or philosophical dilemmas and justify your reasoning in 60 seconds of fluent English!',
    playersCount: '2-12 Players',
    minPlayers: 2,
    maxPlayers: 12,
    difficulty: 'Intermediate',
    category: 'Reasoning & Spontaneity',
    rounds: 4,
    icon: '⚖️'
  },
  {
    id: 'game_two_truths',
    title: 'Two Truths & A Lie',
    slug: 'two-truths',
    description: 'Share three statements about yourself or your country. Other players interrogate you in English to uncover the sneaky lie.',
    playersCount: '3-10 Players',
    minPlayers: 3,
    maxPlayers: 10,
    difficulty: 'Beginner',
    category: 'Social Icebreaker',
    rounds: 3,
    icon: '🕵️‍♂️'
  },
  {
    id: 'game_topic_roulette',
    title: 'Topic Roulette',
    slug: 'topic-roulette',
    description: 'Spin the wheel of wild international questions. Speak continuously for 90 seconds on whatever unexpected topic lands!',
    playersCount: '1-6 Players',
    minPlayers: 1,
    maxPlayers: 6,
    difficulty: 'All',
    category: 'Spoken Fluency',
    rounds: 5,
    icon: '🎡'
  },
  {
    id: 'game_rapid_questions',
    title: 'Rapid Fire 60s',
    slug: 'rapid-questions',
    description: 'Answer as many rapid-fire questions as you can in 60 seconds without hesitating or using filler words like "um" or "uh".',
    playersCount: '1-4 Players',
    minPlayers: 1,
    maxPlayers: 4,
    difficulty: 'Advanced',
    category: 'Speed & Reflexes',
    rounds: 3,
    icon: '⚡'
  },
  {
    id: 'game_trivia',
    title: 'English & Global Culture Trivia',
    slug: 'trivia',
    description: 'Test your knowledge on English idioms, world geography, literary icons, and bizarre cultural traditions.',
    playersCount: '2-10 Players',
    minPlayers: 2,
    maxPlayers: 10,
    difficulty: 'Intermediate',
    category: 'Idioms & Knowledge',
    rounds: 6,
    icon: '🧠'
  }
];

export const CEFR_QUESTIONS: CEFRAssessmentQuestion[] = [
  {
    id: 1,
    type: 'grammar',
    skill: 'Grammar',
    question: 'Choose the correct sentence to express an unreal past situation:',
    options: [
      'If I studied harder, I would pass the exam.',
      'If I had studied harder, I would have passed the exam.',
      'If I would have studied harder, I passed the exam.',
      'If I had studied harder, I had passed the exam.'
    ],
    correctAnswer: 1,
    explanation: 'Third conditional uses "If + past perfect, would have + past participle" to talk about hypothetical past situations.'
  },
  {
    id: 2,
    type: 'multiple-choice',
    skill: 'Vocabulary',
    question: 'Select the word that best completes the sentence: "His argument was so _______ that even his staunchest critics were persuaded."',
    options: [
      'ambiguous',
      'lucid and compelling',
      'superfluous',
      'hesitant'
    ],
    correctAnswer: 1,
    explanation: '"Lucid and compelling" means clear and powerfully convincing, which fits persuading strict critics.'
  },
  {
    id: 3,
    type: 'listening',
    skill: 'Listening',
    question: 'Listen to the audio simulation: "Despite severe weather disruptions, the transatlantic flight managed to touch down ahead of schedule." What happened?',
    audioText: 'Despite severe weather disruptions, the transatlantic flight managed to touch down ahead of schedule.',
    options: [
      'The flight was cancelled due to a storm.',
      'The flight arrived earlier than planned despite bad weather.',
      'The plane was redirected to an alternative airport.',
      'The flight was significantly delayed.'
    ],
    correctAnswer: 1,
    explanation: '"Touch down ahead of schedule" means it landed earlier than expected.'
  },
  {
    id: 4,
    type: 'grammar',
    skill: 'Grammar',
    question: 'Identify the sentence with the correct inversion for dramatic emphasis:',
    options: [
      'Seldom I have witnessed such magnificent eloquence.',
      'Seldom have I witnessed such magnificent eloquence.',
      'Seldom did I witnessed such magnificent eloquence.',
      'Seldom had I witness such magnificent eloquence.'
    ],
    correctAnswer: 1,
    explanation: 'Negative adverbs like "seldom", "rarely", "hardly" at the start of a sentence require subject-auxiliary inversion: "Seldom have I witnessed".'
  },
  {
    id: 5,
    type: 'multiple-choice',
    skill: 'Vocabulary',
    question: 'What does the idiom "bite the bullet" mean in professional contexts?',
    options: [
      'To shoot down a colleague’s proposal abruptly',
      'To face an inevitable grim situation with courage and resolve',
      'To waste valuable resources on unnecessary projects',
      'To act hastily without proper deliberation'
    ],
    correctAnswer: 1,
    explanation: '"Bite the bullet" means to face a difficult or unpleasant situation that cannot be avoided.'
  },
  {
    id: 6,
    type: 'speaking-prompt',
    skill: 'Fluency',
    question: 'Spoken Fluency Task: Record or type a 45-second answer explaining what makes an effective international leader. (Analyzed for coherence, lexical range, and grammatical range).',
    explanation: 'Spoken response evaluated on vocabulary diversity, clear thesis statement, and structured discourse markers.'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'TAR-2026-B2901X',
    candidateName: 'Arian Islam',
    userId: 'usr_me_001',
    cefrLevel: 'B2',
    levelTitle: 'Upper-Intermediate English',
    scorePercentage: 82,
    issueDate: '2026-10-10',
    verificationCode: 'TAR-2026-B2901X',
    status: 'valid',
    issuer: 'Talkie AR Global Assessment Council',
    skills: [
      { name: 'Spoken Fluency & Coherence', score: 85 },
      { name: 'Lexical Resource & Idioms', score: 80 },
      { name: 'Grammatical Accuracy & Range', score: 82 },
      { name: 'Listening & Comprehension', score: 84 }
    ]
  },
  {
    id: 'TAR-2026-C1844M',
    candidateName: 'Carlos Mendez',
    userId: 'usr_carlos_003',
    cefrLevel: 'C1',
    levelTitle: 'Advanced English',
    scorePercentage: 91,
    issueDate: '2026-09-18',
    verificationCode: 'TAR-2026-C1844M',
    status: 'valid',
    issuer: 'Talkie AR Global Assessment Council',
    skills: [
      { name: 'Spoken Fluency & Coherence', score: 94 },
      { name: 'Lexical Resource & Idioms', score: 90 },
      { name: 'Grammatical Accuracy & Range', score: 92 },
      { name: 'Listening & Comprehension', score: 95 }
    ]
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'ev_1',
    title: '🎙️ Global Weekend Debate: Should AI Regulate Social Media?',
    description: 'Join our flagship moderated 3-on-3 debate. Teams will be assigned randomly. Audience Q&A following the closing arguments.',
    category: 'Debate',
    hostName: 'Carlos Mendez',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    startTime: 'Saturday, 18:00 UTC',
    durationMinutes: 90,
    attendeesCount: 42,
    isAttending: true,
    level: 'Upper-Intermediate',
    capacity: 60
  },
  {
    id: 'ev_2',
    title: '☕ Sunday International Language Exchange & Cultural Showcase',
    description: 'Meet 5 new partners in rotating 10-minute speed-conversations! Share your national holidays, folklore, and travel dreams.',
    category: 'Language Exchange',
    hostName: 'Lars Lindqvist',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    startTime: 'Sunday, 14:00 UTC',
    durationMinutes: 75,
    attendeesCount: 78,
    isAttending: false,
    level: 'All Levels',
    capacity: 100
  },
  {
    id: 'ev_3',
    title: '📝 IELTS Speaking Part 2 Masterclass & Live Mock Interviews',
    description: 'Certified mentors dissect real band 8+ responses. 4 volunteers will be invited onto the stage for live mock scoring.',
    category: 'Speaking Club',
    hostName: 'Fatima Al-Sayed',
    hostAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    startTime: 'Tuesday, 19:30 UTC',
    durationMinutes: 60,
    attendeesCount: 115,
    isAttending: true,
    level: 'Intermediate',
    capacity: 150
  }
];

export const INITIAL_VOCABULARY: VocabularyItem[] = [
  {
    id: 'voc_1',
    word: 'Eloquence',
    partOfSpeech: 'noun',
    phonetic: '/ˈel.ə.kwəns/',
    definition: 'Fluent or persuasive speaking or writing.',
    example: 'Her natural eloquence made the debate team unstoppable.',
    level: 'C1',
    mastered: true,
    nextReviewDate: '2026-10-20'
  },
  {
    id: 'voc_2',
    word: 'Ambiguous',
    partOfSpeech: 'adjective',
    phonetic: '/æmˈbɪɡ.ju.əs/',
    definition: 'Open to more than one interpretation; having a double meaning.',
    example: 'The politician gave an ambiguous reply to avoid taking sides.',
    level: 'B2',
    mastered: false,
    nextReviewDate: '2026-10-16'
  },
  {
    id: 'voc_3',
    word: 'Serendipity',
    partOfSpeech: 'noun',
    phonetic: '/ˌser.ənˈdɪp.ə.t̬i/',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
    example: 'Finding an English speaking partner while waiting for coffee was pure serendipity.',
    level: 'C2',
    mastered: true,
    nextReviewDate: '2026-10-25'
  },
  {
    id: 'voc_4',
    word: 'Articulate',
    partOfSpeech: 'adjective / verb',
    phonetic: '/ɑːrˈtɪk.jə.lət/',
    definition: 'Having or showing the ability to speak fluently and coherently.',
    example: 'She is an articulate advocate for bilingual education.',
    level: 'B2',
    mastered: false,
    nextReviewDate: '2026-10-15'
  }
];
