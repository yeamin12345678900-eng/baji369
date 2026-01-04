
import React from 'react';
import { ViewType } from '../App';

interface MiniGamesHubProps {
  onNavigate: (view: ViewType) => void;
  gameStatus: Record<string, boolean>;
}

const MiniGamesHub: React.FC<MiniGamesHubProps> = ({ onNavigate, gameStatus }) => {
  const games = [
    { 
      id: 'crazy777-game' as ViewType, 
      title: 'Crazy 777', 
      icon: 'filter_7', 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-400/10', 
      desc: 'Classic 3-reel slots with mega multipliers!',
      image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 'aviator-game' as ViewType, 
      title: 'Aviator', 
      icon: 'flight_takeoff', 
      color: 'text-primary', 
      bg: 'bg-primary/10', 
      desc: 'Predict how far the plane flies!',
      image: 'https://images.unsplash.com/photo-1464039397811-476f652a343b?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 'crash-game' as ViewType, 
      title: 'Crash', 
      icon: 'rocket_launch', 
      color: 'text-red-500', 
      bg: 'bg-red-500/10', 
      desc: 'Cash out before it crashes!',
      image: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 'mines-game' as ViewType, 
      title: 'Mines', 
      icon: 'grid_view', 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10', 
      desc: 'Find diamonds, avoid mines.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 'penalty-game' as ViewType, 
      title: 'Penalty', 
      icon: 'sports_soccer', 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10', 
      desc: 'Score goals for big multipliers.',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 'limbo-game' as ViewType, 
      title: 'Limbo', 
      icon: 'trending_up', 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10', 
      desc: 'Set your target multiplier.',
      image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 'dice-game' as ViewType, 
      title: 'Dice', 
      icon: 'casino', 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10', 
      desc: 'Roll high or low to win.',
      image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 'plinko-game' as ViewType, 
      title: 'Plinko', 
      icon: 'keyboard_double_arrow_down', 
      color: 'text-cyan-500', 
      bg: 'bg-cyan-500/10', 
      desc: 'Watch the ball fall and win.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop'
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1a0d0e] animate-in fade-in duration-500">
      <header className="p-6 pb-2">
        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">Baji Originals</h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Provably Fair • Instant Win</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 gap-4 no-scrollbar pb-32">
        {games.map((game, i) => {
          const isEnabled = gameStatus[game.id];
          return (
            <div 
              key={i}
              onClick={() => isEnabled && onNavigate(game.id)}
              className={`group relative h-28 border border-white/10 rounded-[2rem] overflow-hidden transition-all ${isEnabled ? 'cursor-pointer active:scale-[0.98]' : 'opacity-30 grayscale cursor-not-allowed'}`}
            >
              {/* Background Image Layer */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-110" 
                style={{ backgroundImage: `url("${game.image}")` }}
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent group-hover:via-black/40 transition-colors"></div>

              {/* Content Layer */}
              <div className="absolute inset-0 p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-5">
                  <div className={`size-14 rounded-2xl ${game.bg} flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/10`}>
                    <span className={`material-symbols-outlined text-3xl text-white`}>{game.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-black text-lg tracking-tight uppercase leading-none">{game.title}</h3>
                      {!isEnabled && <span className="bg-red-500 text-[8px] font-black px-2 py-0.5 rounded uppercase shadow-lg">Maintenance</span>}
                    </div>
                    <p className="text-slate-300 text-[10px] font-bold mt-1.5 leading-tight max-w-[200px]">{game.desc}</p>
                  </div>
                </div>
                <span className={`material-symbols-outlined ${isEnabled ? 'text-white/40 group-hover:text-primary group-hover:translate-x-1' : 'text-slate-800'} transition-all`}>arrow_forward_ios</span>
              </div>
            </div>
          );
        })}

        <div className="mt-4 p-6 bg-primary/5 rounded-[2.5rem] border border-primary/20 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 size-32 bg-primary/5 rounded-full blur-3xl"></div>
            <span className="material-symbols-outlined text-primary text-4xl mb-2 relative z-10">verified_user</span>
            <p className="text-white text-[10px] font-black uppercase tracking-widest relative z-10">Provably Fair System</p>
            <p className="text-slate-500 text-[9px] mt-2 leading-relaxed max-w-[250px] mx-auto relative z-10">Each outcome is cryptographically generated to ensure 100% transparency and fairness.</p>
        </div>
      </div>
    </div>
  );
};

export default MiniGamesHub;
