
import React, { useState, useEffect } from 'react';
import { Language } from '../services/translations';
import { supabase } from '../services/supabase';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected' | 'success';
  created_at: string;
}

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        if (data) setTransactions(data);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'success': return 'text-emerald-500';
      case 'pending': return 'text-orange-400';
      case 'rejected': return 'text-red-500';
      default: return 'text-slate-400';
    }
  };

  const getIconConfig = (type: string) => {
    return type === 'deposit' 
      ? { icon: 'download', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
      : { icon: 'upload', color: 'text-orange-400', bg: 'bg-orange-500/10' };
  };

  return (
    <div className="flex flex-col h-full bg-[#101822] animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar font-display">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#101822]/95 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="size-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 active:scale-90 transition-all">
            <span className="material-symbols-outlined text-primary text-sm">arrow_back</span>
          </button>
          <h2 className="text-lg font-black text-white tracking-tight uppercase">My Wallet</h2>
        </div>
        <button onClick={onHistoryClick} className="text-primary text-[10px] font-black uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
           Full History
        </button>
      </header>

      {/* Balance Card */}
      <div className="px-5 pt-6 pb-2">
        <div className="bg-gradient-to-br from-[#136dec] to-[#0a47a1] rounded-[2rem] p-7 shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute -right-8 -top-8 size-48 bg-white/10 rounded-full blur-3xl"></div>
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
                <p className="text-sm font-black text-white">${balance.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/5">
                <p className="text-[9px] font-black text-yellow-400 uppercase tracking-widest mb-1">Bonus</p>
                <p className="text-sm font-black text-yellow-400">$0.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-6 grid grid-cols-3 gap-3">
        {[
          { icon: 'add_circle', label: 'Deposit', color: 'text-primary', onClick: onDepositClick },
          { icon: 'account_balance_wallet', label: 'Withdraw', color: 'text-orange-400', onClick: onWithdrawClick },
          { icon: 'sync', label: 'Transfer', color: 'text-emerald-400', onClick: () => alert("Transfer coming soon!") }
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

      {/* Recent Activity */}
      <section className="mt-2 flex-1 flex flex-col">
        <div className="px-6 flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-white tracking-tight uppercase">Recent Activity</h3>
        </div>
        
        <div className="flex flex-col border-t border-white/5 bg-[#151e2a]/30 min-h-[200px]">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-10">
              <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : transactions.length > 0 ? (
            transactions.map((tx) => {
              const config = getIconConfig(tx.type);
              return (
                <div key={tx.id} className="flex items-center justify-between px-5 py-5 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`size-11 rounded-2xl ${config.bg} flex items-center justify-center ${config.color} border border-white/5 shadow-inner`}>
                      <span className="material-symbols-outlined text-[22px]">{config.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-white text-sm font-black leading-none mb-1.5 uppercase">
                        {tx.type} via {tx.method}
                      </p>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-base font-black ${tx.type === 'deposit' ? 'text-emerald-500' : 'text-orange-400'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}$ {tx.amount.toLocaleString()}
                    </p>
                    <p className={`text-[9px] font-black uppercase tracking-[0.15em] mt-1 ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-10 opacity-30 text-center">
               <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl">history</span>
               </div>
               <p className="text-xs font-black uppercase tracking-widest mb-1">No Activity Found</p>
               <p className="text-[10px] font-bold leading-relaxed">Transactions will appear here once processed.</p>
            </div>
          )}
        </div>
        
        {transactions.length > 0 && (
          <div className="p-6 pb-20">
            <button onClick={onHistoryClick} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
              See Full History
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Wallet;
