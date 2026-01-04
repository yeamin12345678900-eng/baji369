
import React, { useState, useCallback, useRef, useEffect } from 'react';

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

  const shoot = (position: number) => {
    if (gameState !== 'playing') return;
    setGameState('animating');
    setBallPos(position);
    playSound('kick');

    setTimeout(() => {
      const directSaveProb = riggingIntensity > 0.8 ? 0.8 : (riggingIntensity * 0.5);
      let isGoal = false;
      if (Math.random() < directSaveProb) {
        isGoal = false; 
      } else {
        const winChance = 0.45 - (riggingIntensity * 0.3) - (round * 0.08);
        isGoal = Math.random() < winChance;
      }

      if (isGoal) {
        const wrongPos = [1, 2, 3, 4, 6].filter(p => p !== position);
        setKeeperPos(wrongPos[Math.floor(Math.random() * wrongPos.length)]);
        
        setTimeout(() => {
          setGameState('goal');
          playSound('goal');
          const nextMult = MULTIPLIERS[round];
          setMultiplier(nextMult);
          setRound(prev => prev + 1);
          if (round === 4) handleCollect();
          else setTimeout(() => { setGameState('playing'); setKeeperPos(null); setBallPos(null); }, 1000);
        }, 300);
      } else {
        setKeeperPos(position); 
        setTimeout(() => {
          setGameState('saved');
          playSound('save');
          if (onSaveBet) onSaveBet({ game_name: 'Penalty', stake: bet, multiplier: 0, payout: 0, status: 'lost' });
          setTimeout(() => { setGameState('idle'); setRound(0); setMultiplier(1.0); setKeeperPos(null); setBallPos(null); }, 1500);
        }, 300);
      }
    }, 600);
  };

  const handleCollect = () => {
    if (multiplier <= 1.0 || (gameState !== 'playing' && gameState !== 'goal')) return;
    const win = bet * multiplier;
    if (onSaveBet) onSaveBet({ game_name: 'Penalty', stake: bet, multiplier: multiplier, payout: win, status: 'won' });
    onUpdateBalance(balance + win);
    setGameState('idle');
    setRound(0);
    setMultiplier(1.0);
    playSound('win');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0d0909] font-display overflow-hidden select-none relative">
      
      {/* Stadium Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${BACKGROUND_URL}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a150d]"></div>
        <div className="absolute inset-0 bg-emerald-900/10 backdrop-blur-[1px]"></div>
      </div>

      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-black/40 z-20 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5"><span className="material-symbols-outlined">arrow_back</span></button>
        <div className="text-center">
            <h2 className="text-white font-black uppercase tracking-widest text-[10px]">PENALTY PRO</h2>
            <div className="flex items-center justify-center gap-1">
               <span className="size-1 bg-blue-500 rounded-full animate-pulse"></span>
               <span className="text-blue-400 text-[8px] font-black uppercase">Arena Sync Active</span>
            </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-inner backdrop-blur-md">
              <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 relative flex flex-col items-center justify-center p-6 z-10">
        <div className="w-full max-w-sm aspect-[16/10] border-[8px] border-white/20 rounded-t-3xl relative overflow-hidden bg-emerald-950/40 shadow-[0_0_100px_rgba(0,0,0,0.6)] backdrop-blur-sm">
           <div className="absolute inset-0 opacity-[0.1]" style={{backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 20px), repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 20px)'}} />
           
           {/* Keeper */}
           <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out z-20 ${
             keeperPos === 1 ? '-translate-x-[180%] -translate-y-[100%] rotate-[-45deg]' :
             keeperPos === 2 ? '-translate-x-1/2 -translate-y-[120%]' :
             keeperPos === 3 ? 'translate-x-[80%] -translate-y-[100%] rotate-[45deg]' :
             keeperPos === 4 ? '-translate-x-[160%] rotate-[-20deg]' :
             keeperPos === 6 ? 'translate-x-[60%] rotate-[20deg]' : ''
           }`}>
             <div className="flex flex-col items-center group">
                <div className="size-20 bg-amber-500 rounded-full border-4 border-black/30 flex items-center justify-center shadow-2xl">
                   <span className="material-symbols-outlined text-black font-black text-5xl">sports_handball</span>
                </div>
                <div className="w-14 h-24 bg-blue-700 rounded-t-2xl -mt-2 border-x-4 border-black/20"></div>
             </div>
           </div>

           {/* Ball */}
           {ballPos && (
             <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out z-10 ${
               gameState === 'idle' ? '' :
               ballPos === 1 ? '-translate-x-[280%] -translate-y-[280%] scale-[0.4]' :
               ballPos === 2 ? '-translate-x-1/2 -translate-y-[320%] scale-[0.4]' :
               ballPos === 3 ? 'translate-x-[180%] -translate-y-[280%] scale-[0.4]' :
               ballPos === 4 ? '-translate-x-[280%] -translate-y-[120%] scale-[0.4]' :
               ballPos === 6 ? 'translate-x-[180%] -translate-y-[120%] scale-[0.4]' : ''
             }`}>
                <div className="size-12 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-2 border-black/30 animate-spin">
                   <div className="w-full h-full opacity-40" style={{backgroundImage: 'conic-gradient(#000 0 90deg, #fff 0 180deg, #000 0 270deg, #fff 0)'}} />
                </div>
             </div>
           )}

           {/* Targets */}
           {gameState === 'playing' && (
             <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-8 p-12 z-30">
                {[1,2,3,4,5,6].map(i => i !== 5 && (
                  <button 
                    key={i} onClick={() => shoot(i)}
                    className="size-full rounded-[2rem] border-4 border-dashed border-white/20 hover:border-primary hover:bg-primary/20 transition-all flex items-center justify-center group active:scale-90"
                  >
                    <div className="size-8 bg-white/10 rounded-full group-hover:bg-primary group-hover:scale-125 transition-all shadow-inner" />
                  </button>
                ))}
             </div>
           )}

           {gameState === 'goal' && (
             <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 backdrop-blur-[6px] animate-in zoom-in duration-300 z-40">
                <div className="text-center">
                  <h1 className="text-8xl font-black text-white italic tracking-tighter drop-shadow-[0_0_30px_rgba(16,185,129,0.8)] animate-bounce">GOAL!</h1>
                  <p className="text-emerald-300 font-black uppercase tracking-[0.3em] text-sm mt-6 bg-emerald-950/80 px-6 py-2 rounded-full border border-emerald-500/30">Next: {MULTIPLIERS[round]?.toFixed(2)}x</p>
                </div>
             </div>
           )}
           {gameState === 'saved' && (
             <div className="absolute inset-0 flex items-center justify-center bg-red-600/30 backdrop-blur-[6px] animate-in shake duration-500 z-40">
                <div className="text-center">
                   <h1 className="text-7xl font-black text-white italic tracking-tighter drop-shadow-[0_0_30px_rgba(234,42,51,0.8)] uppercase">SAVED</h1>
                   <p className="text-red-300 text-[12px] font-black uppercase mt-4 tracking-[0.4em] bg-red-950/80 px-6 py-2 rounded-full border border-red-500/30">KEEPER READ YOU</p>
                </div>
             </div>
           )}
        </div>

        <div className="mt-16 w-full max-w-sm flex gap-3">
           {MULTIPLIERS.map((m, i) => (
             <div key={i} className="flex-1 flex flex-col gap-3">
                <div className={`h-2.5 rounded-full transition-all duration-700 ${round > i ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]' : 'bg-white/5'}`} />
                <span className={`text-[10px] font-black text-center tracking-tighter ${round === i ? 'text-white' : 'text-slate-700'}`}>{m}x</span>
             </div>
           ))}
        </div>
      </div>

      <div className="p-8 bg-[#1a0d0e]/95 backdrop-blur-2xl rounded-t-[4rem] border-t border-white/10 space-y-6 pb-14 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] z-50">
        <div className="flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-2">Multiplier</span>
              <span className={`text-5xl font-black transition-colors ${multiplier > 1 ? 'text-emerald-400' : 'text-white'}`}>
                {multiplier.toFixed(2)}<span className="text-2xl ml-1">x</span>
              </span>
           </div>
           {multiplier > 1.0 && (gameState === 'playing' || gameState === 'goal') && (
             <button onClick={handleCollect} className="bg-emerald-500 text-white h-20 px-10 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex flex-col items-center justify-center">
               <span className="mb-0.5">COLLECT</span>
               <span className="text-[11px] opacity-80 tabular-nums">${(bet * multiplier).toFixed(2)}</span>
             </button>
           )}
        </div>

        {gameState === 'idle' ? (
          <div className="space-y-4">
             <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 h-16 bg-white/5 rounded-2xl border border-white/10 px-6 focus-within:border-blue-500/50 transition-all shadow-inner">
                   <span className="text-slate-500 font-black text-2xl">$</span>
                   <input type="number" value={bet} onChange={(e) => setBet(Math.max(0, Number(e.target.value)))} className="bg-transparent border-none focus:ring-0 text-white font-black text-2xl w-full p-0" />
                </div>
             </div>
             <button onClick={startGame} className="w-full h-20 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xl shadow-[0_15px_40px_rgba(234,42,51,0.4)] active:scale-[0.98] transition-all">KICK OFF</button>
          </div>
        ) : (
          <div className="text-center py-6">
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">PICK YOUR TARGET SPOT</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenaltyGame;
