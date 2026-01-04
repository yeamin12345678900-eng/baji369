
import React, { useState, useRef, useEffect } from 'react';

interface Ball {
  id: number;
  targetBucket: number;
}

const ROWS = 8;
const MULTIPLIERS = [15.0, 0.0, 0.5, 0.0, 0.0, 0.05, 0.2, 0.0, 10.0];

const SOUNDS = {
  drop: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',   
  hit: 'https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3',    
  bounce: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3', 
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

  const getRiggedTarget = () => {
    const random = Math.random();
    const failChance = 0.85 + (riggingIntensity * 0.13); 
    const lowReturnChance = 0.95 + (riggingIntensity * 0.04);
    if (random < failChance) return [1, 3, 4, 7][Math.floor(Math.random() * 4)];
    else if (random < lowReturnChance) return [2, 5, 6][Math.floor(Math.random() * 3)];
    else return [0, 8][Math.floor(Math.random() * 2)];
  };

  const dropBall = () => {
    if (balance < bet || isDropping) return;
    setIsDropping(true);
    onUpdateBalance(balance - bet);
    playSound('drop');
    const targetBucket = getRiggedTarget();
    const newBall: Ball = { id: Date.now() + Math.random(), targetBucket };
    setBalls(prev => [...prev, newBall]);
    setTimeout(() => {
      const winMult = MULTIPLIERS[targetBucket];
      const finalWinAmount = bet * winMult;
      onUpdateBalance(balance - bet + finalWinAmount);
      setActiveBucket(targetBucket);
      playSound('hit');
      setTimeout(() => setActiveBucket(null), 600);
      setBalls(prev => prev.filter(b => b.id !== newBall.id));
      setIsDropping(false);
      if (onSaveBet) onSaveBet({ game_name: 'Plinko', stake: bet, multiplier: winMult, payout: finalWinAmount, status: winMult > 1 ? 'won' : 'lost' });
    }, 2800);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0d0909] font-display overflow-hidden select-none relative">
      
      {/* Arcade Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${BACKGROUND_URL}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0d0909]"></div>
        <div className="absolute inset-0 bg-pink-900/10 backdrop-blur-[2px]"></div>
      </div>

      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-black/40 z-50 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5"><span className="material-symbols-outlined">arrow_back</span></button>
        <div className="text-center">
            <h2 className="text-white font-black uppercase tracking-widest text-[10px]">PLINKO PRO</h2>
            <p className="text-pink-500 font-black text-[8px] uppercase tracking-[0.3em] italic">Retro Engine 1.0</p>
        </div>
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-inner backdrop-blur-md">
            <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString()}</span>
        </div>
      </header>

      <div className="flex-1 relative flex flex-col items-center justify-start pt-12 z-10">
        <div className="relative w-full max-w-[360px] flex flex-col items-center p-6 bg-black/40 rounded-[3rem] border border-white/10 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col gap-6 w-full px-4 mb-4 z-10">
            {Array.from({ length: ROWS + 1 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-[30px] md:gap-[34px]">
                {Array.from({ length: rowIndex + 3 }).map((_, pegIndex) => (
                  <div key={pegIndex} className="size-1.5 bg-slate-400 rounded-full relative shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                      <div className="absolute inset-[-4px] bg-white/10 rounded-full blur-[2px]"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none z-20">
            {balls.map((ball) => (
              <div 
                key={ball.id} 
                className="absolute top-[-25px] left-1/2 -translate-x-1/2 size-5 bg-primary rounded-full shadow-[0_0_30px_rgba(234,42,51,1)] animate-plinko-pro-rigged"
                style={{ '--final-x': `${(ball.targetBucket - 4) * 38}px` } as any}
              />
            ))}
          </div>

          <div className="flex justify-center gap-1.5 mt-10 w-full px-2 z-30">
            {MULTIPLIERS.map((m, i) => (
              <div 
                key={i} 
                className={`flex-1 h-14 rounded-xl border-2 flex flex-col items-center justify-center text-[11px] font-black transition-all duration-300 ${
                  activeBucket === i ? 'bg-white !text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.8)] z-40' : 
                  m === 0 ? 'bg-red-950/60 text-red-500 border-red-500/30' : 'bg-emerald-950/60 text-emerald-400 border-emerald-900/30'
                }`}
              >
                <span>{m}x</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 bg-[#1a0d0e]/95 backdrop-blur-2xl rounded-t-[4rem] border-t border-white/10 space-y-6 pb-14 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] z-50">
        <div className="h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center px-6 gap-3 shadow-inner">
           <span className="text-slate-600 font-black text-xl mr-2">$</span>
           <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} className="bg-transparent border-none focus:ring-0 text-white font-black text-2xl w-full p-0 tabular-nums" />
        </div>
        <button onClick={dropBall} disabled={balance < bet || isDropping} className="w-full h-20 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xl shadow-2xl active:scale-95 transition-all">
          {isDropping ? "FALLING..." : "DROP BALL"}
        </button>
      </div>

      <style>{`
        @keyframes plinko-pro-rigged {
          0% { top: -25px; transform: translateX(-50%); }
          100% { top: 380px; transform: translateX(calc(-50% + var(--final-x))); opacity: 0; }
        }
        .animate-plinko-pro-rigged {
          animation: plinko-pro-rigged 2.8s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
        }
      `}</style>
    </div>
  );
};

export default PlinkoGame;
