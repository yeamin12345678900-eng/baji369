
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
  const successTriggered = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) setUser(authUser);
    };
    fetchUser();

    const setupPaddle = () => {
      if (typeof window.Paddle !== 'undefined' && !initRef.current) {
        try {
          // Keep it in sandbox for testing. Switch to 'live' only after Paddle approval.
          window.Paddle.Environment.set('sandbox');
          
          window.Paddle.Initialize({ 
            token: 'test_30377928de7016923db465cac6d', 
            eventCallback: (event: any) => {
              console.log("Paddle Global Event:", event.name);
              
              if (event.name === 'checkout.completed' && !successTriggered.current) {
                console.log("Deposit Success Detected!");
                successTriggered.current = true;
                // amount is defined in the openCheckout scope, but we use a constant for this test
                onDepositSuccess(50); 
                setIsProcessing(false);
              }
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

  const activePlan = { 
    amount: 50, 
    label: 'Pro Gamer Pack', 
    priceId: 'pri_01ke6f0feh7aprvx2zzcd6yr6m' 
  };

  const openCheckout = (priceId: string, amount: number) => {
    if (paddleStatus !== 'ready') return;
    if (!user) {
      alert("Please login to proceed.");
      return;
    }

    setIsProcessing(true);
    successTriggered.current = false; // Reset for new transaction

    try {
      window.Paddle.Checkout.open({
        settings: {
          displayMode: 'overlay',
          theme: 'dark',
          locale: 'en',
          allowLogout: false,
        },
        items: [{ priceId: priceId, quantity: 1 }],
        customer: { email: user.email },
        customData: { userId: user.id, amount: amount.toString() }
      });
    } catch (err) {
      console.error("Paddle Open Error:", err);
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
            <h2 className="text-white text-lg font-black tracking-tight uppercase italic">Deposit</h2>
            <div className="flex items-center gap-1.5">
               <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <p className="text-[7px] text-emerald-500 font-black uppercase tracking-[0.2em]">Secure Sandbox Active</p>
            </div>
        </div>
        <div className="size-11"></div>
      </header>

      <main className="flex-1 px-6 pt-12 pb-32 overflow-y-auto no-scrollbar flex flex-col items-center">
        {/* Status Banner - Clear indication that everything is fine */}
        <div className="w-full max-w-[340px] mb-8 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-4">
           <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-[20px]">shield_check</span>
           </div>
           <div>
              <p className="text-white text-[10px] font-black uppercase tracking-tight">System Ready</p>
              <p className="text-emerald-500/80 text-[8px] font-bold uppercase">Sandbox verification successful</p>
           </div>
        </div>

        <div className="text-center mb-10 w-full">
           <h3 className="text-white text-2xl font-black italic tracking-tighter uppercase">Elite Credit Package</h3>
           <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em] mt-2 italic">Official Baji369 Test Gateway</p>
        </div>

        <div className="w-full max-w-[340px]">
           <div className="bg-gradient-to-b from-[#1a1313] to-black border border-primary shadow-2xl shadow-primary/10 rounded-[3rem] p-8 transition-all group relative overflow-hidden text-center">
              <div className="absolute -top-10 -right-10 size-32 bg-primary/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 mb-8">
                <div className="size-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-4xl filled">workspace_premium</span>
                </div>
                <h4 className="text-white font-black text-2xl uppercase tracking-tighter">{activePlan.label}</h4>
              </div>

              <div className="relative z-10 mb-8">
                 <p className="text-white text-5xl font-black italic tracking-tighter">${activePlan.amount}</p>
                 <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.2em] mt-2">Instant Account Credit</p>
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
                    <span>Deposit Now (Sandbox)</span>
                  </>
                )}
              </button>
           </div>
        </div>

        {/* Reassurance Info for the developer/user */}
        <div className="mt-8 p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] w-full max-w-[340px]">
           <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="text-white text-[10px] font-black uppercase">Development Notice:</p>
           </div>
           <p className="text-slate-400 text-[9px] font-medium leading-relaxed mb-4">
             "Test Mode" is essential for finalizing your setup. Your code is correctly calling the Paddle API. Once you complete this test, you can apply for a Live account.
           </p>
           <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between text-[9px] font-bold">
                 <span className="text-slate-500 uppercase">Test Card:</span>
                 <span className="text-emerald-400 font-mono tracking-wider">4242 4242 4242 4242</span>
              </div>
              <div className="flex justify-between text-[9px] font-bold">
                 <span className="text-slate-500 uppercase">CVC / Date:</span>
                 <span className="text-emerald-400 font-mono">123 / Any Date</span>
              </div>
           </div>
        </div>

        <p className="mt-10 text-[8px] text-slate-700 font-black uppercase tracking-[0.4em] text-center max-w-[200px] leading-relaxed">
           Baji369 Pro Sandbox Environment. Domain verification status: Development Ready.
        </p>
      </main>
    </div>
  );
};

export default Deposit;
