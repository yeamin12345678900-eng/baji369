
import React, { useState, useMemo, useEffect } from 'react';
import { Language, translations } from '../services/translations';

interface Match {
  id: number;
  league: string;
  time: string;
  displayTime: string;
  teamA: string;
  teamB: string;
  codeA: string;
  codeB: string;
  scoreA: number;
  scoreB: number;
  odds: number[];
  prevOdds?: number[];
  isLive: boolean;
  sport: string;
  logoA?: string;
  logoB?: string;
}

const INITIAL_MATCHES: Match[] = [
  { id: 1, league: 'Premier League', time: 'Today', displayTime: 'Today, 20:45', teamA: 'Man United', teamB: 'Liverpool', codeA: 'MUN', codeB: 'LIV', scoreA: 0, scoreB: 0, odds: [2.10, 3.40, 2.85], isLive: true, sport: 'Football' },
  { id: 2, league: 'La Liga', time: 'Live', displayTime: '72\'', teamA: 'Real Madrid', teamB: 'Barcelona', codeA: 'RMA', codeB: 'BAR', scoreA: 2, scoreB: 1, odds: [1.65, 3.80, 4.20], isLive: true, sport: 'Football' },
  { id: 3, league: 'Cricket World Cup', time: 'Live', displayTime: '15.2 Overs', teamA: 'India', teamB: 'Australia', codeA: 'IND', codeB: 'AUS', scoreA: 145, scoreB: 0, odds: [1.32, 15.00, 2.45], isLive: true, sport: 'Cricket' },
  { id: 4, league: 'NBA', time: 'Tomorrow', displayTime: 'Oct 28, 04:30', teamA: 'LA Lakers', teamB: 'GS Warriors', codeA: 'LAL', codeB: 'GSW', scoreA: 0, scoreB: 0, odds: [1.82, 0, 1.82], isLive: false, sport: 'Basketball' }
];

interface SportsBettingProps {
  lang: Language;
  balance: number;
  onNotificationClick?: () => void;
  onMyBetsClick?: () => void;
  globalRigging?: number; // Added to support admin control
}

const SportsBetting: React.FC<SportsBettingProps> = ({ lang, balance, onNotificationClick, onMyBetsClick, globalRigging = 0.3 }) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSport, setActiveSport] = useState('Live');
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [betSlip, setBetSlip] = useState<any[]>([]);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);

  const SPORTS = [
    { id: 'Live', icon: 'sensors', count: 12, label: lang === 'en' ? 'Live' : 'লাইভ' },
    { id: 'Football', icon: 'sports_soccer', count: 45, label: lang === 'en' ? 'Football' : 'ফুটবল' },
    { id: 'Cricket', icon: 'sports_cricket', count: 8, label: lang === 'en' ? 'Cricket' : 'ক্রিকেট' },
    { id: 'Basketball', icon: 'sports_basketball', count: 21, label: lang === 'en' ? 'Basketball' : 'বাস্কেটবল' }
  ];

  // Logic to ensure house edge is respected based on globalRigging
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(currentMatches => {
        return currentMatches.map(match => {
          if (Math.random() > 0.7) {
            const newOdds = match.odds.map(odd => {
              if (odd === 0) return 0;
              // Higher global rigging = lower odds for users (higher profit for admin)
              const bias = globalRigging * 0.2; 
              const change = (Math.random() - (0.5 + bias)) * 0.15; 
              const updated = parseFloat((odd + change).toFixed(2));
              return Math.max(1.05, updated);
            });
            return { ...match, prevOdds: [...match.odds], odds: newOdds };
          }
          return match;
        });
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [globalRigging]);

  const handlePlaceBet = () => {
    setIsPlacing(true);
    // Rigging Logic: Higher rigging means higher chance of simulated loss
    const winThreshold = 0.85 - (globalRigging * 0.6); // If rigging is 1.0, win chance is 25%
    const isWin = Math.random() > winThreshold;

    setTimeout(() => {
      setIsPlacing(false);
      setBetSlip([]);
      setIsSlipOpen(false);
      if (isWin) {
        alert(lang === 'en' ? "Bet placed successfully!" : "বেট সফলভাবে প্লেস করা হয়েছে!");
      } else {
        alert(lang === 'en' ? "Error processing bet. Internal settlement error." : "বেট প্রসেসিং ত্রুটি। অভ্যন্তরীণ সেটেলমেন্ট সমস্যা।");
      }
    }, 1500);
  };

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = m.teamA.toLowerCase().includes(q) || m.teamB.toLowerCase().includes(q) || m.league.toLowerCase().includes(q);
      const matchesSport = activeSport === 'Live' ? m.isLive : m.sport === activeSport;
      return matchesSearch && matchesSport;
    });
  }, [searchQuery, activeSport, matches]);

  const toggleSelection = (match: Match, oddIndex: number) => {
    const selectionId = `${match.id}-${oddIndex}`;
    const exists = betSlip.find(s => s.id === selectionId);
    if (exists) {
      setBetSlip(prev => prev.filter(s => s.id !== selectionId));
    } else {
      const selectionName = oddIndex === 0 ? match.teamA : oddIndex === 1 ? (lang === 'en' ? 'Draw' : 'ড্র') : match.teamB;
      setBetSlip([{ id: selectionId, matchId: match.id, teams: `${match.teamA} vs ${match.teamB}`, selection: selectionName, odds: match.odds[oddIndex] }]);
      setIsSlipOpen(true);
    }
  };

  const getTrendColor = (current: number, prev: number | undefined) => {
    if (!prev || current === prev) return 'text-white';
    return current > prev ? 'text-emerald-400' : 'text-red-400';
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f13] animate-in fade-in duration-500 overflow-y-auto no-scrollbar pb-32 font-display text-slate-100">
      <header className="sticky top-0 z-[60] bg-[#0b0f13]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="flex items-center p-5 justify-between">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-gradient-to-tr from-primary to-red-400 p-[2px] shadow-lg shadow-primary/20">
              <div className="size-full rounded-[14px] bg-[#1a1f26] flex items-center justify-center">
                 <span className="material-symbols-outlined text-white text-[24px] filled">sports_esports</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-white text-lg font-black tracking-tighter leading-none">{t.sports.toUpperCase()}</h2>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                STAKED: ${balance.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onMyBetsClick} className="flex h-11 px-4 items-center justify-center rounded-2xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest gap-2.5 border border-white/5 active:scale-95">
              <span className="material-symbols-outlined !text-[20px] text-primary">receipt_long</span>
              {t.history.toUpperCase()}
            </button>
          </div>
        </div>
        
        <div className="px-5 pb-5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-[#1a1f26] border border-white/5 text-white text-sm rounded-[1.25rem] pl-12 pr-12 focus:ring-1 focus:ring-primary/50 placeholder-slate-600 transition-all font-medium" 
              placeholder={lang === 'en' ? 'Search teams, leagues...' : 'দল বা লীগ খুঁজুন...'}
            />
          </div>
        </div>
      </header>

      <div className="sticky top-[138px] z-50 bg-[#0b0f13]/95 backdrop-blur-xl">
        <div className="flex gap-4 px-5 py-5 overflow-x-auto no-scrollbar border-b border-white/5">
          {SPORTS.map(sport => (
            <button 
              key={sport.id}
              onClick={() => setActiveSport(sport.id)}
              className={`flex flex-col items-center gap-2 shrink-0 p-4 min-w-[85px] rounded-[1.75rem] transition-all relative border ${
                activeSport === sport.id ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-[#1a1f26] text-slate-500 border-white/5'
              }`}
            >
              <span className="material-symbols-outlined !text-[26px]">{sport.icon}</span>
              <span className="text-[9px] font-black uppercase tracking-widest">{sport.label}</span>
              <span className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-lg text-[8px] font-black ${activeSport === sport.id ? 'bg-white text-primary' : 'bg-primary text-white'}`}>{sport.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 p-5">
        {filteredMatches.map(match => (
          <div key={match.id} className="bg-[#1a1f26] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl group transition-all hover:bg-[#212731]">
            <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[14px] text-primary filled">sports_soccer</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{match.league}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500">{match.displayTime}</span>
                {match.isLive && (
                  <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-0.5 rounded-full">
                     <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
                     <span className="text-red-500 text-[8px] font-black uppercase tracking-widest">Live</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-8 gap-4">
                <div className="flex flex-col items-center gap-3 flex-1 text-center">
                  <div className="size-16 rounded-3xl bg-[#212731] border border-white/5 flex items-center justify-center text-white font-black text-xl shadow-inner">{match.codeA}</div>
                  <span className="text-white text-[13px] font-black tracking-tight leading-tight">{match.teamA}</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-3 bg-[#0b0f13] px-5 py-2.5 rounded-2xl border border-white/10 shadow-xl">
                    <span className="text-2xl font-black text-white tabular-nums tracking-tighter">{match.scoreA}</span>
                    <span className="text-slate-600 font-bold text-sm"> : </span>
                    <span className="text-2xl font-black text-white tabular-nums tracking-tighter">{match.scoreB}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 flex-1 text-center">
                  <div className="size-16 rounded-3xl bg-[#212731] border border-white/5 flex items-center justify-center text-white font-black text-xl shadow-inner">{match.codeB}</div>
                  <span className="text-white text-[13px] font-black tracking-tight leading-tight">{match.teamB}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['HOME', 'DRAW', 'AWAY'].map((label, i) => {
                  const odd = match.odds[i];
                  if (odd === 0) return <div key={i}></div>;
                  const isSelected = betSlip.some(s => s.id === `${match.id}-${i}`);
                  const prevOdd = match.prevOdds?.[i];
                  return (
                    <button key={i} onClick={() => toggleSelection(match, i)} className={`relative flex flex-col items-center justify-center h-16 rounded-[1.25rem] border transition-all active:scale-[0.97] ${isSelected ? 'bg-primary border-primary shadow-lg' : 'bg-[#0b0f13]/40 border-white/5 hover:border-white/20'}`}>
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>{label}</span>
                      <span className={`text-base font-black tabular-nums transition-colors duration-500 ${isSelected ? 'text-white' : getTrendColor(odd, prevOdd)}`}>{odd.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {betSlip.length > 0 && (
        <div className="fixed bottom-28 left-0 right-0 px-6 z-[70]">
          <button onClick={() => setIsSlipOpen(true)} className="w-full h-16 bg-primary text-white rounded-[1.5rem] shadow-2xl shadow-primary/40 flex items-center justify-between px-6 animate-in slide-in-from-bottom duration-500 active:scale-95 transition-transform">
            <div className="flex items-center gap-4">
               <span className="material-symbols-outlined text-white">receipt_long</span>
               <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{lang === 'en' ? 'Review Betslip' : 'স্লিপ রিভিউ করুন'}</p>
                  <p className="text-sm font-black tracking-tight">{betSlip.length} Selection{betSlip.length > 1 ? 's' : ''}</p>
               </div>
            </div>
            <span className="material-symbols-outlined">expand_less</span>
          </button>
        </div>
      )}

      {isSlipOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-end">
          <div className="w-full bg-[#1a1f26] rounded-t-[3.5rem] h-[60%] flex flex-col animate-in slide-in-from-bottom duration-500 border-t border-white/5">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 shrink-0"></div>
            <div className="flex items-center justify-between p-8">
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{lang === 'en' ? 'Checkout' : 'চেকআউট'}</h3>
              <button onClick={() => setIsSlipOpen(false)} className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="flex-1 overflow-y-auto px-8 no-scrollbar pb-10 space-y-4">
              {betSlip.map(selection => (
                <div key={selection.id} className="bg-[#212731] border border-white/5 rounded-[2rem] p-6 relative">
                  <h4 className="text-white font-black text-lg tracking-tight">{selection.selection}</h4>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{selection.teams}</p>
                  <span className="absolute top-6 right-6 text-2xl font-black text-primary">{selection.odds.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="p-8 bg-[#0b0f13]/60 backdrop-blur-3xl border-t border-white/5">
              <button 
                onClick={handlePlaceBet}
                disabled={isPlacing}
                className="w-full h-16 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center"
              >
                {isPlacing ? <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (lang === 'en' ? 'Place Bet' : 'বেট ধরুন')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsBetting;
