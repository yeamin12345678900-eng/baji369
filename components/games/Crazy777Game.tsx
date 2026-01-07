
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
  { id: 'respin', label: 'RESPIN', multiplier: 1, weight: 3 },
  { id: 'plus10', label: '+$10', weight: 5 },
  { id: 'blank', label: '0', multiplier: 0, weight: 40 },
];

const SOUNDS = {
  spin: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  jackpot: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'
};

const BACKGROUND_URL = "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=2070&auto=format&fit=crop";

const Crazy777Game: React.FC<Crazy777GameProps> = ({ balance, onUpdateBalance, onSaveBet, riggingIntensity = 0.5, onBack }) => {
  const [bet, setBet] = useState(100);
  const [reels, setReels] = useState<any[]>([SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]]);
  const [special, setSpecial] = useState<any>(SPECIAL_REEL[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      audioRefs.current[key] = new Audio(url);
    });
  }, []);

  const playSound = (key: keyof typeof SOUNDS) => {
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

    setTimeout(() => {
      const res1 = getRandomSymbol(SYMBOLS);
      const res2 = getRandomSymbol(SYMBOLS);
      const res3 = getRandomSymbol(SYMBOLS);
      const spec = getRandomSymbol(SPECIAL_REEL);
      setReels([res1, res2, res3]);
      setSpecial(spec);
      setIsSpinning(false);
      
      if (res1.id !== 'blank' && res1.id === res2.id && res2.id === res3.id) {
        const mult = spec.multiplier || 1;
        const payout = (res1.value * (bet / 10) * mult);
        setWinAmount(payout);
        onUpdateBalance(balance - bet + payout);
        if (payout > bet * 10) playSound('jackpot');
        else playSound('win');
        if (onSaveBet) onSaveBet({ game_name: 'Crazy777', stake: bet, multiplier: payout/bet, payout, status: 'won' });
      } else {
        if (onSaveBet) onSaveBet({ game_name: 'Crazy777', stake: bet, multiplier: 0, payout: 0, status: 'lost' });
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0505] font-display overflow-y-auto no-scrollbar select-none relative pb-10">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${BACKGROUND_URL}")` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/40 to-[#0a0505]"></div>
      </div>

      <header className="sticky top-0 z-50 p-4 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5 transition-transform"><span className="material-symbols-outlined">arrow_back</span></button>
        <h2 className="text-yellow-500 font-black uppercase text-xs tracking-[0.2em] italic">Crazy 777</h2>
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-inner backdrop-blur-md">
            <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center pt-10 px-4">
        <div className="mb-6 w-full max-w-sm bg-gradient-to-b from-yellow-600/40 to-black/60 border border-yellow-500/30 rounded-[2.5rem] p-6 text-center shadow-2xl backdrop-blur-md">
            <p className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1 animate-pulse">Crazy Grand Jackpot</p>
            <h2 className="text-white text-3xl font-black italic tracking-tighter tabular-nums">${(bet * 3333).toLocaleString()}</h2>
        </div>

        <div className="flex items-center gap-2 bg-gradient-to-b from-[#2d1b1c]/95 to-black/95 p-4 rounded-[3rem] border-4 border-yellow-500/30 shadow-2xl relative mb-10 overflow-hidden">
           <div className="flex gap-2">
              {reels.map((sym, i) => (
                <div key={i} className={`w-20 h-28 rounded-2xl bg-black border border-white/10 flex items-center justify-center ${isSpinning ? 'animate-pulse opacity-50' : ''}`}>
                   <span className={`text-2xl font-black italic ${sym.color}`}>{sym.label}</span>
                </div>
              ))}
           </div>
           <div className="w-[1px] h-20 bg-yellow-500/30 mx-1"></div>
           <div className={`w-20 h-28 rounded-2xl bg-gradient-to-br from-primary/40 to-black border-2 border-primary/40 flex items-center justify-center ${isSpinning ? 'animate-pulse opacity-50' : ''}`}>
              <span className="text-white text-xl font-black italic">{special.label}</span>
           </div>
        </div>

        <div className="h-20 flex items-center justify-center mb-6">
           {winAmount && <h1 className="text-white text-5xl font-black italic tracking-tighter drop-shadow-[0_0_30px_rgba(234,42,51,0.6)] animate-bounce uppercase">Win! ${winAmount.toLocaleString()}</h1>}
        </div>

        <div className="w-full max-w-[400px] bg-[#1a0d0e] rounded-[3rem] border border-white/10 p-6 space-y-5 shadow-2xl shadow-black/60">
          <div className="flex items-center gap-3 h-14 bg-white/5 rounded-2xl border border-white/10 px-6 focus-within:border-yellow-500/50 transition-colors">
              <span className="text-slate-600 font-black text-lg mr-2">$</span>
              <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} disabled={isSpinning} className="bg-transparent border-none focus:ring-0 text-white font-black text-xl w-full p-0 tabular-nums" />
          </div>

          <button onClick={handleSpin} disabled={isSpinning || balance < bet} className="w-full h-16 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-xl shadow-yellow-500/20 active:scale-95 transition-all">
             {isSpinning ? "SPINNING..." : "SPIN NOW"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Crazy777Game;
