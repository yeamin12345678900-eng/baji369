
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
          // Set environment to sandbox
          window.Paddle.Environment.set('sandbox');
          
          window.Paddle.Initialize({ 
            token: 'test_30377928de7016923db465cac6d', 
            eventCallback: (event: any) => {
              console.log("Paddle Event:", event.name, event.data);
            }
          });
          
          initRef.current = true;
          setPaddleStatus('ready');
        } catch (e) {
          console.error("Paddle Initialization Failed:", e);
          setPaddleStatus('error');
        }
      }
    };

    const checkInterval = setInterval(() => {
      if (window.Paddle) {
        setupPaddle();
        clearInterval(checkInterval);
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, []);

  // Show only Pro Gamer Pack ($50) without bonus
  const activePlan = { 
    amount: 50, 
    label: 'Pro Gamer Pack', 
    priceId: 'pri_01ke6f0feh7aprvx2zzcd6yr6m' 
  };

  const openCheckout = (priceId: string, amount: number) => {
    if (paddleStatus !== 'ready') {
      alert("Payment system is not ready yet. Please wait a moment.");
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
            priceId: priceId,
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
      alert("Something went wrong opening the checkout. Please refresh.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0909] font-display">
      <header className="sticky top-0 z-50 bg-[#0d0909]/95 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-white/5 shadow-xl">
        <button onClick={onBack} className="size-11 rounded-2xl bg-white/5 flex items-center justify-center text-white active:scale-90 border border-white/5 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-white text-lg font-black tracking-tight uppercase italic">Deposit</h2>
            <div className="flex items-center gap-1.5">
               <span className={`size-1.5 rounded-full ${paddleStatus === 'ready' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
               <p className="text-[7px] text-slate-500 font-black uppercase tracking-[0.2em]">
                 {paddleStatus === 'ready' ? 'Secure Sandbox Connection' : 'Initializing...'}
               </p>
            </div>
        </div>
        <div className="size-11"></div>
      </header>

      <main className="flex-1 px-6 pt-12 pb-32 overflow-y-auto no-scrollbar flex flex-col items-center">
        <div className="text-center mb-10 w-full">
           <h3 className="text-white text-2xl font-black italic tracking-tighter uppercase">Selected Package</h3>
           <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em] mt-2 italic">Standard Elite Credits</p>
        </div>

        {paddleStatus === 'error' && (
          <div className="w-full mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
             <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Connection Error</p>
             <p className="text-slate-400 text-[9px] mt-1">Please check your internet or retry.</p>
          </div>
        )}

        <div className="w-full max-w-[340px]">
           <div className="bg-gradient-to-b from-[#1a1313] to-black border border-primary shadow-2xl shadow-primary/10 rounded-[3rem] p-8 transition-all group relative overflow-hidden text-center">
              {/* Decorative Glow */}
              <div className="absolute -top-10 -right-10 size-32 bg-primary/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 mb-8">
                <div className="size-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-4xl filled">workspace_premium</span>
                </div>
                <h4 className="text-white font-black text-2xl uppercase tracking-tighter">{activePlan.label}</h4>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Single Purchase</p>
              </div>

              <div className="relative z-10 mb-8">
                 <p className="text-white text-5xl font-black italic tracking-tighter">${activePlan.amount}</p>
                 <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.2em] mt-2">Elite Gaming Credits</p>
              </div>

              <button 
                onClick={() => openCheckout(activePlan.priceId, activePlan.amount)}
                disabled={isProcessing || paddleStatus !== 'ready'}
                className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95 flex items-center justify-center gap-3 bg-primary text-white shadow-xl shadow-primary/20"
              >
                {isProcessing ? (
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span>Deposit ${activePlan.amount}</span>
                  </>
                )}
              </button>
           </div>
        </div>

        <div className="mt-12 p-6 bg-white/5 border border-white/5 rounded-[2rem] flex items-center gap-4 w-full max-w-[340px]">
           <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <span className="material-symbols-outlined text-[20px]">verified</span>
           </div>
           <div>
              <p className="text-white text-[10px] font-black uppercase tracking-tight">Vercel Authorized</p>
              <p className="text-slate-500 text-[9px] font-bold leading-tight uppercase">Payment processed securely via approved domain.</p>
           </div>
        </div>

        <p className="mt-10 text-[8px] text-slate-700 font-black uppercase tracking-[0.4em] text-center max-w-[200px] leading-relaxed">
           No hidden fees. Instant credit update after verification.
        </p>
      </main>
    </div>
  );
};

export default Deposit;
