
import React, { useState, useEffect, useRef } from 'react';

interface AviatorGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onSaveBet?: (data: any) => void;
  riggingIntensity?: number;
  onBack: () => void;
}

const SOUNDS = {
  engine: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', 
  flyAway: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', 
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',   
};

const BACKGROUND_URL = "https://images.unsplash.com/photo-1464039397811-476f652a343b?q=80&w=2068&auto=format&fit=crop";

const AviatorGame: React.FC<AviatorGameProps> = ({ balance, onUpdateBalance, onSaveBet, riggingIntensity = 0.5, onBack }) => {
  const [bet, setBet] = useState(100);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState<'idle' | 'running' | 'fly-away' | 'cashed-out'>('idle');
  const [history, setHistory] = useState<number[]>([1.56, 1.12, 12.45, 1.05, 2.11]);
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef<any>(null);
  const multiplierRef = useRef(1.0);
  const currentBalanceRef = useRef(balance);
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

  useEffect(() => {
    currentBalanceRef.current = balance;
  }, [balance]);

  const startNewGame = () => {
    if (gameState === 'running') return;
    if (balance < bet) return;
    onUpdateBalance(balance - bet);
    
    const random = Math.random();
    let target = 1.00;
    
    // Improved Rigging: 
    // High intensity = higher chance of instant crash or low multi
    const instantCrashChance = riggingIntensity * 0.4; // max 40% chance of instant crash
    
    if (random < instantCrashChance) {
      target = 1.00 + (Math.random() * 0.08); // Crashes between 1.00 and 1.08
    } else {
      // Normal game but house edge scales with riggingIntensity
      const houseEdge = 0.03 + (riggingIntensity * 0.25); // House edge 3% to 28%
      const rawTarget = (1.0 - houseEdge) / (1.0 - Math.random());
      target = parseFloat(Math.max(1.01, rawTarget).toFixed(2));
      
      // Safety cap: High rigging prevents high multipliers
      if (riggingIntensity > 0.7 && target > 5.0) target = 1.5 + (Math.random() * 2);
    }

    setMultiplier(1.0);
    multiplierRef.current = 1.0;
    setGameState('running');
    playSound('engine');
    
    timerRef.current = setInterval(() => {
      const growthFactor = 0.005 + (multiplierRef.current * 0.008);
      multiplierRef.current += growthFactor;
      const current = parseFloat(multiplierRef.current.toFixed(2));
      
      if (current >= target) {
        clearInterval(timerRef.current);
        setGameState('fly-away');
        setMultiplier(target);
        playSound('flyAway');
        setHistory(prev => [target, ...prev.slice(0, 4)]);
        if (onSaveBet) onSaveBet({ game_name: 'Aviator', stake: bet, multiplier: 0, payout: 0, status: 'lost' });
      } else {
        setMultiplier(current);
      }
    }, 100);
  };

  const handleCashOut = () => {
    if (gameState !== 'running' || multiplier < 1.02) return;
    clearInterval(timerRef.current);
    const winAmount = bet * multiplier;
    onUpdateBalance(currentBalanceRef.current + winAmount);
    setGameState('cashed-out');
    playSound('win');
    if (onSaveBet) onSaveBet({ game_name: 'Aviator', stake: bet, multiplier: multiplier, payout: winAmount, status: 'won' });
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#120404] font-display overflow-y-auto no-scrollbar select-none relative pb-10">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${BACKGROUND_URL}")` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#120404]/95 via-[#120404]/40 to-[#120404]"></div>
      </div>

      <header className="sticky top-0 z-50 p-4 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5"><span className="material-symbols-outlined">arrow_back</span></button>
        <h2 className="text-primary font-black uppercase text-xs tracking-[0.2em] italic">Aviator Pro</h2>
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-inner">
            <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString()}</span>
        </div>
      </header>

      <div className="flex gap-2 p-2 bg-black/50 overflow-x-auto no-scrollbar border-b border-white/5 z-10 sticky top-[65px] backdrop-blur-md">
        {history.map((h, i) => (
          <span key={i} className={`text-[9px] font-black px-3 py-1 rounded-full whitespace-nowrap ${h < 2 ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20' : 'text-primary bg-primary/10 border border-primary/30'}`}>
            {h.toFixed(2)}x
          </span>
        ))}
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center pt-8 px-6">
        <div className="h-64 flex flex-col items-center justify-center mb-10">
           {gameState === 'fly-away' ? (
             <div className="animate-in slide-in-from-bottom duration-500 flex flex-col items-center">
                <span className="material-symbols-outlined text-primary text-8xl drop-shadow-[0_0_50px_rgba(234,42,51,0.6)]">flight_takeoff</span>
                <p className="text-primary font-black uppercase mt-4 tracking-[0.3em] text-3xl italic">FLEW AWAY!</p>
             </div>
           ) : (
             <div className="flex flex-col items-center">
                <h1 className={`text-8xl font-black tabular-nums transition-all drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] ${gameState === 'cashed-out' ? 'text-emerald-500' : 'text-white'}`}>
                  {multiplier.toFixed(2)}<span className="text-3xl ml-1 text-primary italic">x</span>
                </h1>
                <span className={`material-symbols-outlined text-7xl mt-6 transition-colors ${gameState === 'cashed-out' ? 'text-emerald-500' : 'text-primary'} ${gameState === 'running' ? 'animate-bounce' : ''}`}>
                  {gameState === 'running' ? 'flight' : 'flight_takeoff'}
                </span>
             </div>
           )}
        </div>

        <div className="w-full max-w-[400px] bg-[#1a0606] rounded-[3rem] border border-white/10 p-6 space-y-5 shadow-2xl shadow-black/60 mb-6">
          <div className="flex items-center gap-3 h-14 bg-white/5 rounded-2xl border border-white/10 px-6 focus-within:border-primary/50 transition-colors">
              <span className="text-slate-600 font-black text-lg mr-2">$</span>
              <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} disabled={gameState === 'running'} className="bg-transparent border-none focus:ring-0 text-white font-black text-xl w-full p-0 tabular-nums" />
          </div>

          {gameState === 'running' ? (
            <button onClick={handleCashOut} className="w-full h-20 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all text-base flex flex-col items-center justify-center gap-0.5">
              <span className="text-[9px] font-black opacity-80">CASH OUT</span>
              <span className="text-xl tabular-nums tracking-tighter">${(bet * multiplier).toFixed(2)}</span>
            </button>
          ) : (
            <button onClick={startNewGame} disabled={balance < bet} className="w-full h-20 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-xl active:scale-95 transition-all disabled:opacity-30 border-b-4 border-red-800">
              BET
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default AviatorGame;
