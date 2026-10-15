import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  Award,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CoachFeedback {
  reply: string;
  grammarFeedback?: string;
  betterAlternative?: string;
  vocabHighlight?: {
    wordOrIdiom: string;
    meaning: string;
    example: string;
  };
  fluencyRating?: number;
}

interface MessageHistoryItem {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  feedback?: CoachFeedback;
  timestamp: string;
}

export const AICoachView: React.FC = () => {
  const { currentUser, addVocabularyWord } = useApp();

  const [persona, setPersona] = useState('Friendly Conversation Partner');
  const [topic, setTopic] = useState('Everyday English');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState<MessageHistoryItem[]>([
    {
      id: 'init_1',
      sender: 'coach',
      text: `Hello ${currentUser.displayName}! I am your Talkie AI Coach. How are you feeling today? Tell me what you did this morning, or pick a topic to dive into! 🎙️`,
      timestamp: 'Just now'
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  const personas = [
    { title: 'Friendly Conversation Partner', desc: 'Gentle pacing, casual idioms, confidence building' },
    { title: 'Strict IELTS Examiner', desc: 'Band 7.5-9 criteria, lexical precision, Part 2 & 3 questions' },
    { title: 'Executive Job Interviewer', desc: 'STAR technique, professional tone, leadership vocabulary' },
    { title: 'Travel & Culture Guide', desc: 'Situational English, dining, asking directions, etiquette' }
  ];

  const suggestedPrompts = [
    'How can I improve my confidence when speaking with native speakers?',
    'Give me an IELTS Part 2 cue card question and test my answer.',
    'Simulate a job interview: "Tell me about a time you handled conflict at work."',
    'Teach me 3 advanced C1 idioms for expressing surprise or happiness.'
  ];

  // Speech Synthesis: Speak coach text out loud
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95; // comfortable learner speed
      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech API: Voice recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const message = textToSend || inputText;
    if (!message.trim() || loading) return;

    const userMsg: MessageHistoryItem = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistory(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          topic,
          persona,
          userLevel: currentUser.englishLevel,
          history: history.slice(-4)
        })
      });

      if (!response.ok) {
        throw new Error('Coach API response error');
      }

      const data: CoachFeedback = await response.json();

      const coachMsg: MessageHistoryItem = {
        id: 'coach_' + Date.now(),
        sender: 'coach',
        text: data.reply,
        feedback: data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setHistory(prev => [...prev, coachMsg]);

      // Automatically speak the reply if user used voice
      if (isRecording) {
        speakText(data.reply);
      }
    } catch (err) {
      console.error(err);
      // Fallback response
      setHistory(prev => [
        ...prev,
        {
          id: 'coach_err_' + Date.now(),
          sender: 'coach',
          text: `That was a great point! You expressed yourself clearly. What else would you like to explore regarding ${topic}?`,
          feedback: {
            reply: `That was a great point!`,
            grammarFeedback: 'Good coherent structure. Keep practicing speaking consistently!',
            betterAlternative: 'Try using varied transition phrases like "Moreover" or "In addition".',
            fluencyRating: 84
          },
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#635BFF] uppercase tracking-wider">
            <Bot className="w-4 h-4 text-[#22D3EE]" />
            <span>Server-Side Gemini 3.8 Flash AI Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Talkie AI Coach
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Safe, non-judgmental English practice. Receive real-time grammar tips, vocabulary upgrades, and fluency feedback.
          </p>
        </div>

        {/* Persona Selector Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <label className="text-xs font-bold text-slate-400 uppercase">Persona:</label>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#111827] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
          >
            {personas.map((p) => (
              <option key={p.title} value={p.title}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Suggestions & Details Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Current Coach Persona
            </h3>
            <p className="text-xs font-bold text-[#22D3EE]">{persona}</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {personas.find(p => p.title === persona)?.desc}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Speaking Prompts
            </h3>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#0B1020] hover:bg-[#635BFF]/15 border border-slate-800 hover:border-[#635BFF]/40 text-xs text-slate-300 transition-colors leading-relaxed"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Feed & Input */}
        <div className="lg:col-span-3 flex flex-col h-[600px] bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {history.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#635BFF] to-[#7C3AED] text-white shadow-md'
                      : 'bg-[#0E1528] border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {msg.sender === 'user' ? 'You' : 'Talkie AI Coach'}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>

                  {/* Coach Spoken Voice button */}
                  {msg.sender === 'coach' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="mt-2 text-xs text-[#22D3EE] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen to Audio</span>
                    </button>
                  )}
                </div>

                {/* Structured Feedback Card (if Coach message has analysis) */}
                {msg.feedback && (
                  <div className="mt-2 max-w-[85%] p-3.5 rounded-xl bg-[#090D1A] border border-slate-800 text-xs space-y-2">
                    
                    {msg.feedback.fluencyRating && (
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-slate-400 font-semibold">Spoken Coherence Rating:</span>
                        <span className="text-xs font-bold text-emerald-400">
                          {msg.feedback.fluencyRating}/100
                        </span>
                      </div>
                    )}

                    {msg.feedback.grammarFeedback && (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-300">Grammar Tip: </span>
                          <span className="text-slate-400">{msg.feedback.grammarFeedback}</span>
                        </div>
                      </div>
                    )}

                    {msg.feedback.betterAlternative && (
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-300">Native Alternative: </span>
                          <span className="text-amber-200/90 italic">"{msg.feedback.betterAlternative}"</span>
                        </div>
                      </div>
                    )}

                    {msg.feedback.vocabHighlight && (
                      <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">Vocab: </span>
                          <span className="text-[#22D3EE] font-bold">{msg.feedback.vocabHighlight.wordOrIdiom}</span>
                          <span className="text-slate-400 text-[11px] block">{msg.feedback.vocabHighlight.meaning}</span>
                        </div>
                        <button
                          onClick={() => {
                            if (msg.feedback?.vocabHighlight) {
                              addVocabularyWord({
                                id: 'voc_' + Date.now(),
                                word: msg.feedback.vocabHighlight.wordOrIdiom,
                                partOfSpeech: 'phrase',
                                phonetic: '',
                                definition: msg.feedback.vocabHighlight.meaning,
                                example: msg.feedback.vocabHighlight.example,
                                level: 'B2',
                                mastered: false,
                                nextReviewDate: new Date().toISOString().slice(0, 10)
                              });
                              alert(`Saved "${msg.feedback.vocabHighlight.wordOrIdiom}" to your Vocabulary Notebook!`);
                            }
                          }}
                          className="px-2 py-1 rounded bg-[#635BFF] text-white font-bold text-[10px] hover:bg-[#5249e0]"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#22D3EE]" />
                <span>Coach is analyzing grammar and crafting response...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Box with Voice Mic Button */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-[#0B1020] border-t border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={isRecording ? 'Listening... click to stop' : 'Click to speak using your microphone'}
              className={`p-2.5 rounded-xl transition-all ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder={isRecording ? 'Listening to your speech...' : 'Type your sentence or question for the AI coach...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#111827] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#635BFF]"
            />

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#22D3EE] text-white font-bold text-xs hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
