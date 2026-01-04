
import React, { useState, useRef, useEffect } from 'react';

interface LimboGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onSaveBet?: (data: any) => void;
  riggingIntensity?: number;
  onBack: () => void;
}

const SOUNDS = {
  start: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',   
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',     
  lost: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',    
};

const BACKGROUND_URL = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop";

const LimboGame: React.FC<LimboGameProps> = ({ balance, onUpdateBalance, onSaveBet, riggingIntensity = 0.5, onBack }) => {
  const [bet, setBet] = useState(100);
  const [target, setTarget] = useState(2.00);
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [status, setStatus] = useState<'idle' | 'won' | 'lost'>('idle');
  const [isMuted, setIsMuted] = useState(false);

  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      audioRefs.current[key] = new Audio(url);
    });
  }, []);

  const playSound = (key: keyof typeof SOUNDS) => {
    if (isMuted) return;
    const sound = audioRefs.current[key];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  };

  const roll = () => {
    if (balance < bet) return;
    setIsRolling(true);
    setStatus('idle');
    onUpdateBalance(balance - bet);
    playSound('start');

    setTimeout(() => {
      const riggedBase = 0.99 - (riggingIntensity * 0.05);
      const res = parseFloat((riggedBase / (1 - Math.random())).toFixed(2));
      setResult(res);
      setIsRolling(false);
      
      if (res >= target) {
        setStatus('won');
        playSound('win');
        const payout = bet * target;
        onUpdateBalance(balance - bet + payout);
        if (onSaveBet) onSaveBet({ game_name: 'Limbo', stake: bet, multiplier: target, payout: payout, status: 'won' });
      } else {
        setStatus('lost');
        playSound('lost');
        if (onSaveBet) onSaveBet({ game_name: 'Limbo', stake: bet, multiplier: 0, payout: 0, status: 'lost' });
      }
    }, 600);
  };

  const winProbability = parseFloat((99 / target).toFixed(2));

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0d0909] font-display overflow-hidden select-none relative">
      
      {/* Sci-Fi Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[15000ms] ease-linear"
          style={{ 
            backgroundImage: `url("${BACKGROUND_URL}")`,
            transform: isRolling ? 'scale(1.2)' : 'scale(1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0d0909]"></div>
        <div className="absolute inset-0 bg-emerald-900/10 backdrop-blur-[1px]"></div>
      </div>

      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-black/40 z-20 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5 transition-colors"><span className="material-symbols-outlined">arrow_back</span></button>
        <div className="text-center">
            <h2 className="text-white font-black uppercase tracking-widest text-[10px]">LIMBO PRO</h2>
            <p className="text-emerald-500 font-black text-[8px] uppercase tracking-[0.2em]">Atomic Odds Engine</p>
        </div>
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-inner backdrop-blur-md">
            <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString()}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <div className={`text-[120px] font-black tracking-tighter leading-none transition-all duration-300 drop-shadow-[0_0_50px_rgba(255,255,255,0.2)] ${
          status === 'won' ? 'text-emerald-500 scale-110 drop-shadow-[0_0_60px_rgba(16,185,129,0.5)]' : 
          status === 'lost' ? 'text-red-500' : 'text-white'
        }`}>
          {result ? result.toFixed(2) : target.toFixed(2)}
          <span className="text-4xl ml-1 italic">x</span>
        </div>
        
        <div className="h-16 mt-6 flex flex-col items-center justify-center">
           {status === 'won' && <h2 className="text-emerald-500 font-black text-3xl uppercase tracking-[0.3em] animate-bounce italic drop-shadow-lg">WINNER!</h2>}
           {status === 'lost' && <h2 className="text-red-500 font-black text-3xl uppercase tracking-[0.3em] italic drop-shadow-lg">BUSTED!</h2>}
           {isRolling && (
             <div className="flex gap-2">
               <div className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-[0_0_10px_rgba(234,42,51,0.8)]"></div>
               <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.2s] shadow-[0_0_10px_rgba(234,42,51,0.8)]"></div>
               <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.4s] shadow-[0_0_10px_rgba(234,42,51,0.8)]"></div>
             </div>
           )}
        </div>
      </div>

      <div className="p-8 bg-[#1a0d0e]/95 backdrop-blur-2xl rounded-t-[4rem] border-t border-white/10 space-y-6 pb-14 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] z-20">
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Bet Amount</label>
              <div className="h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center px-4 shadow-inner">
                 <span className="text-slate-600 font-black text-xl">$</span>
                 <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} className="bg-transparent border-none focus:ring-0 text-white font-black text-xl w-full" />
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Target</label>
              <div className="h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center px-4 shadow-inner">
                 <input type="number" step="0.01" value={target} onChange={(e) => setTarget(Math.max(1.01, Number(e.target.value)))} className="bg-transparent border-none focus:ring-0 text-white font-black text-xl w-full" />
                 <span className="text-slate-600 font-black text-xl ml-2">x</span>
              </div>
           </div>
        </div>

        <div className="flex items-center justify-between px-2">
           <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Calculated Win Probability</span>
           <span className="text-emerald-500 text-[10px] font-black tracking-widest italic">{winProbability}%</span>
        </div>

        <button 
          onClick={roll} disabled={isRolling}
          className="w-full h-20 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xl shadow-[0_15px_40px_rgba(234,42,51,0.4)] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isRolling ? 'ROLLING...' : 'ROLL'}
        </button>
      </div>
    </div>
  );
};

export default LimboGame;
