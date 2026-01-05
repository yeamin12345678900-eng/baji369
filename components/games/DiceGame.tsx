
import React, { useState, useRef, useEffect } from 'react';

interface DiceGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onSaveBet?: (data: any) => void;
  riggingIntensity?: number;
  onBack: () => void;
}

const BACKGROUND_URL = "https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=2073&auto=format&fit=crop";

const DiceGame: React.FC<DiceGameProps> = ({ balance, onUpdateBalance, onSaveBet, riggingIntensity = 0.5, onBack }) => {
  const [bet, setBet] = useState(100);
  const [target, setTarget] = useState(50);
  const [mode, setMode] = useState<'over' | 'under'>('over');
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [status, setStatus] = useState<'idle' | 'won' | 'lost'>('idle');

  const winProbability = mode === 'over' ? 100 - target : target;
  const multiplier = parseFloat((99 / winProbability).toFixed(4));

  const roll = () => {
    if (balance < bet) return;
    setIsRolling(true);
    setStatus('idle');
    onUpdateBalance(balance - bet);
    setTimeout(() => {
      const res = Math.floor(Math.random() * 101);
      setResult(res);
      setIsRolling(false);
      const isWin = mode === 'over' ? res > target : res < target;
      if (isWin) {
        setStatus('won');
        onUpdateBalance(balance - bet + (bet * multiplier));
      } else {
        setStatus('lost');
      }
    }, 400);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0909] font-display overflow-y-auto no-scrollbar select-none relative pb-10">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${BACKGROUND_URL}")` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-transparent to-[#0d0909]"></div>
      </div>

      <header className="sticky top-0 z-50 p-4 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5"><span className="material-symbols-outlined">arrow_back</span></button>
        <h2 className="text-purple-400 font-black uppercase text-xs tracking-widest italic">Dice Elite</h2>
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-inner">
            <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center pt-10 px-4">
        <div className="w-full max-w-sm aspect-video bg-black/60 rounded-[2.5rem] border-2 border-white/10 flex items-center justify-center relative shadow-2xl backdrop-blur-md mb-10">
           <h1 className={`text-8xl font-black drop-shadow-2xl transition-all ${status === 'won' ? 'text-emerald-500 scale-110' : status === 'lost' ? 'text-red-500' : 'text-white'}`}>
             {result ?? 50}
           </h1>
           <div className="absolute bottom-4 left-6 right-6 h-1 bg-white/10 rounded-full overflow-hidden flex">
              <div className={`h-full ${mode === 'over' ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${target}%`}}></div>
              <div className={`h-full ${mode === 'over' ? 'bg-emerald-500' : 'bg-red-500'}`} style={{width: `${100-target}%`}}></div>
           </div>
        </div>

        <div className="w-full max-w-[400px] bg-[#1a0d0e] rounded-[3rem] border border-white/10 p-6 space-y-6 shadow-2xl shadow-black/60">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
             <button onClick={() => setMode('under')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${mode === 'under' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Roll Under</button>
             <button onClick={() => setMode('over')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${mode === 'over' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Roll Over</button>
          </div>
          <input type="range" min="1" max="99" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none accent-primary border border-white/5" />
          <div className="flex justify-between items-center px-1">
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase">Multiplier</span>
                <span className="text-xl font-black text-white">{multiplier.toFixed(2)}x</span>
             </div>
             <div className="flex flex-col text-right">
                <span className="text-[8px] font-black text-slate-500 uppercase">Chance</span>
                <span className="text-xl font-black text-emerald-400">{winProbability.toFixed(2)}%</span>
             </div>
          </div>
          <div className="h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center px-4">
              <span className="text-slate-600 font-black text-lg mr-2">$</span>
              <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} className="bg-transparent border-none focus:ring-0 text-white font-black text-lg w-full p-0 tabular-nums" />
          </div>
          <button onClick={roll} disabled={isRolling} className="w-full h-16 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-xl active:scale-95 transition-all">
             {isRolling ? "ROLLING..." : "ROLL DICE"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default DiceGame;
