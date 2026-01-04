
import React, { useState } from 'react';
import { Language } from '../services/translations';

interface WalletProps {
  lang: Language;
  balance: number;
  onBack: () => void;
  onDepositClick: () => void;
  onWithdrawClick: () => void;
  onHistoryClick?: () => void;
}

const Wallet: React.FC<WalletProps> = ({ lang, balance, onBack, onDepositClick, onWithdrawClick, onHistoryClick }) => {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <div className="flex flex-col h-full bg-[#101822] animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar font-display">
      {/* Header - Fixed to support better navigation */}
      <header className="sticky top-0 z-50 bg-[#101822]/95 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
          </div>
          <h2 className="text-lg font-black text-white tracking-tight uppercase">My Wallet</h2>
        </div>
        <button onClick={onHistoryClick} className="text-primary text-[10px] font-black uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
           Transactions
        </button>
      </header>

      {/* Enhanced Balance Card */}
      <div className="px-5 pt-6 pb-2">
        <div className="bg-gradient-to-br from-[#136dec] to-[#0a47a1] rounded-[2rem] p-7 shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute -right-8 -top-8 size-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-12 -bottom-12 size-40 bg-black/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white/70">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Balance</span>
                <button onClick={() => setBalanceVisible(!balanceVisible)} className="size-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">{balanceVisible ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              <span className="text-[10px] font-black text-white bg-white/20 px-2 py-0.5 rounded-md uppercase tracking-widest">Active</span>
            </div>
            
            <h1 className="text-4xl font-black text-white mb-6 tracking-tight">
              {balanceVisible ? `$ ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••••'}
            </h1>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/5">
                <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">Cashable</p>
                <p className="text-sm font-black text-white">${(balance * 0.95).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/5">
                <p className="text-[9px] font-black text-yellow-400 uppercase tracking-widest mb-1">Bonus</p>
                <p className="text-sm font-black text-yellow-400">$50.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Actions Grid */}
      <div className="px-5 py-6 grid grid-cols-3 gap-3">
        {[
          { icon: 'add_circle', label: 'Deposit', color: 'text-primary', onClick: onDepositClick },
          { icon: 'account_balance_wallet', label: 'Withdraw', color: 'text-orange-400', onClick: onWithdrawClick },
          { icon: 'sync', label: 'Transfer', color: 'text-emerald-400' }
        ].map((action, i) => (
          <button 
            key={i} 
            onClick={action.onClick}
            className="flex flex-col items-center gap-3 p-4 rounded-[2rem] bg-[#1a2430] border border-white/5 shadow-lg group active:scale-95 transition-all"
          >
            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <span className={`material-symbols-outlined text-2xl ${action.color}`}>{action.icon}</span>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Transaction History Section */}
      <section className="mt-2 flex-1 flex flex-col">
        <div className="px-5 flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-white tracking-tight uppercase">Recent Activity</h3>
        </div>
        
        <div className="flex flex-col border-t border-white/5 bg-[#151e2a]/30">
          {[
            { title: 'Deposit via Bkash', date: 'Today, 10:23 AM', amount: '+$ 200.00', status: 'Success', color: 'text-emerald-500', icon: 'download', iconBg: 'bg-emerald-500/10' },
            { title: 'Lightning Roulette Win', date: 'Yesterday, 8:45 PM', amount: '+$ 50.00', status: 'Added to Bonus', color: 'text-[#136dec]', icon: 'casino', iconBg: 'bg-blue-500/10' },
            { title: 'Withdrawal to Bank', date: 'Oct 24, 2:30 PM', amount: '-$ 150.00', status: 'Pending', color: 'text-orange-400', icon: 'upload', iconBg: 'bg-orange-500/10' },
          ].map((tx, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-5 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer group active:bg-black/20">
              <div className="flex items-center gap-4">
                <div className={`size-11 rounded-2xl ${tx.iconBg} flex items-center justify-center ${tx.color} border border-white/5 shadow-inner`}>
                  <span className="material-symbols-outlined text-[22px]">{tx.icon}</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-white text-sm font-black leading-none mb-1.5">{tx.title}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-base font-black ${tx.color}`}>{tx.amount}</p>
                <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.15em] mt-1">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="p-6 pb-20">
          <button onClick={onHistoryClick} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
            See Full History
          </button>
        </div>
      </section>
    </div>
  );
};

export default Wallet;
