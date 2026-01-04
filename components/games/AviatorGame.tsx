
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
    const instantCrashThreshold = riggingIntensity * 0.70; 
    
    if (random < instantCrashThreshold) {
      target = 1.00 + (Math.random() * 0.12);
    } else {
      const houseEdge = 0.05 + (riggingIntensity * 0.40); 
      const rawTarget = (1.0 - houseEdge) / (1.0 - Math.random());
      target = parseFloat(Math.max(1.01, rawTarget).toFixed(2));
      
      if (bet > 1000 || riggingIntensity > 0.8) {
        if (target > 1.5) target = 1.05 + (Math.random() * 0.4);
      }
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
        
        if (onSaveBet) {
          onSaveBet({
            game_name: 'Aviator',
            stake: bet,
            multiplier: 0,
            payout: 0,
            status: 'lost'
          });
        }
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
    
    if (onSaveBet) {
      onSaveBet({
        game_name: 'Aviator',
        stake: bet,
        multiplier: multiplier,
        payout: winAmount,
        status: 'won'
      });
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#120404] font-display overflow-hidden select-none relative">
      
      {/* Dynamic Themed Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20000ms] ease-linear"
          style={{ 
            backgroundImage: `url("${BACKGROUND_URL}")`,
            transform: gameState === 'running' ? 'scale(1.3) rotate(2deg)' : 'scale(1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#120404]/80 via-transparent to-[#120404]"></div>
        <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[2px]"></div>
      </div>

      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-black/40 z-20 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Baji Original</h2>
            <h1 className="text-primary font-black text-sm uppercase italic">AVIATOR PRO</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMuted(!isMuted)} className="text-slate-500">
            <span className="material-symbols-outlined text-[20px]">{isMuted ? 'volume_off' : 'volume_up'}</span>
          </button>
          <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-inner backdrop-blur-md">
              <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
        </div>
      </header>

      {/* History Ribbon */}
      <div className="flex gap-2 p-2 bg-black/50 overflow-x-auto no-scrollbar border-b border-white/5 z-10 backdrop-blur-sm">
        {history.map((h, i) => (
          <span key={i} className={`text-[9px] font-black px-3 py-1 rounded-full whitespace-nowrap ${h < 2 ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20' : h < 10 ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20' : 'text-primary bg-primary/10 border border-primary/30 shadow-[0_0_10px_rgba(234,42,51,0.2)]'}`}>
            {h.toFixed(2)}x
          </span>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden z-10">
        <div className="relative w-full h-64 flex flex-col items-center justify-center">
           {gameState === 'fly-away' ? (
             <div className="animate-out slide-out-to-top-right slide-out-to-right duration-1000 fill-mode-forwards flex flex-col items-center">
                <span className="material-symbols-outlined text-primary text-8xl drop-shadow-[0_0_50px_rgba(234,42,51,0.6)]">flight_takeoff</span>
                <p className="text-primary font-black uppercase mt-4 tracking-[0.3em] text-3xl animate-pulse italic drop-shadow-lg">FLEW AWAY!</p>
             </div>
           ) : (
             <div className={`flex flex-col items-center transition-transform duration-500 ${gameState === 'running' ? 'scale-110' : ''}`}>
                <h1 className={`text-8xl font-black tabular-nums transition-all drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] ${
                  gameState === 'cashed-out' ? 'text-emerald-500 scale-105' : 'text-white'
                }`}>
                  {multiplier.toFixed(2)}<span className="text-3xl ml-1 text-primary italic">x</span>
                </h1>
                
                <div className={`mt-8 relative ${gameState === 'running' ? 'animate-bounce' : ''}`}>
                  <span className={`material-symbols-outlined text-8xl transition-colors ${gameState === 'cashed-out' ? 'text-emerald-500' : 'text-primary'}`}>
                    {gameState === 'running' ? 'flight' : 'flight_takeoff'}
                  </span>
                  {gameState === 'running' && (
                    <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex gap-2">
                      <div className="w-8 h-1 bg-white/20 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="p-8 bg-[#1a0606]/95 backdrop-blur-2xl rounded-t-[4rem] border-t border-white/10 space-y-6 pb-14 z-20 shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 h-16 bg-white/5 rounded-2xl border border-white/10 px-6 group focus-within:border-primary/50 transition-all shadow-inner">
           <span className="text-slate-600 font-black text-xl">$</span>
           <input 
              type="number" 
              value={bet}
              onChange={(e) => setBet(Math.max(0, Number(e.target.value)))}
              disabled={gameState === 'running'}
              className="bg-transparent border-none focus:ring-0 text-white font-black text-2xl w-full p-0 tabular-nums"
           />
           <div className="flex gap-2">
              <button onClick={() => setBet(prev => prev * 2)} disabled={gameState === 'running'} className="text-[10px] font-black text-slate-500 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 active:bg-primary transition-all">x2</button>
              <button onClick={() => setBet(prev => Math.floor(prev / 2))} disabled={gameState === 'running'} className="text-[10px] font-black text-slate-500 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 active:bg-primary transition-all">1/2</button>
           </div>
        </div>

        {gameState === 'running' ? (
          <button 
            onClick={handleCashOut}
            className="w-full h-20 bg-emerald-500 text-white rounded-[2.5rem] font-black uppercase shadow-[0_15px_40px_rgba(16,185,129,0.3)] transform transition-all active:scale-95 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-xs opacity-80 font-black tracking-[0.2em]">CASH OUT</span>
            <span className="text-2xl font-bold tracking-tighter tabular-nums">${(bet * multiplier).toFixed(2)}</span>
          </button>
        ) : (
          <button 
            onClick={startNewGame}
            disabled={balance < bet}
            className="w-full h-20 bg-gradient-to-r from-primary via-red-600 to-primary text-white rounded-[2.5rem] font-black uppercase shadow-[0_15px_40px_rgba(234,42,51,0.4)] active:scale-95 transform transition-all text-xl tracking-[0.3em] disabled:opacity-30"
          >
            BET
          </button>
        )}
      </div>
    </div>
  );
};

export default AviatorGame;
