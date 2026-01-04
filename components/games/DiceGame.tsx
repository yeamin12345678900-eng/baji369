
import React, { useState, useRef, useEffect } from 'react';

interface DiceGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onSaveBet?: (data: any) => void;
  riggingIntensity?: number;
  onBack: () => void;
}

const SOUNDS = {
  roll: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3',   
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',    
  lost: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',   
};

const BACKGROUND_URL = "https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=2073&auto=format&fit=crop";

const DiceGame: React.FC<DiceGameProps> = ({ balance, onUpdateBalance, onSaveBet, riggingIntensity = 0.5, onBack }) => {
  const [bet, setBet] = useState(100);
  const [target, setTarget] = useState(50);
  const [mode, setMode] = useState<'over' | 'under'>('over');
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

  const winProbability = mode === 'over' ? 100 - target : target;
  const multiplier = parseFloat((99 / winProbability).toFixed(4));

  const roll = () => {
    if (balance < bet) return;
    setIsRolling(true);
    setStatus('idle');
    onUpdateBalance(balance - bet);
    playSound('roll');

    setTimeout(() => {
      let res = Math.floor(Math.random() * 101);
      if (Math.random() < riggingIntensity * 0.5) {
        if (mode === 'over' && res > target) res = Math.floor(Math.random() * target);
        else if (mode === 'under' && res < target) res = target + Math.floor(Math.random() * (101 - target));
      }
      setResult(res);
      setIsRolling(false);
      const isWin = mode === 'over' ? res > target : res < target;
      if (isWin) {
        setStatus('won');
        playSound('win');
        const payout = bet * multiplier;
        onUpdateBalance(balance - bet + payout);
        if (onSaveBet) onSaveBet({ game_name: 'Dice', stake: bet, multiplier: multiplier, payout: payout, status: 'won' });
      } else {
        setStatus('lost');
        playSound('lost');
        if (onSaveBet) onSaveBet({ game_name: 'Dice', stake: bet, multiplier: 0, payout: 0, status: 'lost' });
      }
    }, 400);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0909] font-display overflow-hidden select-none relative">
      
      {/* Casino Table Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${BACKGROUND_URL}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0d0909]"></div>
        <div className="absolute inset-0 bg-emerald-950/10 backdrop-blur-[2px]"></div>
      </div>

      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-black/40 z-20 backdrop-blur-md">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-slate-400 active:scale-90 transition-colors"><span className="material-symbols-outlined">arrow_back</span></button>
        <div className="text-center">
            <h2 className="text-white font-black uppercase tracking-widest text-[10px]">DICE ELITE</h2>
            <p className="text-purple-400 font-black text-[8px] uppercase tracking-[0.2em]">High Stakes Floor</p>
        </div>
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-inner backdrop-blur-md">
            <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString()}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 overflow-hidden">
        <div className="w-full max-w-sm aspect-video bg-black/40 rounded-[2.5rem] border-4 border-white/10 flex items-center justify-center relative overflow-hidden backdrop-blur-md shadow-2xl">
           <div className={`text-8xl md:text-[120px] font-black tracking-tighter transition-all duration-300 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] ${
             status === 'won' ? 'text-emerald-500 scale-110 drop-shadow-[0_0_60px_rgba(16,185,129,0.5)]' : 
             status === 'lost' ? 'text-red-500 animate-in shake' : 'text-white'
           }`}>
             {result ?? 50}
           </div>
           
           <div className="absolute bottom-4 left-0 right-0 px-8">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex border border-white/5">
                 <div className={`h-full transition-all duration-300 ${mode === 'over' ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${target}%`}}></div>
                 <div className={`h-full transition-all duration-300 ${mode === 'over' ? 'bg-emerald-500' : 'bg-red-500'}`} style={{width: `${100-target}%`}}></div>
              </div>
           </div>
        </div>
        
        {/* Adjusted Stats Boxes for Mobile */}
        <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-[320px]">
           <div className="text-center bg-black/40 px-4 py-3 rounded-2xl border border-white/5 backdrop-blur-sm">
              <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mb-1">Multiplier</p>
              <h3 className="text-white font-black text-xl tabular-nums">{multiplier.toFixed(2)}x</h3>
           </div>
           <div className="text-center bg-black/40 px-4 py-3 rounded-2xl border border-white/5 backdrop-blur-sm">
              <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mb-1">Win Chance</p>
              <h3 className="text-emerald-400 font-black text-xl tabular-nums">{winProbability.toFixed(2)}%</h3>
           </div>
        </div>
      </div>

      {/* Optimized Control Panel for small screens */}
      <div className="p-6 bg-[#1a0d0e]/95 backdrop-blur-2xl rounded-t-[3rem] border-t border-white/10 space-y-4 pb-12 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] z-20">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
           <button onClick={() => setMode('under')} className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${mode === 'under' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Roll Under</button>
           <button onClick={() => setMode('over')} className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${mode === 'over' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Roll Over</button>
        </div>

        <div className="space-y-4 pt-2">
           <input type="range" min="1" max="99" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary border border-white/5" />
           <div className="flex justify-between px-2">
              <span className="text-[9px] font-black text-slate-600">1</span>
              <span className="text-[9px] font-black text-slate-600">50</span>
              <span className="text-[9px] font-black text-slate-600">99</span>
           </div>
        </div>

        <div className="flex flex-col gap-2">
           <div className="h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center px-4 shadow-inner focus-within:border-primary/50 transition-colors">
              <span className="text-slate-600 font-black text-lg mr-2">$</span>
              <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} className="bg-transparent border-none focus:ring-0 text-white font-black text-lg w-full tabular-nums p-0" />
           </div>
        </div>

        <button onClick={roll} disabled={isRolling} className="w-full h-16 bg-primary text-white rounded-[1.8rem] font-black uppercase tracking-[0.3em] text-lg shadow-2xl active:scale-95 transition-all">
          {isRolling ? 'ROLLING...' : 'ROLL DICE'}
        </button>
      </div>
    </div>
  );
};

export default DiceGame;
