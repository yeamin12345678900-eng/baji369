
import React, { useState, useEffect, useRef } from 'react';
import { Language, translations } from '../services/translations';
import { supabase } from '../services/supabase';

declare global {
  interface Window {
    Paddle: any;
  }
}

interface DepositProps {
  lang: Language;
  balance: number;
  onBack: () => void;
  onDepositSuccess: (amount: number) => void;
}

const Deposit: React.FC<DepositProps> = ({ lang, balance, onBack, onDepositSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [paddleStatus, setPaddleStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const initRef = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) setUser(authUser);
    };
    fetchUser();

    const setupPaddle = () => {
      if (typeof window.Paddle !== 'undefined' && !initRef.current) {
        try {
          // IMPORTANT: Set environment to sandbox BEFORE Initialize
          window.Paddle.Environment.set('sandbox');
          
          window.Paddle.Initialize({ 
            token: 'test_30377928de7016923db465cac6d', // Sandbox Token
            eventCallback: (event: any) => {
              console.log("Paddle Global Event:", event.name, event.data);
            }
          });
          
          initRef.current = true;
          setPaddleStatus('ready');
          console.log("Paddle v2 Sandbox Initialized successfully.");
        } catch (e) {
          console.error("Paddle Initialization Failed:", e);
          setPaddleStatus('error');
        }
      }
    };

    // Poll for Paddle availability
    const checkInterval = setInterval(() => {
      if (window.Paddle) {
        setupPaddle();
        clearInterval(checkInterval);
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, []);

  // Pro tip: Price ID-ti obossoi apnar sandbox dashboard er hote hobe.
  // Jodi ek-i price ID prottek package er jonno use koren, tahole user joto deposit e click koruk, 
  // checkout e oi ek-i amount dekhabe.
  const pricingPlans = [
    { amount: 10, label: 'Starter Pack', bonus: '+$1 Bonus', priceId: 'pri_01ke6f0feh7aprvx2zzcd6yr6m' },
    { amount: 50, label: 'Pro Gamer Pack', bonus: '+$5 Bonus', priceId: 'pri_01ke6f0feh7aprvx2zzcd6yr6m' },
    { amount: 100, label: 'VIP Credits', bonus: '+$15 Bonus', priceId: 'pri_01ke6f0feh7aprvx2zzcd6yr6m' },
    { amount: 500, label: 'Elite Whale', bonus: '+$100 Bonus', priceId: 'pri_01ke6f0feh7aprvx2zzcd6yr6m' },
  ];

  const openCheckout = (priceId: string, amount: number) => {
    if (paddleStatus !== 'ready') {
      alert("Payment system is not ready yet. Please wait...");
      return;
    }

    if (!user) {
      alert("Please login to proceed.");
      return;
    }

    setIsProcessing(true);

    try {
      window.Paddle.Checkout.open({
        settings: {
          displayMode: 'overlay',
          theme: 'dark',
          locale: 'en',
          allowLogout: false,
        },
        items: [
          {
            priceId: priceId, // Ensure this ID is exactly what's in Sandbox dashboard
            quantity: 1,
          },
        ],
        customer: {
          email: user.email,
        },
        customData: {
          userId: user.id,
          amount: amount.toString(),
        },
        eventCallback: (data: any) => {
          if (data.name === 'checkout.completed') {
            onDepositSuccess(amount);
            setIsProcessing(false);
          } else if (data.name === 'checkout.closed') {
            setIsProcessing(false);
          } else if (data.name === 'checkout.error') {
            console.error("Checkout internal error:", data);
            setIsProcessing(false);
          }
        }
      });
    } catch (err) {
      console.error("Failed to open checkout:", err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0909] font-display">
      <header className="sticky top-0 z-50 bg-[#0d0909]/95 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-white/5 shadow-xl">
        <button onClick={onBack} className="size-11 rounded-2xl bg-white/5 flex items-center justify-center text-white active:scale-90 border border-white/5 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-white text-lg font-black tracking-tight uppercase italic">Deposit Funds</h2>
            <div className="flex items-center gap-1.5">
               <span className={`size-1.5 rounded-full ${paddleStatus === 'ready' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
               <p className="text-[7px] text-slate-500 font-black uppercase tracking-[0.2em]">
                 {paddleStatus === 'ready' ? 'Paddle Sandbox Active' : 'Connecting SDK...'}
               </p>
            </div>
        </div>
        <div className="size-11"></div>
      </header>

      <main className="flex-1 px-6 pt-8 pb-32 overflow-y-auto no-scrollbar">
        <div className="text-center mb-10">
           <h3 className="text-white text-2xl font-black italic tracking-tighter">Select Package</h3>
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Verified Secure Sandbox Payments</p>
        </div>

        {paddleStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
             <p className="text-red-500 text-[10px] font-black uppercase">Initialization Error</p>
             <p className="text-slate-400 text-[9px] mt-1">Please check your internet or browser ad-blockers.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
           {pricingPlans.map((plan, idx) => (
             <div 
              key={idx}
              className={`bg-white/5 border rounded-[2.5rem] p-6 transition-all group relative overflow-hidden ${idx === 1 ? 'border-primary shadow-2xl shadow-primary/10' : 'border-white/10'}`}
             >
                <div className="flex items-center justify-between relative z-10">
                   <div>
                      <h4 className="text-white font-black text-xl uppercase tracking-tight">{plan.label}</h4>
                      <p className="text-emerald-500 text-[10px] font-black uppercase mt-1">{plan.bonus}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-white text-3xl font-black italic tracking-tighter">${plan.amount}</p>
                   </div>
                </div>

                <button 
                  onClick={() => openCheckout(plan.priceId, plan.amount)}
                  disabled={isProcessing || paddleStatus !== 'ready'}
                  className={`w-full mt-6 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 flex items-center justify-center gap-3 ${idx === 1 ? 'bg-primary text-white' : 'bg-white/10 text-white border border-white/10'}`}
                >
                  {isProcessing ? (
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">payments</span>
                      <span>Buy ${plan.amount} Pack</span>
                    </>
                  )}
                </button>
             </div>
           ))}
        </div>

        <div className="mt-8 p-6 bg-white/5 border border-white/5 rounded-[2rem] flex items-center gap-4">
           <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <span className="material-symbols-outlined text-[20px]">shield</span>
           </div>
           <div>
              <p className="text-white text-[10px] font-black uppercase tracking-tight">Vercel Domain Approved</p>
              <p className="text-slate-500 text-[9px] font-bold leading-tight uppercase">baji369.vercel.app is authorized in Paddle Dashboard.</p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Deposit;
