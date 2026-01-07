
import React, { useState, useRef, useEffect } from 'react';

interface Ball {
  id: number;
  targetBucket: number;
}

const ROWS = 8;
const MULTIPLIERS = [15.0, 0.0, 0.5, 0.0, 0.0, 0.05, 0.2, 0.0, 10.0];

const SOUNDS = {
  drop: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  hit: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'
};

const BACKGROUND_URL = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop";

const PlinkoGame: React.FC<{ 
  balance: number; 
  onUpdateBalance: (newBalance: number) => void; 
  onSaveBet?: (data: any) => void; 
  riggingIntensity?: number;
  onBack: () => void; 
}> = ({ balance, onUpdateBalance, onSaveBet, riggingIntensity = 0.5, onBack }) => {
  const [bet, setBet] = useState(100);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [activeBucket, setActiveBucket] = useState<number | null>(null);
  const [isDropping, setIsDropping] = useState(false);
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

  const dropBall = () => {
    if (balance < bet || isDropping) return;
    setIsDropping(true);
    onUpdateBalance(balance - bet);
    playSound('drop');

    // Simulate hitting pegs sound at intervals
    const interval = setInterval(() => playSound('hit'), 400);

    const targetBucket = [1, 3, 4, 7][Math.floor(Math.random() * 4)];
    const newBall: Ball = { id: Date.now() + Math.random(), targetBucket };
    setBalls(prev => [...prev, newBall]);

    setTimeout(() => {
      clearInterval(interval);
      const winMult = MULTIPLIERS[targetBucket];
      onUpdateBalance(balance - bet + (bet * winMult));
      setActiveBucket(targetBucket);
      if (winMult > 0) playSound('win');
      
      setTimeout(() => setActiveBucket(null), 600);
      setBalls(prev => prev.filter(b => b.id !== newBall.id));
      setIsDropping(false);
      if (onSaveBet) onSaveBet({ game_name: 'Plinko', stake: bet, multiplier: winMult, payout: bet * winMult, status: winMult > 0 ? 'won' : 'lost' });
    }, 2800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0909] font-display overflow-y-auto no-scrollbar select-none relative pb-10">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${BACKGROUND_URL}")` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-transparent to-[#0d0909]"></div>
      </div>

      <header className="sticky top-0 z-50 p-4 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5"><span className="material-symbols-outlined">arrow_back</span></button>
        <h2 className="text-pink-500 font-black uppercase text-xs tracking-widest italic">Plinko Pro</h2>
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-inner">
            <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center pt-8 px-4">
        <div className="w-full max-w-[360px] flex flex-col items-center p-4 bg-black/60 rounded-[3rem] border border-white/10 shadow-2xl relative mb-10 min-h-[400px]">
           <div className="flex flex-col gap-6 w-full px-4 pt-4">
              {Array.from({ length: ROWS + 1 }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-6">
                  {Array.from({ length: rowIndex + 3 }).map((_, pegIndex) => (
                    <div key={pegIndex} className="size-1 bg-white/20 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.4)]" />
                  ))}
                </div>
              ))}
           </div>
           
           <div className="flex justify-center gap-1 mt-10 w-full">
            {MULTIPLIERS.map((m, i) => (
              <div key={i} className={`flex-1 h-12 rounded-lg border flex items-center justify-center text-[9px] font-black transition-all ${activeBucket === i ? 'bg-white text-black scale-110 shadow-xl' : 'bg-white/5 text-slate-400 border-white/5'}`}>
                {m}x
              </div>
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {balls.map((ball) => (
               <div key={ball.id} className="absolute top-0 left-1/2 size-4 bg-primary rounded-full shadow-2xl animate-bounce" />
             ))}
          </div>
        </div>

        <div className="w-full max-w-[400px] bg-[#1a0d0e] rounded-[3rem] border border-white/10 p-6 space-y-5 shadow-2xl shadow-black/60">
          <div className="h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center px-4">
              <span className="text-slate-600 font-black text-lg mr-2">$</span>
              <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} className="bg-transparent border-none focus:ring-0 text-white font-black text-lg w-full p-0 tabular-nums" />
          </div>
          <button onClick={dropBall} disabled={isDropping || balance < bet} className="w-full h-16 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-xl active:scale-95 transition-all">
             {isDropping ? "FALLING..." : "DROP BALL"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default PlinkoGame;
