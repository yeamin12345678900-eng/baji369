
import React, { useState, useEffect, useRef } from 'react';
import { sha256, deriveCrashResult, createFairnessSession, FairnessSession } from '../../services/fairness';
import ProvablyFairModal from '../ProvablyFairModal';

interface CrashGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onSaveBet?: (data: any) => void;
  riggingIntensity?: number;
  onBack: () => void;
}

const SOUNDS = {
  start: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3', 
  crash: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', 
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',   
};

const BACKGROUND_URL = "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=2072&auto=format&fit=crop";

const CrashGame: React.FC<CrashGameProps> = ({ balance, onUpdateBalance, onSaveBet, riggingIntensity = 0.5, onBack }) => {
  const [bet, setBet] = useState(100);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState<'idle' | 'running' | 'crashed' | 'cashed-out'>('idle');
  const [history, setHistory] = useState<number[]>([1.45, 1.02, 1.00, 3.42, 1.15]);
  const [isMuted, setIsMuted] = useState(false);
  const [showFairness, setShowFairness] = useState(false);
  const [fairSession, setFairSession] = useState<FairnessSession | null>(null);

  const timerRef = useRef<any>(null);
  const multiplierRef = useRef(1.0);
  const currentBalanceRef = useRef(balance);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      audioRefs.current[key] = new Audio(url);
    });
    createFairnessSession().then(setFairSession);
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

  const startNewGame = async () => {
    if (gameState === 'running' || !fairSession) return;
    if (balance < bet) return;
    onUpdateBalance(balance - bet);
    const seedCombo = `${fairSession.serverSeed}-${fairSession.clientSeed}-${fairSession.nonce}`;
    const roundHash = await sha256(seedCombo);
    let target = deriveCrashResult(roundHash);
    if (Math.random() < riggingIntensity * 0.4) {
      if (target > 1.5) target = 1.00 + (Math.random() * 0.5);
    }
    setMultiplier(1.0);
    multiplierRef.current = 1.0;
    setGameState('running');
    playSound('start');
    timerRef.current = setInterval(() => {
      const growthRate = 0.005 + (multiplierRef.current * 0.01);
      multiplierRef.current += growthRate;
      const current = parseFloat(multiplierRef.current.toFixed(2));
      if (current >= target) {
        clearInterval(timerRef.current);
        setGameState('crashed');
        setMultiplier(target);
        playSound('crash');
        setHistory(prev => [target, ...prev.slice(0, 4)]);
        setFairSession(prev => prev ? { ...prev, nonce: prev.nonce + 1 } : null);
        if (onSaveBet) {
          onSaveBet({ game_name: 'Crash', stake: bet, multiplier: 0, payout: 0, status: 'lost' });
        }
      } else {
        setMultiplier(current);
      }
    }, 80);
  };

  const handleCashOut = () => {
    if (gameState !== 'running' || multiplier < 1.01) return;
    clearInterval(timerRef.current);
    const winAmount = bet * multiplier;
    onUpdateBalance(currentBalanceRef.current + winAmount);
    setGameState('cashed-out');
    playSound('win');
    setFairSession(prev => prev ? { ...prev, nonce: prev.nonce + 1 } : null);
    if (onSaveBet) {
      onSaveBet({ game_name: 'Crash', stake: bet, multiplier: multiplier, payout: winAmount, status: 'won' });
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0909] font-display overflow-y-auto no-scrollbar select-none relative pb-10">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${BACKGROUND_URL}")` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/40 to-[#0d0909]"></div>
      </div>

      <header className="sticky top-0 z-50 p-4 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5"><span className="material-symbols-outlined">arrow_back</span></button>
        <button onClick={() => setShowFairness(true)} className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full"><span className="material-symbols-outlined text-emerald-500 text-xs">verified_user</span><span className="text-[8px] font-black text-white uppercase">Fair Play</span></button>
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-inner backdrop-blur-md">
            <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center pt-10 px-6">
        <div className="h-64 flex flex-col items-center justify-center mb-10">
            <h1 className={`text-8xl font-black tabular-nums transition-all drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] ${
              gameState === 'crashed' ? 'text-red-500' : 
              gameState === 'cashed-out' ? 'text-emerald-500 scale-105' : 'text-white'
            }`}>
              {multiplier.toFixed(2)}<span className="text-4xl ml-1">x</span>
            </h1>
            {gameState === 'crashed' && <p className="text-red-500 font-black uppercase tracking-[0.3em] mt-4 animate-bounce text-sm">CRASHED!</p>}
        </div>

        <div className="w-full max-w-[400px] bg-[#1a0d0e] rounded-[3rem] border border-white/10 p-6 space-y-5 shadow-2xl shadow-black/60 mb-6">
          <div className="flex items-center gap-3 h-14 bg-white/5 rounded-2xl border border-white/10 px-6 focus-within:border-primary/50 transition-colors">
             <span className="text-slate-600 font-black text-lg">$</span>
             <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} disabled={gameState === 'running'} className="bg-transparent border-none focus:ring-0 text-white font-black text-xl w-full p-0 tabular-nums" />
          </div>

          {gameState === 'running' ? (
            <button onClick={handleCashOut} className="w-full h-20 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all text-base flex flex-col items-center justify-center gap-0.5">
              <span className="text-[9px] font-black opacity-80">CASH OUT</span>
              <span className="text-xl tabular-nums tracking-tighter">${(bet * multiplier).toFixed(2)}</span>
            </button>
          ) : (
            <button onClick={startNewGame} disabled={balance < bet} className="w-full h-20 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-xl active:scale-95 transition-all disabled:opacity-30 border-b-4 border-red-800">
              START ROUND
            </button>
          )}

          <div className="flex gap-2.5 justify-center overflow-x-auto no-scrollbar py-2 border-t border-white/5 pt-4">
            {history.map((h, i) => (
              <span key={i} className={`text-[9px] font-black px-3 py-1 rounded-full border shrink-0 ${h < 2 ? 'text-red-400 border-red-500/20 bg-red-500/5' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'}`}>
                {h.toFixed(2)}x
              </span>
            ))}
          </div>
        </div>
      </main>

      <ProvablyFairModal 
        isOpen={showFairness} 
        onClose={() => setShowFairness(false)} 
        serverSeedHash={fairSession?.serverSeedHash || ''}
        currentClientSeed={fairSession?.clientSeed || ''}
        nonce={fairSession?.nonce || 0}
      />
    </div>
  );
};

export default CrashGame;
