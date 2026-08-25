import React from 'react';
import { 
  Building2, 
  Coins, 
  Users, 
  TrendingUp, 
  Star, 
  Check, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Eye, 
  ShoppingCart,
  Zap,
  Globe
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice, calculateDiscount } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onAddToCart: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onAddToCart,
  onInstantBuy,
  onViewDetails
}) => {
  const discount = calculateDiscount(product.originalPriceUsd, product.priceUsd);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bank-accounts': return Building2;
      case 'crypto-accounts': return Coins;
      case 'smm-accounts': return Users;
      case 'smm-services': return TrendingUp;
      case 'reviews-services': return Star;
      default: return Zap;
    }
  };

  const IconComp = getCategoryIcon(product.category);

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Best Seller': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Hot': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Top Rated': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Instant Delivery': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-slate-900/95 via-[#0d1424]/95 to-[#0b101d]/95 border border-slate-800/90 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/40 p-5 glow-card"
    >
      {/* Top Header Row: Category Icon & Badges */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-emerald-400 group-hover:scale-105 transition">
              <IconComp className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {product.categoryLabel}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 flex-wrap justify-end">
            {product.badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(product.badge)}`}>
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Product Title & Subtitle */}
        <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {product.subtitle}
        </p>

        {/* Region & Verification Level Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/70 text-[11px]">
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>{product.region}</span>
          </span>

          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{product.verificationLevel}</span>
          </span>
        </div>

        {/* Key Features bullet points */}
        <div className="mt-3.5 space-y-1.5">
          {product.features.slice(0, 3).map((feat, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{feat}</span>
            </div>
          ))}
        </div>

        {/* Documents & Speed micro specs */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{product.deliveryTime}</span>
          </div>

          <div className="flex items-center space-x-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3 h-3" />
            <span>{product.warrantyDays}D Warranty</span>
          </div>
        </div>
      </div>

      {/* Bottom Pricing & Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-extrabold text-white font-['Outfit']">
                {formatPrice(product.priceUsd, currency)}
              </span>
              {product.originalPriceUsd && (
                <span className="text-xs text-slate-500 line-through">
                  {formatPrice(product.originalPriceUsd, currency)}
                </span>
              )}
            </div>
            {product.unitLabel && (
              <span className="text-[10px] text-slate-400 block font-medium">
                {product.unitLabel}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 text-xs">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
            <span className="text-slate-500 text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id={`btn-details-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Details</span>
          </button>

          <button
            id={`btn-add-cart-${product.id}`}
            onClick={() => onAddToCart(product)}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950 flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>

        <button
          id={`btn-instant-buy-${product.id}`}
          onClick={() => onInstantBuy(product)}
          className="mt-2 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>Instant Buy with Crypto / Card</span>
        </button>
      </div>
    </div>
  );
};
