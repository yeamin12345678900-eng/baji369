
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
    desc: 'Get 1% cashback on net losses. Min loss $500.',
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
    desc: 'Invite friends. Get $2 when they deposit $200+.',
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
      alert('Request sent for review. T&C apply.');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1111] animate-in fade-in duration-500 overflow-y-auto no-scrollbar pb-32 font-display">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1a1111]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
               <span className="material-symbols-outlined text-primary text-base">local_activity</span>
            </div>
            <h2 className="text-lg font-black text-white tracking-tight">Promotions</h2>
        </div>
        <button className="size-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 active:scale-90 transition-transform shrink-0">
          <span className="material-symbols-outlined text-[20px]">filter_list</span>
        </button>
      </header>

      {/* Featured Carousel */}
      <section className="px-4 mt-4">
        <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
          {FEATURED_CAROUSEL.map((item, idx) => (
            <div 
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${idx === carouselIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url("${item.image}")`}} />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent p-5 flex flex-col justify-center">
                <span className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded w-fit mb-2 uppercase tracking-widest">{item.tag}</span>
                <h3 className="text-xl font-black text-white leading-tight mb-1">{item.title}</h3>
                <p className="text-white/70 text-[10px] font-bold mb-4 max-w-[80%] line-clamp-2">{item.desc}</p>
                <button onClick={() => onNavigate('deposit')} className="bg-white text-primary text-[9px] font-black px-4 py-1.5 rounded-full w-fit uppercase tracking-widest shadow-xl">Check Offers</button>
              </div>
            </div>
          ))}
          {/* Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
            {FEATURED_CAROUSEL.map((_, idx) => (
              <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === carouselIndex ? 'w-4 bg-primary' : 'w-1.5 bg-white/20'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-[57px] z-40 bg-[#1a1111]/95 backdrop-blur-md py-3 mt-4 border-b border-white/5 overflow-hidden">
        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`shrink-0 h-8 px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 border ${
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
      <div className="px-4 mt-5 flex flex-col gap-8 overflow-hidden">
        {filteredSections.map((sectionName) => (
          <div key={sectionName} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[18px] ${
                  sectionName === 'Welcome' ? 'text-red-500' : 
                  sectionName === 'Sports' ? 'text-blue-500' : 
                  sectionName === 'Casino' ? 'text-purple-500' : 'text-yellow-500'
                }`}>
                  {sectionName === 'Welcome' ? 'stars' : 
                   sectionName === 'Sports' ? 'sports_soccer' : 
                   sectionName === 'Casino' ? 'casino' : 'loyalty'}
                </span>
                <h2 className="text-[11px] font-black text-white uppercase tracking-wider">{sectionName} Offers</h2>
              </div>
              <button className="text-[9px] font-black text-primary uppercase tracking-widest opacity-60">See All</button>
            </div>

            <div className="flex flex-col gap-3.5">
              {sections[sectionName]?.map((offer) => (
                <div key={offer.id} className="bg-[#24191a] rounded-[1.75rem] p-5 border border-white/5 shadow-lg relative overflow-hidden group">
                  <div className="flex gap-4 items-start">
                    <div className={`size-16 rounded-2xl ${offer.iconBg} shrink-0 flex items-center justify-center shadow-xl relative border border-white/5`}>
                      <span className="material-symbols-outlined text-white text-2xl">{offer.iconName}</span>
                      {offer.isLive && (
                        <div className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-[#24191a]"></span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">{offer.tag}</span>
                      </div>
                      <h3 className="text-white font-black text-sm leading-tight mb-1 truncate">{offer.title}</h3>
                      <p className="text-slate-400 text-[10px] leading-tight font-bold line-clamp-2">{offer.desc}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{offer.status}</span>
                      </div>
                      <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Verified</span>
                    </div>
                    <button 
                      onClick={() => handleClaim(offer.id)}
                      disabled={claimingId === offer.id}
                      className={`w-full h-12 rounded-xl ${offer.ctaColor} text-white text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2`}
                    >
                      {claimingId === offer.id ? (
                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        offer.ctaText
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-8 mt-6 mb-10 text-center opacity-40">
         <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">
            * T&C apply. Managed by Baji369 Admin.
         </p>
      </div>
    </div>
  );
};

export default Promotions;
