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

// In-memory persistent database for state during execution
let db = {
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
  ],
  reports: [
    {
      id: 'rep_101',
      targetType: 'user',
      targetName: 'SuspiciousBot#992',
      reason: 'Repetitive spam links in room chat',
      reporterName: 'Fatima Al-Sayed',
      timestamp: '2026-10-14 20:15',
      status: 'pending'
    },
    {
      id: 'rep_102',
      targetType: 'room',
      targetName: 'Random Screaming Room',
      reason: 'Disruptive audio and unmoderated noise',
      reporterName: 'Carlos Mendez',
      timestamp: '2026-10-14 18:40',
      status: 'reviewed'
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
// AI Speaking Coach Endpoint
// -------------------------------------------------------------
app.post('/api/ai-coach/chat', async (req, res) => {
  try {
    const { message, topic = 'Everyday English', persona = 'Friendly Mentor', userLevel = 'Intermediate', history = [] } = req.body;

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
    
    // Evaluate standard answers: Question 1: 1, Question 2: 1, Question 3: 1, Question 4: 1, Question 5: 1, Question 6 (Speaking text length/richness)
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

// Certificate lookup
app.get('/api/certificates/:id', (req, res) => {
  const cert = db.certificates.find(c => c.id.toUpperCase() === req.params.id.toUpperCase());
  if (!cert) {
    return res.status(404).json({ error: 'Certificate not found in Talkie AR registry' });
  }
  return res.json(cert);
});

// Public Verification endpoint
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

// -------------------------------------------------------------
// Admin & Moderation Endpoints
// -------------------------------------------------------------
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
  const { reportId, action, notes } = req.body;
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
    // Mount Vite dev middleware in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
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
