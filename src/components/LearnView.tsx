import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Plus,
  CheckCircle2,
  RotateCw,
  Sparkles,
  Award,
  Lightbulb,
  X,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { VocabularyItem, CEFRLevel } from '../types/index';

export const LearnView: React.FC = () => {
  const { vocabulary, addVocabularyWord } = useApp();

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  // Add word form state
  const [newWord, setNewWord] = useState('');
  const [newPos, setNewPos] = useState('noun');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newDef, setNewDef] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newLevel, setNewLevel] = useState<CEFRLevel>('B2');

  const filteredVocab = vocabulary.filter(v =>
    v.word.toLowerCase().includes(search.toLowerCase()) ||
    v.definition.toLowerCase().includes(search.toLowerCase())
  );

  const activeItem = filteredVocab[activeCardIndex] || filteredVocab[0];

  const handleSpeak = (word: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(word);
    utt.lang = 'en-US';
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  const handleMastered = () => {
    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}
    setIsFlipped(false);
    setActiveCardIndex(i => (i + 1) % filteredVocab.length);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setActiveCardIndex(i => (i + 1) % filteredVocab.length);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newDef.trim()) return;

    const newItem: VocabularyItem = {
      id: 'voc_' + Date.now(),
      word: newWord.trim(),
      partOfSpeech: newPos,
      phonetic: newPhonetic.trim() || '/pronunciation/',
      definition: newDef.trim(),
      example: newExample.trim() || `She used ${newWord.trim()} in her presentation.`,
      level: newLevel,
      mastered: false,
      nextReviewDate: new Date().toISOString().slice(0, 10)
    };

    addVocabularyWord(newItem);
    setShowAddModal(false);
    setNewWord('');
    setNewDef('');
    setNewExample('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#22D3EE] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Spaced-Repetition Learning Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Vocabulary Notebook
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Save and retain advanced English words, collocations, and idioms through active recall.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE] hover:opacity-95 shadow-md shadow-[#635BFF]/30 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Word</span>
        </button>
      </div>

      {/* Main Flashcard Lab */}
      {activeItem && (
        <div className="max-w-xl mx-auto">
          
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Card {activeCardIndex + 1} of {filteredVocab.length}</span>
            <span className="text-[#22D3EE] font-bold">Level: {activeItem.level}</span>
          </div>

          {/* Flashcard container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[260px] rounded-3xl p-8 bg-gradient-to-b from-[#161F37] to-[#111827] border-2 border-slate-700/80 hover:border-[#635BFF] shadow-2xl flex flex-col justify-between text-center transition-all transform hover:-translate-y-1"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#635BFF]/20 text-[#22D3EE]">
                {activeItem.partOfSpeech}
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-wide">
                {activeItem.word}
              </h2>
              <p className="text-sm font-mono text-slate-400 mt-1">{activeItem.phonetic}</p>
            </div>

            {isFlipped ? (
              <div className="my-4 p-4 rounded-2xl bg-[#0B1020]/90 border border-slate-800 animate-in fade-in duration-150">
                <p className="text-sm font-semibold text-white leading-relaxed">
                  "{activeItem.definition}"
                </p>
                <p className="text-xs text-slate-400 italic mt-2">
                  Example: {activeItem.example}
                </p>
              </div>
            ) : (
              <div className="my-6 text-xs text-slate-500 font-medium">
                Tap or click card to reveal definition & example →
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(activeItem.word);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                title="Pronounce Word"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
            >
              Need Review
            </button>
            <button
              onClick={handleMastered}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 shadow-md shadow-emerald-500/25 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Mastered (+25 XP)</span>
            </button>
          </div>
        </div>
      )}

      {/* Vocabulary Catalog Table */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="font-extrabold text-base text-white">Saved Vocabulary List</h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search words..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#635BFF]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B1020] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Word</th>
                <th className="p-3">Part of Speech</th>
                <th className="p-3">Definition</th>
                <th className="p-3">Level</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredVocab.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <button onClick={() => handleSpeak(item.word)} title="Listen">
                      <Volume2 className="w-3.5 h-3.5 text-[#22D3EE] hover:opacity-80" />
                    </button>
                    <span>{item.word}</span>
                  </td>
                  <td className="p-3 text-slate-400">{item.partOfSpeech}</td>
                  <td className="p-3 max-w-sm truncate">{item.definition}</td>
                  <td className="p-3 font-bold text-[#635BFF]">{item.level}</td>
                  <td className="p-3">
                    {item.mastered ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Mastered</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">Learning</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD WORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-base text-white">Add Vocabulary Word</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Word *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ubiquitous"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Part of Speech</label>
                  <select
                    value={newPos}
                    onChange={(e) => setNewPos(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  >
                    <option value="noun">Noun</option>
                    <option value="verb">Verb</option>
                    <option value="adjective">Adjective</option>
                    <option value="adverb">Adverb</option>
                    <option value="phrase">Phrase / Idiom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Level</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  >
                    <option value="B1">B1 (Intermediate)</option>
                    <option value="B2">B2 (Upper-Int)</option>
                    <option value="C1">C1 (Advanced)</option>
                    <option value="C2">C2 (Proficient)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Definition *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Present, appearing, or found everywhere."
                  value={newDef}
                  onChange={(e) => setNewDef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Example Sentence</label>
                <input
                  type="text"
                  placeholder="Smartphones have become ubiquitous in daily modern life."
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5249e0]"
                >
                  Save to Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
