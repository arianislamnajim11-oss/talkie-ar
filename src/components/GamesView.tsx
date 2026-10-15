import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Users,
  Timer,
  Trophy,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_GAMES } from '../services/mockData';
import { SpeakingGame } from '../types/index';
import { calculateGameScore } from '../utils/rules';

export const GamesView: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<SpeakingGame | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundTimer, setRoundTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [gameResult, setGameResult] = useState<string | null>(null);

  // Taboo Game state
  const tabooCards = [
    {
      word: 'AIRPLANE',
      forbidden: ['Fly', 'Sky', 'Wings', 'Pilot'],
      hint: 'A commercial vehicle for international journeys'
    },
    {
      word: 'COFFEE',
      forbidden: ['Drink', 'Morning', 'Cafe', 'Bean'],
      hint: 'A dark roasted beverage that gives you caffeine energy'
    },
    {
      word: 'PASSPORT',
      forbidden: ['Travel', 'Border', 'Country', 'Visa'],
      hint: 'A small official booklet granting you international entry'
    },
    {
      word: 'DOCTOR',
      forbidden: ['Hospital', 'Medicine', 'Sick', 'Patient'],
      hint: 'A healthcare professional dedicated to saving lives'
    }
  ];

  const wouldYouRatherCards = [
    {
      optionA: 'Speak every world language fluently with ease',
      optionB: 'Be able to communicate effortlessly with all animals'
    },
    {
      optionA: 'Travel 200 years into the future for 1 week',
      optionB: 'Travel 500 years into the past with full modern knowledge'
    },
    {
      optionA: 'Never have to sleep again without feeling tired',
      optionB: 'Never have to work a job and live comfortably'
    }
  ];

  const triviaCards = [
    {
      q: 'What is the origin of the English idiom "Bite the bullet"?',
      options: [
        'Old military battlefield surgery without anesthesia',
        'Western cowboy duels in Texas',
        'Gold rush coin testing',
        'British Royal Navy salute'
      ],
      correct: 0,
      fact: 'Wounded soldiers bit on lead bullets to endure painful surgery before anesthesia existed.'
    },
    {
      q: 'Which word contains all five English vowels in alphabetical order?',
      options: ['Facetious', 'Abstemious', 'Aerodynamics', 'Education'],
      correct: 0,
      fact: '"Facetious" has a-e-i-o-u in exact alphabetical sequence!'
    }
  ];

  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && roundTimer > 0) {
      interval = setInterval(() => {
        setRoundTimer(t => t - 1);
      }, 1000);
    } else if (isPlaying && roundTimer === 0) {
      // Round ended
      handleRoundEnd(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, roundTimer]);

  const startGame = (game: SpeakingGame) => {
    setSelectedGame(game);
    setIsPlaying(true);
    setCurrentRound(1);
    setScore(0);
    setRoundTimer(game.slug === 'taboo' ? 30 : game.slug === 'would-you-rather' ? 60 : 45);
    setActiveCardIndex(0);
    setGameResult(null);
  };

  const handleRoundEnd = (success: boolean) => {
    if (success) {
      const points = calculateGameScore(100, roundTimer, currentRound);
      setScore(s => s + points);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    }

    if (currentRound < 3) {
      setCurrentRound(r => r + 1);
      setActiveCardIndex(i => i + 1);
      setRoundTimer(selectedGame?.slug === 'taboo' ? 30 : 45);
    } else {
      setIsPlaying(false);
      setGameResult('Victory! You completed all rounds with remarkable speaking agility.');
      try {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Gamepad2 className="w-4 h-4" />
            <span>Interactive Multiplayer Fluency Games</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Speaking Games Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build vocabulary, conquer hesitation, and laugh with global friends through interactive live games.
          </p>
        </div>

        {selectedGame && (
          <button
            onClick={() => {
              setSelectedGame(null);
              setIsPlaying(false);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 self-start md:self-auto"
          >
            ← Back to All Games
          </button>
        )}
      </div>

      {/* GAME ARENA IF SELECTED */}
      {selectedGame ? (
        <div className="mt-8 max-w-4xl mx-auto">
          
          {/* Top Status Bar */}
          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedGame.icon}</span>
              <div>
                <h2 className="font-extrabold text-base text-white">{selectedGame.title}</h2>
                <p className="text-xs text-slate-400">Round {currentRound} of 3</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                <Timer className="w-4 h-4" />
                <span>{roundTimer}s</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#635BFF]/20 border border-[#635BFF]/40 text-[#22D3EE] text-xs font-bold">
                <Trophy className="w-4 h-4" />
                <span>{score} XP</span>
              </div>
            </div>
          </div>

          {/* ACTIVE GAME CARD */}
          <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#161F37] to-[#111827] border-2 border-[#635BFF]/40 shadow-2xl relative overflow-hidden">
            
            {/* 1. TABOO GAMEPLAY */}
            {selectedGame.slug === 'taboo' && (
              <div className="text-center max-w-md mx-auto">
                <span className="text-xs font-extrabold text-[#22D3EE] uppercase tracking-wider">
                  Describe this secret word to teammates:
                </span>
                <div className="mt-4 p-5 rounded-2xl bg-[#0B1020] border-2 border-[#22D3EE] shadow-lg">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-widest">
                    {tabooCards[activeCardIndex]?.word}
                  </h3>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-left">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>FORBIDDEN TABOO WORDS (Do NOT say these!):</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-200">
                    {tabooCards[activeCardIndex]?.forbidden.map((word) => (
                      <span key={word} className="px-2 py-1 rounded bg-slate-900/60 border border-red-500/20 text-center">
                        ❌ {word}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleRoundEnd(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-red-400 bg-red-500/15 border border-red-500/30 hover:bg-red-500/25"
                  >
                    Pass / Used Taboo
                  </button>
                  <button
                    onClick={() => handleRoundEnd(true)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 shadow-lg shadow-emerald-500/30"
                  >
                    Teammate Guessed Correctly! (+100)
                  </button>
                </div>
              </div>
            )}

            {/* 2. WOULD YOU RATHER GAMEPLAY */}
            {selectedGame.slug === 'would-you-rather' && (
              <div className="max-w-xl mx-auto text-center">
                <span className="text-xs font-extrabold text-[#22D3EE] uppercase tracking-wider">
                  Pick one & explain your stance in 60 seconds:
                </span>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleRoundEnd(true)}
                    className="p-6 rounded-2xl bg-[#0B1020] border-2 border-slate-700 hover:border-[#635BFF] transition-all text-left flex flex-col justify-between group"
                  >
                    <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider mb-2">Option A</span>
                    <p className="text-sm font-bold text-white leading-relaxed group-hover:text-[#22D3EE]">
                      "{wouldYouRatherCards[activeCardIndex]?.optionA}"
                    </p>
                    <span className="mt-4 text-xs font-semibold text-slate-400">Click to choose & argue →</span>
                  </button>

                  <button
                    onClick={() => handleRoundEnd(true)}
                    className="p-6 rounded-2xl bg-[#0B1020] border-2 border-slate-700 hover:border-[#22D3EE] transition-all text-left flex flex-col justify-between group"
                  >
                    <span className="text-xs font-bold text-[#22D3EE] uppercase tracking-wider mb-2">Option B</span>
                    <p className="text-sm font-bold text-white leading-relaxed group-hover:text-[#22D3EE]">
                      "{wouldYouRatherCards[activeCardIndex]?.optionB}"
                    </p>
                    <span className="mt-4 text-xs font-semibold text-slate-400">Click to choose & argue →</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. TRIVIA GAMEPLAY */}
            {selectedGame.slug === 'trivia' && (
              <div className="max-w-xl mx-auto">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                  English Idiom & Cultural Question:
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-2 leading-relaxed">
                  {triviaCards[activeCardIndex % triviaCards.length]?.q}
                </h3>

                <div className="mt-6 space-y-2.5">
                  {triviaCards[activeCardIndex % triviaCards.length]?.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRoundEnd(idx === triviaCards[activeCardIndex % triviaCards.length]?.correct)}
                      className="w-full text-left p-3.5 rounded-xl bg-[#0B1020] border border-slate-800 hover:border-[#635BFF] text-xs sm:text-sm text-slate-200 hover:text-white transition-all font-medium"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Default for remaining games: Speaking Topic Roulette */}
            {selectedGame.slug !== 'taboo' && selectedGame.slug !== 'would-you-rather' && selectedGame.slug !== 'trivia' && (
              <div className="text-center max-w-md mx-auto">
                <span className="text-xs font-extrabold text-[#22D3EE] uppercase tracking-wider">
                  Random Prompt Generator:
                </span>
                <div className="mt-4 p-6 rounded-2xl bg-[#0B1020] border-2 border-[#635BFF]">
                  <p className="text-base font-bold text-white leading-relaxed">
                    "If you could instantaneously master any skill or art form tonight, which would you pick and how would it alter your career trajectory?"
                  </p>
                </div>
                <button
                  onClick={() => handleRoundEnd(true)}
                  className="mt-6 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5249e0]"
                >
                  Completed 60s Speaking Turn (+100 XP)
                </button>
              </div>
            )}

            {/* Game Result Modal */}
            {gameResult && (
              <div className="absolute inset-0 bg-[#0B1020]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                <span className="text-4xl mb-3">🎉</span>
                <h3 className="text-2xl font-extrabold text-white">Game Session Finished!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mt-2 leading-relaxed">
                  {gameResult}
                </p>
                <div className="mt-4 px-4 py-2 rounded-xl bg-[#635BFF]/20 border border-[#635BFF]/40 text-[#22D3EE] font-bold text-sm">
                  Total Score: {score} XP Earned
                </div>
                <button
                  onClick={() => startGame(selectedGame)}
                  className="mt-6 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE]"
                >
                  Play Rematch
                </button>
              </div>
            )}

          </div>
        </div>
      ) : (
        /* GAMES CATALOG GRID */
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_GAMES.map((game) => (
            <div
              key={game.id}
              className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{game.icon}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {game.playersCount}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-4 group-hover:text-[#22D3EE] transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#635BFF]">
                  {game.category}
                </span>
                <button
                  onClick={() => startGame(game)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#635BFF] to-[#7C3AED] hover:opacity-95 shadow-md shadow-[#635BFF]/20 transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Play Game</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
