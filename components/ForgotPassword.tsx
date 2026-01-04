
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Language } from '../services/translations';

interface ForgotPasswordProps {
  lang: Language;
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ lang, onBack }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: lang === 'en' 
          ? 'Reset link sent! Check your inbox.' 
          : 'রিসেট লিঙ্ক পাঠানো হয়েছে! আপনার ইনবক্স চেক করুন।'
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || (lang === 'en' ? 'An error occurred. Please try again.' : 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a0d0e] p-6 animate-in slide-in-from-right duration-500">
      <header className="flex items-center mb-10">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-white/5 text-white active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="flex-1 text-center pr-10 text-lg font-black text-white uppercase tracking-tighter italic">Forgot Password</h2>
      </header>

      <div className="flex flex-col items-center text-center space-y-4 mb-10">
        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <span className="material-symbols-outlined text-4xl">key_off</span>
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight">Recover Your Account</h3>
        <p className="text-slate-500 text-xs font-bold leading-relaxed max-w-[280px]">
          {lang === 'en' 
            ? 'Enter your registered email and we will send you a link to reset your password.' 
            : 'আপনার নিবন্ধিত ইমেইল লিখুন এবং আমরা আপনাকে পাসওয়ার্ড রিসেট করার লিঙ্ক পাঠাবো।'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border animate-in zoom-in ${
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
          }`}>
            {message.text}
          </div>
        )}

        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">mail</span>
          <input 
            required 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-700" 
            placeholder="example@mail.com"
          />
        </div>

        <button 
          disabled={isSubmitting || !email}
          className="w-full h-16 bg-primary text-white rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30"
        >
          {isSubmitting ? (
            <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined">send</span>
              Send Recovery Link
            </>
          )}
        </button>
      </form>

      <div className="mt-auto pb-10 flex justify-center">
        <button onClick={onBack} className="text-slate-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors underline">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
