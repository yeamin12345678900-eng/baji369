
import React, { useState, useEffect } from 'react';

interface DailySpinProps {
  onWin: (amount: number) => void;
  onClose: () => void;
}

const DailySpin: React.FC<DailySpinProps> = ({ onWin, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [reward, setReward] = useState<number | null>(null);

  const prizes = [
    { label: '$0.50', value: 0.5, color: 'bg-slate-800' },
    { label: '$1.00', value: 1.0, color: 'bg-primary' },
    { label: '$0.10', value: 0.1, color: 'bg-slate-700' },
    { label: '$5.00', value: 5.0, color: 'bg-yellow-600' },
    { label: '$0.25', value: 0.25, color: 'bg-slate-800' },
    { label: '$2.00', value: 2.0, color: 'bg-blue-600' },
    { label: '$0.05', value: 0.05, color: 'bg-slate-700' },
    { label: '$10.0', value: 10.0, color: 'bg-emerald-600' },
  ];

  useEffect(() => {
    const lastSpin = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    if (lastSpin === today) {
      setHasSpun(true);
    }
  }, []);

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    const extraDegrees = 1800 + Math.floor(Math.random() * 360);
    const newRotation = rotation + extraDegrees;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDeg = newRotation % 360;
      const prizeIndex = Math.floor((360 - actualDeg) / (360 / prizes.length)) % prizes.length;
      const finalPrize = prizes[prizeIndex];
      
      setReward(finalPrize.value);
      setHasSpun(true);
      localStorage.setItem('lastSpinDate', new Date().toDateString());
      onWin(finalPrize.value);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#1a0d0e] rounded-[3rem] border border-white/10 p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
        
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="text-center mb-8">
           <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Lucky Spin</h2>
           <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Win Daily Rewards</p>
        </div>

        {/* The Wheel */}
        <div className="relative size-64 mb-10">
          {/* Needle */}
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-20 text-primary drop-shadow-xl">
             <span className="material-symbols-outlined text-4xl filled">stat_minus_1</span>
          </div>

          <div 
            className="size-full rounded-full border-8 border-white/5 relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {prizes.map((p, i) => (
              <div 
                key={i}
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 origin-bottom flex items-start justify-center pt-4 ${p.color}`}
                style={{ transform: `rotate(${i * (360 / prizes.length)}deg) skewY(-45deg)` }}
              >
                <span className="text-[10px] font-black text-white transform skewY(45deg) rotate-0 mt-2">
                  {p.label}
                </span>
              </div>
            ))}
            <div className="absolute inset-0 rounded-full border-[12px] border-black/20 pointer-events-none"></div>
          </div>
          
          {/* Center Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 bg-[#1a0d0e] rounded-full border-4 border-white/10 flex items-center justify-center z-10 shadow-xl">
             <div className="size-4 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>

        {reward !== null ? (
          <div className="text-center animate-in zoom-in duration-500">
             <p className="text-slate-400 text-xs font-bold uppercase mb-2">Congratulations!</p>
             <h3 className="text-4xl font-black text-emerald-400 italic tracking-tighter mb-6">+${reward.toFixed(2)}</h3>
             <button onClick={onClose} className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Collect Prize</button>
          </div>
        ) : (
          <button 
            onClick={handleSpin}
            disabled={isSpinning || hasSpun}
            className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
              hasSpun ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5' : 'bg-primary text-white'
            }`}
          >
            {isSpinning ? 'Spinning...' : hasSpun ? 'Come back tomorrow' : 'Spin Now'}
            {!isSpinning && !hasSpun && <span className="material-symbols-outlined text-xl">autorenew</span>}
          </button>
        )}

        <div className="mt-6 opacity-30 text-center">
           <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
             Free spin resets every 24 hours. Prize amount is credited directly to your main wallet balance.
           </p>
        </div>
      </div>
    </div>
  );
};

export default DailySpin;
