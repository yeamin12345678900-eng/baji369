
import React, { useState, useEffect } from 'react';
import { getBetHistory, supabase } from '../services/supabase';
import { Language } from '../services/translations';

interface MyBetsProps {
  lang: Language;
  user?: any;
  onBack: () => void;
  onNavigateHome: () => void;
  initialTab?: 'bets' | 'transactions';
}

type BetStatus = 'won' | 'lost' | 'running';
type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'success';

interface BetRecord {
  id: string;
  game_name: string;
  stake: number;
  multiplier: number;
  payout: number;
  status: BetStatus;
  created_at: string;
}

interface TransactionRecord {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  method: string;
  status: TransactionStatus;
  created_at: string;
}

const MyBets: React.FC<MyBetsProps> = ({ lang, user, onBack, onNavigateHome, initialTab = 'bets' }) => {
  const [mainTab, setMainTab] = useState<'bets' | 'transactions'>(initialTab);
  const [filterTab, setFilterTab] = useState<'all' | 'open' | 'settled'>('all');
  const [bets, setBets] = useState<BetRecord[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user, mainTab]);

  const fetchData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      if (mainTab === 'bets') {
        const { data, error } = await getBetHistory(user.id);
        if (data) setBets(data);
      } else {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setTransactions(data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      won: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      success: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      approved: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      lost: 'text-red-500 bg-red-500/10 border-red-500/20',
      rejected: 'text-red-500 bg-red-500/10 border-red-500/20',
      running: 'text-blue-500 bg-blue-500/10 border-blue-500/20 animate-pulse',
      pending: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    };
    return (
      <span className={`flex items-center gap-1 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${colors[status] || 'text-slate-400'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0909] animate-in slide-in-from-right duration-500 overflow-hidden font-display relative">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0d0909]/90 backdrop-blur-xl px-4 py-4 border-b border-white/5 flex items-center shadow-2xl">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-90">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="flex-1 text-center pr-10">
          <h2 className="text-lg font-black text-white tracking-tight uppercase italic">{mainTab === 'bets' ? 'Betting Logs' : 'Financial Logs'}</h2>
          <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">Verified History</p>
        </div>
      </div>

      {/* Main Switcher */}
      <div className="flex p-4 gap-2 bg-[#140a0b] border-b border-white/5">
        <button 
          onClick={() => setMainTab('bets')} 
          className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${mainTab === 'bets' ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}
        >
          <span className="material-symbols-outlined text-sm">casino</span> Game Bets
        </button>
        <button 
          onClick={() => setMainTab('transactions')} 
          className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${mainTab === 'transactions' ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}
        >
          <span className="material-symbols-outlined text-sm">payments</span> Transactions
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase mt-4">Syncing History...</p>
          </div>
        ) : (mainTab === 'bets' ? bets : transactions).length > 0 ? (
          <div className="p-4 space-y-4">
            {mainTab === 'bets' ? bets.map((bet) => (
              <div key={bet.id} className="bg-[#1a0d0e] rounded-[2rem] border border-white/5 overflow-hidden shadow-xl group">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">sports_esports</span>
                    </div>
                    <h4 className="text-white font-black text-xs leading-none uppercase tracking-tighter">{bet.game_name}</h4>
                  </div>
                  {getStatusBadge(bet.status)}
                </div>
                <div className="p-5 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Stake / Result</span>
                    <p className="text-white font-black text-sm">${bet.stake} <span className="text-primary mx-1">→</span> <span className={bet.status === 'won' ? 'text-emerald-500' : 'text-slate-500'}>${bet.payout}</span></p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Date</span>
                    <p className="text-slate-400 font-bold text-[10px]">{new Date(bet.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )) : transactions.map((tx) => (
              <div key={tx.id} className="bg-[#1a0d0e] rounded-[2rem] border border-white/5 overflow-hidden shadow-xl group">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-xl flex items-center justify-center shadow-lg ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      <span className="material-symbols-outlined text-[20px]">{tx.type === 'deposit' ? 'download' : 'upload'}</span>
                    </div>
                    <h4 className="text-white font-black text-xs leading-none uppercase tracking-tighter">{tx.type} via {tx.method}</h4>
                  </div>
                  {getStatusBadge(tx.status)}
                </div>
                <div className="p-5 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Amount</span>
                    <p className={`text-lg font-black italic ${tx.type === 'deposit' ? 'text-emerald-500' : 'text-orange-400'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Processed On</span>
                    <p className="text-slate-400 font-bold text-[10px]">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-24 px-10 opacity-30 text-center">
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl">history</span>
            </div>
            <h3 className="text-white font-black text-lg uppercase">Empty Logs</h3>
            <p className="text-slate-500 text-[10px] font-bold mt-2">No data found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBets;
