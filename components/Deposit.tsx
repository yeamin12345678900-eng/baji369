
import React, { useState, useEffect } from 'react';
import { Language, translations } from '../services/translations';
import { supabase, submitDepositRequest, getGlobalSettings } from '../services/supabase';

interface DepositProps {
  lang: Language;
  balance: number;
  onBack: () => void;
  onDepositSuccess: (amount: number) => void;
}

type Provider = 'bkash' | 'nagad' | 'rocket';

const Deposit: React.FC<DepositProps> = ({ lang, balance, onBack, onDepositSuccess }) => {
  const t = translations[lang];
  const [view, setView] = useState<'selection' | 'paddle' | 'rupantor-steps'>('selection');
  const [step, setStep] = useState<1 | 2>(1); 
  const [provider, setProvider] = useState<Provider>('bkash');
  const [amount, setAmount] = useState<number>(500);
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [paymentNumbers, setPaymentNumbers] = useState({
    bkash: '01700000000',
    nagad: '01700000000',
    rocket: '01700000000'
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    
    // Fetch dynamic numbers from settings
    const fetchNumbers = async () => {
      const { data } = await getGlobalSettings();
      if (data?.payment_numbers) {
        setPaymentNumbers(data.payment_numbers);
      }
    };
    fetchNumbers();
  }, []);

  const handleCopy = () => {
    const numToCopy = paymentNumbers[provider] || "01700000000";
    navigator.clipboard.writeText(numToCopy); 
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitTrx = async () => {
    if (!trxId || !user) {
        alert(lang === 'en' ? "Please enter Transaction ID" : "দয়া করে ট্রানজেকশন আইডি দিন");
        return;
    }
    setIsSubmitting(true);
    
    try {
      const { error } = await submitDepositRequest({
        user_id: user.id,
        amount: amount,
        method: provider.toUpperCase(),
        transaction_id: trxId
      });

      if (error) {
          if (error.code === '23505') {
              alert(lang === 'en' ? "This Transaction ID has already been used!" : "এই ট্রানজেকশন আইডিটি আগে ব্যবহার করা হয়েছে!");
          } else {
              throw error;
          }
          return;
      }

      alert(lang === 'en' ? "Deposit request submitted! Please wait for admin approval." : "ডিপোজিট রিকোয়েস্ট পাঠানো হয়েছে! অ্যাডমিনের অনুমোদনের জন্য অপেক্ষা করুন।");
      onBack();
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const providers = [
    { id: 'bkash', name: 'bKash', color: 'bg-[#D12053]', icon: 'https://raw.githubusercontent.com/rupantor-pay/assets/main/bkash.png' },
    { id: 'nagad', name: 'Nagad', color: 'bg-[#F16022]', icon: 'https://raw.githubusercontent.com/rupantor-pay/assets/main/nagad.png' },
    { id: 'rocket', name: 'Rocket', color: 'bg-[#8C3494]', icon: 'https://raw.githubusercontent.com/rupantor-pay/assets/main/rocket.png' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0d0909] font-display animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-[#0d0909]/95 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-white/5 shadow-xl">
        <button onClick={view === 'selection' ? onBack : () => { setView('selection'); setStep(1); }} className="size-11 rounded-2xl bg-white/5 flex items-center justify-center text-white active:scale-90 border border-white/5 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-white text-lg font-black tracking-tight uppercase italic">{t.deposit}</h2>
            <p className="text-[7px] text-emerald-500 font-black uppercase tracking-[0.2em]">Secure RupantorPay Gateway</p>
        </div>
        <div className="size-11"></div>
      </header>

      <main className="flex-1 px-6 pt-8 pb-32 overflow-y-auto no-scrollbar flex flex-col items-center">
        
        {view === 'selection' && (
          <div className="w-full max-w-[400px] space-y-6 animate-in slide-in-from-bottom duration-500">
             <div className="text-center mb-4">
                <h3 className="text-white text-xl font-black uppercase tracking-tighter italic">Choose Payment Method</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Instant Credits with Local Providers</p>
             </div>

             <button 
              onClick={() => setView('rupantor-steps')}
              className="w-full bg-[#1a0d0e] border border-white/10 rounded-[2.5rem] p-6 flex items-center gap-6 group hover:border-primary/50 transition-all text-left shadow-2xl"
             >
                <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                   <span className="material-symbols-outlined text-4xl">payments</span>
                </div>
                <div className="flex-1">
                   <h4 className="text-white font-black text-lg uppercase italic tracking-tight">{t.localPayment}</h4>
                   <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">bKash, Nagad, Rocket</p>
                </div>
                <span className="material-symbols-outlined text-slate-700">arrow_forward_ios</span>
             </button>

             <button 
              onClick={() => setView('paddle')}
              className="w-full bg-[#1a0d0e] border border-white/10 rounded-[2.5rem] p-6 flex items-center gap-6 group hover:border-blue-500/50 transition-all text-left shadow-2xl"
             >
                <div className="size-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                   <span className="material-symbols-outlined text-4xl">public</span>
                </div>
                <div className="flex-1">
                   <h4 className="text-white font-black text-lg uppercase italic tracking-tight">{t.globalPayment}</h4>
                   <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Visa, Mastercard, Crypto</p>
                </div>
                <span className="material-symbols-outlined text-slate-700">arrow_forward_ios</span>
             </button>
          </div>
        )}

        {view === 'rupantor-steps' && (
          <div className="w-full max-w-[400px] animate-in slide-in-from-right duration-500">
             {step === 1 ? (
               <div className="space-y-8">
                  <div className="bg-[#1a0d0e] border border-white/5 rounded-[3rem] p-8 space-y-8 shadow-2xl">
                     <h3 className="text-white font-black text-center text-sm uppercase italic tracking-widest">{t.selectProvider}</h3>
                     <div className="grid grid-cols-3 gap-3">
                        {providers.map(p => (
                          <button 
                            key={p.id}
                            onClick={() => setProvider(p.id as Provider)}
                            className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all ${provider === p.id ? 'bg-primary/10 border-primary scale-105' : 'bg-white/5 border-transparent opacity-40'}`}
                          >
                            <span className="text-[12px] font-black text-white uppercase mb-2">{p.name}</span>
                            <div className="size-4 rounded-full border-2 border-white/20 flex items-center justify-center">
                               {provider === p.id && <div className="size-2 bg-primary rounded-full"></div>}
                            </div>
                          </button>
                        ))}
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Select Amount (BDT)</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[500, 1000, 2000, 5000].map(amt => (
                            <button 
                                key={amt}
                                onClick={() => setAmount(amt)}
                                className={`h-14 rounded-xl border font-black text-sm tabular-nums transition-all ${amount === amt ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500'}`}
                            >
                                ৳{amt.toLocaleString()}
                            </button>
                            ))}
                        </div>
                     </div>

                     <button 
                       onClick={() => setStep(2)}
                       className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                     >
                       Next Step
                       <span className="material-symbols-outlined">arrow_forward</span>
                     </button>
                  </div>
               </div>
             ) : (
               <div className="space-y-6">
                  <div className="bg-[#1a0d0e] border border-white/5 rounded-[3rem] p-8 space-y-6 shadow-2xl">
                     <div className="text-center space-y-3">
                        <div className={`size-16 rounded-3xl mx-auto flex items-center justify-center text-white ${providers.find(p => p.id === provider)?.color} shadow-2xl`}>
                           <span className="material-symbols-outlined text-4xl">send_to_mobile</span>
                        </div>
                        <h3 className="text-white font-black text-xl uppercase italic tracking-tighter">Instructions</h3>
                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-relaxed tracking-widest">{t.paymentInstruction}</p>
                     </div>

                     <div className="p-6 bg-black/60 border border-white/10 rounded-2xl flex items-center justify-between">
                        <div>
                           <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">{t.merchantNo}</p>
                           <p className="text-white text-xl font-black tracking-[0.2em] mt-1">{paymentNumbers[provider]}</p>
                        </div>
                        <button 
                          onClick={handleCopy}
                          className="px-4 py-2 bg-primary/20 text-primary border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest active:scale-90 transition-transform"
                        >
                          {copied ? t.copied : t.copy}
                        </button>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">{t.trxId}</label>
                        <input 
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                          placeholder="8XJ9K0LP..."
                          className="w-full h-16 bg-black border border-white/10 rounded-2xl px-6 text-white font-black uppercase tracking-widest focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                     </div>

                     <button 
                        onClick={handleSubmitTrx}
                        disabled={!trxId || isSubmitting}
                        className="w-full h-16 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-emerald-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                     >
                       {isSubmitting ? <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                         <>
                           <span className="material-symbols-outlined">check_circle</span>
                           {t.submitRequest}
                         </>
                       )}
                     </button>
                  </div>
               </div>
             )}
          </div>
        )}

        {view === 'paddle' && (
          <div className="w-full max-w-[400px] animate-in slide-in-from-right duration-500">
             <div className="bg-[#1a0d0e] border border-blue-500/20 rounded-[3rem] p-10 text-center shadow-2xl">
                <div className="size-24 rounded-[2rem] bg-blue-500/10 flex items-center justify-center mx-auto mb-6 text-blue-500 border border-blue-500/20 shadow-inner">
                   <span className="material-symbols-outlined text-5xl">public</span>
                </div>
                <h4 className="text-white font-black text-xl uppercase italic tracking-tighter mb-2">Global Checkout</h4>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Visa, Mastercard, Google Pay</p>
                <button className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-blue-900/30 active:scale-95 transition-transform flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined">payments</span>
                    Pay with Card
                </button>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Deposit;
