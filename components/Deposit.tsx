
import React, { useState, useEffect } from 'react';
import { Language } from '../services/translations';
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

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user);

      if (window.Paddle) {
        // Paddle Initialization using Sandbox environment
        window.Paddle.Environment.set('sandbox'); 
        window.Paddle.Initialize({ 
          token: 'test_30377928de7016923db465cac6d' // YOUR CLIENT SIDE TOKEN
        });
      }
    };
    init();
  }, []);

  const pricingPlans = [
    { amount: 10, label: 'Starter Pack', bonus: '+$1 Bonus', priceId: 'pri_01...' }, // Mock for others
    { amount: 50, label: 'Pro Gamer Pack', bonus: '+$5 Bonus', priceId: 'pri_01ke6f0feh7aprvx2zzcd6yr6m', popular: true }, // YOUR REAL PRICE ID
    { amount: 100, label: 'VIP Credits', bonus: '+$15 Bonus', priceId: 'pri_02...' },
    { amount: 500, label: 'Elite Whale', bonus: '+$100 Bonus', priceId: 'pri_03...' },
  ];

  const handlePaddleCheckout = (priceId: string, amount: number) => {
    if (!window.Paddle) {
      alert("Paddle SDK not loaded. Please refresh the page.");
      return;
    }

    if (!user) {
      alert("Please log in to make a deposit.");
      return;
    }

    setIsProcessing(true);

    window.Paddle.Checkout.open({
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        locale: 'en',
      },
      items: [{ 
        priceId: priceId, 
        quantity: 1 
      }],
      customer: {
        email: user.email,
      },
      // Pass the userId in customData so the webhook knows who paid
      customData: {
        userId: user.id,
      },
      eventCallback: (data: any) => {
        if (data.name === 'checkout.completed') {
          // Local success feedback (the real balance update happens in the background via webhook)
          onDepositSuccess(amount);
          setIsProcessing(false);
        } else if (data.name === 'checkout.closed') {
          setIsProcessing(false);
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0909] animate-in slide-in-from-right duration-500 font-display">
      <header className="sticky top-0 z-50 bg-[#0d0909]/95 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-white/5">
        <button onClick={onBack} className="size-11 rounded-2xl bg-white/5 flex items-center justify-center text-white active:scale-90 transition-all border border-white/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-white text-lg font-black tracking-tight uppercase italic">Deposit</h2>
            <p className="text-[8px] text-primary font-black uppercase tracking-[0.3em]">Paddle Sandbox Active</p>
        </div>
        <div className="size-11"></div>
      </header>

      <main className="flex-1 px-6 pt-8 pb-32 overflow-y-auto no-scrollbar">
        <div className="text-center mb-10">
           <h3 className="text-white text-2xl font-black italic tracking-tighter">Choose Your Pack</h3>
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Credits will be added instantly after payment</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
           {pricingPlans.map((plan) => (
             <div 
              key={plan.amount}
              className={`relative bg-white/5 border rounded-[2.5rem] p-6 transition-all group overflow-hidden ${plan.popular ? 'border-primary shadow-2xl shadow-primary/10' : 'border-white/10'}`}
             >
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-primary text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Best Value</div>
                )}
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
                  disabled={isProcessing}
                  className={`w-full mt-6 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 flex items-center justify-center gap-3 ${plan.popular ? 'bg-primary text-white shadow-xl' : 'bg-white/10 text-white border border-white/10'}`}
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
           <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-[20px]">verified</span>
           </div>
           <p className="text-slate-500 text-[10px] font-bold leading-tight">Your payment is secured by Paddle. Credits are added to your wallet immediately after confirmation.</p>
        </div>
      </main>
    </div>
  );
};

export default Deposit;
