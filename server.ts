import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface ServerRoom {
  id: string;
  title: string;
  description: string;
  topic: string;
  category: string;
  language: string;
  level: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostCountryCode: string;
  capacity: number;
  isPrivate: boolean;
  password?: string;
  rules?: string;
  isBeginnerFriendly: boolean;
  speakingMode: string;
  status: 'active' | 'closed';
  timerSeconds?: number;
  activeTopicPrompt?: string;
  participants: any[];
  tags: string[];
  createdAt: string;
}

// In-memory persistent database
let db = {
  users: [
    {
      id: 'usr_me_001',
      username: 'arian_global',
      displayName: 'Arian Islam',
      email: 'arian@talkiear.com',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      country: 'Bangladesh',
      countryCode: 'BD',
      nativeLanguage: 'Bengali',
      targetLanguage: 'English',
      englishLevel: 'Upper-Intermediate',
      cefrLevel: 'B2',
      bio: 'Software engineer & English speaker. Practicing for conferences and tech debates!',
      streakDays: 14,
      totalPracticeMinutes: 840,
      isPremium: false,
      role: 'user',
      presence: 'online',
      customStatus: 'Practicing for conference debate 🎙️'
    },
    {
      id: 'usr_maya_002',
      username: 'maya_tokyo',
      displayName: 'Maya Tanaka',
      email: 'maya@talkiear.com',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
      country: 'Japan',
      countryCode: 'JP',
      nativeLanguage: 'Japanese',
      targetLanguage: 'English',
      englishLevel: 'Intermediate',
      cefrLevel: 'B1',
      bio: 'Tokyo graphic designer preparing for international freelance projects.',
      streakDays: 9,
      totalPracticeMinutes: 420,
      isPremium: false,
      role: 'user',
      presence: 'online',
      customStatus: 'Coffee & English practice ☕'
    },
    {
      id: 'usr_carlos_003',
      username: 'carlos_madrid',
      displayName: 'Carlos Mendez',
      email: 'carlos@talkiear.com',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      country: 'Spain',
      countryCode: 'ES',
      nativeLanguage: 'Spanish',
      targetLanguage: 'English',
      englishLevel: 'Advanced',
      cefrLevel: 'C1',
      bio: 'Hospital doctor in Madrid looking to master international presentations.',
      streakDays: 28,
      totalPracticeMinutes: 1650,
      isPremium: true,
      role: 'mentor',
      presence: 'online',
      customStatus: 'Hosting Science Club tonight'
    }
  ],
  rooms: <ServerRoom[]>[
    {
      id: 'rm_ielts_01',
      title: '🎯 IELTS Speaking Band 7.5+ Practice & Feedback',
      description: 'We take turns answering Part 2 cue cards and Part 3 abstract questions. Friendly feedback on vocabulary, fluency, and coherence.',
      topic: 'Cue Cards: Describe an ambitious project you completed',
      category: 'IELTS Practice',
      language: 'English',
      level: 'Upper-Intermediate',
      hostId: 'usr_carlos_003',
      hostName: 'Carlos Mendez',
      hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      hostCountryCode: 'ES',
      capacity: 6,
      isPrivate: false,
      isBeginnerFriendly: false,
      speakingMode: 'interview',
      status: 'active',
      timerSeconds: 120,
      activeTopicPrompt: 'Describe a memorable journey you went on. Say where you went and why it was memorable.',
      participants: [
        {
          userId: 'usr_carlos_003',
          displayName: 'Carlos Mendez',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
          countryCode: 'ES',
          level: 'Advanced',
          role: 'host',
          isMuted: false,
          isDeafened: false,
          isSpeaking: true,
          raisedHand: false,
          joinedAt: '2026-10-14T21:42:00Z'
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
        }
      ],
      tags: ['IELTS', 'Exam Prep', 'Cue Cards'],
      createdAt: '2026-10-14T21:30:00Z'
    },
    {
      id: 'rm_coffee_02',
      title: '☕ Cozy Morning Coffee & Casual Chats (All Levels)',
      description: 'No pressure, zero judgment! Grab your favorite drink, share how your week went, discuss favorite foods.',
      topic: 'What is your absolute favorite comfort food from your country?',
      category: 'Everyday English',
      language: 'English',
      level: 'All Levels',
      hostId: 'usr_maya_002',
      hostName: 'Maya Tanaka',
      hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
      hostCountryCode: 'JP',
      capacity: 8,
      isPrivate: false,
      isBeginnerFriendly: true,
      speakingMode: 'free',
      status: 'active',
      activeTopicPrompt: 'Introduce yourself and share what dish you crave when tired!',
      participants: [
        {
          userId: 'usr_maya_002',
          displayName: 'Maya Tanaka',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
          countryCode: 'JP',
          level: 'Intermediate',
          role: 'host',
          isMuted: false,
          isDeafened: false,
          isSpeaking: false,
          raisedHand: false,
          joinedAt: '2026-10-14T21:50:00Z'
        }
      ],
      tags: ['Casual', 'Beginner Friendly', 'Food'],
      createdAt: '2026-10-14T21:48:00Z'
    }
  ],
  roomMessages: {} as Record<string, any[]>,
  certificates: [
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
    }
  ],
  reports: [
    {
      id: 'rep_101',
      targetType: 'user',
      targetName: 'SuspiciousBot#992',
      reason: 'Repetitive spam links in room chat',
      reporterName: 'Carlos Mendez',
      timestamp: '2026-10-14 20:15',
      status: 'pending'
    }
  ],
  stats: {
    activeUsersNow: 482,
    liveSpeakingRoomsCount: 34,
    totalSessionsToday: 1290,
    practiceMinutesToday: 24500,
    certificatesIssued: 412
  }
};

// Initialize Gemini SDK if API key is present
let geminiAi: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiAi = new GoogleGenAI();
  } catch (err) {
    console.warn('Could not initialize Gemini SDK:', err);
  }
}

// -------------------------------------------------------------
// Authentication Endpoints (Open Registration & Login)
// -------------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  const { username, email, displayName, password, country = 'United States', countryCode = 'US', englishLevel = 'Intermediate' } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required.' });
  }

  const existing = db.users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Username or email already in use.' });
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    username: username.trim().toLowerCase(),
    displayName: displayName?.trim() || username.trim(),
    email: email.trim().toLowerCase(),
    password: password || 'password123',
    avatar: `https://images.unsplash.com/photo-${1534528741775 + (db.users.length * 1000)}?auto=format&fit=crop&w=250&q=80`,
    country,
    countryCode,
    nativeLanguage: 'English',
    targetLanguage: 'English',
    englishLevel: englishLevel as any,
    cefrLevel: 'B1' as any,
    bio: 'New global learner ready to speak!',
    streakDays: 1,
    totalPracticeMinutes: 0,
    isPremium: false,
    role: 'user' as const,
    presence: 'online' as const,
    customStatus: 'Ready to speak!'
  };

  db.users.push(newUser);
  return res.json({ success: true, user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { usernameOrEmail } = req.body;
  if (!usernameOrEmail) {
    return res.status(400).json({ error: 'Username or email is required.' });
  }

  const user = db.users.find(u => 
    u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
    u.email.toLowerCase() === usernameOrEmail.toLowerCase()
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found. Try registering a new account!' });
  }

  return res.json({ success: true, user });
});

app.get('/api/users', (req, res) => {
  return res.json(db.users.map(({ password, ...u }) => u));
});

// -------------------------------------------------------------
// Speaking Rooms Endpoints (Free4Talk-Style Core)
// -------------------------------------------------------------
app.get('/api/rooms', (req, res) => {
  // Return all active rooms
  const activeRooms = db.rooms.filter(r => r.status !== 'closed');
  return res.json(activeRooms);
});

app.post('/api/rooms', (req, res) => {
  const {
    title,
    topic,
    description,
    category = 'Everyday English',
    language = 'English',
    level = 'All Levels',
    capacity = 6,
    isPrivate = false,
    password,
    rules,
    isBeginnerFriendly = true,
    speakingMode = 'free',
    hostUser
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Room title is required.' });
  }

  const host = hostUser || db.users[0];

  const newRoom = {
    id: 'rm_' + Date.now(),
    title: title.trim(),
    description: description?.trim() || 'Open spoken conversation. Jump in and say hello!',
    topic: topic?.trim() || 'General conversation & cultural exchange',
    category,
    language,
    level,
    hostId: host.id,
    hostName: host.displayName,
    hostAvatar: host.avatar,
    hostCountryCode: host.countryCode || 'US',
    capacity: Math.min(12, Math.max(2, parseInt(capacity) || 6)),
    isPrivate: !!isPrivate,
    password: password ? String(password).trim() : undefined,
    rules: rules ? String(rules).trim() : undefined,
    isBeginnerFriendly: !!isBeginnerFriendly,
    speakingMode: speakingMode as any,
    status: 'active' as const,
    activeTopicPrompt: topic || 'Share your thoughts and experiences!',
    participants: [
      {
        userId: host.id,
        displayName: host.displayName,
        avatar: host.avatar,
        countryCode: host.countryCode || 'US',
        level: host.englishLevel || 'Intermediate',
        role: 'host' as const,
        isMuted: false,
        isDeafened: false,
        isSpeaking: false,
        raisedHand: false,
        joinedAt: new Date().toISOString()
      }
    ],
    tags: [category, language, level],
    createdAt: new Date().toISOString()
  };

  db.rooms.unshift(newRoom);
  return res.json({ success: true, room: newRoom });
});

app.get('/api/rooms/:id', (req, res) => {
  const room = db.rooms.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found.' });
  }
  return res.json(room);
});

app.post('/api/rooms/:id/join', (req, res) => {
  const { user, password } = req.body;
  if (!user || !user.id) {
    return res.status(401).json({ error: 'Authentication required to join speaking room.' });
  }

  const room = db.rooms.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found.' });
  }

  if (room.status === 'closed') {
    return res.status(410).json({ error: 'This room has been closed by the host.' });
  }

  // Capacity check
  if (room.participants.length >= room.capacity) {
    return res.status(403).json({ error: 'Room is at full capacity. Please try another room or create your own.' });
  }

  // Password check for private rooms
  if (room.isPrivate && room.password) {
    if (room.password !== password) {
      return res.status(403).json({ error: 'Incorrect room password.' });
    }
  }

  // Check if already in room
  const alreadyIn = room.participants.some(p => p.userId === user.id);
  if (!alreadyIn) {
    room.participants.push({
      userId: user.id,
      displayName: user.displayName,
      avatar: user.avatar,
      countryCode: user.countryCode || 'US',
      level: user.englishLevel || 'Intermediate',
      role: 'speaker',
      isMuted: false,
      isDeafened: false,
      isSpeaking: false,
      raisedHand: false,
      joinedAt: new Date().toISOString()
    });
  }

  return res.json({ success: true, room });
});

app.post('/api/rooms/:id/leave', (req, res) => {
  const { userId } = req.body;
  const room = db.rooms.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found.' });
  }

  room.participants = room.participants.filter(p => p.userId !== userId);
  return res.json({ success: true, room });
});

app.post('/api/rooms/:id/close', (req, res) => {
  const { hostId } = req.body;
  const room = db.rooms.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found.' });
  }

  if (room.hostId !== hostId) {
    return res.status(403).json({ error: 'Only the room creator/host can close this room.' });
  }

  room.status = 'closed';
  room.participants = [];
  return res.json({ success: true, message: 'Room successfully closed.' });
});

// In-room Chat Messages
app.get('/api/rooms/:id/messages', (req, res) => {
  const messages = db.roomMessages[req.params.id] || [];
  return res.json(messages);
});

app.post('/api/rooms/:id/messages', (req, res) => {
  const { senderId, senderName, senderAvatar, content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  const newMsg = {
    id: 'rmsg_' + Date.now(),
    roomId: req.params.id,
    senderId,
    senderName,
    senderAvatar,
    content: content.trim(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  if (!db.roomMessages[req.params.id]) {
    db.roomMessages[req.params.id] = [];
  }
  db.roomMessages[req.params.id].push(newMsg);

  return res.json({ success: true, message: newMsg });
});

// -------------------------------------------------------------
// AI Speaking Coach Endpoint
// -------------------------------------------------------------
app.post('/api/ai-coach/chat', async (req, res) => {
  try {
    const { message, topic = 'Everyday English', persona = 'Friendly Mentor', userLevel = 'Intermediate' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (geminiAi && process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are "Talkie AI Coach", an empathetic, highly skilled international English conversation coach in Talkie AR.
Persona: ${persona}.
Topic: ${topic}.
Learner Level: ${userLevel}.

Provide your response strictly in the following JSON format:
{
  "reply": "Your natural, encouraging, spoken-style conversational reply (2-4 sentences max). Always ask a follow-up question to keep the conversation flowing naturally.",
  "grammarFeedback": "One specific, constructive grammar tip or correction from the user's sentence, or state 'Great grammar and structure!' if flawless.",
  "betterAlternative": "A more natural, native-sounding alternative or higher-CEFR phrasing of what they said.",
  "vocabHighlight": {
    "wordOrIdiom": "A useful, idiomatic word or phrase relevant to this topic",
    "meaning": "Brief explanation",
    "example": "Short example sentence"
  },
  "fluencyRating": 88
}`;

        const prompt = `${systemPrompt}\n\nLearner said: "${message}"\n\nJSON output:`;
        const response = await geminiAi.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const text = response.text?.trim() || '';
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch (geminiError) {
        console.warn('Gemini generateContent error, falling back to smart local coach:', geminiError);
      }
    }

    // Intelligent conversational fallback when Gemini is unavailable
    const fallbackResponses = [
      {
        reply: `That is a really interesting perspective on ${topic}! I love how clearly you communicated your main idea. What first sparked your interest in this subject?`,
        grammarFeedback: message.toLowerCase().includes('i am agree') 
          ? 'Notice: In English we say "I agree" rather than "I am agree".'
          : 'Your sentence structure was clear and easy to understand!',
        betterAlternative: `Rather than a basic phrase, you could say: "From my standpoint, ${topic} offers remarkable opportunities."`,
        vocabHighlight: {
          wordOrIdiom: 'Persuasive',
          meaning: 'Good at making someone do or believe something through reasoning',
          example: 'Her persuasive arguments convinced the entire debate audience.'
        },
        fluencyRating: 85
      },
      {
        reply: `Spot on! You expressed your thoughts with great coherence. In international settings, being able to articulate that so smoothly is a huge asset. How do people in your country usually approach this?`,
        grammarFeedback: 'Good flow! Try using linking words like "Consequently" or "Furthermore" to connect your arguments.',
        betterAlternative: `A sophisticated alternative: "It is widely acknowledged that this creates substantial impact."`,
        vocabHighlight: {
          wordOrIdiom: 'In a nutshell',
          meaning: 'In a very clear, brief way',
          example: 'In a nutshell, consistent daily practice leads to rapid fluency.'
        },
        fluencyRating: 88
      }
    ];

    const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return res.json(randomFallback);
  } catch (error) {
    console.error('Error in /api/ai-coach/chat:', error);
    return res.status(500).json({ error: 'Internal coach error' });
  }
});

// -------------------------------------------------------------
// CEFR Assessment & Certificate Verification Endpoints
// -------------------------------------------------------------
app.post('/api/assessments/submit', (req, res) => {
  try {
    const { userName, answers, totalQuestions = 6 } = req.body;
    let correctCount = 0;
    
    if (answers[1] === 1) correctCount++;
    if (answers[2] === 1) correctCount++;
    if (answers[3] === 1) correctCount++;
    if (answers[4] === 1) correctCount++;
    if (answers[5] === 1) correctCount++;
    if (answers[6] && String(answers[6]).trim().length > 20) correctCount++;

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    let cefrLevel = 'B1';
    let levelTitle = 'Intermediate English';

    if (scorePercentage >= 90) {
      cefrLevel = 'C2';
      levelTitle = 'Proficient Mastery';
    } else if (scorePercentage >= 80) {
      cefrLevel = 'C1';
      levelTitle = 'Advanced English';
    } else if (scorePercentage >= 65) {
      cefrLevel = 'B2';
      levelTitle = 'Upper-Intermediate English';
    } else if (scorePercentage >= 50) {
      cefrLevel = 'B1';
      levelTitle = 'Intermediate English';
    } else {
      cefrLevel = 'A2';
      levelTitle = 'Elementary English';
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateId = `TAR-2026-${randomSuffix}`;

    const newCert = {
      id: certificateId,
      candidateName: userName || 'Arian Islam',
      userId: 'usr_me_001',
      cefrLevel: cefrLevel as any,
      levelTitle: levelTitle,
      scorePercentage: scorePercentage,
      issueDate: new Date().toISOString().slice(0, 10),
      verificationCode: certificateId,
      status: 'valid' as const,
      issuer: 'Talkie AR Global Assessment Council',
      skills: [
        { name: 'Spoken Fluency & Coherence', score: Math.min(98, scorePercentage + 4) },
        { name: 'Lexical Resource & Idioms', score: Math.min(95, scorePercentage + 2) },
        { name: 'Grammatical Accuracy & Range', score: Math.min(96, scorePercentage) },
        { name: 'Listening & Comprehension', score: Math.min(99, scorePercentage + 5) }
      ]
    };

    db.certificates.unshift(newCert);
    db.stats.certificatesIssued++;

    return res.json({
      success: true,
      result: {
        score: correctCount,
        maxScore: totalQuestions,
        percentage: scorePercentage,
        cefrLevel,
        levelTitle,
        certificate: newCert
      }
    });
  } catch (err) {
    console.error('Error submitting assessment:', err);
    return res.status(500).json({ error: 'Assessment submission failed' });
  }
});

app.get('/api/certificates/:id', (req, res) => {
  const cert = db.certificates.find(c => c.id.toUpperCase() === req.params.id.toUpperCase());
  if (!cert) {
    return res.status(404).json({ error: 'Certificate not found in Talkie AR registry' });
  }
  return res.json(cert);
});

app.get('/api/verify/:id', (req, res) => {
  const cert = db.certificates.find(c => c.id.toUpperCase() === req.params.id.toUpperCase());
  if (!cert) {
    return res.json({
      verified: false,
      message: 'Certificate ID not found or may have been revoked.',
      certificateId: req.params.id
    });
  }
  return res.json({
    verified: true,
    certificate: cert,
    verifiedAt: new Date().toISOString()
  });
});

app.get('/api/admin/metrics', (req, res) => {
  return res.json({
    ...db.stats,
    reportsPending: db.reports.filter(r => r.status === 'pending').length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/admin/reports', (req, res) => {
  return res.json(db.reports);
});

app.post('/api/admin/moderate', (req, res) => {
  const { reportId, action } = req.body;
  const rep = db.reports.find(r => r.id === reportId);
  if (rep) {
    rep.status = 'resolved';
  }
  return res.json({ success: true, message: `Action "${action}" recorded in audit trail.` });
});

// -------------------------------------------------------------
// Dev & Production Serving
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Talkie AR Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
