import React, { useState } from 'react';
import {
  Mic,
  Users,
  Compass,
  Gamepad2,
  Bot,
  Award,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Globe2,
  MessageCircle,
  HelpCircle,
  Flame,
  Volume2,
  Check,
  ArrowRight,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LandingPageProps {
  navigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  const { speakingRooms, joinRoom, currentUser } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does Talkie AR work?',
      a: 'Talkie AR connects English learners worldwide in live voice rooms, Discord-style community servers, interactive speaking games, and structured AI coaching sessions. You can drop in to practice conversational English anytime without booking weeks in advance.'
    },
    {
      q: 'Is Talkie AR free to use?',
      a: 'Yes! Core live speaking rooms, community servers, basic vocabulary tools, and games are free for all members. Talkie Pro is an optional upgrade offering unlimited AI Coach analysis, advanced profile customizations, and priority community event features.'
    },
    {
      q: 'Can beginners join, or is it only for fluent speakers?',
      a: 'Talkie AR welcomes all levels! We have dedicated Beginner-Friendly rooms with patient hosts, speed-controlled prompts, and supportive moderators where you can start by listening before taking the mic.'
    },
    {
      q: 'Are the CEFR certificates verified?',
      a: 'Yes. Each Talkie AR certificate comes with a cryptographically verifiable ID (e.g. TAR-2026-B2901X) and public lookup URL backed by your evaluated diagnostic performance in grammar, vocabulary, listening, and spoken fluency.'
    },
    {
      q: 'How does Talkie AR ensure community safety?',
      a: 'We operate 24/7 proactive moderation, host mute/kick controls, one-click block & report workflows, and strict anti-harassment community guidelines. We do not tolerate hate speech or unsolicited harassment.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 selection:bg-[#635BFF] selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-slate-800/80">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#635BFF]/20 via-[#22D3EE]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#A855F7]/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Live Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#635BFF]/15 border border-[#635BFF]/35 text-[#22D3EE] text-xs font-semibold mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Over 34 Live International Rooms Active Right Now</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none">
              Speak English.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#635BFF] to-[#A855F7]">
                Meet the World.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Practice English with real people around the world, join live voice rooms, build global friendships, play interactive speaking games, and grow your confidence every day.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('rooms')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#635BFF] via-[#7C3AED] to-[#22D3EE] hover:opacity-95 shadow-xl shadow-[#635BFF]/30 transition-all flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>Start Speaking Free</span>
              </button>
              <button
                onClick={() => navigate('rooms')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#22D3EE]" />
                <span>Explore Live Rooms</span>
              </button>
            </div>

            {/* Micro proof points */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant microphone testing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Beginner friendly</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Hero Visual Preview */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#111827]/80 backdrop-blur-xl p-4 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="font-mono text-[11px] text-slate-400 ml-2">talkiear.app/live-hub</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Audio Stream Active</span>
              </div>
            </div>

            {/* Featured Room Preview Card */}
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-[#0B1020]/90 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/30 px-2.5 py-0.5 rounded-full">
                      🎯 Featured IELTS Masterclass
                    </span>
                    <span className="text-xs text-slate-400">6/8 Speakers</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-3">
                    Part 2 Cue Cards & Fast Abstract Feedback Round
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Topic: "Describe a challenge you solved creatively." Practice organizing thoughts in 60s and speaking clearly for 2 minutes.
                  </p>
                </div>

                {/* Stage Speakers Visualization */}
                <div className="mt-6">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Speakers on Stage:
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-emerald-500/50">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                          alt="Fatima"
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-white">🎙️</span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white leading-tight">Fatima (Host)</p>
                        <p className="text-[10px] text-emerald-400 font-semibold">Speaking now...</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                        alt="Carlos"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-200 leading-tight">Carlos (Madrid)</p>
                        <p className="text-[10px] text-slate-400">Queue: #2</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                      <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                        alt="Maya"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-200 leading-tight">Maya (Tokyo)</p>
                        <p className="text-[10px] text-slate-400">Listener</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Volume2 className="w-4 h-4 text-[#22D3EE]" />
                    <span>Real-time Web Audio rendering</span>
                  </div>
                  <button
                    onClick={() => {
                      if (speakingRooms[0]) joinRoom(speakingRooms[0]);
                      navigate('rooms');
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5249e0] transition-colors"
                  >
                    Join Speaking Room
                  </button>
                </div>
              </div>

              {/* Learning Progress & AI Coach Mini Widget */}
              <div className="bg-[#0B1020]/90 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      14-Day Streak
                    </span>
                    <span className="text-xs text-slate-400">B2 Assessed</span>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#635BFF]/20 text-[#22D3EE] flex items-center justify-center font-bold text-xs">
                        🤖
                      </div>
                      <p className="text-xs font-bold text-white">Talkie AI Coach Feedback</p>
                    </div>
                    <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
                      "Instead of saying 'I have much problems with words', try: 'I frequently encounter lexical hesitation in abstract topics'."
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => navigate('ai-coach')}
                    className="w-full py-2 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span>Practice with AI Coach</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: LIVE ROOMS HAPPENING NOW */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#22D3EE] uppercase tracking-wider">
              <Mic className="w-3.5 h-3.5" />
              <span>Instant Drop-in Voice</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Live Speaking Rooms Happening Now
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Drop in, listen to global perspectives, or unmute when you feel comfortable.
            </p>
          </div>
          <button
            onClick={() => navigate('rooms')}
            className="text-xs sm:text-sm font-bold text-[#22D3EE] hover:text-[#635BFF] transition-colors flex items-center gap-1"
          >
            <span>View All 34 Rooms</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {speakingRooms.slice(0, 3).map((room) => (
            <div
              key={room.id}
              className="bg-[#111827] rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {room.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#22D3EE]" />
                    {room.participants.length}/{room.capacity}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-3 group-hover:text-[#22D3EE] transition-colors line-clamp-2">
                  {room.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {room.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={room.hostAvatar}
                    alt={room.hostName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-slate-300 font-medium truncate max-w-[100px]">
                    {room.hostName}
                  </span>
                </div>
                <button
                  onClick={() => {
                    joinRoom(room);
                    navigate('rooms');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5249e0] transition-colors"
                >
                  Join Room
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION: THE 6 CORE PRODUCT PILLARS */}
      <section className="py-16 bg-[#0E1528] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#22D3EE] uppercase tracking-wider">
              Comprehensive Platform
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Everything You Need to Master Spoken English
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Combining live international conversation with community structure and smart learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-[#635BFF]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#635BFF]/20 text-[#635BFF] flex items-center justify-center mb-4">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">1. Live Speaking Rooms</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Topic-focused audio rooms with creative modes: 2-Minute Speaking Challenge, Debate arena, and IELTS cue cards.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-[#22D3EE]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/20 text-[#22D3EE] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">2. Discord-Style Communities</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Join servers with dedicated text channels, voice stages, grammar forums, announcement feeds, and study circles.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-[#A855F7]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#A855F7]/20 text-[#A855F7] flex items-center justify-center mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">3. Talkie AI Speaking Coach</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Receive instant grammar tips, native alternative phrasings, and vocabulary enhancements without judgment.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-amber-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">4. Multiplayer Speaking Games</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Play Word Guessing (Taboo), Would You Rather?, Two Truths & A Lie, and Topic Roulette with timed rounds and points.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-emerald-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">5. Global Partner Discovery</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Filter conversation partners by English proficiency (A1-C2), mutual interests, goals, and matching time zones.
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-[#F5C451]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#F5C451]/20 text-[#F5C451] flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">6. Verifiable CEFR Certificates</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Demonstrate your validated speaking milestone with a verifiable ID, QR code, and skills diagnostic breakdown.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECTION: FREE VS PREMIUM PLAN COMPARISON */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#F5C451] uppercase tracking-wider">
            Transparent Membership
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Choose Your Speaking Path
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Safety, blocking, and core live rooms will always remain completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Free Tier */}
          <div className="rounded-2xl p-6 sm:p-8 bg-[#111827] border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Community Citizen
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">Talkie Free</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-400">/ forever</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Ideal for learners looking to drop into live speaking rooms and practice with friends.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited public live speaking rooms</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Join community servers & text channels</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multiplayer speaking games (Taboo, Roulette)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct messages & friend requests</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Diagnostic CEFR level assessment</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate('rooms')}
              className="mt-8 w-full py-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              Start Speaking Free
            </button>
          </div>

          {/* Premium Pro Tier */}
          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#161F37] to-[#111827] border-2 border-[#635BFF] relative shadow-2xl flex flex-col justify-between">
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#635BFF] to-[#A855F7] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Recommended
            </div>

            <div>
              <span className="text-xs font-bold text-[#22D3EE] uppercase tracking-wider">
                Serious Fluency
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">Talkie Pro</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">$9.99</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-300 mt-2">
                For exam candidates, professionals, and dedicated learners targeting rapid fluency.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22D3EE] shrink-0" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22D3EE] shrink-0" />
                  <span>Unlimited AI Coach analysis with Gemini 3.8</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22D3EE] shrink-0" />
                  <span>Official verifiable CEFR certificate & PDF download</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22D3EE] shrink-0" />
                  <span>Premium Gold cosmetic badge & custom room themes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22D3EE] shrink-0" />
                  <span>Priority stage queue in large weekend debate events</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate('premium')}
              className="mt-8 w-full py-3 rounded-xl text-xs font-bold text-slate-900 bg-gradient-to-r from-[#F5C451] via-[#FBBF24] to-[#F59E0B] hover:brightness-110 shadow-lg shadow-[#F5C451]/20 transition-all"
            >
              Upgrade to Talkie Pro
            </button>
          </div>

        </div>
      </section>

      {/* 5. SECTION: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 bg-[#0E1528] border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Everything you need to know about Talkie AR.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#111827] border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-[#22D3EE] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-400 font-mono text-base">
                    {activeFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. COMPREHENSIVE FOOTER */}
      <footer className="border-t border-slate-800 bg-[#0B1020] py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#635BFF] to-[#22D3EE] flex items-center justify-center font-bold text-white text-xs">
                T
              </div>
              <span className="font-extrabold text-base text-white">Talkie AR</span>
            </div>
            <p className="mt-3 text-xs text-slate-400 max-w-sm leading-relaxed">
              The premier global social speaking, gaming, and AI language learning network. Connect authentically with people worldwide.
            </p>
            <p className="mt-4 text-[11px] text-slate-400">
              © 2026 Talkie AR Inc. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Speaking</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('rooms')} className="hover:text-white">Live Rooms</button></li>
              <li><button onClick={() => navigate('discover')} className="hover:text-white">Find Partners</button></li>
              <li><button onClick={() => navigate('games')} className="hover:text-white">Speaking Games</button></li>
              <li><button onClick={() => navigate('events')} className="hover:text-white">Weekend Debates</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Learning</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('ai-coach')} className="hover:text-white">Talkie AI Coach</button></li>
              <li><button onClick={() => navigate('learn')} className="hover:text-white">Vocabulary Notebook</button></li>
              <li><button onClick={() => navigate('assessments')} className="hover:text-white">CEFR Assessment</button></li>
              <li><button onClick={() => navigate('certificates')} className="hover:text-white">Verify Certificate</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Safety & Trust</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('safety')} className="hover:text-white">Community Guidelines</button></li>
              <li><button onClick={() => navigate('privacy')} className="hover:text-white">Privacy Policy</button></li>
              <li><button onClick={() => navigate('terms')} className="hover:text-white">Terms of Service</button></li>
              <li><button onClick={() => navigate('support')} className="hover:text-white">Help & Support</button></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
};
