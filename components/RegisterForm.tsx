
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Language, translations } from '../services/translations';

interface RegisterFormProps {
  lang: Language;
  onLoginClick: () => void;
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ lang, onLoginClick, onSuccess }) => {
  const t = translations[lang];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(lang === 'en' ? "Passwords do not match" : "পাসওয়ার্ড মিলছে না");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (data.user) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 px-6 pt-4 animate-in fade-in duration-500 animate-gpu">
      <div className="text-center mb-2">
         <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{t.createAccount}</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs text-center font-bold">{error}</div>}
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">mail</span>
          <input required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-base placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-white" placeholder={t.email} type="email" />
        </div>
        <input required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-base placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-white" placeholder={t.password} type="password" />
        <input required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-base placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-white" placeholder={t.confirmPass} type="password" />
        <button disabled={isSubmitting} className="w-full h-16 rounded-full bg-primary hover:bg-red-600 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-red-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
          {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : t.createAccount.toUpperCase()}
        </button>
      </form>
      <div className="mt-auto flex justify-center pb-10">
        <p className="text-center text-xs font-bold text-slate-500">{t.alreadyAccount} <button onClick={onLoginClick} className="font-black text-primary hover:underline ml-1 uppercase">{t.login}</button></p>
      </div>
    </div>
  );
};

export default RegisterForm;
