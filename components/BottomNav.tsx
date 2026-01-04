
import React from 'react';
import { ViewType } from '../App';
import { translations, Language } from '../services/translations';

interface BottomNavProps {
  lang: Language;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ lang, currentView, onNavigate }) => {
  const t = translations[lang];
  const tabs: { id: ViewType; label: string; icon: string }[] = [
    { id: 'dashboard', label: t.home, icon: 'home' },
    { id: 'wallet', label: t.wallet, icon: 'account_balance_wallet' }, // Replaced sports with wallet
    { id: 'casino', label: t.casino, icon: 'casino' },
    { id: 'promotions', label: t.promos, icon: 'local_activity' },
    { id: 'profile', label: t.account, icon: 'person' },
  ];

  return (
    <nav className="w-full bg-[#1a0d0e]/95 backdrop-blur-xl border-t border-white/5 z-50">
      <div className="flex justify-around items-center h-[72px] pb-safe px-2">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          if (tab.id === 'casino') {
            return (
              <div key={tab.id} className="relative -top-6">
                <button 
                  onClick={() => onNavigate('casino')}
                  className={`size-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/40 border-4 border-[#1a0d0e] transition-transform active:scale-90 ${isActive ? 'scale-110' : ''}`}
                >
                  <span className="material-symbols-outlined text-[28px]">casino</span>
                </button>
              </div>
            );
          }
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
            >
              <span className={`material-symbols-outlined text-[24px] ${isActive ? 'filled' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                {tab.icon}
              </span>
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
