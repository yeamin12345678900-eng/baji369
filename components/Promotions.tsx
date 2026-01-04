
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

/**
 * ADMIN PROTECTED PROMOTIONS
 * These offers look attractive but have very low actual cost to the admin.
 */
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
    footerText: 'Ends soon',
    footerIcon: 'schedule'
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
    footerText: 'Every Friday',
    footerIcon: 'calendar_month'
  },
  {
    id: 4,
    title: '1% Weekly Cashback',
    category: 'Loyalty',
    desc: 'Get 1% cashback on net losses. Minimum loss $500 required.',
    tag: 'CASHBACK',
    status: 'Auto-credit',
    ctaText: 'View Terms',
    ctaColor: 'bg-neutral-800 border border-white/10',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
    iconName: 'currency_exchange',
    footerText: 'Auto-credit',
    footerIcon: 'sync'
  },
  {
    id: 5,
    title: 'Refer & Earn $2',
    category: 'Referral',
    desc: 'Invite friends. Get $2 when they deposit $200 or more.',
    tag: 'REFERRAL',
    status: 'Unlimited',
    ctaText: 'Invite Friends',
    ctaColor: 'bg-indigo-600',
    iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-800',
    iconName: 'group_add',
    footerText: 'Unlimited',
    footerIcon: 'all_inclusive'
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
      alert('Your request has been sent for review. Term and conditions apply.');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1111] animate-in fade-in duration-500 overflow-y-auto no-scrollbar pb-32 font-display">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1a1111]/95 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
               <span className="material-symbols-outlined text-primary text-sm">local_activity</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Promotions</h2>
        </div>
        <button className="size-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[20px]">filter_list</span>
        </button>
      </header>

      {/* Featured Carousel */}
      <section className="px-5 mt-4">
        <div className="relative aspect-[16/8] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
          {FEATURED_CAROUSEL.map((item, idx) => (
            <div 
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${idx === carouselIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url("${item.image}")`}} />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent p-6 flex flex-col justify-center">
                <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-md w-fit mb-3 uppercase tracking-widest">{item.tag}</span>
                <h3 className="text-2xl font-black text-white leading-tight mb-2">{item.title}</h3>
                <p className="text-white/70 text-xs font-bold mb-4 max-w-[70%]">{item.desc}</p>
                <button onClick={() => onNavigate('deposit')} className="bg-white text-primary text-[10px] font-black px-5 py-2 rounded-full w-fit uppercase tracking-widest shadow-xl active:scale-95">Check Offers</button>
              </div>
            </div>
          ))}
          {/* Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
            {FEATURED_CAROUSEL.map((_, idx) => (
              <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === carouselIndex ? 'w-5 bg-primary' : 'w-2 bg-white/20'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-[61px] z-40 bg-[#1a1111]/95 backdrop-blur-md py-4 mt-4 border-b border-white/5 shadow-sm">
        <div className="flex gap-2 px-5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`shrink-0 h-9 px-5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border ${
                activeTab === cat 
                  ? 'bg-white border-white text-black shadow-lg shadow-white/5' 
                  : 'bg-white/5 border-white/10 text-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Promotion List By Category */}
      <div className="px-5 mt-6 flex flex-col gap-10">
        {filteredSections.map((sectionName) => (
          <div key={sectionName} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[18px] ${
                  sectionName === 'Welcome' ? 'text-red-500' : 
                  sectionName === 'Sports' ? 'text-blue-500' : 
                  sectionName === 'Casino' ? 'text-purple-500' : 'text-yellow-500'
                }`}>
                  {sectionName === 'Welcome' ? 'featured_seasonal' : 
                   sectionName === 'Sports' ? 'sports_soccer' : 
                   sectionName === 'Casino' ? 'casino' : 'loyalty'}
                </span>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">{sectionName} Offers</h2>
              </div>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60">See All</button>
            </div>

            <div className="flex flex-col gap-4">
              {sections[sectionName]?.map((offer) => (
                <div key={offer.id} className="bg-[#24191a] rounded-[2.5rem] p-6 border border-white/5 shadow-xl relative overflow-hidden group">
                  {/* Promo Icon & Text Container */}
                  <div className="flex gap-5 items-start">
                    <div className={`size-20 rounded-[2rem] ${offer.iconBg} shrink-0 flex items-center justify-center shadow-2xl relative border border-white/5`}>
                      <span className="material-symbols-outlined text-white text-3xl">{offer.iconName}</span>
                      {offer.isLive && (
                        <div className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border border-[#24191a]"></span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{offer.tag}</span>
                        {offer.isLive && <span className="text-[8px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-1.5 py-0.5 rounded">Live</span>}
                      </div>
                      <h3 className="text-white font-black text-lg leading-tight mb-2 tracking-tight">{offer.title}</h3>
                      <p className="text-slate-400 text-[11px] leading-relaxed font-bold">{offer.desc}</p>
                    </div>
                  </div>

                  {/* Footer & CTA */}
                  <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {offer.footerIcon && <span className="material-symbols-outlined text-red-500 text-[16px]">{offer.footerIcon}</span>}
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{offer.status}</span>
                      </div>
                      <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Verified</span>
                    </div>
                    <button 
                      onClick={() => handleClaim(offer.id)}
                      disabled={claimingId === offer.id}
                      className={`w-full h-14 rounded-2xl ${offer.ctaColor} text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2`}
                    >
                      {claimingId === offer.id ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          {offer.ctaText}
                          {offer.category === 'Referral' && <span className="material-symbols-outlined text-sm">share</span>}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* T&C Footer Notice */}
      <div className="px-10 mt-6 mb-10 text-center opacity-40">
         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">
            * All bonuses are subject to 50x wagering requirements and management approval. Baji369 reserves the right to modify terms at any time.
         </p>
      </div>

      {/* Empty State */}
      {filteredSections.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-24 opacity-20">
          <span className="material-symbols-outlined text-7xl mb-4">no_accounts</span>
          <p className="text-sm font-black uppercase tracking-widest">No promotions found</p>
        </div>
      )}
    </div>
  );
};

export default Promotions;
