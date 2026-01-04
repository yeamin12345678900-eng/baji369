
import React, { useState } from 'react';
import { sha256 } from '../services/fairness';

interface ProvablyFairModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverSeedHash: string;
  currentClientSeed: string;
  nonce: number;
}

const ProvablyFairModal: React.FC<ProvablyFairModalProps> = ({ isOpen, onClose, serverSeedHash, currentClientSeed, nonce }) => {
  const [activeTab, setActiveTab] = useState<'verify' | 'seeds'>('verify');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#1a0d0e] rounded-[3rem] border border-white/10 flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="size-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                <span className="material-symbols-outlined">verified_user</span>
             </div>
             <div>
                <h3 className="text-white font-black text-lg uppercase tracking-tight">Provably Fair</h3>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Trust & Transparency</p>
             </div>
          </div>
          <button onClick={onClose} className="size-10 flex items-center justify-center text-slate-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
           <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
              <button onClick={() => setActiveTab('verify')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'verify' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Verifier</button>
              <button onClick={() => setActiveTab('seeds')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'seeds' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Current Seeds</button>
           </div>

           {activeTab === 'seeds' ? (
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Next Server Seed (Hashed)</label>
                   <div className="p-4 bg-black/40 rounded-2xl border border-white/5 break-all text-[10px] font-mono text-emerald-400">
                      {serverSeedHash}
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Client Seed (Current)</label>
                   <input 
                    readOnly 
                    value={currentClientSeed} 
                    className="w-full h-12 bg-black/40 rounded-2xl border border-white/5 px-4 text-white text-[10px] font-mono outline-none" 
                   />
                </div>
                <div className="flex justify-between items-center px-1">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Nonce</span>
                   <span className="text-white font-black text-xs">{nonce}</span>
                </div>
             </div>
           ) : (
             <div className="space-y-4">
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                   You can verify any game result by entering the server seed used for that round. The server seed for your last round is shown in your bet history.
                </p>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Enter Server Seed (Un-hashed)</label>
                   <input 
                    className="w-full h-14 bg-black/40 rounded-2xl border border-white/5 px-4 text-white text-[11px] font-mono outline-none focus:border-primary transition-all" 
                    placeholder="64-character secret seed..." 
                   />
                </div>
                <button className="w-full h-14 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">
                   Verify Outcome
                </button>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5 text-center">
           <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest leading-relaxed">
              Our provably fair system uses the SHA-256 algorithm to ensure that every roll is generated before the bet is placed.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ProvablyFairModal;
