
import React from 'react';

interface TermsConditionsProps {
  onBack: () => void;
}

const TermsConditions: React.FC<TermsConditionsProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-background-dark animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar pb-10 font-display">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md px-4 py-4 border-b border-white/5 flex items-center">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-90 shrink-0">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="flex-1 text-center pr-10 text-lg font-black text-white tracking-tight uppercase">Terms & Conditions</h2>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 space-y-8 max-w-3xl mx-auto">
        <section className="space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </span>
            1. Acceptance of Terms
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            By accessing and using Baji369, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span className="size-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">person_check</span>
            </span>
            2. Eligibility
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            You must be at least 18 years of age or the legal age for gambling in your jurisdiction to create an account. Baji369 reserves the right to request proof of age at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span className="size-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">security</span>
            </span>
            3. Account Security
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            You are responsible for maintaining the confidentiality of your account credentials. Any activities occurring under your account will be deemed your responsibility.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span className="size-8 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
            4. Deposits & Withdrawals
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            All financial transactions are subject to verification. Withdrawals may require additional documentation for anti-money laundering compliance.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span className="size-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
            </span>
            5. Responsible Gaming
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Baji369 promotes responsible gaming. We provide tools for self-exclusion and deposit limits. Gaming should be for entertainment only.
          </p>
        </section>

        <div className="pt-10 border-t border-white/5">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] text-center">
            Last Updated: November 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
