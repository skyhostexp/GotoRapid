import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  ShoppingCart, 
  Headphones, 
  SearchCheck, 
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Lock
} from 'lucide-react';
import { Currency, ProductCategory } from '../types';
import { CURRENCY_RATES } from '../utils/formatters';

interface NavbarProps {
  currentCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrderTracker: () => void;
  onOpenLiveSupport: () => void;
  onOpenSearch: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCategory,
  onSelectCategory,
  currency,
  onCurrencyChange,
  cartCount,
  onOpenCart,
  onOpenOrderTracker,
  onOpenLiveSupport,
  onOpenSearch,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Services' },
    { id: 'bank-accounts', label: 'Bank Accounts' },
    { id: 'crypto-accounts', label: 'Crypto Accounts' },
    { id: 'smm-accounts', label: 'SMM Accounts' },
    { id: 'smm-services', label: 'SMM Services' },
    { id: 'reviews-services', label: 'Reviews Service' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-md">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border-b border-emerald-500/20 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-emerald-400">gotorapid.com Agency</span>
            <span className="hidden sm:inline text-slate-400">• Instant 15-Min Delivery • 100% Replacement Warranty • 24/7 Escrow</span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              id="track-order-top-btn"
              onClick={onOpenOrderTracker}
              className="flex items-center space-x-1 text-slate-300 hover:text-emerald-400 transition cursor-pointer"
            >
              <SearchCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Track Order</span>
            </button>
            <span className="text-slate-700">|</span>
            <button 
              id="support-top-btn"
              onClick={onOpenLiveSupport}
              className="flex items-center space-x-1 text-slate-300 hover:text-emerald-400 transition cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5 text-cyan-400" />
              <span>24/7 Concierge</span>
            </button>
            {onOpenAdmin && (
              <>
                <span className="text-slate-700 hidden sm:inline">|</span>
                <button
                  id="admin-portal-top-btn"
                  onClick={onOpenAdmin}
                  className="hidden sm:flex items-center space-x-1 text-slate-400 hover:text-emerald-300 transition cursor-pointer font-mono text-[11px]"
                  title="Admin Order Management"
                >
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Admin</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onSelectCategory('all'); }}
              className="flex items-center space-x-2.5 group"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-cyan-400 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition">
                <div className="h-full w-full rounded-xl bg-[#0d1424] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400 group-hover:scale-110 transition duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">GoTo<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Rapid</span></span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">.com</span>
                </div>
                <span className="text-[11px] tracking-wider text-slate-400 font-medium uppercase">Digital Products Agency</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`nav-link-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  currentCategory === cat.id
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>

          {/* Action buttons & Utilities */}
          <div className="flex items-center space-x-3">
            {/* Search Trigger */}
            <button
              id="search-trigger-btn"
              onClick={onOpenSearch}
              className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
              title="Search digital assets & services"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                id="currency-selector-btn"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-slate-700 transition cursor-pointer"
              >
                <span className="text-emerald-400 font-mono">
                  {currency === 'USDT' ? '₮' : CURRENCY_RATES[currency].symbol}
                </span>
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {(Object.keys(CURRENCY_RATES) as Currency[]).map((cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        onCurrencyChange(cur);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition cursor-pointer ${
                        currency === cur ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300'
                      }`}
                    >
                      <span>{cur}</span>
                      <span className="font-mono text-slate-400">
                        {cur === 'USDT' ? '₮' : CURRENCY_RATES[cur].symbol}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 transition duration-200 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-emerald-950 text-xs font-black animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0d1424] px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider px-2 py-1">
            Service Categories
          </div>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                currentCategory === cat.id
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            <button
              onClick={() => {
                onOpenOrderTracker();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200"
            >
              <span className="flex items-center space-x-2">
                <SearchCheck className="w-4 h-4 text-emerald-400" />
                <span>Track Order</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">GR-XXXX</span>
            </button>

            <button
              onClick={() => {
                onOpenLiveSupport();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200"
            >
              <span className="flex items-center space-x-2">
                <Headphones className="w-4 h-4 text-cyan-400" />
                <span>24/7 Concierge Support</span>
              </span>
              <span className="text-xs text-emerald-400 font-bold">Online</span>
            </button>

            {onOpenAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-300 hover:text-emerald-400"
              >
                <span className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Admin Order Console</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Staff</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
