
import React, { useState, useEffect } from 'react';
import { getBetHistory } from '../services/supabase';
import { Language } from '../services/translations';

interface MyBetsProps {
  lang: Language;
  user?: any;
  onBack: () => void;
  onNavigateHome: () => void;
}

type BetStatus = 'won' | 'lost' | 'running';

interface BetRecord {
  id: string;
  game_name: string;
  stake: number;
  multiplier: number;
  payout: number;
  status: BetStatus;
  created_at: string;
}

const MyBets: React.FC<MyBetsProps> = ({ lang, user, onBack, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'settled'>('all');
  const [bets, setBets] = useState<BetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await getBetHistory(user.id);
        if (data) {
          setBets(data);
        }
      } catch (err) {
        console.error("Error fetching bets:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBets();
  }, [user]);

  const filteredBets = bets.filter(bet => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return bet.status === 'running';
    if (activeTab === 'settled') return bet.status === 'won' || bet.status === 'lost';
    return true;
  });

  const getStatusBadge = (status: BetStatus) => {
    switch (status) {
      case 'won':
        return <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">Won</span>;
      case 'lost':
        return <span className="flex items-center gap-1 text-[9px] font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-red-500/20">Lost</span>;
      case 'running':
        return <span className="flex items-center gap-1 text-[9px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20 animate-pulse">Running</span>;
    }
  };

  const getGameIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'penalty': return 'sports_soccer';
      case 'crash': return 'rocket_launch';
      case 'mines': return 'grid_view';
      case 'limbo': return 'trending_up';
      case 'dice': return 'casino';
      case 'plinko': return 'keyboard_double_arrow_down';
      default: return 'sports_esports';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#101922] animate-in slide-in-from-right duration-500 overflow-hidden font-display relative">
      <div className="sticky top-0 z-50 bg-[#101922]/90 backdrop-blur-xl px-4 py-4 border-b border-[#233648] flex items-center">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-90">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="flex-1 text-center pr-10">
          <h2 className="text-lg font-black text-white tracking-tight uppercase">Betting History</h2>
          <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">Transaction Logs</p>
        </div>
      </div>

      <div className="flex p-4 gap-2 bg-[#101922] border-b border-[#233648]">
        {(['all', 'open', 'settled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-[#1A2633] text-slate-500 border border-[#233648]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredBets.length > 0 ? (
          <div className="p-4 space-y-4">
            {filteredBets.map((bet) => (
              <div key={bet.id} className="bg-[#1A2633] rounded-[2rem] border border-[#233648] overflow-hidden shadow-xl group">
                <div className="px-5 py-4 border-b border-[#233648] flex items-center justify-between bg-[#1D2B3A]">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#233648] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">{getGameIcon(bet.game_name)}</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Baji Original</p>
                      <h4 className="text-white font-black text-xs leading-none uppercase tracking-tighter">{bet.game_name}</h4>
                    </div>
                  </div>
                  {getStatusBadge(bet.status)}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Bet Stake</span>
                      <p className="text-white font-black text-sm">${Number(bet.stake).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Multiplier</span>
                      <p className="text-primary font-black text-lg leading-none">{Number(bet.multiplier).toFixed(2)}x</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 pt-4 border-t border-[#233648]">
                    <div className={`p-3 rounded-xl border border-white/5 ${bet.status === 'won' ? 'bg-emerald-500/5' : 'bg-[#101922]'}`}>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Payout Amount</p>
                      <p className={`font-black text-sm ${bet.status === 'won' ? 'text-emerald-500' : 'text-white'}`}>
                        ${Number(bet.payout).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-[#1D2B3A]/50 flex items-center justify-between text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">
                  <span>ID: {bet.id.split('-')[0]}</span>
                  <span>{new Date(bet.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-24 px-10 opacity-40">
            <div className="size-24 rounded-full bg-[#1A2633] flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl">receipt_long</span>
            </div>
            <h3 className="text-white font-black text-lg tracking-tight uppercase">No History</h3>
            <p className="text-slate-500 text-[10px] font-bold mt-2 text-center leading-relaxed">
              Start playing to see your betting records here.
            </p>
            <button 
              onClick={onNavigateHome}
              className="mt-8 px-8 h-12 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-primary/20 active:scale-95 transition-all"
            >
              Go to Casino
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBets;
