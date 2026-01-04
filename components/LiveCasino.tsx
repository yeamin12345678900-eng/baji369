
import React from 'react';
import { ViewType } from '../App';
import { Language } from '../services/translations';

interface LiveCasinoProps {
  lang: Language;
  balance: number;
  onNavigate: (view: ViewType) => void;
  gameStatus: Record<string, boolean>;
}

const LiveCasino: React.FC<LiveCasinoProps> = ({ lang, balance, onNavigate, gameStatus }) => {
  const games = [
    { 
      id: 'crazy777-game' as ViewType, 
      title: 'Crazy 777', 
      icon: 'filter_7', 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-400/10', 
      multiplier: 'x3333', 
      players: '8.1k',
      image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=400&auto=format&fit=crop'
    },
    { 
      id: 'aviator-game' as ViewType, 
      title: 'Aviator', 
      icon: 'flight_takeoff', 
      color: 'text-primary', 
      bg: 'bg-primary/10', 
      multiplier: 'x1000', 
      players: '5.4k',
      image: 'https://images.unsplash.com/photo-1464039397811-476f652a343b?q=80&w=400&auto=format&fit=crop'
    },
    { 
      id: 'crash-game' as ViewType, 
      title: 'Crash', 
      icon: 'rocket_launch', 
      color: 'text-red-500', 
      bg: 'bg-red-500/10', 
      multiplier: 'x1000', 
      players: '1.2k',
      image: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=400&auto=format&fit=crop'
    },
    { 
      id: 'mines-game' as ViewType, 
      title: 'Mines', 
      icon: 'grid_view', 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10', 
      multiplier: 'x24.00', 
      players: '840',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop'
    },
    { 
      id: 'penalty-game' as ViewType, 
      title: 'Penalty', 
      icon: 'sports_soccer', 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10', 
      multiplier: 'x30.72', 
      players: '2.1k',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format&fit=crop'
    },
    { 
      id: 'limbo-game' as ViewType, 
      title: 'Limbo', 
      icon: 'trending_up', 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10', 
      multiplier: 'x100.00', 
      players: '450',
      image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop'
    },
    { 
      id: 'dice-game' as ViewType, 
      title: 'Dice', 
      icon: 'casino', 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10', 
      multiplier: 'x99.00', 
      players: '320',
      image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=400&auto=format&fit=crop'
    },
    { 
      id: 'plinko-game' as ViewType, 
      title: 'Plinko', 
      icon: 'keyboard_double_arrow_down', 
      color: 'text-cyan-500', 
      bg: 'bg-cyan-500/10', 
      multiplier: 'x10.00', 
      players: '670',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop'
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1a0d0e] animate-in fade-in duration-500 overflow-y-auto no-scrollbar pb-32 font-display">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1a0d0e]/95 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <span className="material-symbols-outlined text-primary">casino</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Casino Floor</span>
            <span className="text-white text-sm font-black tracking-tight">ORIGINAL GAMES</span>
          </div>
        </div>
        <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
            <span className="text-white font-black text-xs tabular-nums">${balance.toLocaleString()}</span>
        </div>
      </header>

      {/* Featured Banner */}
      <section className="p-5">
         <div 
          onClick={() => gameStatus['crazy777-game'] && onNavigate('crazy777-game')}
          className={`w-full h-40 rounded-[2.5rem] bg-cover bg-center p-6 flex flex-col justify-center relative overflow-hidden group cursor-pointer ${!gameStatus['crazy777-game'] ? 'grayscale opacity-50' : ''}`}
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=1000&auto=format&fit=crop")' }}
         >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="relative z-10">
              <h2 className="text-white text-2xl font-black uppercase italic tracking-tighter">Crazy 777</h2>
              <p className="text-white/80 text-xs font-bold mt-1 uppercase tracking-widest">Mega Jackpots Await</p>
              
              {gameStatus['crazy777-game'] ? (
                <button className="mt-4 bg-primary text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest w-fit shadow-xl">PLAY NOW</button>
              ) : (
                <div className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest w-fit shadow-xl">OFFLINE</div>
              )}
            </div>
         </div>
      </section>

      {/* Games Grid */}
      <section className="px-5 mt-2 grid grid-cols-2 gap-4">
        {games.map((game) => {
          const isEnabled = gameStatus[game.id];
          return (
            <div 
              key={game.id} 
              onClick={() => isEnabled && onNavigate(game.id)} 
              className={`bg-surface-dark h-52 rounded-[2rem] border border-white/5 transition-all relative overflow-hidden group ${isEnabled ? 'cursor-pointer active:scale-95 hover:border-primary/50' : 'opacity-40 grayscale cursor-not-allowed'}`}
            >
              {/* Card Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                style={{ backgroundImage: `url("${game.image}")` }}
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>

              {!isEnabled && (
                <div className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center">
                  <span className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg rotate-[-10deg]">Maintenance</span>
                </div>
              )}

              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
                <div className={`size-10 rounded-xl ${game.bg} flex items-center justify-center mb-3 shadow-xl backdrop-blur-md border border-white/10`}>
                  <span className="material-symbols-outlined text-xl text-white">{game.icon}</span>
                </div>
                
                <h4 className="text-white font-black text-sm uppercase tracking-tight leading-none mb-2">{game.title}</h4>
                <div className="flex flex-col">
                  <span className="text-[7px] text-slate-400 font-black uppercase tracking-widest leading-none">Max Win</span>
                  <span className="text-emerald-400 text-[10px] font-black">{game.multiplier}x</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default LiveCasino;
