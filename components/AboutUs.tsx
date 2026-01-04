
import React from 'react';

interface AboutUsProps {
  onBack: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-background-dark animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar pb-10">
      {/* Top App Bar - Centered Content for Desktop */}
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md px-4 py-4 border-b border-white/5 flex items-center justify-center">
        <div className="w-full max-w-5xl flex items-center">
          <button 
            onClick={onBack} 
            className="size-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="flex-1 text-center pr-10 text-lg font-black text-white tracking-tight uppercase">About Us</h2>
        </div>
      </header>

      {/* Main Content Wrapper - Responsive Max Width */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="w-full flex flex-col items-center pt-10 pb-6 px-6 md:pt-16 md:pb-12">
          <div className="relative p-1.5 rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-tr from-primary to-red-400 shadow-2xl shadow-primary/20 mb-6 md:mb-8">
            <div className="bg-surface-dark rounded-[2.2rem] md:rounded-[2.7rem] h-32 w-32 md:h-40 md:w-40 flex items-center justify-center overflow-hidden border border-white/5">
              <div 
                className="bg-center bg-no-repeat bg-contain h-16 w-16 md:h-20 md:w-20" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBpiSxIHTSA5g5zA5HbS8pNtz5fBIxYnzWo18kbRcCulCYl7e-xqk-WctuUd3JDWtmPNyDMFF0T3_1FHInN2Va6gyfgNuqLcei-vQihb-aKBUU5ypbNnHOwLdnKcmfyYMQ1UiG8vdsvQxNzH8K91_hvsil57JOB5pF4lfgSoKyv-PRdVTkzPYoBAQEM1WA-0oGswW2cD5EEyCldb6i64J5kfDt3ML5MnMeQJ732dXQsQw8H10uKSnzoVncEf8bm1mjqJLo0wQbC')" }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <h1 className="text-white text-3xl md:text-5xl font-black tracking-tighter">Baji369 Pro</h1>
            <div className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20">
              <p className="text-primary text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">Version 2.4.1 Build PRO</p>
            </div>
          </div>

          <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed text-center mt-6 md:mt-10 max-w-[300px] md:max-w-[600px]">
            The premier destination for high-fidelity gaming at Baji369, offering a secure, transparent, and exciting environment for players worldwide.
          </p>
        </div>

        {/* Core Values Section - Grid for Desktop */}
        <div className="w-full px-5 mt-4 md:mt-12 space-y-4 md:space-y-6">
          <h3 className="text-white tracking-tight text-lg md:text-2xl font-black uppercase pl-1 text-center md:text-left">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Mission Card */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 md:p-8 shadow-sm flex items-start gap-4 md:gap-6 hover:bg-white/[0.07] transition-colors group">
              <div className="h-10 w-10 md:h-14 md:w-14 shrink-0 rounded-xl md:rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined md:text-3xl">rocket_launch</span>
              </div>
              <div>
                <h4 className="text-white font-black text-base md:text-xl mb-1 uppercase tracking-tight">Our Mission</h4>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">To provide the ultimate Baji369 gaming experience through innovation and customer-centric services.</p>
              </div>
            </div>
            {/* Vision Card */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 md:p-8 shadow-sm flex items-start gap-4 md:gap-6 hover:bg-white/[0.07] transition-colors group">
              <div className="h-10 w-10 md:h-14 md:w-14 shrink-0 rounded-xl md:rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined md:text-3xl">visibility</span>
              </div>
              <div>
                <h4 className="text-white font-black text-base md:text-xl mb-1 uppercase tracking-tight">Our Vision</h4>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">To become the world's most trusted platform for entertainment and responsible gaming with Baji369.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Connectivity */}
        <div className="w-full mt-12 mb-8 md:mt-24 md:mb-16 flex flex-col items-center justify-center gap-8">
          {/* Social Icons */}
          <div className="flex items-center gap-6 md:gap-10">
            {[
              { label: 'f', icon: null, custom: true },
              { label: 'send', icon: 'send' },
              { label: 'photo_camera', icon: 'photo_camera' }
            ].map((social, idx) => (
              <button 
                key={idx} 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-primary/50 hover:bg-primary/10 transition-all active:scale-90"
              >
                {social.custom ? (
                  <span className="font-black text-xl md:text-2xl leading-none -mt-0.5">f</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px] md:text-[28px]">{social.icon}</span>
                )}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col items-center text-center opacity-40">
            <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Copyright © 2024 Baji369 Gaming Ltd.</p>
            <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-1">All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
