
import React from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-background-dark animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar pb-10 font-display">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md px-4 py-4 border-b border-white/5 flex items-center">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-90 shrink-0">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="flex-1 text-center pr-10 text-lg font-black text-white tracking-tight uppercase">Privacy Policy</h2>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 space-y-8 max-w-3xl mx-auto">
        <section className="space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span className="size-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">database</span>
            </span>
            1. Information We Collect
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            We collect personal information that you provide to us directly when you create an account at Baji369, including your name, email address, phone number, and payment details. We also collect data automatically, such as IP addresses and device information, to enhance your gaming experience and maintain platform security.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span className="size-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </span>
            2. How We Use Your Information
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Your data is used to provide and manage our services, process financial transactions, communicate account-related updates, and provide personalized promotions. We also use aggregated, non-identifiable data for internal analytics to improve our platform's performance.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">security</span>
            </span>
            3. Data Security & Protection
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Baji369 employs advanced encryption technologies and secure servers to protect your personal information from unauthorized access, disclosure, or destruction. We regularly audit our security protocols to ensure the highest standards of data integrity.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span className="size-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">cookie</span>
            </span>
            4. Cookie Policy
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            We use cookies to remember your preferences and provide a seamless login experience. You can manage your cookie settings through your browser, although disabling them may limit some functionalities of our platform.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span className="size-8 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">share</span>
            </span>
            5. Third-Party Sharing
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            We do not sell your personal data. Information may be shared with trusted third-party service providers (like payment processors) solely for the purpose of maintaining our services, or when required by legal authorities to comply with local regulations.
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

export default PrivacyPolicy;
