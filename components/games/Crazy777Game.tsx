
import React, { useState, useEffect, useRef } from 'react';

interface Crazy777GameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onSaveBet?: (data: any) => void;
  riggingIntensity?: number;
  onBack: () => void;
}

const SYMBOLS = [
  { id: '7', label: '7', color: 'text-red-500', value: 10, weight: 10 },
  { id: '77', label: '77', color: 'text-blue-500', value: 25, weight: 6 },
  { id: '777', label: '777', color: 'text-yellow-500', value: 100, weight: 2 },
  { id: 'bar', label: 'BAR', color: 'text-slate-300', value: 5, weight: 15 },
  { id: 'bar2', label: 'BARx2', color: 'text-slate-300', value: 10, weight: 10 },
  { id: 'bar3', label: 'BARx3', color: 'text-slate-300', value: 15, weight: 8 },
  { id: 'crazy', label: 'CRAZY', color: 'text-primary', value: 500, weight: 1 },
  { id: 'blank', label: '-', color: 'text-slate-800', value: 0, weight: 20 },
];

const SPECIAL_REEL = [
  { id: 'x2', label: 'x2', multiplier: 2, weight: 10 },
  { id: 'x5', label: 'x5', multiplier: 5, weight: 5 },
  { id: 'x10', label: 'x10', multiplier: 10, weight: 2 },
  { id: 'respin', label: 'RESPIN', multiplier: 1, respin: true, weight: 3 },
  { id: 'plus10', label: '+$10', bonus: 10, weight: 5 },
  { id: 'blank', label: '0', multiplier: 0, weight: 40 },
];

const SOUNDS = {
  spin: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  loss: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
};

const BACKGROUND_URL = "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=2070&auto=format&fit=crop";

const Crazy777Game: React.FC<Crazy777GameProps> = ({ balance, onUpdateBalance, onSaveBet, riggingIntensity = 0.5, onBack }) => {
  const [bet, setBet] = useState(100);
  const [reels, setReels] = useState<any[]>([SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]]);
  const [special, setSpecial] = useState<any>(SPECIAL_REEL[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState<number | null>(null);
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

  const getRandomSymbol = (list: any[]) => {
    const totalWeight = list.reduce((acc, sym) => acc + sym.weight, 0);
    let random = Math.random() * totalWeight;
    for (const sym of list) {
      if (random < sym.weight) return sym;
      random -= sym.weight;
    }
    return list[list.length - 1];
  };

  const handleSpin = () => {
    if (isSpinning || balance < bet) return;
    
    setIsSpinning(true);
    setWinAmount(null);
    onUpdateBalance(balance - bet);
    playSound('spin');

    const adjustedSymbols = SYMBOLS.map(s => s.id === 'blank' ? { ...s, weight: s.weight + (riggingIntensity * 100) } : s);
    const adjustedSpecial = SPECIAL_REEL.map(s => s.id === 'blank' ? { ...s, weight: s.weight + (riggingIntensity * 150) } : s);

    setTimeout(() => {
      const res1 = getRandomSymbol(adjustedSymbols);
      const res2 = getRandomSymbol(adjustedSymbols);
      const res3 = getRandomSymbol(adjustedSymbols);
      const spec = getRandomSymbol(adjustedSpecial);

      setReels([res1, res2, res3]);
      setSpecial(spec);
      setIsSpinning(false);

      let baseWin = 0;
      let multiplier = 1;
      let finalPayout = 0;

      if (res1.id !== 'blank' && res1.id === res2.id && res2.id === res3.id) {
        baseWin = res1.value;
      } else if (res1.id !== 'blank' && res2.id !== 'blank' && res3.id !== 'blank') {
        baseWin = 2; 
      }

      if (baseWin > 0) {
        multiplier = spec.multiplier !== undefined && spec.multiplier > 0 ? spec.multiplier : 1;
        const bonus = spec.bonus || 0;
        finalPayout = (baseWin * (bet / 10) * multiplier) + bonus;

        if (finalPayout > 0) {
          onUpdateBalance(balance - bet + finalPayout);
          setWinAmount(finalPayout);
          playSound('win');
        }
      } else {
        playSound('loss');
      }

      if (onSaveBet) {
        onSaveBet({
          game_name: 'Crazy 777',
          stake: bet,
          multiplier: baseWin > 0 ? (finalPayout / bet) : 0,
          payout: finalPayout,
          status: finalPayout > 0 ? 'won' : 'lost'
        });
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0505] font-display overflow-hidden select-none relative">
      
      {/* Premium Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${BACKGROUND_URL}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#0a0505]"></div>
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px]"></div>
      </div>

      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-black/60 z-20 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-yellow-500 font-black uppercase tracking-[0.2em] text-[10px] italic">Baji Casino</h2>
            <h1 className="text-white font-black text-sm uppercase tracking-tighter italic">CRAZY 777</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMuted(!isMuted)} className="text-slate-500">
            <span className="material-symbols-outlined text-[20px]">{isMuted ? 'volume_off' : 'volume_up'}</span>
          </button>
          <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-inner backdrop-blur-md">
              <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        {/* Jackpot Board */}
        <div className="mb-6 w-full max-w-sm bg-gradient-to-b from-yellow-600/40 to-black/60 border-2 border-yellow-500/30 rounded-[2.5rem] p-6 text-center shadow-2xl backdrop-blur-md">
            <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1.5 animate-pulse">Crazy Grand Jackpot</p>
            <h2 className="text-white text-4xl font-black italic tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">${(bet * 3333).toLocaleString()}</h2>
        </div>

        {/* Slot Machine UI */}
        <div className="flex items-center gap-2 bg-gradient-to-b from-[#2d1b1c]/90 to-black/95 p-6 md:p-8 rounded-[4rem] border-[4px] border-yellow-500/30 shadow-[0_0_120px_rgba(0,0,0,0.9)] relative backdrop-blur-md">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] z-30 shadow-xl shadow-yellow-500/30">Triple Payline</div>
           
           <div className="flex gap-4">
              {reels.map((sym, i) => (
                <div key={i} className={`w-20 h-32 md:w-28 md:h-40 rounded-[2rem] bg-black border border-white/10 flex items-center justify-center overflow-hidden relative ${isSpinning ? 'animate-reel-spin' : 'animate-in fade-in duration-300'}`}>
                   <span className={`text-3xl md:text-5xl font-black italic tracking-tighter ${sym.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] text-center leading-none px-2`}>
                    {sym.label}
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none"></div>
                   <div className="absolute inset-x-0 h-[2px] bg-yellow-500/20 top-1/2 -translate-y-1/2 pointer-events-none"></div>
                </div>
              ))}
           </div>

           <div className="w-[3px] h-24 bg-gradient-to-b from-transparent via-yellow-500/50 to-transparent mx-3"></div>

           <div className={`w-24 h-32 md:w-32 md:h-40 rounded-[2rem] bg-gradient-to-br from-primary/40 to-black border-[3px] border-primary/40 flex flex-col items-center justify-center overflow-hidden relative ${isSpinning ? 'animate-reel-spin' : ''}`}>
              <span className="text-primary text-[9px] font-black uppercase tracking-[0.2em] absolute top-4">SPECIAL</span>
              <span className="text-white text-3xl md:text-5xl font-black italic drop-shadow-[0_0_20px_rgba(234,42,51,0.7)]">{special.label}</span>
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none"></div>
           </div>
        </div>

        <div className="h-24 mt-8 flex items-center justify-center">
           {winAmount && (
             <div className="animate-in zoom-in duration-500 text-center">
                <p className="text-yellow-500 text-[12px] font-black uppercase tracking-[0.5em] mb-2 italic drop-shadow-lg">Jackpot Win!</p>
                <h1 className="text-white text-6xl font-black italic tracking-tighter tabular-nums drop-shadow-[0_0_40px_rgba(234,42,51,0.6)]">${winAmount.toLocaleString()}</h1>
             </div>
           )}
        </div>
      </div>

      <div className="p-8 bg-[#1a0d0e]/95 backdrop-blur-2xl rounded-t-[4rem] border-t border-white/10 space-y-6 pb-14 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] z-20">
        <div className="flex items-center gap-3 h-16 bg-white/5 rounded-2xl border border-white/10 px-6 group focus-within:border-yellow-500/50 transition-all shadow-inner">
           <span className="text-slate-600 font-black text-xl">$</span>
           <input 
              type="number" 
              value={bet}
              onChange={(e) => setBet(Math.max(0, Number(e.target.value)))}
              disabled={isSpinning}
              className="bg-transparent border-none focus:ring-0 text-white font-black text-2xl w-full p-0 tabular-nums"
           />
           <div className="flex gap-2">
              <button onClick={() => setBet(prev => prev * 2)} disabled={isSpinning} className="text-[10px] font-black text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 active:bg-yellow-500 transition-all">x2</button>
              <button onClick={() => setBet(prev => Math.floor(prev / 2))} disabled={isSpinning} className="text-[10px] font-black text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 active:bg-yellow-500 transition-all">1/2</button>
           </div>
        </div>

        <button 
          onClick={handleSpin}
          disabled={isSpinning || balance < bet}
          className={`w-full h-20 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-2xl transform transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-4 ${
            isSpinning ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-600 text-white shadow-yellow-500/40 hover:brightness-110'
          }`}
        >
          {isSpinning ? (
            <div className="size-8 border-[6px] border-slate-700 border-t-yellow-500 rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined text-4xl">autorenew</span>
              SPIN
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes reel-spin {
          0% { transform: translateY(-15%); opacity: 0.7; filter: blur(3px); }
          50% { transform: translateY(15%); opacity: 1; filter: blur(6px); }
          100% { transform: translateY(-15%); opacity: 0.7; filter: blur(3px); }
        }
        .animate-reel-spin {
          animation: reel-spin 0.1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Crazy777Game;
