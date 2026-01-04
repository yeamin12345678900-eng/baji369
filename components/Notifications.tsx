
import React, { useState } from 'react';
import { translations, Language } from '../services/translations';

interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: 'win' | 'promo' | 'system' | 'loss' | 'security';
  unread: boolean;
  category: string;
}

const NOTIFICATIONS: NotificationItem[] = [
  { id: 1, title: 'Goal! Manchester vs. Arsenal', desc: 'Your bet on Over 2.5 goals has won. Check balance now.', time: '2M AGO', type: 'win', unread: true, category: 'Bet Updates' },
  { id: 2, title: '100% Deposit Bonus', desc: 'Claim your weekend bonus before it expires. Don\'t miss out!', time: '2H AGO', type: 'promo', unread: true, category: 'Promotional Offers' },
  { id: 3, title: 'System Maintenance', desc: 'System maintenance at 02:00 AM UTC. Betting will pause for 15 mins.', time: '5H AGO', type: 'system', unread: false, category: 'System Alerts' }
];

interface NotificationsProps {
  lang: Language;
  onBack: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ lang, onBack }) => {
  const t = translations[lang];
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  const getIconConfig = (type: NotificationItem['type']) => {
    switch(type) {
      case 'win': return { icon: 'sports_soccer' };
      case 'promo': return { icon: 'card_giftcard' };
      case 'system': return { icon: 'settings' };
      default: return { icon: 'notifications' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a0d0e] animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar font-display">
      <header className="sticky top-0 z-50 bg-[#1a0d0e]/95 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-white/5 shadow-2xl">
        <button onClick={onBack} className="flex items-center justify-center size-10 rounded-full hover:bg-white/5 active:scale-90"><span className="material-symbols-outlined text-white text-2xl font-black">arrow_back</span></button>
        <h2 className="text-white text-lg font-black tracking-tighter uppercase">{t.notifications}</h2>
        <button onClick={markAllRead} className="text-primary text-[10px] font-black uppercase tracking-widest">{t.markRead}</button>
      </header>

      <div className="flex flex-col pb-20 mt-4">
        <h3 className="text-white text-[11px] font-black uppercase tracking-[0.25em] px-7 py-4 mb-2">{t.today}</h3>
        <div className="divide-y divide-white/[0.03]">
          {notifications.map(n => {
            const config = getIconConfig(n.type);
            return (
              <div key={n.id} className="flex gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors cursor-pointer group relative">
                <div className="flex items-center justify-center rounded-2xl shrink-0 size-14 border border-white/10 bg-white/5 shadow-2xl">
                  <span className="material-symbols-outlined text-[28px] text-white leading-none">{config.icon}</span>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <h4 className="text-white text-[13px] font-black uppercase tracking-tight truncate leading-none">{n.title}</h4>
                    <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest shrink-0">{n.time}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] font-bold leading-relaxed line-clamp-2">{n.desc}</p>
                </div>
                {n.unread && <div className="shrink-0 self-center pl-2"><div className="size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(234,42,51,0.8)]"></div></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
