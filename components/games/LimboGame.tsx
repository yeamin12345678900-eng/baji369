
import React, { useState, useRef, useEffect } from 'react';

interface LimboGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onSaveBet?: (data: any) => void;
  riggingIntensity?: number;
  onBack: () => void;
}

const BACKGROUND_URL = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop";

const LimboGame: React.FC<LimboGameProps> = ({ balance, onUpdateBalance, onSaveBet, riggingIntensity = 0.5, onBack }) => {
  const [bet, setBet] = useState(100);
  const [target, setTarget] = useState(2.00);
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [status, setStatus] = useState<'idle' | 'won' | 'lost'>('idle');

  const roll = () => {
    if (balance < bet) return;
    setIsRolling(true);
    setStatus('idle');
    onUpdateBalance(balance - bet);
    setTimeout(() => {
      const res = parseFloat((0.99 / (1 - Math.random())).toFixed(2));
      setResult(res);
      setIsRolling(false);
      if (res >= target) {
        setStatus('won');
        onUpdateBalance(balance - bet + (bet * target));
      } else {
        setStatus('lost');
      }
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0909] font-display overflow-y-auto no-scrollbar select-none relative pb-10">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${BACKGROUND_URL}")` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0909]/95 via-transparent to-[#0d0909]"></div>
      </div>

      <header className="sticky top-0 z-50 p-4 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5"><span className="material-symbols-outlined">arrow_back</span></button>
        <h2 className="text-emerald-500 font-black uppercase text-xs tracking-widest italic">Limbo Pro</h2>
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-inner">
            <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center pt-10 px-4">
        <div className="h-48 flex flex-col items-center justify-center mb-10">
            <h1 className={`text-8xl font-black tabular-nums drop-shadow-2xl transition-all ${status === 'won' ? 'text-emerald-500 scale-110' : status === 'lost' ? 'text-red-500' : 'text-white'}`}>
              {result ? result.toFixed(2) : target.toFixed(2)}<span className="text-3xl ml-1 italic">x</span>
            </h1>
            {isRolling && <p className="text-white text-[10px] uppercase tracking-widest animate-pulse mt-4">Rolling...</p>}
        </div>

        <div className="w-full max-w-[400px] bg-[#1a0d0e] rounded-[3rem] border border-white/10 p-6 space-y-5 shadow-2xl shadow-black/60">
          <div className="grid grid-cols-2 gap-3">
             <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bet Amount</span>
                <div className="h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 shadow-inner">
                   <span className="text-slate-600 font-black text-lg">$</span>
                   <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} className="bg-transparent border-none focus:ring-0 text-white font-black text-lg w-full p-0 tabular-nums" />
                </div>
             </div>
             <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Target x</span>
                <div className="h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 shadow-inner">
                   <input type="number" step="0.01" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="bg-transparent border-none focus:ring-0 text-white font-black text-lg w-full p-0 tabular-nums" />
                   <span className="text-slate-600 font-black text-lg">x</span>
                </div>
             </div>
          </div>
          <button onClick={roll} disabled={isRolling} className="w-full h-20 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-xl active:scale-95 transition-all">
             {isRolling ? "WAIT..." : "ROLL NOW"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default LimboGame;
