
import React, { useState, useEffect } from 'react';
import { translations, Language } from '../services/translations';
import { getUserNotifications, supabase } from '../services/supabase';

interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time?: string;
  created_at: string;
  type: 'win' | 'promo' | 'system' | 'loss' | 'security';
  unread: boolean;
}

interface NotificationsProps {
  lang: Language;
  onBack: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ lang, onBack }) => {
  const t = translations[lang];
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await getUserNotifications(user.id);
      if (data) setNotifications(data);
    }
    setIsLoading(false);
  };

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('notifications').update({ unread: false }).eq('user_id', user.id);
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    }
  };

  const getIconConfig = (type: string) => {
    switch(type) {
      case 'win': return { icon: 'sports_soccer', color: 'text-emerald-500' };
      case 'promo': return { icon: 'card_giftcard', color: 'text-primary' };
      case 'system': return { icon: 'settings', color: 'text-blue-500' };
      default: return { icon: 'notifications', color: 'text-slate-400' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a0d0e] animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar font-display">
      <header className="sticky top-0 z-50 bg-[#1a0d0e]/95 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-white/5 shadow-2xl">
        <button onClick={onBack} className="flex items-center justify-center size-10 rounded-full hover:bg-white/5 active:scale-90"><span className="material-symbols-outlined text-white text-2xl font-black">arrow_back</span></button>
        <h2 className="text-white text-lg font-black tracking-tighter uppercase italic">Alert Center</h2>
        <button onClick={markAllRead} className="text-primary text-[10px] font-black uppercase tracking-widest">{t.markRead}</button>
      </header>

      <div className="flex flex-col pb-20 mt-4">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-white/[0.03]">
            {notifications.map(n => {
              const config = getIconConfig(n.type);
              return (
                <div key={n.id} className="flex gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors cursor-pointer group relative">
                  <div className={`flex items-center justify-center rounded-2xl shrink-0 size-14 border border-white/10 bg-white/5 shadow-2xl ${config.color}`}>
                    <span className="material-symbols-outlined text-[28px] leading-none">{config.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <h4 className="text-white text-[13px] font-black uppercase tracking-tight truncate leading-none">{n.title}</h4>
                      <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest shrink-0">{new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] font-bold leading-relaxed">{n.desc}</p>
                  </div>
                  {n.unread && <div className="shrink-0 self-center pl-2"><div className="size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(234,42,51,0.8)]"></div></div>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
             <span className="material-symbols-outlined text-6xl mb-4">notifications_off</span>
             <p className="text-xs font-black uppercase tracking-widest">No new alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
