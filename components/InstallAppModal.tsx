
import React from 'react';
import { Language, translations } from '../services/translations';

interface InstallAppModalProps {
  lang: Language;
  onClose: () => void;
  onInstall: () => void;
  isIOS: boolean;
}

const InstallAppModal: React.FC<InstallAppModalProps> = ({ lang, onClose, onInstall, isIOS }) => {
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#1a0d0e] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
        <div className="absolute top-0 right-0 p-6 z-10">
          <button onClick={onClose} className="size-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 pt-12 flex flex-col items-center text-center">
          <div className="size-24 rounded-3xl bg-gradient-to-tr from-primary to-orange-500 flex items-center justify-center shadow-2xl shadow-primary/20 mb-6 rotate-3">
             <span className="material-symbols-outlined text-white text-5xl filled">install_mobile</span>
          </div>

          <h2 className="text-2xl font-black text-white uppercase tracking-tight italic mb-2">Baji369 Mobile</h2>
          <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8">
            {lang === 'en' 
              ? 'Install our official app for a faster, smoother gaming experience.' 
              : 'আরও দ্রুত এবং স্মুথ গেমিং অভিজ্ঞতার জন্য আমাদের অফিসিয়াল অ্যাপটি ইনস্টল করুন।'}
          </p>

          {isIOS ? (
            <div className="w-full space-y-4 bg-white/5 rounded-[2rem] p-6 border border-white/5">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Instructions for iPhone</p>
              <div className="flex items-center gap-4 text-left">
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 font-black">1</div>
                <p className="text-white text-[11px] font-medium leading-tight">Tap the <span className="text-primary font-bold">Share</span> icon (square with arrow) at the bottom.</p>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 font-black">2</div>
                <p className="text-white text-[11px] font-medium leading-tight">Scroll down and select <span className="text-primary font-bold">"Add to Home Screen"</span>.</p>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 font-black">3</div>
                <p className="text-white text-[11px] font-medium leading-tight">Click <span className="text-primary font-bold">"Add"</span> to finish installation.</p>
              </div>
            </div>
          ) : (
            <button 
              onClick={onInstall}
              className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">download</span>
              {lang === 'en' ? 'Install Now' : 'এখনই ইনস্টল করুন'}
            </button>
          )}

          <p className="mt-8 text-[9px] text-slate-600 font-black uppercase tracking-widest leading-relaxed">
            * Fully compatible with Android & iOS devices.<br/>Safe & Secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstallAppModal;
