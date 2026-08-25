import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  FileCheck, 
  Check, 
  Zap, 
  Lock, 
  AlertCircle, 
  ShoppingCart, 
  Star,
  Globe,
  Building2,
  Coins,
  Users,
  TrendingUp,
  DownloadCloud
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface ProductDetailsModalProps {
  product: Product | null;
  currency: Currency;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, customNotes?: string) => void;
  onInstantBuy: (product: Product, quantity: number, customNotes?: string) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  currency,
  isOpen,
  onClose,
  onAddToCart,
  onInstantBuy
}) => {
  const [quantity, setQuantity] = useState(1);
  const [customNotes, setCustomNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'specs' | 'docs' | 'safety' | 'warmup'>('specs');

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, customNotes);
    onClose();
  };

  const handleInstantBuy = () => {
    onInstantBuy(product, quantity, customNotes);
    onClose();
  };

  const totalPrice = product.priceUsd * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="product-details-modal"
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0d1424] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {product.categoryLabel}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {product.id}
            </span>
          </div>

          <button
            id="close-product-details-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Info Hero */}
          <div>
            <div className="flex items-center space-x-2 text-xs text-amber-400 mb-1 font-semibold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{product.rating.toFixed(1)} / 5.0 Rating ({product.reviewCount} Verified Customer Reviews)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              {product.name}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Delivery Speed</span>
              <div className="flex items-center space-x-1.5 mt-1 text-emerald-400 font-bold text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{product.deliveryTime}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Jurisdiction</span>
              <div className="flex items-center space-x-1.5 mt-1 text-cyan-400 font-bold text-xs">
                <Globe className="w-3.5 h-3.5" />
                <span>{product.region}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Warranty Period</span>
              <div className="flex items-center space-x-1.5 mt-1 text-amber-400 font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{product.warrantyDays} Days Replacement</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Trust & Safety</span>
              <div className="flex items-center space-x-1.5 mt-1 text-purple-400 font-bold text-xs font-mono">
                <Lock className="w-3.5 h-3.5" />
                <span>{product.safetyScore}% Clean Score</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-800 flex space-x-4">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'specs' 
                  ? 'border-emerald-400 text-emerald-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Key Capabilities
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'docs' 
                  ? 'border-emerald-400 text-emerald-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Included Documents ({product.documentsIncluded.length})
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'safety' 
                  ? 'border-emerald-400 text-emerald-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Anti-Detect & Security
            </button>
            {product.warmupGuideIncluded && (
              <button
                onClick={() => setActiveTab('warmup')}
                className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                  activeTab === 'warmup' 
                    ? 'border-emerald-400 text-emerald-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Warmup Manual
              </button>
            )}
          </div>

          {/* Tab Panes */}
          {activeTab === 'specs' && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Verified Technical Features:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Encrypted Vault Contents Provided Upon Instant Delivery:
              </h4>
              <div className="space-y-2">
                {product.documentsIncluded.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                    <FileCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs text-slate-200 font-medium">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>GoToRapid Anti-Detect Guarantee</span>
                </div>
                <p>
                  Every account is initialized through isolated hardware fingerprints and high-reputation static residential proxy subnets. We export ready-to-import profiles for Dolphin{'{'}anty{'}'}, AdsPower, Multilogin, or GoLogin.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <span className="font-bold text-white block">Escrow & Replacement Protocol:</span>
                <p className="text-slate-400">
                  Payment is held in automated escrow until you verify your credentials within 24 hours. Full 30 to 90-day replacement warranty if any algorithmic flag occurs under standard warmup rules.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'warmup' && (
            <div className="space-y-2.5">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-emerald-400 block">Recommended First 48-Hour Warmup Rules:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Import the provided anti-detect browser JSON profile before logging in.</li>
                  <li>Do not change primary email or master password for the first 24 hours.</li>
                  <li>Perform 1-2 small test interactions/transactions before scaling volume.</li>
                  <li>Always keep 2FA authenticator seeds stored in a safe offline vault.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Target link / Custom requirements field */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              {product.isService 
                ? 'Target Profile Link, Video URL or Review Instructions (Optional):' 
                : 'Special Delivery Instructions / Telegram Username (Optional):'}
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder={product.isService ? 'e.g. https://instagram.com/mybrand or https://trustpilot.com/review/...' : 'e.g. Deliver backup via Telegram @myhandle'}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/95 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Price</span>
              <div className="text-2xl font-black text-white font-['Outfit']">
                {formatPrice(totalPrice, currency)}
              </div>
            </div>

            {/* Quantity Controller */}
            <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-mono font-bold text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              id="modal-add-cart-btn"
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              id="modal-instant-buy-btn"
              onClick={handleInstantBuy}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Instant Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
