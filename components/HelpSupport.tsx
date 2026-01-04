
import React, { useState } from 'react';

interface HelpSupportProps {
  onBack: () => void;
}

const FAQ_DATA = [
  {
    category: 'Account Management',
    icon: 'manage_accounts',
    color: 'text-primary',
    questions: [
      { q: 'How do I verify my account?', a: 'To verify your account, go to Profile > Verification Center. You will need to upload a valid government-issued ID and a proof of address. Verification typically takes 24-48 hours.' },
      { q: 'I forgot my password. How to reset?', a: 'Click on the "Login" button and select "Forgot Password". Enter your registered email or phone number to receive a reset link/code. Follow the instructions to set a new password.' }
    ]
  },
  {
    category: 'Deposits & Withdrawals',
    icon: 'payments',
    color: 'text-emerald-500',
    questions: [
      { q: 'What are the minimum deposit limits?', a: 'Minimum deposit limits vary by payment method. Generally, e-wallets start at $10, while bank transfers may require $50. Check the "Deposit" page for specific limits for your region.' },
      { q: 'Why is my withdrawal pending?', a: 'Withdrawals are usually processed within 24 hours. If it\'s pending longer, it might be due to required account verification or bank processing times.' }
    ]
  },
  {
    category: 'Betting Rules',
    icon: 'gavel',
    color: 'text-orange-500',
    questions: [
      { q: 'What happens if a match is postponed?', a: 'If a match is postponed for more than 48 hours, all bets on that event are typically voided and stakes are returned to your account balance.' }
    ]
  },
  {
    category: 'Technical Support',
    icon: 'build',
    color: 'text-blue-400',
    questions: [
      { q: 'The app is crashing on launch.', a: 'Please ensure your app is updated to the latest version. Try clearing the app cache or reinstalling. If the issue persists, contact support with your device model and OS version.' }
    ]
  }
];

const HelpSupport: React.FC<HelpSupportProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQ_DATA.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="flex flex-col h-full bg-background-dark animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar font-display">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center justify-center size-10 rounded-full hover:bg-white/5 transition-colors text-white">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-black tracking-tight text-center flex-1 pr-10 uppercase">Help & Support</h1>
      </div>

      {/* Headline */}
      <div className="px-5 pt-6 pb-2">
        <h2 className="text-2xl font-black tracking-tight leading-tight text-white">How can we help you?</h2>
        <p className="text-slate-500 mt-1 text-sm font-bold">Find answers or contact our support team.</p>
      </div>

      {/* Search Bar */}
      <div className="px-5 py-6 sticky top-[64px] z-40 bg-background-dark/95 backdrop-blur-md">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">search</span>
          </div>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent text-white shadow-sm transition-all" 
            placeholder="Search for issues, topics..." 
            type="text"
          />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-5 pb-8">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Live Chat', icon: 'chat', color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Email Us', icon: 'mail', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { label: 'My Ticket', icon: 'confirmation_number', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
          ].map((action, i) => (
            <button key={i} className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-white/5 bg-white/5 hover:border-primary/50 transition-all group active:scale-95">
              <div className={`p-3 rounded-full ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined">{action.icon}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="px-5 py-2">
        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">Frequently Asked Questions</h3>
      </div>

      <div className="px-5 space-y-4 pb-24">
        {filteredFaqs.map((category, idx) => (
          <div key={idx} className="rounded-2xl overflow-hidden border border-white/5 bg-white/5">
            <div className="px-5 py-4 bg-white/5 border-b border-white/5 flex items-center gap-3">
              <span className={`material-symbols-outlined ${category.color} text-xl`}>{category.icon}</span>
              <h4 className="font-black text-[10px] uppercase tracking-[0.15em] text-slate-500">{category.category}</h4>
            </div>
            {category.questions.map((item, qIdx) => (
              <details key={qIdx} className="group border-b border-white/5 last:border-0">
                <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-sm hover:bg-white/5 transition-colors">
                  <span className="text-slate-200">{item.q}</span>
                  <span className="transition-transform duration-300 group-open:rotate-180 material-symbols-outlined text-slate-500">expand_more</span>
                </summary>
                <div className="text-slate-400 text-xs px-5 pb-5 leading-relaxed font-medium animate-in slide-in-from-top-2 duration-300">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <span className="material-symbols-outlined text-5xl mb-4">search_off</span>
            <p className="text-sm font-black uppercase tracking-widest">No matching answers</p>
          </div>
        )}

        {/* Footer Support Button */}
        <div className="mt-10 mb-8 text-center">
          <p className="text-slate-500 text-xs font-bold mb-5 uppercase tracking-widest">Still need help?</p>
          <button className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.15em] text-xs">
            <span className="material-symbols-outlined !text-[20px]">headset_mic</span>
            Contact Support Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
