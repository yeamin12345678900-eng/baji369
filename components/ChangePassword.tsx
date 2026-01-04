
import React, { useState } from 'react';

interface ChangePasswordProps {
  onBack: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onBack }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onBack();
    }, 2000);
  };

  const calculateStrength = () => {
    if (newPassword.length === 0) return 0;
    if (newPassword.length < 6) return 25;
    if (newPassword.length < 10) return 60;
    return 100;
  };

  const strength = calculateStrength();

  return (
    <div className="flex flex-col h-full bg-background-dark animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar font-display">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md px-4 py-4 border-b border-white/5 flex items-center">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-90 shrink-0">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="flex-1 text-center pr-10 text-lg font-black text-white tracking-tight uppercase">Security</h2>
      </header>

      <div className="flex-1 p-6 space-y-8 max-w-md mx-auto w-full">
        {/* Intro */}
        <div className="text-center space-y-3">
          <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-4xl">lock_reset</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight uppercase">Update Password</h3>
          <p className="text-slate-500 text-xs font-bold leading-relaxed">
            Ensure your account stays secure by using a strong password that you don't use elsewhere.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Current Password</label>
            <div className="relative group">
              <input 
                required
                type={showCurrent ? 'text' : 'password'}
                className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 text-white font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all pr-12"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">{showCurrent ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">New Password</label>
            <div className="relative group">
              <input 
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type={showNew ? 'text' : 'password'}
                className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 text-white font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all pr-12"
                placeholder="Minimum 8 characters"
              />
              <button 
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">{showNew ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
            
            {/* Strength Indicator */}
            <div className="px-1 pt-1 space-y-2">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                <span className="text-slate-600">Password Strength</span>
                <span className={strength < 30 ? 'text-red-500' : strength < 70 ? 'text-amber-500' : 'text-emerald-500'}>
                  {strength === 0 ? 'Empty' : strength < 30 ? 'Weak' : strength < 70 ? 'Medium' : 'Strong'}
                </span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${strength < 30 ? 'bg-red-500' : strength < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${strength}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Confirm New Password</label>
            <div className="relative group">
              <input 
                required
                type={showConfirm ? 'text' : 'password'}
                className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 text-white font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all pr-12"
                placeholder="Repeat new password"
              />
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">{showConfirm ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
             <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-3">Security Rules</h4>
             <ul className="space-y-2">
                {[
                  { text: 'At least 8 characters long', met: newPassword.length >= 8 },
                  { text: 'Mix of letters and numbers', met: /[A-Za-z]/.test(newPassword) && /[0-9]/.test(newPassword) },
                  { text: 'Unique from previous passwords', met: true }
                ].map((rule, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[14px] ${rule.met ? 'text-emerald-500' : 'text-slate-600'}`}>
                      {rule.met ? 'check_circle' : 'circle'}
                    </span>
                    <span className={`text-[10px] font-bold ${rule.met ? 'text-slate-300' : 'text-slate-600'}`}>{rule.text}</span>
                  </li>
                ))}
             </ul>
          </div>

          <button 
            type="submit"
            disabled={isSaving || newPassword.length < 8}
            className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 uppercase tracking-[0.2em] text-xs transition-all active:scale-95 disabled:opacity-30 mt-4 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="material-symbols-outlined !text-[18px]">save</span>
                Update Security Credentials
              </>
            )}
          </button>
        </form>
      </div>

      {/* Security Banner */}
      <div className="mt-auto p-6 bg-white/5 border-t border-white/5">
         <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
               <span className="material-symbols-outlined">security_update_good</span>
            </div>
            <div>
               <p className="text-white text-[10px] font-black uppercase tracking-tight">Login Alert Enabled</p>
               <p className="text-slate-500 text-[9px] font-bold">We will notify you on your registered email for any new login attempts.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChangePassword;
