
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Language } from '../services/translations';

interface ResetPasswordProps {
  lang: Language;
  onSuccess: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ lang, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(lang === 'en' ? 'Passwords do not match.' : 'পাসওয়ার্ড মিলছে না।');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      
      alert(lang === 'en' ? 'Password updated successfully!' : 'পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error updating password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a0d0e] p-6 animate-in slide-in-from-bottom duration-500">
      <div className="text-center space-y-3 mt-10 mb-10">
        <div className="size-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20">
          <span className="material-symbols-outlined text-4xl">lock_open</span>
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight uppercase">Set New Password</h3>
        <p className="text-slate-500 text-xs font-bold leading-relaxed max-w-[280px] mx-auto">
          {lang === 'en' ? 'Choose a strong password to protect your account.' : 'আপনার অ্যাকাউন্ট সুরক্ষিত করতে একটি শক্তিশালী পাসওয়ার্ড বেছে নিন।'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase text-center rounded-2xl animate-in shake">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">New Password</label>
          <input 
            required 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 px-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Confirm Password</label>
          <input 
            required 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-14 px-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
            placeholder="••••••••"
          />
        </div>

        <button 
          disabled={isSubmitting || !password}
          className="w-full h-16 bg-emerald-500 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
        >
          {isSubmitting ? (
            <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined">verified</span>
              Update Password
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
