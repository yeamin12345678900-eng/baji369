
import React, { useState, useRef, useEffect } from 'react';

interface PenaltyGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onSaveBet?: (data: any) => void;
  riggingIntensity?: number;
  onBack: () => void;
}

const SOUNDS = {
  start: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',   
  kick: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',    
  goal: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',    
  save: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',    
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',     
};

const BACKGROUND_URL = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop";

const PenaltyGame: React.FC<PenaltyGameProps> = ({ balance, onUpdateBalance, onSaveBet, riggingIntensity = 0.5, onBack }) => {
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'animating' | 'goal' | 'saved'>('idle');
  const [multiplier, setMultiplier] = useState(1.0);
  const [round, setRound] = useState(0);
  const [keeperPos, setKeeperPos] = useState<number | null>(null);
  const [ballPos, setBallPos] = useState<number | null>(null);
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

  const MULTIPLIERS = [1.90, 3.80, 7.60, 15.20, 30.40];

  const startGame = () => {
    if (balance < bet) return;
    onUpdateBalance(balance - bet);
    setGameState('playing');
    setMultiplier(1.0);
    setRound(0);
    setKeeperPos(null);
    setBallPos(null);
    playSound('start');
  };

  // Map position index to CSS positioning percentages for animations
  const getPosCoords = (pos: number) => {
    const coords: Record<number, { x: string, y: string }> = {
      1: { x: '20%', y: '25%' }, // Top Left
      2: { x: '50%', y: '25%' }, // Top Center
      3: { x: '80%', y: '25%' }, // Top Right
      4: { x: '20%', y: '55%' }, // Bottom Left
      6: { x: '80%', y: '55%' }, // Bottom Right
    };
    return coords[pos] || { x: '50%', y: '50%' };
  };

  const shoot = (position: number) => {
    if (gameState !== 'playing') return;
    setGameState('animating');
    setBallPos(position);
    playSound('kick');

    // Logic: Will keeper save it?
    const winThreshold = 0.4 + (riggingIntensity * 0.4); 
    const isGoal = Math.random() > winThreshold;
    
    // Determine where keeper dives
    // If not goal, keeper must dive to the SAME position as ball
    // If goal, keeper dives to a DIFFERENT random position
    let kPos = position;
    if (isGoal) {
      const otherPositions = [1, 2, 3, 4, 6].filter(p => p !== position);
      kPos = otherPositions[Math.floor(Math.random() * otherPositions.length)];
    }
    setKeeperPos(kPos);

    setTimeout(() => {
      if (isGoal) {
        setGameState('goal');
        playSound('goal');
        const nextMult = MULTIPLIERS[round];
        setMultiplier(nextMult);
        setRound(prev => prev + 1);
        
        if (round === 4) {
            setTimeout(handleCollect, 1500);
        } else {
            setTimeout(() => {
                setGameState('playing');
                setBallPos(null);
                setKeeperPos(null);
            }, 1200);
        }
      } else {
        setGameState('saved');
        playSound('save');
        if (onSaveBet) onSaveBet({ game_name: 'Penalty', stake: bet, multiplier: 0, payout: 0, status: 'lost' });
        setTimeout(() => { 
            setGameState('idle'); 
            setRound(0); 
            setMultiplier(1.0); 
            setBallPos(null);
            setKeeperPos(null);
        }, 2000);
      }
    }, 600);
  };

  const handleCollect = () => {
    if (multiplier <= 1.0) return;
    const winAmount = bet * multiplier;
    onUpdateBalance(balance + winAmount);
    if (onSaveBet) onSaveBet({ game_name: 'Penalty', stake: bet, multiplier, payout: winAmount, status: 'won' });
    setGameState('idle');
    setRound(0);
    setMultiplier(1.0);
    setBallPos(null);
    setKeeperPos(null);
    playSound('win');
  };

  const ballCoords = ballPos ? getPosCoords(ballPos) : { x: '50%', y: '90%' };
  const keeperCoords = keeperPos ? getPosCoords(keeperPos) : { x: '50%', y: '60%' };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0909] font-display overflow-y-auto no-scrollbar select-none relative pb-10">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${BACKGROUND_URL}")` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-transparent to-[#0a150d]"></div>
      </div>

      <header className="sticky top-0 z-50 p-4 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5"><span className="material-symbols-outlined">arrow_back</span></button>
        <h2 className="text-blue-400 font-black uppercase text-[10px] tracking-widest italic">Penalty Elite</h2>
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-inner backdrop-blur-md">
            <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center pt-6 px-4">
        {/* Stadium Display */}
        <div className="w-full max-w-sm aspect-[16/11] border-[6px] border-white/10 rounded-t-[3rem] relative overflow-hidden bg-emerald-950/40 shadow-2xl backdrop-blur-sm border-b-0">
           {/* Goal Net Pattern */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
           
           {/* Shooting Targets */}
           {gameState === 'playing' && (
             <div className="absolute inset-0 z-20 grid grid-cols-3 grid-rows-2 gap-4 p-8">
                {[1,2,3,4,5,6].map(i => i !== 5 && (
                  <button 
                    key={i} 
                    onClick={() => shoot(i)} 
                    className="size-full rounded-full border-2 border-dashed border-white/20 hover:border-primary hover:bg-primary/20 transition-all active:scale-90 flex items-center justify-center group"
                  >
                    <span className="material-symbols-outlined text-white/10 group-hover:text-white/40 text-xl">target</span>
                  </button>
                ))}
             </div>
           )}

           {/* Goalkeeper Character */}
           <div 
             className="absolute transition-all duration-500 ease-out z-30 pointer-events-none flex flex-col items-center"
             style={{ 
               left: keeperCoords.x, 
               top: keeperCoords.y, 
               transform: `translate(-50%, -50%) ${keeperPos ? 'scale(1.2) rotate(' + (keeperPos < 3 ? '-15deg' : '15deg') + ')' : 'scale(1)'}` 
             }}
           >
              <div className="relative">
                 <span className={`material-symbols-outlined text-white text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] ${gameState === 'saved' ? 'text-amber-400' : ''}`}>
                    sports_handball
                 </span>
                 {gameState === 'saved' && <span className="absolute -top-4 -right-4 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-full animate-bounce">SAVED!</span>}
              </div>
           </div>

           {/* The Ball */}
           <div 
             className={`absolute transition-all duration-500 ease-out z-40 pointer-events-none ${gameState === 'goal' ? 'animate-shake' : ''}`}
             style={{ 
               left: ballCoords.x, 
               top: ballCoords.y, 
               transform: `translate(-50%, -50%) ${ballPos ? 'scale(0.6) rotate(360deg)' : 'scale(1)'}` 
             }}
           >
              <span className="material-symbols-outlined text-white text-4xl filled drop-shadow-lg">
                 sports_soccer
              </span>
           </div>

           {/* Status Overlays */}
           {gameState === 'goal' && (
             <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <h1 className="text-7xl font-black text-white italic animate-in zoom-in duration-300 drop-shadow-[0_0_30px_rgba(234,42,51,0.8)] uppercase">Goal!</h1>
             </div>
           )}
        </div>

        {/* Multiplier Progress */}
        <div className="mt-6 w-full max-w-sm flex gap-1.5">
           {MULTIPLIERS.map((m, i) => (
             <div key={i} className="flex-1 flex flex-col gap-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${round > i ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/5'}`} />
                <span className={`text-[7px] font-black text-center ${round === i ? 'text-white' : 'text-slate-600'}`}>{m}x</span>
             </div>
           ))}
        </div>

        {/* Control UI */}
        <div className="w-full max-w-[400px] mt-8 mb-10 bg-[#1a0d0e] rounded-[3rem] border border-white/10 p-6 space-y-5 shadow-2xl shadow-black/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
             <span className="material-symbols-outlined text-9xl">sports_soccer</span>
          </div>
          
          <div className="flex items-center justify-between px-2 relative z-10">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Potential Payout</span>
                 <span className="text-3xl font-black text-white italic tracking-tighter tabular-nums">${(bet * multiplier).toFixed(2)}</span>
              </div>
              {multiplier > 1 && gameState === 'playing' && (
                <button onClick={handleCollect} className="bg-emerald-500 text-white h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all animate-in slide-in-from-right">COLLECT</button>
              )}
          </div>
          
          {gameState === 'idle' ? (
            <div className="space-y-4 relative z-10">
               <div className="h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center px-6 shadow-inner focus-within:border-primary/50 transition-colors">
                  <span className="text-slate-600 font-black text-xl mr-3">$</span>
                  <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} className="bg-transparent border-none focus:ring-0 text-white font-black text-2xl w-full p-0 tabular-nums" />
               </div>
               <button onClick={startGame} className="w-full h-20 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-xl shadow-primary/30 active:scale-95 transition-all border-b-4 border-red-900 flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined">play_arrow</span>
                  START ROUND
               </button>
            </div>
          ) : (
            <div className="py-4 text-center relative z-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] animate-pulse flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">ads_click</span>
                  Select target to shoot
               </p>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%) scale(0.6) rotate(360deg); }
          25% { transform: translate(-52%, -52%) scale(0.6) rotate(365deg); }
          75% { transform: translate(-48%, -48%) scale(0.6) rotate(355deg); }
        }
        .animate-shake {
          animation: shake 0.1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PenaltyGame;
