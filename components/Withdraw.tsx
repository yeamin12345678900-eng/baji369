
import React, { useState } from 'react';
import { Language } from '../services/translations';

interface WithdrawProps {
  lang: Language;
  balance: number;
  onBack: () => void;
  onWithdrawSuccess: (amount: number) => void;
}

const Withdraw: React.FC<WithdrawProps> = ({ lang, balance, onBack, onWithdrawSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('Bkash');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const methods = [
    { id: 'Bkash', label: 'Bkash', color: 'bg-pink-500', icon: 'account_balance_wallet' },
    { id: 'Nagad', label: 'Nagad', color: 'bg-orange-500', icon: 'payments' },
    { id: 'Rocket', label: 'Rocket', color: 'bg-purple-600', icon: 'rocket_launch' },
    { id: 'Bank', label: 'Bank', color: 'bg-blue-800', icon: 'account_balance' },
  ];

  const handleWithdraw = () => {
    const numAmount = parseFloat(amount);
    if (!amount || numAmount > balance || numAmount < 10) return;
    
    setIsProcessing(true);
    // Simulate API withdrawal process
    setTimeout(() => {
      setIsProcessing(false);
      onWithdrawSuccess(numAmount);
    }, 2000);
  };

  const finalAmount = amount ? (parseFloat(amount) * 0.98).toFixed(2) : "0.00";

  return (
    <div className="flex flex-col h-full bg-[#101822] animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar font-display">
      <header className="sticky top-0 z-50 bg-[#111822]/95 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5">
        <button onClick={onBack} className="size-10 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black text-white tracking-tight flex-1 text-center pr-10">Withdraw Funds</h2>
      </header>

      <main className="flex-1 pb-32">
        <section className="px-5 pt-6 pb-2">
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#1a2430] to-[#141b25] border border-[#324867] p-8 shadow-xl relative overflow-hidden group">
                <p className="text-[#92a9c9] text-[10px] font-black tracking-[0.2em] uppercase">Withdrawable Balance</p>
                <p className="text-white tracking-tight text-4xl font-black">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
        </section>

        <section className="mt-8">
            <h3 className="text-white text-base font-black px-5 mb-4 uppercase tracking-wider">Withdraw To</h3>
            <div className="grid grid-cols-2 gap-3 px-5">
                {methods.map((method) => (
                    <button 
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`relative flex items-center gap-3 p-4 rounded-2xl bg-[#1a2430] border-2 transition-all active:scale-95 ${
                            selectedMethod === method.id ? 'border-orange-500 shadow-lg shadow-orange-900/10' : 'border-transparent text-slate-500'
                        }`}
                    >
                        <div className={`w-9 h-9 rounded-full ${method.color} flex items-center justify-center text-white shrink-0`}>
                            <span className="material-symbols-outlined text-[18px]">{method.icon}</span>
                        </div>
                        <p className={`text-[11px] font-black uppercase tracking-wider ${selectedMethod === method.id ? 'text-white' : 'text-slate-500'}`}>{method.label}</p>
                    </button>
                ))}
            </div>
        </section>

        <section className="mt-10 px-5">
            <h3 className="text-white text-base font-black mb-4 uppercase tracking-wider">Amount</h3>
            <div className="bg-[#1a2430] rounded-2xl border border-slate-700 p-5 shadow-sm focus-within:border-orange-500 transition-all">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Amount to Withdraw</label>
                <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-3xl font-black">$</span>
                    <input 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-transparent text-white text-3xl font-black placeholder-slate-700 focus:outline-none p-0 border-none focus:ring-0" 
                        placeholder="0.00" 
                        type="number"
                    />
                </div>
            </div>

            {/* Fee Info */}
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Processing Fee (2%)</span>
                    <span className="text-red-400">-${amount ? (parseFloat(amount) * 0.02).toFixed(2) : "0.00"}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest pt-2 border-t border-white/5">
                    <span className="text-white">You will receive</span>
                    <span className="text-green-400">${finalAmount}</span>
                </div>
            </div>
        </section>

        <section className="mt-8 px-5">
            <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <span className="material-symbols-outlined text-orange-500">info</span>
                <p className="text-xs text-orange-200/70 leading-relaxed font-medium">
                    Withdrawals are usually processed within 24 hours. Ensure your payment details are correct to avoid delays.
                </p>
            </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-5 bg-[#111822]/90 backdrop-blur-xl border-t border-white/5 z-30 max-w-md mx-auto rounded-t-[2.5rem]">
        <button 
            onClick={handleWithdraw}
            disabled={isProcessing || !amount || parseFloat(amount) > balance || parseFloat(amount) < 10}
            className={`w-full h-14 rounded-2xl bg-orange-500 text-white text-sm font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] ${
                isProcessing || !amount || parseFloat(amount) > balance || parseFloat(amount) < 10 ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'
            }`}
        >
            {isProcessing ? (
                <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            ) : (
                "Request Withdrawal"
            )}
        </button>
      </footer>
    </div>
  );
};

export default Withdraw;
