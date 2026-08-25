import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Send, 
  Lock, 
  ArrowUpRight, 
  Check, 
  Mail,
  Building2,
  Coins,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenOrderTracker: () => void;
  onOpenLiveSupport: () => void;
  onOpenCalculator: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenOrderTracker,
  onOpenLiveSupport,
  onOpenCalculator,
  onOpenAdmin
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#070b14] border-t border-slate-800/90 text-slate-400 text-xs">
      {/* Top Banner with Trust Badges */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-white font-bold text-sm flex items-center justify-center space-x-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Instant 15-Min Delivery</span>
            </div>
            <p className="text-slate-500 text-[11px]">Automated credentials vault generation</p>
          </div>

          <div className="space-y-1">
            <div className="text-white font-bold text-sm flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>100% Replacement Warranty</span>
            </div>
            <p className="text-slate-500 text-[11px]">30 to 90 days full escrow protection</p>
          </div>

          <div className="space-y-1">
            <div className="text-white font-bold text-sm flex items-center justify-center space-x-1.5">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Anti-Detect Fingerprints</span>
            </div>
            <p className="text-slate-500 text-[11px]">Residential IPs & session cookies</p>
          </div>

          <div className="space-y-1">
            <div className="text-white font-bold text-sm flex items-center justify-center space-x-1.5">
              <Send className="w-4 h-4 text-amber-400" />
              <span>24/7 Telegram Concierge</span>
            </div>
            <p className="text-slate-500 text-[11px]">Live technical staff always available</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-400 p-[1px]">
                <div className="h-full w-full rounded-xl bg-[#0d1424] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight font-['Outfit']">GoTo<span className="text-emerald-400">Rapid</span><span className="text-slate-400 text-xs">.com</span></span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Digital Products Agency</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The premier marketplace and growth agency for verified Bank Accounts, high-tier Crypto Exchange accounts, aged SMM profiles, non-drop SMM campaigns, and 5-Star Reviews.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="space-y-2 pt-1 max-w-sm">
              <span className="text-[11px] font-bold text-slate-300 block">Get Exclusive Private Restock Alerts:</span>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer"
                >
                  {subscribed ? 'Subscribed!' : 'Join'}
                </button>
              </div>
            </form>
          </div>

          {/* Core Services Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Agency Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('bank-accounts')}
                  className="hover:text-emerald-400 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Bank Accounts (Wise, Mercury)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('crypto-accounts')}
                  className="hover:text-emerald-400 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Coins className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Crypto Accounts (Binance, Bybit)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('smm-accounts')}
                  className="hover:text-emerald-400 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-pink-400" />
                  <span>SMM Accounts (Aged IG, X, TikTok)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('smm-services')}
                  className="hover:text-emerald-400 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SMM Growth Services</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('reviews-services')}
                  className="hover:text-emerald-400 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reviews Service (Trustpilot)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Tools & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Tools & Verification
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenOrderTracker}
                  className="hover:text-emerald-400 transition flex items-center space-x-1 cursor-pointer"
                >
                  <span>Track Order & Download Vault</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCalculator}
                  className="hover:text-emerald-400 transition flex items-center space-x-1 cursor-pointer"
                >
                  <span>Custom SMM Price Calculator</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLiveSupport}
                  className="hover:text-emerald-400 transition flex items-center space-x-1 cursor-pointer"
                >
                  <span>24/7 Concierge Support</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </button>
              </li>
              <li>
                <a
                  href="https://t.me/Go2Rapid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition flex items-center space-x-1 text-cyan-400 font-semibold"
                >
                  <span>Official Telegram (@Go2Rapid)</span>
                  <Send className="w-3 h-3" />
                </a>
              </li>
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-emerald-400 transition flex items-center space-x-1 text-slate-400 font-mono text-[11px] cursor-pointer pt-1"
                  >
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Admin Order Portal</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Accepted Payments & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>Crypto-Only Gateway</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap gap-1.5">
                {['USDT (TRC-20)', 'USDT (BEP-20)', 'Bitcoin (BTC)', 'Ethereum (ETH)', 'Solana (SOL)', 'TON (Telegram)', 'Litecoin (LTC)'].map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
                    {p}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 pt-2">
                100% Crypto Escrow Protected. Anonymous checkout, zero chargebacks, and instant automated 15-min vault generation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} gotorapid.com Digital Products Agency. All rights reserved.
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="hover:text-slate-400 cursor-pointer">Warranty Terms</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Anti-Detect Guidelines</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Escrow Policy</span>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button 
                  onClick={onOpenAdmin}
                  className="text-emerald-400 hover:text-emerald-300 font-mono flex items-center space-x-1 cursor-pointer"
                >
                  <Lock className="w-2.5 h-2.5" />
                  <span>Admin Console</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
