
import React, { useState, useRef, useEffect } from 'react';

interface MinesGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onSaveBet?: (data: any) => void;
  riggingIntensity?: number;
  onBack: () => void;
}

const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',   
  diamond: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', 
  mine: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',    
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',     
};

const BACKGROUND_URL = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2168&auto=format&fit=crop";

const MinesGame: React.FC<MinesGameProps> = ({ balance, onUpdateBalance, onSaveBet, riggingIntensity = 0.5, onBack }) => {
  const [bet, setBet] = useState(100);
  const [minesCount, setMinesCount] = useState(3);
  const [grid, setGrid] = useState<any[]>(Array.from({ length: 25 }, (_, i) => ({ id: i, type: 'hidden' })));
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended' | 'cashed-out'>('idle');
  const [minesPositions, setMinesPositions] = useState<number[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const balanceAtStart = useRef(balance);
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

  const calculateMultiplier = (revealed: number) => {
    if (revealed === 0) return 0;
    const combinations = (n: number, k: number): number => {
      if (k < 0 || k > n) return 0;
      if (k === 0 || k === n) return 1;
      if (k > n / 2) k = n - k;
      let res = 1;
      for (let i = 1; i <= k; i++) res = res * (n - i + 1) / i;
      return res;
    };
    const total = combinations(25, revealed);
    const winning = combinations(25 - minesCount, revealed);
    if (total === 0 || winning === 0) return 0;
    
    const houseEdge = 0.94 - (riggingIntensity * 0.15);
    return parseFloat((houseEdge / (winning / total)).toFixed(2));
  };

  const startGame = () => {
    if (gameState === 'playing' || balance < bet) return;
    onUpdateBalance(balance - bet);
    balanceAtStart.current = balance - bet;
    
    const positions: number[] = [];
    while (positions.length < minesCount) {
      const r = Math.floor(Math.random() * 25);
      if (!positions.includes(r)) positions.push(r);
    }
    
    setMinesPositions(positions);
    setGrid(Array.from({ length: 25 }, (_, i) => ({ id: i, type: 'hidden' })));
    setGameState('playing');
    setRevealedCount(0);
    playSound('click');
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'playing' || grid[index].type !== 'hidden') return;

    const shouldForceMine = (riggingIntensity > 0.8 && revealedCount >= 2) || (Math.random() < riggingIntensity * 0.3);
    
    if (minesPositions.includes(index) || shouldForceMine) {
      const finalMines = minesPositions.includes(index) ? minesPositions : [...minesPositions, index];
      setGrid(grid.map((t, i) => finalMines.includes(i) ? { ...t, type: 'mine' } : { ...t, type: 'revealed' }));
      setGameState('ended');
      playSound('mine');
      
      if (onSaveBet) {
        onSaveBet({ game_name: 'Mines', stake: bet, multiplier: 0, payout: 0, status: 'lost' });
      }
    } else {
      const newGrid = [...grid];
      newGrid[index] = { ...newGrid[index], type: 'diamond' };
      setGrid(newGrid);
      setRevealedCount(prev => prev + 1);
      playSound('diamond');
    }
  };

  const cashOut = () => {
    if (gameState !== 'playing' || revealedCount === 0) return;
    const mult = calculateMultiplier(revealedCount);
    const winAmount = bet * mult;
    onUpdateBalance(balanceAtStart.current + winAmount);
    setGameState('cashed-out');
    playSound('win');
    
    if (onSaveBet) {
      onSaveBet({ game_name: 'Mines', stake: bet, multiplier: mult, payout: winAmount, status: 'won' });
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0d0909] font-display overflow-hidden select-none relative">
      
      {/* Mine Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${BACKGROUND_URL}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0909]/90 via-transparent to-[#0d0909]"></div>
        <div className="absolute inset-0 bg-amber-900/10 backdrop-blur-[2px]"></div>
      </div>

      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-black/40 z-20 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 size-10 flex items-center justify-center rounded-full active:bg-white/5"><span className="material-symbols-outlined">arrow_back</span></button>
        <div className="text-center">
            <h2 className="text-white font-black uppercase text-[10px] tracking-widest leading-none mb-1">Mines Elite</h2>
            <div className="flex items-center justify-center gap-1.5 opacity-50">
               <span className="size-1 bg-amber-500 rounded-full animate-pulse"></span>
               <span className="text-amber-500 text-[7px] font-black uppercase tracking-widest">Master Control Active</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#1a0d0e]/60 px-4 py-1.5 rounded-full border border-white/10 text-white font-black text-[11px] shadow-inner backdrop-blur-md">
              ${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        <div className="grid grid-cols-5 gap-3 w-full max-w-[360px] aspect-square p-6 bg-black/40 rounded-[3.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] relative backdrop-blur-md">
          {grid.map((tile, i) => (
            <button 
              key={tile.id} 
              onClick={() => handleTileClick(i)}
              className={`aspect-square rounded-2xl flex items-center justify-center border-2 transition-all duration-300 relative ${
                tile.type === 'hidden' ? 'bg-gradient-to-br from-[#24191a] to-[#150d0e] border-white/10 active:scale-90 shadow-lg' :
                tile.type === 'diamond' ? 'bg-emerald-500/30 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]' :
                tile.type === 'mine' ? 'bg-red-500/40 border-red-500 animate-in shake duration-500 shadow-[0_0_25px_rgba(234,42,51,0.4)]' : 'opacity-20'
              }`}
            >
              {tile.type === 'diamond' && <span className="material-symbols-outlined text-emerald-400 text-4xl filled drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">diamond</span>}
              {tile.type === 'mine' && <span className="material-symbols-outlined text-red-500 text-4xl filled drop-shadow-[0_0_10px_rgba(234,42,51,0.5)]">explosion</span>}
            </button>
          ))}
        </div>
        
        <div className="h-16 mt-8 flex flex-col items-center justify-center">
          {gameState === 'playing' && revealedCount > 0 && (
            <div className="animate-in zoom-in text-center">
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">Potential Win</p>
               <p className="text-emerald-500 font-black text-4xl italic tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">${(bet * calculateMultiplier(revealedCount)).toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 bg-[#1a0d0e]/95 backdrop-blur-2xl rounded-t-[4rem] border-t border-white/10 space-y-6 pb-14 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] z-20">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Stake</span>
            <div className="h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 shadow-inner">
               <span className="text-slate-600 font-black text-xl">$</span>
               <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} disabled={gameState === 'playing'} className="bg-transparent border-none focus:ring-0 text-white px-2 font-black text-xl w-full" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Risk</span>
            <select value={minesCount} onChange={(e) => setMinesCount(Number(e.target.value))} disabled={gameState === 'playing'} className="bg-white/5 border border-white/10 rounded-2xl h-16 text-white px-5 font-black text-sm focus:outline-none appearance-none shadow-inner">
              {[1, 3, 5, 10, 15, 20].map(m => <option key={m} value={m} className="bg-[#1a0d0e]">{m} Mines</option>)}
            </select>
          </div>
        </div>
        {gameState === 'playing' ? (
          <button onClick={cashOut} disabled={revealedCount === 0} className="w-full h-18 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all text-sm">
            CASH OUT (${(bet * calculateMultiplier(revealedCount)).toFixed(2)})
          </button>
        ) : (
          <button onClick={startGame} className="w-full h-18 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all text-sm">START ROUND</button>
        )}
      </div>
    </div>
  );
};

export default MinesGame;
