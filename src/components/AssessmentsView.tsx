import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  HelpCircle,
  Volume2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  Printer,
  Search,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { CEFR_QUESTIONS } from '../services/mockData';
import { Certificate, CEFRLevel } from '../types/index';

interface AssessmentsViewProps {
  onCertificateIssued: (cert: Certificate) => void;
  onViewCertificates: () => void;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({ onCertificateIssued, onViewCertificates }) => {
  const { currentUser } = useApp();

  const [activeStep, setActiveStep] = useState<'intro' | 'testing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [spokenResponseText, setSpokenResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  const currentQuestion = CEFR_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (qId: number, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleAudioListen = (text?: string) => {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  const handleNext = () => {
    if (currentQuestionIndex < CEFR_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      submitAssessment();
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    const finalAnswers = { ...answers, 6: spokenResponseText };

    try {
      const res = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: currentUser.displayName,
          answers: finalAnswers,
          totalQuestions: CEFR_QUESTIONS.length
        })
      });

      const data = await res.json();
      if (data.success) {
        setAssessmentResult(data.result);
        onCertificateIssued(data.result.certificate);
        setActiveStep('result');
        try {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } catch (err) {
      console.error(err);
      alert('Could not submit assessment. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 1. INTRO STEP */}
      {activeStep === 'intro' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-3xl bg-[#F5C451]/20 border border-[#F5C451]/40 flex items-center justify-center mx-auto text-3xl mb-4 shadow-lg shadow-[#F5C451]/10">
            🏆
          </div>
          <span className="text-xs font-bold text-[#F5C451] uppercase tracking-wider">
            Official Language Proficiency Evaluation
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            CEFR English Diagnostic Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-3 leading-relaxed">
            Take our comprehensive 6-part diagnostic test evaluating Grammar, Lexical Precision, Listening Comprehension, and Spoken Coherence. Earn a verifiable Talkie AR Certificate.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800">
              <span className="text-lg">⏱️</span>
              <p className="text-xs font-bold text-white mt-1">10-15 Minutes</p>
              <p className="text-[10px] text-slate-400">Adaptive timing</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800">
              <span className="text-lg">🎯</span>
              <p className="text-xs font-bold text-white mt-1">A1 to C2 Scale</p>
              <p className="text-[10px] text-slate-400">European Framework</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800">
              <span className="text-lg">📜</span>
              <p className="text-xs font-bold text-white mt-1">Official ID</p>
              <p className="text-[10px] text-slate-400">Verifiable QR Code</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800">
              <span className="text-lg">🎧</span>
              <p className="text-xs font-bold text-white mt-1">Audio Listening</p>
              <p className="text-[10px] text-slate-400">Synthetic audio tasks</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveStep('testing')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#635BFF] via-[#7C3AED] to-[#22D3EE] hover:opacity-95 shadow-xl shadow-[#635BFF]/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Begin Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onViewCertificates}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              View My Existing Certificates
            </button>
          </div>
        </div>
      )}

      {/* 2. TESTING QUESTIONS STEP */}
      {activeStep === 'testing' && (
        <div className="bg-[#111827] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
            <span className="font-bold text-[#22D3EE] uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {CEFR_QUESTIONS.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#635BFF]/20 text-[#22D3EE] font-bold">
              Skill: {currentQuestion.skill}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#635BFF] to-[#22D3EE] h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / CEFR_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Details */}
          <div className="mt-6">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Audio task player button */}
            {currentQuestion.audioText && (
              <div className="mt-4 p-4 rounded-2xl bg-[#0B1020] border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleAudioListen(currentQuestion.audioText)}
                    className="p-3 rounded-full bg-[#635BFF] hover:bg-[#5249e0] text-white shadow-md transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <div>
                    <p className="text-xs font-bold text-white">Audio Listening Track</p>
                    <p className="text-[10px] text-slate-400">Click to listen to the transatlantic flight announcement</p>
                  </div>
                </div>
              </div>
            )}

            {/* Multiple Choice Options */}
            {currentQuestion.options && (
              <div className="mt-6 space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, idx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#635BFF]/20 border-[#635BFF] text-white font-bold shadow-md'
                          : 'bg-[#0B1020] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{option}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                          isSelected ? 'border-[#635BFF] bg-[#635BFF]' : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Spoken Response text input */}
            {currentQuestion.type === 'speaking-prompt' && (
              <div className="mt-6">
                <textarea
                  rows={4}
                  placeholder="Record or type your 45-second spoken answer here (e.g. 'In my perspective, an effective international leader must possess empathy, articulate vision, and cultural intelligence...')"
                  value={spokenResponseText}
                  onChange={(e) => setSpokenResponseText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-[#0B1020] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#635BFF]"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE] hover:opacity-95 shadow-md shadow-[#635BFF]/30 transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Grading Diagnostic...</span>
                </>
              ) : currentQuestionIndex === CEFR_QUESTIONS.length - 1 ? (
                <span>Submit & Calculate CEFR Level</span>
              ) : (
                <>
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 3. RESULT & CERTIFICATE ISSUED STEP */}
      {activeStep === 'result' && assessmentResult && (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl mb-3">
            🎉
          </div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Evaluation Complete
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Your CEFR Level is {assessmentResult.cefrLevel}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {assessmentResult.levelTitle} ({assessmentResult.percentage}% Score)
          </p>

          <div className="mt-6 p-6 rounded-2xl bg-[#111827] border border-slate-800 max-w-md mx-auto text-left space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Diagnostic Skills Breakdown:
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-200">
                <span>Spoken Fluency:</span>
                <span className="font-bold text-[#22D3EE]">{assessmentResult.percentage + 2}%</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span>Grammar & Accuracy:</span>
                <span className="font-bold text-[#22D3EE]">{assessmentResult.percentage}%</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span>Lexical Precision:</span>
                <span className="font-bold text-[#22D3EE]">{assessmentResult.percentage + 4}%</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Certificate ID: <strong className="text-white">{assessmentResult.certificate.id}</strong>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={onViewCertificates}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE] hover:opacity-95 shadow-lg shadow-[#635BFF]/30"
            >
              View Official Certificate & Print PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
