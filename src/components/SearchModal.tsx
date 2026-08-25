import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { Product, Currency } from '../types';
import { PRODUCTS } from '../data/products';
import { formatPrice } from '../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  currency,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return PRODUCTS.slice(0, 6);
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.features.some((f) => f.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        id="search-modal-container"
        className="w-full max-w-2xl bg-[#0d1424] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="relative p-4 border-b border-slate-800 bg-slate-900/90 flex items-center">
          <Search className="w-5 h-5 text-emerald-400 absolute left-6" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bank accounts, crypto exchanges, aged accounts, reviews..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white absolute right-6"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-6 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center space-x-2 text-xs text-slate-400 overflow-x-auto scrollbar-none">
          <span className="shrink-0 font-semibold">Popular:</span>
          {['Wise', 'Binance Plus', 'Aged Instagram', 'Trustpilot Reviews', 'Mercury LLC', 'TikTok Monetized'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition text-[11px] whitespace-nowrap cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {searchResults.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No matching assets or services found for "{query}".
            </div>
          ) : (
            searchResults.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/40 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {prod.categoryLabel}
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                      {prod.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {prod.subtitle}
                  </p>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <div className="text-sm font-extrabold text-white font-mono">
                    {formatPrice(prod.priceUsd, currency)}
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center justify-end space-x-1">
                    <span>View Asset</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
