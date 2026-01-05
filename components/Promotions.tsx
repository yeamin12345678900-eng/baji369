
import React, { useState, useEffect, useMemo } from 'react';
import { ViewType } from '../App';

interface PromoOffer {
  id: number;
  title: string;
  category: 'Welcome' | 'Sports' | 'Casino' | 'Loyalty' | 'Referral';
  desc: string;
  tag?: string;
  status?: string;
  ctaText: string;
  ctaColor: string;
  iconBg: string;
  iconName: string;
  footerText?: string;
  footerIcon?: string;
  isLive?: boolean;
}

const FEATURED_CAROUSEL = [
  {
    id: 1,
    title: 'Welcome Gift',
    desc: 'Get a $5 starter bonus on your first $100 deposit.',
    tag: 'FEATURED',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXa0BkcB9gQbwl-vQ4hdb9jaj2O2rijR7o_tN8xda21OF9HpWw3BBKSf3FClVmp3reyg5we2-NSHKnS8liM_3hwixelqsLsb2g8eyMi4nvTwv69qzyzP3bLMiA8MSo4IMF5QTdVsaABr5ScU-Xgo7y8l32dJI9MmvVFoClaJwW-Jwb2tuSXuzJRRNc4BzKlfs_j5xfTXRo3J8L5M_VOa89jfJMrwp-CLpIJPTP10x7E5WXx27JZ7M3XX_PuRjRIPp_eZ16QZbw',
  },
  {
    id: 2,
    title: 'Weekend Boost',
    desc: 'Extra 2% bonus for slots every Sunday.',
    tag: 'LIMITED',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFIC9unOW_w0gYGxXWd_OGMdgqDudpXWrcK4xTo2unZ5nF-ly_OS8fvjdSrTBS68hd-yfX3P_peTgiDN03fVUd0uWkeML08LBLITMhsQM8H9HMmDH05WqeDvKQb-w3cfM2E02Df1Vx8uAlC86nlQhMvgdenNsUIgVF02NnZV2a2ajJn4sAuSafWjeV7bd_rCuN5oSbXQ71dWfZgKQnN-rZxVf-s3OQvLgp-jVmm4H-t2wOzx2PGAS8o33-ZiF__uppgsinUnc0',
  }
];

const OFFERS: PromoOffer[] = [
  {
    id: 1,
    title: '10% First Deposit Bonus',
    category: 'Welcome',
    desc: 'Start your journey with a 10% boost. Max bonus $10.',
    tag: 'NEW PLAYER',
    status: 'Available',
    ctaText: 'Claim Bonus',
    ctaColor: 'bg-primary',
    iconBg: 'bg-gradient-to-br from-orange-600 to-red-600',
    iconName: 'card_giftcard'
  },
  {
    id: 2,
    title: 'Sports Free Bet $1',
    category: 'Sports',
    desc: 'Bet $50 on any match and receive a $1 free bet credit.',
    tag: 'EVENT SPECIAL',
    isLive: true,
    status: 'Ends soon',
    ctaText: 'Participate',
    ctaColor: 'bg-blue-600',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    iconName: 'sports_cricket',
  },
  {
    id: 3,
    title: 'Friday Free Spins',
    category: 'Casino',
    desc: 'Get 5 Free Spins on select high-edge slots every Friday.',
    tag: 'SLOTS',
    status: 'Every Friday',
    ctaText: 'Get 5 Spins',
    ctaColor: 'bg-purple-600',
    iconBg: 'bg-gradient-to-br from-fuchsia-600 to-purple-700',
    iconName: 'token',
  },
  {
    id: 4,
    title: '1% Weekly Cashback',
    category: 'Loyalty',
    desc: 'Get 1% cashback on net losses. Min loss $500.',
    tag: 'CASHBACK',
    status: 'Auto-credit',
    ctaText: 'View Terms',
    ctaColor: 'bg-neutral-800 border border-white/10',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
    iconName: 'currency_exchange',
  }
];

const CATEGORIES = ['All Offers', 'Welcome', 'Sports', 'Casino', 'Loyalty'];

interface PromotionsProps {
  onNavigate: (view: ViewType) => void;
}

const Promotions: React.FC<PromotionsProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('All Offers');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [claimingId, setClaimingId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % FEATURED_CAROUSEL.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const sections = useMemo(() => {
    const grouped: Record<string, PromoOffer[]> = {};
    OFFERS.forEach(offer => {
      const cat = offer.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(offer);
    });
    return grouped;
  }, []);

  const filteredSections = useMemo(() => {
    if (activeTab === 'All Offers') return Object.keys(sections);
    return [activeTab];
  }, [activeTab, sections]);

  const handleClaim = (id: number) => {
    setClaimingId(id);
    setTimeout(() => {
      setClaimingId(null);
      alert('Request sent for review. T&C apply.');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#140a0b] animate-in fade-in duration-500 overflow-y-auto no-scrollbar pb-32 font-display">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#140a0b]/95 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase">Promotions</h2>
        </div>
        <button className="size-11 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 active:scale-90 transition-transform border border-white/5">
          <span className="material-symbols-outlined text-[24px]">tune</span>
        </button>
      </header>

      {/* Hero Carousel - Immersive Look */}
      <section className="px-5 mt-6">
        <div className="relative h-56 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
          {FEATURED_CAROUSEL.map((item, idx) => (
            <div 
              key={item.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === carouselIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            >
              <div className="absolute inset-0 bg-cover bg-center scale-110" style={{backgroundImage: `url("${item.image}")`}} />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent p-8 flex flex-col justify-center">
                <div className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[8px] font-black px-3 py-1 rounded-full w-fit mb-3 uppercase tracking-widest">{item.tag}</div>
                <h3 className="text-3xl font-black text-white leading-none mb-2 tracking-tighter italic uppercase">{item.title}</h3>
                <p className="text-white/70 text-[11px] font-bold mb-6 max-w-[70%] leading-relaxed">{item.desc}</p>
                <button onClick={() => onNavigate('deposit')} className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] w-fit shadow-2xl active:scale-95 transition-transform">Check Offers</button>
              </div>
            </div>
          ))}
          <div className="absolute bottom-6 left-8 flex gap-1.5">
            {FEATURED_CAROUSEL.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === carouselIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/20'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Pill Style Category Tabs */}
      <div className="sticky top-[72px] z-40 bg-[#140a0b]/95 backdrop-blur-md py-4 mt-6 border-b border-white/5">
        <div className="flex gap-2.5 px-6 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`shrink-0 h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeTab === cat 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white/5 border-white/10 text-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Section */}
      <div className="px-6 mt-8 flex flex-col gap-10">
        {filteredSections.map((sectionName) => (
          <div key={sectionName} className="flex flex-col gap-5 overflow-hidden">
            <div className="flex items-center justify-between px-1">
               <div className="flex items-center gap-3">
                  <span className="h-6 w-1 bg-primary rounded-full"></span>
                  <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">{sectionName} Offers</h2>
               </div>
               <span className="text-[10px] font-black text-primary uppercase tracking-widest opacity-40">See All</span>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {sections[sectionName]?.map((offer) => (
                <div key={offer.id} className="bg-[#1f1314] rounded-[2.5rem] border border-white/5 p-6 shadow-2xl relative overflow-hidden group">
                  <div className="flex gap-5 items-start relative z-10">
                    <div className={`size-16 rounded-3xl ${offer.iconBg} shrink-0 flex items-center justify-center shadow-xl border border-white/10 group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined text-white text-3xl filled">{offer.iconName}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">{offer.tag}</span>
                        {offer.isLive && (
                           <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                              <span className="size-1 bg-red-500 rounded-full animate-pulse"></span>
                              <span className="text-red-500 text-[8px] font-black uppercase">Live</span>
                           </div>
                        )}
                      </div>
                      <h3 className="text-white font-black text-lg leading-tight mb-1 truncate uppercase italic">{offer.title}</h3>
                      <p className="text-slate-400 text-[11px] leading-tight font-bold line-clamp-2 pr-4">{offer.desc}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <span className="material-symbols-outlined text-emerald-500 text-base">verified</span>
                         <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Verified Bonus</span>
                      </div>
                      <span className="text-[9px] font-black uppercase text-slate-400 bg-white/5 px-3 py-1 rounded-full">{offer.status}</span>
                    </div>
                    <button 
                      onClick={() => handleClaim(offer.id)}
                      disabled={claimingId === offer.id}
                      className={`w-full h-14 rounded-2xl ${offer.ctaColor} text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3`}
                    >
                      {claimingId === offer.id ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>{offer.ctaText}</span>
                          <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Decorative background icon */}
                  <span className="absolute -right-6 -bottom-6 material-symbols-outlined text-9xl text-white/[0.02] rotate-12 pointer-events-none group-hover:text-white/[0.04] transition-colors">{offer.iconName}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 mb-20 px-10 text-center">
         <div className="w-12 h-1 bg-white/5 mx-auto mb-6 rounded-full"></div>
         <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] leading-relaxed">
            * All bonuses are subject to 10x wagering requirements.<br/>
            Gaming Portal Managed by Baji369 Admin.
         </p>
      </div>
    </div>
  );
};

export default Promotions;
