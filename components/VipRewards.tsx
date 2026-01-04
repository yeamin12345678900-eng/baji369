
import React from 'react';

interface VipRewardsProps {
  onBack: () => void;
  currentPoints: number;
}

interface VipTier {
  level: number;
  name: string;
  pointsRequired: number;
  benefits: string[];
  color: string;
  glow: string;
}

const VIP_TIERS: VipTier[] = [
  { level: 1, name: 'Bronze', pointsRequired: 0, benefits: ['Standard Support', '5% Weekly Cashback'], color: 'text-[#cd7f32]', glow: 'shadow-[#cd7f32]/20' },
  { level: 2, name: 'Silver', pointsRequired: 500, benefits: ['Priority Support', '7% Weekly Cashback', 'Birthday Bonus'], color: 'text-slate-400', glow: 'shadow-slate-400/20' },
  { level: 3, name: 'Gold', pointsRequired: 1500, benefits: ['Personal Manager', '10% Weekly Cashback', 'Exclusive Tournaments'], color: 'text-yellow-500', glow: 'shadow-yellow-500/20' },
  { level: 4, name: 'Platinum', pointsRequired: 5000, benefits: ['24/7 Direct Line', '15% Weekly Cashback', 'Gadget Giveaways', 'VIP Events'], color: 'text-blue-400', glow: 'shadow-blue-400/20' },
  { level: 5, name: 'Diamond', pointsRequired: 15000, benefits: ['Unlimited Withdrawals', '20% Weekly Cashback', 'Luxury Travel Rewards', 'Private Concierge'], color: 'text-cyan-300', glow: 'shadow-cyan-300/20' },
];

const VipRewards: React.FC<VipRewardsProps> = ({ onBack, currentPoints }) => {
  const currentTier = VIP_TIERS.find(t => t.level === 3) || VIP_TIERS[0]; // Assuming user is Level 3 Gold
  const nextTier = VIP_TIERS.find(t => t.level === currentTier.level + 1);
  const progressPercent = nextTier ? (currentPoints / nextTier.pointsRequired) * 100 : 100;

  return (
    <div className="flex flex-col h-full bg-[#0d0909] animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar font-display">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-[#0d0909]/95 backdrop-blur-xl px-4 py-4 border-b border-white/5 flex items-center">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-90 shrink-0">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="flex-1 text-center pr-10">
          <h2 className="text-lg font-black text-white tracking-tight uppercase">VIP Club</h2>
          <p className="text-[9px] text-yellow-500 font-black uppercase tracking-[0.2em]">Exclusivity Redefined</p>
        </div>
      </header>

      {/* Hero Progression Card */}
      <div className="px-5 pt-6">
        <div className="bg-gradient-to-br from-[#1a1313] to-[#0d0909] rounded-[2.5rem] p-8 border border-yellow-500/20 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 size-48 bg-yellow-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="size-20 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-4 shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)]">
               <span className="material-symbols-outlined text-yellow-500 text-4xl filled">workspace_premium</span>
            </div>
            <h3 className="text-white font-black text-2xl tracking-tighter uppercase mb-1">{currentTier.name} Member</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">Current Standing</p>
            
            {/* Progress Bar */}
            <div className="w-full space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points Progress</span>
                <span className="text-sm font-black text-yellow-500">{currentPoints.toLocaleString()} <span className="text-slate-600">/ {nextTier?.pointsRequired.toLocaleString()}</span></span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest pt-1">
                Collect <span className="text-white">{(nextTier?.pointsRequired || 0) - currentPoints} more points</span> to reach <span className="text-blue-400">{nextTier?.name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Perks Grid */}
      <div className="px-5 mt-10">
        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 pl-2">Current Tier Perks</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Weekly Cashback', value: '10%', icon: 'account_balance_wallet', color: 'text-emerald-500' },
            { label: 'Monthly Bonus', value: '$250', icon: 'card_giftcard', color: 'text-purple-500' },
            { label: 'Withdraw Limit', value: '$10k/day', icon: 'trending_up', color: 'text-blue-500' },
            { label: 'Personal Host', value: 'Sarah', icon: 'support_agent', color: 'text-orange-500' },
          ].map((perk, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
              <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center ${perk.color}`}>
                <span className="material-symbols-outlined text-[20px]">{perk.icon}</span>
              </div>
              <div>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest leading-none mb-1">{perk.label}</p>
                <p className="text-white font-black text-sm">{perk.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Roadmap */}
      <div className="px-5 mt-10 mb-20">
        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 pl-2">VIP Roadmap</h3>
        <div className="space-y-3">
          {VIP_TIERS.map((tier) => {
            const isUnlocked = currentTier.level >= tier.level;
            return (
              <div 
                key={tier.level}
                className={`bg-[#1a1313] border rounded-[1.8rem] p-5 flex items-center justify-between transition-all ${
                  isUnlocked ? 'border-yellow-500/20 opacity-100' : 'border-white/5 opacity-40 grayscale'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`size-12 rounded-2xl bg-white/5 flex items-center justify-center ${tier.color} shadow-lg`}>
                    <span className="material-symbols-outlined text-[24px] filled">stars</span>
                  </div>
                  <div>
                    <h4 className={`font-black text-sm tracking-tight ${tier.color}`}>{tier.name}</h4>
                    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">
                      {tier.pointsRequired === 0 ? 'Starter Tier' : `${tier.pointsRequired.toLocaleString()} Points`}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                   {isUnlocked ? (
                     <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-500/20">Unlocked</span>
                   ) : (
                     <span className="material-symbols-outlined text-slate-600">lock</span>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Info */}
      <div className="fixed bottom-6 left-6 right-6 z-50">
        <button className="w-full h-14 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-black rounded-2xl shadow-xl shadow-yellow-900/30 uppercase tracking-[0.2em] text-xs transition-all active:scale-95 flex items-center justify-center gap-2">
           <span className="material-symbols-outlined">redeem</span>
           Redeem Rewards Points
        </button>
      </div>
    </div>
  );
};

export default VipRewards;
