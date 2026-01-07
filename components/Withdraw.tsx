
import React, { useState, useEffect } from 'react';
import { Language } from '../services/translations';
import { supabase, submitWithdrawRequest, getGlobalSettings } from '../services/supabase';

interface WithdrawProps {
  lang: Language;
  balance: number;
  onBack: () => void;
  onWithdrawSuccess: (amount: number) => void;
  isDemo?: boolean;
}

const Withdraw: React.FC<WithdrawProps> = ({ lang, balance, onBack, onWithdrawSuccess, isDemo = false }) => {
  const [selectedMethod, setSelectedMethod] = useState('BKASH');
  const [amount, setAmount] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [methodStatus, setMethodStatus] = useState<Record<string, boolean>>({
    bkash: true,
    nagad: true,
    rocket: true
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    
    // Fetch method status from global settings
    const fetchSettings = async () => {
      const { data } = await getGlobalSettings();
      if (data?.method_status) {
        setMethodStatus(data.method_status);
        
        // If current selected is disabled, select first available
        const currentLower = selectedMethod.toLowerCase();
        if (data.method_status[currentLower] === false) {
            if (data.method_status.bkash) setSelectedMethod('BKASH');
            else if (data.method_status.nagad) setSelectedMethod('NAGAD');
            else if (data.method_status.rocket) setSelectedMethod('ROCKET');
        }
      }
    };
    fetchSettings();
  }, []);

  const methods = [
    { id: 'BKASH', label: 'bKash', color: 'bg-[#D12053]', icon: 'account_balance_wallet', statusKey: 'bkash' },
    { id: 'NAGAD', label: 'Nagad', color: 'bg-[#F16022]', icon: 'payments', statusKey: 'nagad' },
    { id: 'ROCKET', label: 'Rocket', color: 'bg-[#8C3494]', icon: 'rocket_launch', statusKey: 'rocket' },
  ];

  const handleWithdraw = async () => {
    if (isDemo) {
      alert(lang === 'en' ? "Withdrawal is blocked in Demo Mode!" : "ডেমো মোডে টাকা উত্তোলন বন্ধ!");
      return;
    }

    const currentMethodActive = methodStatus[selectedMethod.toLowerCase()];
    if (currentMethodActive === false) {
      alert(lang === 'en' ? "This method is currently under maintenance." : "এই মেথডটি বর্তমানে রক্ষণাবেক্ষণের অধীনে আছে।");
      return;
    }

    const numAmount = parseFloat(amount);
    
    if (!amount || numAmount < 50) {
      alert(lang === 'en' ? "Minimum withdrawal is $50" : "সর্বনিম্ন উত্তোলনের পরিমাণ $৫০");
      return;
    }

    if (numAmount > balance) {
      alert(lang === 'en' ? "Insufficient balance in your real wallet." : "আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই।");
      return;
    }

    if (!phone || phone.length < 11) {
      alert(lang === 'en' ? "Please enter a valid 11-digit phone number" : "সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন");
      return;
    }

    if (!user) {
      alert(lang === 'en' ? "Session expired. Please log in again." : "সেশন শেষ হয়েছে। আবার লগইন করুন।");
      return;
    }
    
    setIsProcessing(true);
    try {
      await submitWithdrawRequest(user.id, numAmount, selectedMethod, phone);
      alert(lang === 'en' 
        ? "Withdrawal request submitted! Payout will be processed within 24 hours." 
        : "রিকোয়েস্ট সফল হয়েছে! পরবর্তী ২৪ ঘণ্টার মধ্যে পেমেন্ট সম্পন্ন করা হবে।");
      onWithdrawSuccess(numAmount);
      onBack();
    } catch (err: any) {
      alert("Error: " + (err.message || "Failed to process request."));
    } finally {
      setIsProcessing(false);
    }
  };

  const finalAmount = amount ? (parseFloat(amount) * 0.98).toFixed(2) : "0.00";

  return (
    <div className="flex flex-col h-full bg-[#0d0909] animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar font-display">
      <header className="sticky top-0 z-50 bg-[#0d0909]/95 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5">
        <button onClick={onBack} className="size-10 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform bg-white/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black text-white tracking-tight flex-1 text-center pr-10 uppercase italic">Withdraw Funds</h2>
      </header>

      <main className="flex-1 pb-32">
        {isDemo && (
          <section className="px-5 mt-4">
             <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 animate-pulse">report</span>
                <div>
                   <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Demo Mode Active</p>
                   <p className="text-[9px] text-red-400/60 font-bold uppercase tracking-tight leading-tight">You cannot withdraw funds from a demo account.</p>
                </div>
             </div>
          </section>
        )}

        <section className="px-5 pt-6 pb-2">
            <div className="flex flex-col items-center justify-center gap-2 rounded-[2.5rem] bg-gradient-to-br from-[#1a0d0e] to-black border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
                <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">{isDemo ? 'Demo Balance' : 'Real Wallet Balance'}</p>
                <p className={`tracking-tight text-4xl font-black italic tabular-nums ${isDemo ? 'text-amber-500' : 'text-white'}`}>
                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
            </div>
        </section>

        <section className="mt-8">
            <h3 className="text-white text-xs font-black px-6 mb-4 uppercase tracking-widest italic">Choose Method</h3>
            <div className="grid grid-cols-3 gap-3 px-5">
                {methods.map((method) => {
                    const isActive = methodStatus[method.statusKey];
                    return (
                        <button 
                            key={method.id}
                            disabled={isDemo || !isActive}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                                selectedMethod === method.id ? 'bg-primary/10 border-primary shadow-lg' : 'bg-white/5 border-transparent text-slate-500'
                            } ${(!isActive || isDemo) ? 'opacity-30 grayscale' : ''}`}
                        >
                            {!isActive && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 rounded-2xl">
                                    <span className="bg-red-600 text-white text-[6px] font-black px-1 py-0.5 rounded-sm uppercase rotate-[-15deg]">Offline</span>
                                </div>
                            )}
                            <div className={`w-10 h-10 rounded-xl ${method.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                                <span className="material-symbols-outlined text-[20px] filled">{method.icon}</span>
                            </div>
                            <p className={`text-[9px] font-black uppercase tracking-wider ${selectedMethod === method.id ? 'text-white' : 'text-slate-500'}`}>{method.label}</p>
                        </button>
                    );
                })}
            </div>
        </section>

        <section className="mt-10 px-5 space-y-6">
            <div className={`bg-[#1a0d0e] rounded-2xl border border-white/5 p-5 shadow-inner focus-within:border-primary/30 transition-all ${isDemo ? 'opacity-50' : ''}`}>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 pl-1">Target Phone/Wallet Number</label>
                <input 
                  type="tel"
                  disabled={isDemo}
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-transparent text-white text-xl font-black placeholder-slate-800 focus:outline-none p-0 border-none focus:ring-0 tracking-[0.2em]"
                />
            </div>

            <div className={`bg-[#1a0d0e] rounded-2xl border border-white/5 p-5 shadow-inner focus-within:border-primary/30 transition-all ${isDemo ? 'opacity-50' : ''}`}>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 pl-1">Amount to Withdraw (USD)</label>
                <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-3xl font-black italic">$</span>
                    <input 
                        disabled={isDemo}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-transparent text-white text-3xl font-black placeholder-slate-800 focus:outline-none p-0 border-none focus:ring-0 italic tabular-nums" 
                        placeholder="50.00" 
                        type="number"
                    />
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Processing Fee (2%)</span>
                    <span className="text-red-500">-${amount ? (parseFloat(amount) * 0.02).toFixed(2) : "0.00"}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Net Arrival</span>
                    <span className="text-emerald-400 font-black text-xl italic tabular-nums">${finalAmount}</span>
                </div>
            </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-[#0d0909]/95 backdrop-blur-xl border-t border-white/5 z-50">
        <button 
            onClick={handleWithdraw}
            disabled={isProcessing || !amount || parseFloat(amount) < 50 || parseFloat(amount) > balance || isDemo}
            className={`w-full h-16 rounded-2xl bg-primary text-white text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-[0.98] ${
                isProcessing || !amount || parseFloat(amount) < 50 || parseFloat(amount) > balance || isDemo ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:brightness-110'
            }`}
        >
            {isProcessing ? (
                <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            ) : (
                isDemo ? "DISABLED IN DEMO" : "REQUEST PAYOUT"
            )}
        </button>
      </footer>
    </div>
  );
};

export default Withdraw;
