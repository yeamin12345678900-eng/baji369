
import React, { useState, useEffect } from 'react';

interface GameDetailProps {
  balance: number;
  gameId: number | null;
  onBack: () => void;
  onUpdateBalance?: (newBalance: number) => void;
}

// Mock Database for dynamic content
const GAMES_DB: Record<number, any> = {
  1: {
    title: 'Lightning Roulette',
    provider: 'Evolution Gaming',
    type: 'roulette',
    bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB4ot_Av8rmYMCL2HEsh8L1arKg9Hbws_Z125wWccA2EWgrrTEUYPOkJ6b8tl-IA80_8mqkSu81xRee1kzFVDU1XY_gu8FJuVkc-0kxc5JqqOOCZGHj_tpyI4YMzLpUE3HS38EevnTq1cqJcdY7_r5frSFhHjXwCwvXD4nLkUSWEw1u12obbcNtiTWhcDr6POFN3H5qUc4sKG2rTZS9ZxyNeAhSBhu8H6VSfM7FqB1aueacr7mDMUdyel1MYjnN4KCCONzAOGM',
    dealer: 'Sarah'
  },
  2: {
    title: 'Sexy Baccarat T4',
    provider: 'AE Sexy',
    type: 'baccarat',
    bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi-5vmP-7EAh2GhpfUa54GVv9Lbc4HyFfLY6y5YRiC5_XwM7n-HQmWyd4sZnoeh0OHjNrunyZlTFzXiFNEjEbBpjHVWAuWjLuR5C2Cay3Px-Q7--XvbxwvTsha9as7ZWfAT34R_Lo4F9gaL4hBx7_ub8CltZg3-e5zqgb_m3tiMFnd2JYW7WaFI-wRUbKeWtCLfwPME_OqUTsWl13qtPaa6vgZMwIDB7MJq5UjyvoL_ZJO8q1E-F9wrET1xorQJnQA6X8Lz045',
    dealer: 'Mika'
  },
  5: {
    title: 'Book of Dead',
    provider: "Play'n GO",
    type: 'slot',
    bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbBPmTeXUzWKL3CEMck6Cim8o2hNbkfd6LnIMFI4h-uoWmx5VDfJh1O1m9k_hu8P_EtCG7XzJtIatvMgiHS7lV8ZJKUIFShk5jdYaBzKWu6-MMPF1mtftF4O5lYHUZoD8bETw1MYcA-mjr9hjZzsalpdALjdfI-K4vA_hZz6Jpv3VHIGfnrQ086pNpZAPlAWXEDqkDew5pZSH-SKvhkZ4jVEMRY4aQmsE2sQGYVbmVu9snv5xdeK092KLM0F9HxMOVzjsZkfY7',
    dealer: 'System'
  }
};

const GameDetail: React.FC<GameDetailProps> = ({ balance, gameId, onBack }) => {
  const gameInfo = (gameId && GAMES_DB[gameId]) || GAMES_DB[1]; // Fallback to Roulette
  
  const [loadingState, setLoadingState] = useState<'connecting' | 'ready'>('connecting');
  const [activeTab, setActiveTab] = useState<'chat' | 'rules'>('chat');
  const [selectedChip, setSelectedChip] = useState<number>(25);
  const [totalBet, setTotalBet] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<'betting' | 'playing' | 'result'>('betting');
  const [winResult, setWinResult] = useState<string | null>(null);
  
  // Specific states for different game types
  const [selectedNumbers, setSelectedNumbers] = useState<{ [key: number]: number }>({});
  const [baccaratSelection, setBaccaratSelection] = useState<string | null>(null);

  const chips = [1, 5, 25, 100, 500];

  useEffect(() => {
    setLoadingState('connecting');
    const timer = setTimeout(() => setLoadingState('ready'), 1500);
    return () => clearTimeout(timer);
  }, [gameId]);

  const handlePlaceBet = () => {
    if (totalBet === 0) return;
    setGameStatus('playing');
    
    setTimeout(() => {
      const isWin = Math.random() > 0.7; // 30% win chance
      setGameStatus('result');
      setWinResult(isWin ? 'Congratulations! You Won!' : 'Better luck next time!');
      
      setTimeout(() => {
        setGameStatus('betting');
        setTotalBet(0);
        setSelectedNumbers({});
        setBaccaratSelection(null);
        setWinResult(null);
      }, 3000);
    }, 2000);
  };

  const renderBettingInterface = () => {
    switch (gameInfo.type) {
      case 'roulette':
        return (
          <div className="grid grid-cols-6 gap-1.5 p-2 bg-white/5 rounded-2xl border border-white/5">
            {Array.from({ length: 36 }, (_, i) => i + 1).map(n => (
              <button 
                key={n}
                onClick={() => {
                  if (gameStatus !== 'betting') return;
                  setSelectedNumbers(prev => ({...prev, [n]: (prev[n] || 0) + selectedChip}));
                  setTotalBet(prev => prev + selectedChip);
                }}
                className={`h-10 rounded-lg flex flex-col items-center justify-center font-black transition-all ${
                  selectedNumbers[n] ? 'bg-primary text-white scale-95' : 'bg-black/40 text-slate-500'
                }`}
              >
                <span className="text-[10px]">{n}</span>
                {selectedNumbers[n] && <span className="text-[7px]">${selectedNumbers[n]}</span>}
              </button>
            ))}
          </div>
        );
      case 'baccarat':
        return (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {['PLAYER', 'TIE', 'BANKER'].map(side => (
                <button 
                  key={side}
                  onClick={() => {
                    if (gameStatus !== 'betting') return;
                    setBaccaratSelection(side);
                    setTotalBet(selectedChip);
                  }}
                  className={`h-24 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                    baccaratSelection === side 
                    ? 'bg-primary border-white text-white' 
                    : 'bg-white/5 border-white/10 text-slate-500'
                  }`}
                >
                  <span className="text-xs font-black tracking-widest">{side}</span>
                  <span className="text-[10px] mt-1">{side === 'TIE' ? '8:1' : '1:1'}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] text-slate-500 font-black uppercase tracking-widest">Select your side to place bet</p>
          </div>
        );
      case 'slot':
        return (
          <div className="flex flex-col items-center justify-center py-6 gap-6">
            <div className="w-full flex justify-around items-center px-4">
               <div className="size-16 rounded-xl bg-white/5 flex items-center justify-center text-4xl">🍒</div>
               <div className="size-20 rounded-xl bg-white/10 flex items-center justify-center text-5xl border-2 border-primary animate-pulse">7️⃣</div>
               <div className="size-16 rounded-xl bg-white/5 flex items-center justify-center text-4xl">💎</div>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-white font-black text-sm uppercase tracking-[0.3em] mb-1">Bet Per Spin</span>
               <div className="flex items-center gap-4">
                  <button onClick={() => setTotalBet(Math.max(1, totalBet - 5))} className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white">-</button>
                  <span className="text-2xl font-black text-yellow-400">${totalBet || 5}</span>
                  <button onClick={() => setTotalBet(totalBet + 5)} className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white">+</button>
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark animate-in fade-in duration-500 overflow-hidden font-display relative">
      
      {/* Header / Stream */}
      <div className="relative w-full aspect-[16/9] bg-black overflow-hidden border-b border-white/10">
        {loadingState === 'connecting' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background-dark">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-[10px] font-black uppercase tracking-widest">Loading Live Feed...</p>
          </div>
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url("${gameInfo.bg}")`}}>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-black/60"></div>
            </div>
            {gameStatus !== 'betting' && (
              <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="flex flex-col items-center">
                  {gameStatus === 'playing' ? (
                    <div className="w-16 h-16 border-8 border-primary border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <div className="text-center p-6 bg-primary rounded-3xl shadow-2xl animate-in zoom-in">
                        <p className="text-white font-black text-xl">{winResult}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        <button onClick={onBack} className="absolute top-8 left-4 z-50 size-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-80">
        <div className="px-5 py-6">
          <h1 className="text-2xl font-black text-white leading-tight">{gameInfo.title}</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Dealer: {gameInfo.dealer} • {gameInfo.provider}</p>
          
          <div className="mt-8">
            {renderBettingInterface()}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-0 left-0 w-full z-50 bg-[#1e1414]/95 backdrop-blur-2xl rounded-t-[2.5rem] border-t border-white/5">
        <div className="px-6 py-4 flex justify-around border-b border-white/5">
          <div className="flex flex-col items-center">
            <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Balance</span>
            <span className="text-white font-black">${balance.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Total Bet</span>
            <span className="text-yellow-400 font-black">${totalBet}</span>
          </div>
        </div>

        <div className="px-4 py-4 flex justify-center gap-3">
          {chips.map(v => (
            <button key={v} onClick={() => setSelectedChip(v)} className={`relative transition-all ${selectedChip === v ? '-translate-y-1 scale-110' : 'opacity-40'}`}>
              <div className={`size-11 rounded-full flex items-center justify-center font-black text-[10px] border-2 shadow-xl ${v === 25 ? 'bg-red-600 border-red-400' : 'bg-slate-700 border-slate-500'} text-white`}>
                {v}
              </div>
            </button>
          ))}
        </div>

        <div className="px-6 pb-10 flex gap-3">
          <button onClick={() => {setTotalBet(0); setSelectedNumbers({}); setBaccaratSelection(null);}} className="size-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500">
            <span className="material-symbols-outlined">delete</span>
          </button>
          <button 
            onClick={handlePlaceBet}
            disabled={totalBet === 0 || gameStatus !== 'betting'}
            className="flex-1 h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl disabled:opacity-30"
          >
            {gameStatus === 'betting' ? 'Confirm Bet' : 'Processing...'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
