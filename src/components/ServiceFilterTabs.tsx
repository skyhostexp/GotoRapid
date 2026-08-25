import React from 'react';
import { 
  Building2, 
  Coins, 
  Users, 
  TrendingUp, 
  Star, 
  Grid,
  Search,
  SlidersHorizontal,
  Globe
} from 'lucide-react';
import { ProductCategory } from '../types';
import { CATEGORIES_META } from '../data/products';

interface ServiceFilterTabsProps {
  currentCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRegion: string;
  onRegionChange: (r: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
  totalFilteredCount: number;
}

export const ServiceFilterTabs: React.FC<ServiceFilterTabsProps> = ({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  sortBy,
  onSortChange,
  totalFilteredCount
}) => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'bank-accounts': return Building2;
      case 'crypto-accounts': return Coins;
      case 'smm-accounts': return Users;
      case 'smm-services': return TrendingUp;
      case 'reviews-services': return Star;
      default: return Grid;
    }
  };

  const regions = [
    { value: 'all', label: 'All Jurisdictions 🌐' },
    { value: 'USA', label: 'USA 🇺🇸' },
    { value: 'UK', label: 'UK 🇬🇧' },
    { value: 'EU', label: 'EU / EEA 🇪🇺' },
    { value: 'Global', label: 'Global 🌍' }
  ];

  return (
    <div className="space-y-4">
      {/* Category Pills Slider */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_META.map((cat) => {
          const IconComp = getCategoryIcon(cat.id);
          const isActive = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`filter-tab-${cat.id}`}
              onClick={() => onSelectCategory(cat.id as ProductCategory)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-bold'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[11px] font-mono ${
                isActive ? 'bg-black/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filter Controls Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="catalog-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search assets (e.g., 'Wise', 'Binance', 'Aged Instagram', 'Trustpilot', 'TikTok')..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Region & Sort Selectors */}
        <div className="flex items-center space-x-2.5">
          {/* Region filter */}
          <div className="flex items-center space-x-1 bg-slate-950/80 border border-slate-800/90 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <select
              id="region-filter-select"
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {regions.map((r) => (
                <option key={r.value} value={r.value} className="bg-slate-900 text-slate-200">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-1 bg-slate-950/80 border border-slate-800/90 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <select
              id="sort-filter-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="popular" className="bg-slate-900 text-slate-200">Sort: Recommended</option>
              <option value="price-asc" className="bg-slate-900 text-slate-200">Price: Low to High</option>
              <option value="price-desc" className="bg-slate-900 text-slate-200">Price: High to Low</option>
              <option value="rating" className="bg-slate-900 text-slate-200">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter result notice */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <span className="text-emerald-400 font-bold font-mono">{totalFilteredCount}</span> digital products & agency services
        </div>
        {searchQuery && (
          <div>
            Filtered by query: <span className="text-white font-semibold">"{searchQuery}"</span>
          </div>
        )}
      </div>
    </div>
  );
};
