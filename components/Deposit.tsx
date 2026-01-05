
import React, { useState, useEffect } from 'react';
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
  const t = translations[lang];
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [paddleReady, setPaddleReady] = useState(false);

  useEffect(() => {
    const getAuthUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) setUser(authUser);
    };
    getAuthUser();

    // Function to initialize Paddle
    const initPaddle = () => {
      if (window.Paddle) {
        try {
          // 1. Set environment FIRST
          window.Paddle.Environment.set('sandbox');
          
          // 2. Initialize with your specific Sandbox Token
          window.Paddle.Initialize({ 
            token: 'test_30377928de7016923db465cac6d' 
          });
          
          setPaddleReady(true);
          console.log("Paddle v2 Sandbox Initialized");
        } catch (e) {
          console.error("Paddle Init Error:", e);
        }
      }
    };

    // Wait for the script in index.html to load
    if (window.Paddle) {
      initPaddle();
    } else {
      const interval = setInterval(() => {
        if (window.Paddle) {
          initPaddle();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  const pricingPlans = [
    { amount: 10, label: 'Starter Pack', bonus: '+$1 Bonus', priceId: 'pri_01ke6f0feh7aprvx2zzcd6yr6m' },
    { amount: 50, label: 'Pro Gamer Pack', bonus: '+$5 Bonus', priceId: 'pri_01ke6f0feh7aprvx2zzcd6yr6m' },
    { amount: 100, label: 'VIP Credits', bonus: '+$15 Bonus', priceId: 'pri_01ke6f0feh7aprvx2zzcd6yr6m' },
    { amount: 500, label: 'Elite Whale', bonus: '+$100 Bonus', priceId: 'pri_01ke6f0feh7aprvx2zzcd6yr6m' },
  ];

  const handlePaddleCheckout = (priceId: string, amount: number) => {
    if (!paddleReady) {
      alert("Payment system is still loading. Please wait 2-3 seconds.");
      return;
    }

    if (!user) {
      alert("Please login first.");
      return;
    }

    setIsProcessing(true);

    try {
      window.Paddle.Checkout.open({
        settings: {
          displayMode: 'overlay',
          theme: 'dark',
          locale: 'en',
        },
        items: [
          {
            priceId: priceId, // Using the price ID you provided
            quantity: 1
          }
        ],
        customer: {
          email: user.email,
        },
        customData: {
          userId: user.id,
          depositAmount: amount.toString()
        },
        eventCallback: (data: any) => {
          if (data.name === 'checkout.completed') {
            onDepositSuccess(amount);
            setIsProcessing(false);
          } else if (data.name === 'checkout.closed') {
            setIsProcessing(false);
          } else if (data.name === 'checkout.error') {
            console.error("Paddle Checkout Error Event:", data);
            setIsProcessing(false);
          }
        }
      });
    } catch (err) {
      console.error("Paddle Open Error:", err);
      setIsProcessing(false);
      alert("Failed to open checkout. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0909] font-display">
      <header className="sticky top-0 z-50 bg-[#0d0909]/95 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-white/5">
        <button onClick={onBack} className="size-11 rounded-2xl bg-white/5 flex items-center justify-center text-white active:scale-90 border border-white/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-white text-lg font-black tracking-tight uppercase italic">{lang === 'en' ? 'Deposit' : 'ডিপোজিট'}</h2>
            <p className={`text-[7px] font-black uppercase tracking-[0.2em] ${paddleReady ? 'text-emerald-500' : 'text-red-500'}`}>
              {paddleReady ? 'Secure Connection Active' : 'Connecting to Paddle...'}
            </p>
        </div>
        <div className="size-11"></div>
      </header>

      <main className="flex-1 px-6 pt-8 pb-32 overflow-y-auto no-scrollbar">
        <div className="text-center mb-10">
           <h3 className="text-white text-2xl font-black italic tracking-tighter">
             {lang === 'en' ? 'Select Credit Pack' : 'প্যাক নির্বাচন করুন'}
           </h3>
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
             Funds added instantly after successful payment
           </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
           {pricingPlans.map((plan, idx) => (
             <div 
              key={idx}
              className={`relative bg-white/5 border rounded-[2.5rem] p-6 transition-all group overflow-hidden ${idx === 1 ? 'border-primary shadow-2xl shadow-primary/10' : 'border-white/10'}`}
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
                  onClick={() => handlePaddleCheckout(plan.priceId, plan.amount)}
                  disabled={isProcessing || !paddleReady}
                  className={`w-full mt-6 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 flex items-center justify-center gap-3 ${idx === 1 ? 'bg-primary text-white' : 'bg-white/10 text-white border border-white/10'}`}
                >
                  {isProcessing ? (
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">payments</span>
                      <span>{lang === 'en' ? `Buy $${plan.amount} Pack` : `$${plan.amount} প্যাক কিনুন`}</span>
                    </>
                  )}
                </button>
             </div>
           ))}
        </div>

        <div className="mt-8 p-6 bg-white/5 border border-white/5 rounded-[2rem] flex items-center gap-4">
           <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-[20px]">verified</span>
           </div>
           <div>
              <p className="text-white text-[10px] font-black uppercase tracking-tight">Verified Secure Checkout</p>
              <p className="text-slate-500 text-[9px] font-bold leading-tight uppercase">Your payment is processed securely via Paddle sandbox environment.</p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Deposit;
