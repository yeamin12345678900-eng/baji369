
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Language, translations } from '../services/translations';

interface LoginFormProps {
  lang: Language;
  onSignUpClick: () => void;
  onForgotClick: () => void;
  onSuccess: () => void;
  onDemoLogin?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ lang, onSignUpClick, onForgotClick, onSuccess, onDemoLogin }) => {
  const t = translations[lang];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      onSuccess();
    } catch (err: any) {
      setError(lang === 'en' ? 'Invalid credentials. Please try again.' : 'ভুল ইমেইল বা পাসওয়ার্ড। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-6 animate-gpu w-full">
      {/* Brand Header - Makes the centered "box" look complete */}
      <div className="flex flex-col items-center text-center mb-2 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="size-20 bg-gradient-to-tr from-primary to-red-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 mb-6 border border-white/10 rotate-3">
          <span className="material-symbols-outlined text-white text-4xl filled">sports_esports</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Baji<span className="text-primary">369</span> Pro</h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Elite Gaming Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-[10px] text-center font-bold animate-in shake">{error}</div>}
        
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">mail</span>
          <input 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-base placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-white font-medium" 
            placeholder={t.email} 
            type="email" 
          />
        </div>

        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
          <input 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="block w-full pl-12 pr-12 py-4 bg-white/5 border border-white/5 rounded-2xl text-base placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-white font-medium" 
            placeholder={t.password} 
            type={showPassword ? "text" : "password"} 
          />
          <button 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors" 
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
          </button>
        </div>

        <div className="flex justify-end px-2">
          <button type="button" onClick={onForgotClick} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline transition-all">
            {lang === 'en' ? 'Forgot Password?' : 'পাসওয়ার্ড ভুলে গেছেন?'}
          </button>
        </div>

        <div className="space-y-3 mt-2">
          <button 
            disabled={isSubmitting} 
            className="w-full bg-primary hover:bg-red-600 text-white font-black py-4 rounded-full shadow-xl shadow-primary/20 active:scale-[0.98] transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2"
          >
            {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : t.login}
          </button>
          
          <button 
            type="button" 
            onClick={onDemoLogin} 
            className="w-full bg-white/5 border border-white/10 text-white font-black py-4 rounded-full active:scale-95 transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">play_circle</span>
            {t.demo}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-slate-500 text-xs font-bold">
          {t.noAccount} 
          <button onClick={onSignUpClick} type="button" className="text-primary font-black ml-2 uppercase hover:underline tracking-widest">
            {t.signUp}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
