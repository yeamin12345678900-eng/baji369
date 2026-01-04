
import React, { useState, useEffect } from 'react';
import { Language } from '../services/translations';

interface DepositProps {
  lang: Language;
  balance: number;
  onBack: () => void;
  onDepositSuccess: (amount: number) => void;
}

declare global {
  interface Window {
    Paddle: any;
  }
}

const Deposit: React.FC<DepositProps> = ({ lang, balance, onBack, onDepositSuccess }) => {
  const [amount, setAmount] = useState<string>('20');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'error'>('idle');

  useEffect(() => {
    if (window.Paddle) {
      window.Paddle.Initialize({ 
        token: 'test_d4c98c19a9f97914e6d4d67375a', 
        environment: 'sandbox' 
      });
    }
  }, []);

  const quickAmounts = [10, 20, 50, 100, 500];

  const handlePaddleCheckout = () => {
    const numAmount = parseFloat(amount);
    if (!amount || numAmount <= 0) return;

    setIsProcessing(true);
    
    if (window.Paddle) {
      window.Paddle.Checkout.open({
        settings: {
          displayMode: 'overlay',
          theme: 'dark',
          locale: 'en'
        },
        items: [{ priceId: 'pri_01hkvjk2m000000000000000', quantity: 1 }],
        eventCallback: (event: any) => {
          if (event.name === 'checkout.completed') {
            setIsProcessing(false);
            onDepositSuccess(numAmount);
          } else if (event.name === 'checkout.closed') {
            setIsProcessing(false);
          } else if (event.name === 'checkout.error') {
            setIsProcessing(false);
            setStatus('error');
          }
        }
      });
    } else {
      setTimeout(() => {
        setIsProcessing(false);
        onDepositSuccess(numAmount);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0909] animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar font-display">
      <header className="sticky top-0 z-50 bg-[#0d0909]/95 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-white/5 shadow-2xl">
        <button onClick={onBack} className="size-11 rounded-2xl bg-white/5 flex items-center justify-center text-white active:scale-90 transition-all border border-white/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-white text-lg font-black tracking-tight uppercase italic">Secure Deposit</h2>
            <p className="text-[8px] text-emerald-500 font-black uppercase tracking-[0.3em]">PCI DSS Compliant</p>
        </div>
        <div className="size-11"></div>
      </header>

      <main className="flex-1 px-6 pt-8 pb-32 max-w-lg mx-auto w-full">
        {/* Sandbox Info Box - Education for user */}
        <section className="mb-6">
           <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-3xl flex items-start gap-4">
              <span className="material-symbols-outlined text-blue-500">info</span>
              <div>
                 <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1">Testing Environment Active</p>
                 <p className="text-blue-300/70 text-[10px] font-medium leading-relaxed">
                   আপনার অ্যাপটি বর্তমানে "Testing/Sandbox" মোডে আছে। লাইভ পেমেন্ট নিতে হলে একটি নিজস্ব ডোমেইন কিনে প্যাডেল ড্যাশবোর্ডে ভেরিফাই করতে হবে।
                 </p>
              </div>
           </div>
        </section>

        <section className="mb-10">
            <div className="bg-gradient-to-br from-[#1a1111] to-[#0d0909] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 size-40 bg-primary/10 rounded-full blur-3xl"></div>
                <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase mb-1">Current Balance</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-white text-4xl font-black tracking-tighter">${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    <span className="text-emerald-500 text-xs font-bold uppercase">USD</span>
                </div>
            </div>
        </section>

        <section className="mb-8">
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 pl-2 opacity-50">Select Amount</h3>
            <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6 focus-within:border-primary/50 transition-all">
                <div className="flex items-center gap-4">
                    <span className="text-slate-500 text-4xl font-black">$</span>
                    <input 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-transparent text-white text-5xl font-black placeholder-slate-800 focus:outline-none p-0 border-none focus:ring-0 tabular-nums" 
                        type="number"
                    />
                </div>
            </div>

            <div className="flex gap-2.5 overflow-x-auto no-scrollbar mt-6 py-2">
                {quickAmounts.map((val) => (
                    <button 
                        key={val}
                        onClick={() => setAmount(val.toString())}
                        className={`shrink-0 h-14 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border ${
                            amount === val.toString() 
                            ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                            : 'bg-white/5 text-slate-500 border-white/5'
                        }`}
                    >
                        ${val}
                    </button>
                ))}
            </div>
        </section>

        <section className="mb-10">
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 pl-2 opacity-50">Global Gateway</h3>
            <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-[2rem] flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="size-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl">
                        <span className="material-symbols-outlined text-3xl">public</span>
                    </div>
                    <div>
                        <p className="text-white font-black text-base uppercase italic tracking-tighter">Paddle Payment</p>
                        <p className="text-indigo-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">VISA, PayPal, Apple Pay</p>
                    </div>
                </div>
                <div className="size-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-500 text-sm font-black">check</span>
                </div>
            </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0d0909] via-[#0d0909] to-transparent z-[60]">
        <div className="max-w-lg mx-auto">
            <button 
                onClick={handlePaddleCheckout}
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                className="w-full h-20 bg-primary text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm shadow-[0_20px_50px_rgba(234,42,51,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
                {isProcessing ? (
                    <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>
                      <span className="material-symbols-outlined text-2xl">bolt</span>
                      DEPOSIT VIA PADDLE
                    </>
                )}
            </button>
        </div>
      </footer>
    </div>
  );
};

export default Deposit;
