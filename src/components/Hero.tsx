import React from 'react';
import { 
  Building2, 
  Coins, 
  Users, 
  TrendingUp, 
  Star, 
  ShieldCheck, 
  Clock, 
  Lock, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { ProductCategory } from '../types';

interface HeroProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenCalculator: () => void;
  onOpenLiveOrderTicker: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectCategory,
  onOpenCalculator,
  onOpenLiveOrderTicker
}) => {
  const servicePills: { id: ProductCategory; label: string; icon: React.ElementType; color: string; desc: string }[] = [
    { 
      id: 'bank-accounts', 
      label: 'Bank Account', 
      icon: Building2, 
      color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400',
      desc: 'Wise, Revolut, Mercury & Stripe Ready'
    },
    { 
      id: 'crypto-accounts', 
      label: 'Crypto Accounts', 
      icon: Coins, 
      color: 'from-amber-500/20 to-yellow-500/20 border-yellow-500/30 text-yellow-400',
      desc: 'Binance Plus, Bybit, Kraken Tier 2/3'
    },
    { 
      id: 'smm-accounts', 
      label: 'SMM Account', 
      icon: Users, 
      color: 'from-purple-500/20 to-pink-500/20 border-pink-500/30 text-pink-400',
      desc: 'Aged 2012-2020 IG, X, TikTok Monetized'
    },
    { 
      id: 'smm-services', 
      label: 'SMM Service', 
      icon: TrendingUp, 
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
      desc: 'Non-Drop Followers, Views & 4k Watchtime'
    },
    { 
      id: 'reviews-services', 
      label: 'Reviews Service', 
      icon: Star, 
      color: 'from-rose-500/20 to-amber-500/20 border-amber-500/30 text-amber-300',
      desc: 'Trustpilot & Google Maps 5-Star Local Guides'
    },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-14 border-b border-slate-800/80 bg-radial-gradient">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-5">
          {/* Cyber Agency Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">
              Official Digital Products Agency <span className="text-emerald-400 font-mono">gotorapid.com</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-medium text-emerald-300 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse"></span>
              24/7 Instant Delivery Active
            </span>
          </div>

          {/* Main Hero Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Verified Digital Assets, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              High-Trust Accounts & Authority Growth
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Your premier marketplace for verified <span className="text-white font-semibold">Bank Accounts</span>, high-limit <span className="text-white font-semibold">Crypto Accounts</span>, aged <span className="text-white font-semibold">SMM Accounts</span>, non-drop <span className="text-white font-semibold">SMM Growth Services</span>, and 5-Star <span className="text-white font-semibold">Reviews</span>. Pre-warmed with anti-detect profiles and replacement warranty.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              id="hero-catalog-cta-btn"
              onClick={() => onSelectCategory('all')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-bold shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition duration-200 flex items-center space-x-2 cursor-pointer"
            >
              <span>Explore All Digital Assets</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-calculator-cta-btn"
              onClick={onOpenCalculator}
              className="px-5 py-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-white text-sm font-semibold shadow-lg transition duration-200 flex items-center space-x-2 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Custom SMM & Reviews Calculator</span>
            </button>
          </div>
        </div>

        {/* 5 Core Services Interactive Cards */}
        <div className="mt-12">
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Select a specialized agency service to explore inventory:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {servicePills.map((s) => {
              const IconComp = s.icon;
              return (
                <button
                  key={s.id}
                  id={`hero-service-card-${s.id}`}
                  onClick={() => onSelectCategory(s.id)}
                  className={`group relative text-left p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0c121e]/90 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${s.color}`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-white/10 group-hover:scale-110 transition duration-200">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      Instant
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                    {s.label}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {s.desc}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>View inventory</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition text-emerald-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trust Badges & Platform Metrics Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center justify-center space-x-1.5 text-emerald-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-lg font-extrabold text-white font-mono">15 Mins</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Average Automated Dispatch</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center justify-center space-x-1.5 text-cyan-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-lg font-extrabold text-white font-mono">100% Guaranteed</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">30-90 Day Replacement Warranty</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center justify-center space-x-1.5 text-purple-400 mb-1">
              <Lock className="w-4 h-4" />
              <span className="text-lg font-extrabold text-white font-mono">Anti-Detect</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Clean Residential IP & Cookies</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center justify-center space-x-1.5 text-amber-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-lg font-extrabold text-white font-mono">45,000+</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Verified Assets Delivered</p>
          </div>
        </div>
      </div>
    </section>
  );
};
