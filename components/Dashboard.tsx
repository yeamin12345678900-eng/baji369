
import React from 'react';
import { Language, translations } from '../services/translations';

interface DashboardProps {
  lang: Language;
  balance: number;
  userProfile?: any;
  onWalletClick: () => void;
  onDepositClick: () => void;
  onNavigate: (view: any) => void;
  onSpinClick?: () => void;
  onNotificationClick?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ lang, balance, userProfile, onWalletClick, onDepositClick, onNavigate, onSpinClick, onNotificationClick }) => {
  const t = translations[lang];
  const userName = userProfile?.first_name || "User";

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 bg-[#1a0d0e] overflow-y-auto no-scrollbar pb-32 font-display">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1a0d0e]/95 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
            {userProfile?.avatar_url ? (
              <img src={userProfile.avatar_url} alt="Profile" className="size-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-primary">person</span>
            )}
          </div>
          <div onClick={onWalletClick} className="flex flex-col cursor-pointer">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{userName}</span>
            <div className="flex items-center gap-1">
              <span className="text-white text-lg font-black">${balance.toLocaleString()}</span>
              <span className="material-symbols-outlined text-slate-500 text-sm">chevron_right</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => onNotificationClick?.()} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 relative">
               <span className="material-symbols-outlined">notifications</span>
               <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-[#1a0d0e]"></span>
            </button>
            <button onClick={onDepositClick} className="bg-primary px-5 py-2.5 rounded-full text-white text-[10px] font-black shadow-lg shadow-primary/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              {t.deposit.toUpperCase()}
            </button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-6">
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBXa0BkcB9gQbwl-vQ4hdb9jaj2O2rijR7o_tN8xda21OF9HpWw3BBKSf3FClVmp3reyg5we2-NSHKnS8liM_3hwixelqsLsb2g8eyMi4nvTwv69qzyzP3bLMiA8MSo4IMF5QTdVsaABr5ScU-Xgo7y8l32dJI9MmvVFoClaJwW-Jwb2tuSXuzJRRNc4BzKlfs_j5xfTXRo3J8L5M_VOa89jfJMrwp-CLpIJPTP10x7E5WXx27JZ7M3XX_PuRjRIPp_eZ16QZbw")'}} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-center">
            <h2 className="text-2xl font-black text-white leading-tight">{t.originals.toUpperCase()}</h2>
            <p className="text-slate-300 text-[10px] mt-1 uppercase tracking-widest font-bold">{lang === 'en' ? 'Try our instant win games' : 'আমাদের ইনস্ট্যান্ট গেমগুলো খেলুন'}</p>
            <button onClick={() => onNavigate('mini-games')} className="mt-4 bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">{t.playNow}</button>
          </div>
        </div>
      </section>

      {/* Retention Feature: Lucky Spin Banner */}
      <section className="px-4 mt-6">
         <div onClick={onSpinClick} className="bg-gradient-to-r from-indigo-900 to-[#1a0d0e] rounded-2xl border border-indigo-500/30 p-5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-[80px]">stars</span>
            </div>
            <div className="flex items-center gap-4 relative z-10">
               <div className="size-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-indigo-400 text-3xl animate-spin-slow">autorenew</span>
               </div>
               <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-tighter">{t.luckySpin}</h3>
                  <p className="text-indigo-300 text-[9px] font-bold uppercase tracking-widest">{t.freeWait}</p>
               </div>
            </div>
            <span className="material-symbols-outlined text-indigo-400 relative z-10">arrow_forward_ios</span>
         </div>
      </section>

      {/* Baji Originals Grid */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white tracking-tight uppercase">{t.originals}</h2>
          <span className="text-primary text-[10px] font-black animate-pulse">{t.hot}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div onClick={() => onNavigate('crash-game')} className="aspect-[4/5] bg-gradient-to-b from-[#2d1b1c] to-[#1a0d0e] rounded-2xl border border-white/5 p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-all active:scale-95">
            <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
               <span className="material-symbols-outlined text-primary text-3xl">rocket_launch</span>
            </div>
            <span className="text-white text-[10px] font-black uppercase tracking-tight">Crash</span>
            <span className="text-emerald-400 text-[8px] font-bold mt-1">x1000.00</span>
          </div>
          <div onClick={() => onNavigate('mines-game')} className="aspect-[4/5] bg-gradient-to-b from-[#2d1b1c] to-[#1a0d0e] rounded-2xl border border-white/5 p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-all active:scale-95">
            <div className="size-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
               <span className="material-symbols-outlined text-amber-500 text-3xl">grid_view</span>
            </div>
            <span className="text-white text-[10px] font-black uppercase tracking-tight">Mines</span>
            <span className="text-amber-400 text-[8px] font-bold mt-1">{t.instant} Win</span>
          </div>
          <div onClick={() => onNavigate('penalty-game')} className="aspect-[4/5] bg-gradient-to-b from-[#2d1b1c] to-[#1a0d0e] rounded-2xl border border-white/5 p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-all active:scale-95">
            <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
               <span className="material-symbols-outlined text-blue-400 text-3xl">sports_soccer</span>
            </div>
            <span className="text-white text-[10px] font-black uppercase tracking-tight">Penalty</span>
            <span className="text-blue-400 text-[8px] font-bold mt-1">Goal!</span>
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <section className="px-4 mt-8 grid grid-cols-2 gap-3 pb-10">
        <div onClick={() => onNavigate('vip-rewards')} className="h-28 rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between overflow-hidden relative group cursor-pointer">
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl opacity-5 group-hover:opacity-20 transition-opacity">stars</span>
          <span className="text-white font-black text-lg uppercase tracking-tighter italic">VIP Club</span>
          <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">Exclusive Perks</span>
        </div>
        <div onClick={() => onNavigate('casino')} className="h-28 rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between overflow-hidden relative group cursor-pointer">
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl opacity-5 group-hover:opacity-20 transition-opacity">casino</span>
          <span className="text-white font-black text-lg uppercase tracking-tighter italic">{t.casino}</span>
          <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Live Dealer</span>
        </div>
      </section>

      <style>{`
         @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
         }
         .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
         }
      `}</style>
    </div>
  );
};

export default Dashboard;
