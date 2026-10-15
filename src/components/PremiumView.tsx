import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Shield,
  CreditCard,
  Award,
  Crown,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const PremiumView: React.FC = () => {
  const { currentUser, upgradeToPremium } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [upgrading, setUpgrading] = useState(false);
  const [justUpgraded, setJustUpgraded] = useState(false);

  const handleUpgrade = (tier: 'pro' | 'unlimited') => {
    setUpgrading(true);
    setTimeout(() => {
      upgradeToPremium(tier);
      setUpgrading(false);
      setJustUpgraded(true);
      try {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      } catch (e) {}
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5C451]/15 border border-[#F5C451]/30 text-[#F5C451] text-xs font-bold mb-4">
          <Crown className="w-3.5 h-3.5" />
          <span>Elevate Your International Fluency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Talkie AR Premium Membership
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          Unlock unlimited AI Coach analysis, priority debate slots, verifiable certificate exports, and exclusive profile decorations.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="mt-6 inline-flex items-center p-1 rounded-2xl bg-[#111827] border border-slate-800">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              billingCycle === 'monthly' ? 'bg-[#635BFF] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
              billingCycle === 'yearly' ? 'bg-[#635BFF] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Yearly (Save 25%)</span>
            <span className="text-[9px] bg-emerald-500 text-slate-900 px-1 py-0.2 rounded font-extrabold">SALE</span>
          </button>
        </div>
      </div>

      {justUpgraded && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-center animate-in zoom-in-95 duration-200">
          <p className="font-extrabold text-sm text-white">🎉 Welcome to Talkie AR Pro!</p>
          <p className="text-xs text-emerald-200 mt-0.5">Your Pro Badge and unlimited coaching entitlements are now active.</p>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* FREE PLAN */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#111827] border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Essential</span>
            <h3 className="text-xl font-extrabold text-white mt-1">Talkie Free</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">$0</span>
              <span className="text-xs text-slate-400">/ forever</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Core social speaking and live voice rooms.</p>

            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited live speaking rooms</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Join community servers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multiplayer speaking games</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Basic CEFR diagnostic scoring</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="mt-8 w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 cursor-default"
          >
            Current Standard Plan
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#161F37] to-[#111827] border-2 border-[#635BFF] relative shadow-2xl flex flex-col justify-between">
          <div className="absolute -top-3 right-6 bg-[#635BFF] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
            Most Popular
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE]">Dedicated Fluency</span>
            <h3 className="text-xl font-extrabold text-white mt-1">Talkie Pro</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">
                {billingCycle === 'monthly' ? '$9.99' : '$7.49'}
              </span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>
            <p className="text-xs text-slate-300 mt-2">Comprehensive AI practice & official certificates.</p>

            <ul className="mt-6 space-y-3 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22D3EE] shrink-0" />
                <span>Unlimited Gemini 3.8 AI Coach feedback</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22D3EE] shrink-0" />
                <span>Verifiable PDF Certificate with QR code</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22D3EE] shrink-0" />
                <span>Exclusive Talkie Pro Gold cosmetic badge</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22D3EE] shrink-0" />
                <span>Custom speaking room visual themes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22D3EE] shrink-0" />
                <span>Priority queue in weekend debates</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('pro')}
            disabled={currentUser.isPremium || upgrading}
            className="mt-8 w-full py-3 rounded-xl text-xs font-bold text-slate-900 bg-gradient-to-r from-[#F5C451] to-[#F59E0B] hover:brightness-110 shadow-lg shadow-[#F5C451]/20 transition-all disabled:opacity-60"
          >
            {currentUser.isPremium ? '✓ Active Plan' : upgrading ? 'Activating...' : 'Upgrade to Talkie Pro'}
          </button>
        </div>

        {/* UNLIMITED MASTER PLAN */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#111827] border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A855F7]">Ultimate Mastery</span>
            <h3 className="text-xl font-extrabold text-white mt-1">Talkie Unlimited</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">
                {billingCycle === 'monthly' ? '$19.99' : '$14.99'}
              </span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Mentor tools & community creator access.</p>

            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#A855F7] shrink-0" />
                <span>Everything in Talkie Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#A855F7] shrink-0" />
                <span>Host your own Community Servers & Stages</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#A855F7] shrink-0" />
                <span>Verified Mentor application eligibility</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#A855F7] shrink-0" />
                <span>Deep vocal & pronunciation analytics</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('unlimited')}
            disabled={upgrading}
            className="mt-8 w-full py-3 rounded-xl text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5249e0] transition-colors"
          >
            {upgrading ? 'Activating...' : 'Get Unlimited Master'}
          </button>
        </div>

      </div>

    </div>
  );
};
