
import React, { useState } from 'react';

interface VerificationCenterProps {
  onBack: () => void;
}

type Status = 'verified' | 'pending' | 'required' | 'rejected';

const VerificationCenter: React.FC<VerificationCenterProps> = ({ onBack }) => {
  const [activeView, setActiveView] = useState<'list' | 'phone-otp'>('list');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Only Phone Verification step remains
  const steps = [
    {
      id: 'phone',
      title: 'Phone Verification',
      desc: 'OTP via SMS for withdrawal security',
      status: phoneVerified ? 'verified' : 'required' as Status,
      icon: 'smartphone',
      color: phoneVerified ? 'text-emerald-500' : 'text-primary',
      bg: phoneVerified ? 'bg-emerald-500/10' : 'bg-primary/10'
    }
  ];

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'verified':
        return <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20"><span className="material-symbols-outlined text-[12px]">check_circle</span> Verified</span>;
      case 'pending':
        return <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-amber-500/20"><span className="material-symbols-outlined text-[12px] animate-spin">sync</span> Pending</span>;
      default:
        return <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/5">Required</span>;
    }
  };

  const handlePhoneVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPhoneVerified(true);
      setActiveView('list');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background-dark animate-in slide-in-from-right duration-500 overflow-hidden font-display relative">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl px-4 py-4 border-b border-white/5 flex items-center">
        <button 
          onClick={activeView === 'list' ? onBack : () => setActiveView('list')} 
          className="size-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined">{activeView === 'list' ? 'arrow_back_ios_new' : 'close'}</span>
        </button>
        <div className="flex-1 text-center pr-10">
          <h2 className="text-lg font-black text-white tracking-tight uppercase">
            {activeView === 'list' ? 'Security Center' : 'Phone OTP'}
          </h2>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">
            {phoneVerified ? 'Verified Account' : 'Tier 1 Account'}
          </p>
        </div>
      </div>

      {activeView === 'list' ? (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
          {/* Progress Overview Card */}
          <div className="px-5 pt-6 pb-2">
            <div className="bg-gradient-to-br from-[#2a1415] to-[#1a0d0e] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 size-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="size-24 rounded-full border-4 border-white/5 flex items-center justify-center relative mb-4">
                   <svg className="absolute inset-0 size-full -rotate-90">
                      <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                      <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="276" strokeDashoffset={phoneVerified ? "0" : "276"} className="text-primary transition-all duration-1000" />
                   </svg>
                   <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-white">{phoneVerified ? '100%' : '0%'}</span>
                   </div>
                </div>
                <h3 className="text-white font-black text-lg tracking-tight uppercase">{phoneVerified ? 'Security Complete' : 'Security Pending'}</h3>
                <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-widest leading-relaxed">
                  {phoneVerified ? 'Your account is fully secured.' : 'Verify your phone to unlock'}<br/>Withdrawal Features
                </p>
              </div>
            </div>
          </div>

          {/* Requirements List */}
          <div className="px-5 mt-8 space-y-4">
            <div className="flex items-center justify-between px-2 mb-2">
               <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Required Step</h4>
               <span className="text-[10px] font-black text-primary uppercase">{phoneVerified ? '1 of 1' : '0 of 1'} Done</span>
            </div>

            {steps.map((step) => (
              <button 
                key={step.id}
                disabled={step.status === 'verified'}
                onClick={() => step.id === 'phone' && setActiveView('phone-otp')}
                className="w-full bg-white/5 border border-white/5 rounded-[1.8rem] p-5 flex items-center justify-between hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-80 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`size-12 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-[24px]">{step.icon}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-black text-sm tracking-tight">{step.title}</p>
                    <p className="text-slate-500 text-[10px] font-bold mt-0.5">{step.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(step.status)}
                  {step.status === 'required' && (
                    <span className="material-symbols-outlined text-slate-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Trust Elements */}
          <div className="mt-10 mb-8 flex flex-col items-center justify-center opacity-40">
             <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-sm">shield</span>
                <p className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted Verification</p>
             </div>
          </div>
        </div>
      ) : (
        /* Phone OTP Flow */
        <div className="flex-1 p-6 flex flex-col animate-in slide-in-from-bottom duration-500">
          <div className="mt-8 text-center space-y-3">
             <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">mobile_friendly</span>
             </div>
             <h3 className="text-2xl font-black text-white tracking-tight uppercase">Verify Mobile</h3>
             <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-[250px] mx-auto">
                Enter your mobile number to receive a 6-digit verification code.
             </p>
          </div>

          <div className="mt-10 space-y-6">
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                  <span className="text-slate-500 font-black text-sm">+880</span>
                </div>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="1XXX XXXXXX"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl h-16 pl-16 pr-5 text-white font-black tracking-widest focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-700"
                />
             </div>

             {otpSent ? (
                <div className="animate-in fade-in zoom-in duration-300">
                   <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Enter 6-Digit Code</p>
                   <div className="grid grid-cols-6 gap-2">
                      {[1,2,3,4,5,6].map(i => (
                         <div key={i} className="h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white font-black text-xl">
                            {i === 1 ? '5' : i === 2 ? '2' : ''}
                         </div>
                      ))}
                   </div>
                   <button className="w-full mt-6 text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Resend Code in 0:45</button>
                </div>
             ) : (
                <button 
                  onClick={() => setOtpSent(true)}
                  disabled={!phoneNumber}
                  className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 uppercase tracking-[0.2em] text-xs transition-all active:scale-95 disabled:opacity-30"
                >
                  Send Verification Code
                </button>
             )}
          </div>

          {otpSent && (
            <div className="mt-auto pb-10">
               <button 
                 onClick={handlePhoneVerify}
                 disabled={isVerifying}
                 className="w-full h-16 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 uppercase tracking-[0.2em] text-sm transition-all active:scale-95 flex items-center justify-center gap-3"
               >
                 {isVerifying ? (
                   <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 ) : (
                   <>
                     <span className="material-symbols-outlined">verified</span>
                     Verify & Secure Account
                   </>
                 )}
               </button>
            </div>
          )}
        </div>
      )}
      
      {activeView === 'list' && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background-dark/80 backdrop-blur-xl border-t border-white/5">
          <button className="w-full h-14 bg-white/5 border border-white/10 text-slate-400 font-black rounded-2xl flex items-center justify-center gap-3 uppercase tracking-[0.15em] text-xs hover:bg-white/10 transition-all active:scale-95">
            <span className="material-symbols-outlined !text-[20px]">headset_mic</span>
            Identity Support Live
          </button>
        </div>
      )}
    </div>
  );
};

export default VerificationCenter;
