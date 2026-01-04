
import React from 'react';
import { translations, Language } from '../services/translations';

interface ProfileSettingsProps {
  lang: Language;
  userProfile?: any;
  onBack: () => void;
  onLogout: () => void;
  onLanguageToggle: () => void;
  onEditProfile: () => void;
  onPersonalDetails: () => void;
  onVerificationCenter: () => void;
  onChangePassword: () => void;
  onVipRewards: () => void;
  onHelpSupport?: () => void;
  onAboutUs?: () => void;
  onTerms?: () => void;
  onPrivacy?: () => void;
  onAdminPanel?: () => void;
}

const SettingItem = ({ icon, label, onClick, badge, color = "text-white", iconColor = "bg-white/5", iconText = "text-slate-400" }: any) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left group">
    <div className="flex items-center gap-4">
      <div className={`size-10 rounded-2xl ${iconColor} flex items-center justify-center transition-transform group-active:scale-90`}>
        <span className={`material-symbols-outlined text-[22px] ${iconText}`}>{icon}</span>
      </div>
      <span className={`text-sm font-bold ${color}`}>{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge && <span className="text-[9px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">{badge}</span>}
      <span className="material-symbols-outlined text-slate-700 text-[20px]">chevron_right</span>
    </div>
  </button>
);

// Fix: Explicitly use React.FC with PropsWithChildren to ensure children are recognized as optional in the props object during JSX transpilation
const SectionTitle: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-5 mb-3 mt-8">{children}</h3>
);

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  lang, userProfile, onBack, onLogout, onLanguageToggle, onEditProfile, onPersonalDetails, onVerificationCenter, 
  onChangePassword, onVipRewards, onHelpSupport, onAboutUs, onTerms, onPrivacy, onAdminPanel 
}) => {
  const t = translations[lang];
  const userName = userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || 'Player'}`.trim() : "Guest Player";
  const userId = userProfile?.id?.split('-')[0].toUpperCase() || "BAJI-0000";

  return (
    <div className="flex flex-col h-full bg-[#0d0909] animate-in fade-in duration-500 overflow-y-auto no-scrollbar pb-40">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d0909]/95 backdrop-blur-md px-4 py-4 border-b border-white/5 flex items-center shadow-xl">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="flex-1 text-center pr-10 text-lg font-black text-white tracking-tight uppercase">{t.account}</h2>
      </header>

      {/* User Card */}
      <div className="flex flex-col items-center p-8 pb-4 relative">
        <div className="relative mb-4">
          <div className="size-28 rounded-full bg-slate-800 border-2 border-primary shadow-[0_0_40px_rgba(234,42,51,0.2)] overflow-hidden">
             {userProfile?.avatar_url ? (
               <img src={userProfile.avatar_url} alt="Profile" className="size-full object-cover" />
             ) : (
               <div className="size-full bg-slate-700 flex items-center justify-center">
                 <span className="material-symbols-outlined text-white/20 text-5xl">person</span>
               </div>
             )}
          </div>
          <button onClick={onEditProfile} className="absolute bottom-0 right-0 size-9 bg-primary rounded-full border-4 border-[#0d0909] flex items-center justify-center text-white shadow-xl active:scale-90 transition-all">
            <span className="material-symbols-outlined text-[18px] font-bold">edit</span>
          </button>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight italic">{userName}</h1>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Player ID: {userId}</p>
      </div>

      <div className="px-5">
        {/* General Settings */}
        <SectionTitle>General Settings</SectionTitle>
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5 shadow-2xl">
          <SettingItem icon="translate" label={t.language} badge={t.langName} onClick={onLanguageToggle} iconColor="bg-blue-500/10" iconText="text-blue-500" />
          <SettingItem icon="person" label={t.profileInfo} onClick={onPersonalDetails} iconColor="bg-emerald-500/10" iconText="text-emerald-500" />
        </div>

        {/* Security Section */}
        <SectionTitle>{t.security}</SectionTitle>
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5 shadow-2xl">
          <SettingItem icon="verified_user" label={t.verification} onClick={onVerificationCenter} iconColor="bg-orange-500/10" iconText="text-orange-500" />
          <SettingItem icon="lock" label={t.changePass} onClick={onChangePassword} iconColor="bg-indigo-500/10" iconText="text-indigo-500" />
        </div>

        {/* Rewards & Support */}
        <SectionTitle>{t.rewardsSupport}</SectionTitle>
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5 shadow-2xl">
          <SettingItem icon="stars" label={t.vipRewards} onClick={onVipRewards} iconColor="bg-yellow-500/10" iconText="text-yellow-500" />
          <SettingItem icon="headset_mic" label={t.helpSupport} onClick={onHelpSupport} iconColor="bg-red-500/10" iconText="text-red-500" />
          <SettingItem icon="info" label={t.aboutUs} onClick={onAboutUs} iconColor="bg-slate-500/10" iconText="text-slate-400" />
        </div>

        {/* Legal */}
        <SectionTitle>{t.legal}</SectionTitle>
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5 shadow-2xl">
          <SettingItem icon="gavel" label={t.terms} onClick={onTerms} iconColor="bg-slate-800" iconText="text-slate-400" />
          <SettingItem icon="security" label={t.privacy} onClick={onPrivacy} iconColor="bg-slate-800" iconText="text-slate-400" />
        </div>

        {/* Admin Panel (If authorized) */}
        {onAdminPanel && (
          <>
            <SectionTitle>Administration</SectionTitle>
            <div className="bg-primary/5 border border-primary/20 rounded-3xl overflow-hidden shadow-2xl">
              <SettingItem icon="admin_panel_settings" label="ADMIN PANEL" onClick={onAdminPanel} color="text-primary" iconColor="bg-primary/20" iconText="text-primary" />
            </div>
          </>
        )}

        {/* Logout */}
        <div className="mt-10 mb-20 px-2">
          <button onClick={onLogout} className="w-full py-4 rounded-2xl bg-[#2d1b1c] border border-primary/20 text-primary font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl">
            <span className="material-symbols-outlined text-[22px]">logout</span>
            {t.logout}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
