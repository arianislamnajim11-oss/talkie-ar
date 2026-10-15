import React from 'react';
import { ShieldCheck, HelpCircle, FileText, Lock, Mail, ExternalLink } from 'lucide-react';

export const SupportPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
    <div className="border-b border-slate-800 pb-6">
      <div className="flex items-center gap-2 text-xs font-bold text-[#22D3EE] uppercase tracking-wider">
        <HelpCircle className="w-4 h-4" />
        <span>Help & Documentation</span>
      </div>
      <h1 className="text-3xl font-extrabold text-white mt-1">Talkie AR Support Center</h1>
      <p className="text-sm text-slate-400 mt-1">
        Find answers to common questions about voice rooms, CEFR certificates, microphone troubleshooting, and billing.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800">
        <h3 className="font-bold text-white text-base">Troubleshooting Microphone & Audio</h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          If others cannot hear you in a live room, verify browser permissions. Chrome and Firefox allow mic access via the padlock icon in the address bar. You can also run the built-in diagnostic meter in Settings.
        </p>
      </div>
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800">
        <h3 className="font-bold text-white text-base">CEFR Certificate Verification</h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Every Talkie AR certificate comes with a unique code (e.g. TAR-2026-B2901X). Employers, tutors, or recruiters can verify the issue date and diagnostic score breakdown directly on our public verification portal.
        </p>
      </div>
    </div>

    <div className="p-6 rounded-2xl bg-[#0E1528] border border-slate-800 flex items-center justify-between">
      <div>
        <h4 className="font-bold text-white text-sm">Need Direct Assistance?</h4>
        <p className="text-xs text-slate-400 mt-0.5">Our international team responds within 24 hours.</p>
      </div>
      <a
        href="mailto:support@talkiear.com"
        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5249e0] flex items-center gap-1.5"
      >
        <Mail className="w-4 h-4" />
        <span>Email Support</span>
      </a>
    </div>
  </div>
);

export const SafetyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
    <div className="border-b border-slate-800 pb-6">
      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4" />
        <span>Trust & Security</span>
      </div>
      <h1 className="text-3xl font-extrabold text-white mt-1">Safety & Community Code of Conduct</h1>
      <p className="text-sm text-slate-400 mt-1">
        Talkie AR is built on mutual respect, cultural curiosity, and constructive encouragement.
      </p>
    </div>

    <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
        <h3 className="font-bold text-white text-base mb-1">1. Zero Tolerance for Harassment</h3>
        <p className="text-slate-400">
          Discriminatory language, hate speech, sexual harassment, bullying, and trolling result in immediate account restriction.
        </p>
      </div>
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
        <h3 className="font-bold text-white text-base mb-1">2. No Unconsented Audio Recording</h3>
        <p className="text-slate-400">
          We never record live speaking rooms by default. Any recording, transcription, or external broadcasting without unanimous verbal consent is strictly prohibited.
        </p>
      </div>
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
        <h3 className="font-bold text-white text-base mb-1">3. Empowered Room Moderation</h3>
        <p className="text-slate-400">
          Room hosts and community moderators have full authority to mute, reorder the queue, or remove disruptive participants.
        </p>
      </div>
    </div>
  </div>
);

export const PrivacyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
    <div className="border-b border-slate-800 pb-6">
      <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
        <Lock className="w-4 h-4" />
        <span>Data Governance</span>
      </div>
      <h1 className="text-3xl font-extrabold text-white mt-1">Talkie AR Privacy Policy</h1>
      <p className="text-xs text-slate-400 mt-1">Last updated: October 2026</p>
    </div>

    <div className="text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed">
      <p>
        Your privacy is paramount. Talkie AR collects only information necessary to deliver authentic peer-to-peer conversations, diagnostic learning assessments, and platform safety.
      </p>
      <h3 className="text-base font-bold text-white pt-2">Voice & Audio Privacy</h3>
      <p>
        Audio packets in live rooms are transmitted ephemerally via secure WebRTC protocols. Audio is not saved, archived, or used for commercial marketing.
      </p>
      <h3 className="text-base font-bold text-white pt-2">AI Processing Disclosure</h3>
      <p>
        When you choose to practice with Talkie AI Coach, text and user-provided inputs are securely processed by Google Gemini server-side APIs to generate grammar suggestions.
      </p>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
    <div className="border-b border-slate-800 pb-6">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
        <FileText className="w-4 h-4" />
        <span>Legal Terms</span>
      </div>
      <h1 className="text-3xl font-extrabold text-white mt-1">Terms of Service</h1>
      <p className="text-xs text-slate-400 mt-1">Effective: October 2026</p>
    </div>

    <div className="text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed">
      <p>
        By using Talkie AR, you agree to comply with our community rules, uphold fair conduct in multiplayer games, and respect fellow learners across all borders.
      </p>
      <p>
        Talkie AR Certificates represent verified platform diagnostic achievement and are not external academic accreditations.
      </p>
    </div>
  </div>
);
