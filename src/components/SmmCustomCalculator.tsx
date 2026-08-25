import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Check, 
  ShoppingCart, 
  Zap,
  Sliders,
  Globe
} from 'lucide-react';
import { Currency, Product } from '../types';
import { formatPrice } from '../utils/formatters';

interface SmmCustomCalculatorProps {
  currency: Currency;
  onAddCustomToCart: (product: Product, quantity: number, customNotes?: string) => void;
  onInstantBuyCustom: (product: Product, quantity: number, customNotes?: string) => void;
}

interface ServiceOption {
  id: string;
  name: string;
  category: 'smm-services' | 'reviews-services';
  categoryLabel: string;
  baseRateUsd: number; // rate per baseUnit
  baseUnit: number; // e.g. 1000 followers, or 10 reviews
  unitName: string;
  minUnits: number;
  maxUnits: number;
  step: number;
  iconName: string;
  defaultDrip: string;
  warrantyDays: number;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'custom-ig-followers',
    name: 'Instagram High-Retention Followers',
    category: 'smm-services',
    categoryLabel: 'SMM Service',
    baseRateUsd: 5.80, // $5.80 per 1,000
    baseUnit: 1000,
    unitName: 'Followers',
    minUnits: 1000,
    maxUnits: 100000,
    step: 1000,
    iconName: 'Instagram',
    defaultDrip: 'Natural 1,000/day Drip',
    warrantyDays: 365
  },
  {
    id: 'custom-tiktok-views',
    name: 'TikTok High-Retention Video Views & FYP Push',
    category: 'smm-services',
    categoryLabel: 'SMM Service',
    baseRateUsd: 2.20, // $2.20 per 10,000
    baseUnit: 10000,
    unitName: 'Views',
    minUnits: 10000,
    maxUnits: 1000000,
    step: 10000,
    iconName: 'Video',
    defaultDrip: 'Instant Algorithmic Spike',
    warrantyDays: 90
  },
  {
    id: 'custom-yt-watchtime',
    name: 'YouTube Public Watch-Time Hours (YPP Compliant)',
    category: 'smm-services',
    categoryLabel: 'SMM Service',
    baseRateUsd: 35.00, // $35 per 1,000 hours
    baseUnit: 1000,
    unitName: 'Hours',
    minUnits: 1000,
    maxUnits: 4000,
    step: 500,
    iconName: 'Play',
    defaultDrip: '24-72h Gradual Watch Sessions',
    warrantyDays: 90
  },
  {
    id: 'custom-twitter-impressions',
    name: 'X / Twitter Tweet Retweets & Algorithmic Impressions',
    category: 'smm-services',
    categoryLabel: 'SMM Service',
    baseRateUsd: 11.00, // $11 per 10,000 impressions
    baseUnit: 10000,
    unitName: 'Impressions',
    minUnits: 10000,
    maxUnits: 500000,
    step: 10000,
    iconName: 'Twitter',
    defaultDrip: 'Paced Campaign Delivery',
    warrantyDays: 60
  },
  {
    id: 'custom-trustpilot-reviews',
    name: 'Trustpilot 5-Star Verified Buyer Reviews',
    category: 'reviews-services',
    categoryLabel: 'Reviews Service',
    baseRateUsd: 12.00, // $12 per single review
    baseUnit: 1,
    unitName: 'Verified Reviews',
    minUnits: 5,
    maxUnits: 200,
    step: 5,
    iconName: 'Star',
    defaultDrip: 'Natural 1-2 Reviews/Day',
    warrantyDays: 60
  },
  {
    id: 'custom-google-maps-reviews',
    name: 'Google Maps Local 5-Star Reviews (Local Guides Lvl 4-8)',
    category: 'reviews-services',
    categoryLabel: 'Reviews Service',
    baseRateUsd: 9.50, // $9.50 per review
    baseUnit: 1,
    unitName: 'Local Guide Reviews',
    minUnits: 5,
    maxUnits: 200,
    step: 5,
    iconName: 'MapPin',
    defaultDrip: 'Drip-Fed 2 Reviews/Day',
    warrantyDays: 90
  },
  {
    id: 'custom-app-store-reviews',
    name: 'iOS App Store & Google Play Ratings + Keyword Installs',
    category: 'reviews-services',
    categoryLabel: 'Reviews Service',
    baseRateUsd: 6.00, // $6 per rating/review
    baseUnit: 1,
    unitName: 'App Store Reviews',
    minUnits: 10,
    maxUnits: 500,
    step: 10,
    iconName: 'Smartphone',
    defaultDrip: 'Paced Device Installs',
    warrantyDays: 60
  }
];

export const SmmCustomCalculator: React.FC<SmmCustomCalculatorProps> = ({
  currency,
  onAddCustomToCart,
  onInstantBuyCustom
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICE_OPTIONS[0].id);
  const selectedService = SERVICE_OPTIONS.find(s => s.id === selectedServiceId) || SERVICE_OPTIONS[0];
  
  const [quantity, setQuantity] = useState<number>(selectedService.minUnits * 2);
  const [pacingSpeed, setPacingSpeed] = useState<'standard' | 'express' | 'stealth'>('standard');
  const [targetLink, setTargetLink] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [geoTarget, setGeoTarget] = useState<string>('USA 🇺🇸 & Global');

  // Handle service change
  const handleServiceChange = (id: string) => {
    setSelectedServiceId(id);
    const s = SERVICE_OPTIONS.find(x => x.id === id);
    if (s) {
      setQuantity(s.minUnits);
    }
  };

  // Calculate pricing
  const rawPriceUsd = (quantity / selectedService.baseUnit) * selectedService.baseRateUsd;
  
  // Volume Discount logic
  let discountPercent = 0;
  if (rawPriceUsd >= 200) {
    discountPercent = 20;
  } else if (rawPriceUsd >= 80) {
    discountPercent = 10;
  } else if (rawPriceUsd >= 40) {
    discountPercent = 5;
  }

  const finalPriceUsd = Math.round(rawPriceUsd * (1 - discountPercent / 100));

  const createCustomProduct = (): Product => {
    return {
      id: `custom-${selectedService.id}-${quantity}`,
      name: `Custom Order: ${quantity.toLocaleString()} ${selectedService.unitName} (${selectedService.name})`,
      category: selectedService.category,
      categoryLabel: selectedService.categoryLabel,
      subtitle: `${pacingSpeed.toUpperCase()} Pacing • ${geoTarget} • ${selectedService.warrantyDays}D Non-Drop Warranty`,
      priceUsd: finalPriceUsd,
      originalPriceUsd: discountPercent > 0 ? Math.round(rawPriceUsd) : undefined,
      unitLabel: `/ ${quantity.toLocaleString()} ${selectedService.unitName}`,
      rating: 5.0,
      reviewCount: 99,
      inStock: true,
      stockCount: 999,
      deliveryTime: pacingSpeed === 'express' ? 'Starts in 5 Mins (Fast)' : 'Natural Drip-Feed Scheduled',
      region: geoTarget,
      verificationLevel: 'Tier 1',
      badge: 'Hot',
      iconName: selectedService.iconName,
      shortDescription: `Custom configured package for ${selectedService.name}.`,
      description: `Tailored order for ${quantity.toLocaleString()} ${selectedService.unitName}. Target: ${targetLink || 'Will provide via Telegram/Email'}. Instructions: ${customInstructions || 'Standard optimal algorithm distribution'}.`,
      features: [
        `${quantity.toLocaleString()} HQ ${selectedService.unitName} delivered via residential IP nodes`,
        `${selectedService.warrantyDays}-Day Non-Drop Replacement Guarantee`,
        `Delivery Pacing: ${pacingSpeed === 'stealth' ? 'Stealth Ultra-Gradual' : pacingSpeed === 'express' ? 'High-Velocity Turbo' : 'Natural Organic Algorithm Curve'}`,
        `Geo-Targeting: ${geoTarget}`
      ],
      documentsIncluded: [
        'Live campaign dashboard tracker link',
        'Delivery completion verification report'
      ],
      safetyScore: 100,
      warrantyDays: selectedService.warrantyDays,
      warmupGuideIncluded: false,
      isService: true
    };
  };

  const handleAddToCart = () => {
    const customProd = createCustomProduct();
    const notes = `Target: ${targetLink || 'None provided'} | Notes: ${customInstructions || 'Default'}`;
    onAddCustomToCart(customProd, 1, notes);
  };

  const handleInstantBuy = () => {
    const customProd = createCustomProduct();
    const notes = `Target: ${targetLink || 'None provided'} | Notes: ${customInstructions || 'Default'}`;
    onInstantBuyCustom(customProd, 1, notes);
  };

  return (
    <section id="custom-calculator-section" className="py-12 border-b border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Custom Package Configurator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Custom SMM & Reviews Price Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Configure tailored follower counts, watch-time hours, or verified review drip campaigns with automatic bulk volume discounts.
          </p>
        </div>

        {/* Calculator Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0c1220] border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl">
          {/* Left Configuration Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Select Service */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                1. Choose Target Service:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SERVICE_OPTIONS.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => handleServiceChange(srv.id)}
                    className={`text-left p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      selectedServiceId === srv.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{srv.name}</span>
                      {selectedServiceId === srv.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      From ${srv.baseRateUsd} per {srv.baseUnit > 1 ? srv.baseUnit.toLocaleString() : 'unit'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Quantity Slider */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Select Quantity ({selectedService.unitName}):
                </label>
                <div className="text-lg font-black text-emerald-400 font-mono">
                  {quantity.toLocaleString()} <span className="text-xs text-slate-400 font-normal">{selectedService.unitName}</span>
                </div>
              </div>

              <input
                type="range"
                min={selectedService.minUnits}
                max={selectedService.maxUnits}
                step={selectedService.step}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Min: {selectedService.minUnits.toLocaleString()}</span>
                <span>Max: {selectedService.maxUnits.toLocaleString()}</span>
              </div>
            </div>

            {/* Step 3: Pacing & Geo Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  3. Delivery Pacing:
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setPacingSpeed('standard')}
                    className={`py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                      pacingSpeed === 'standard' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Natural Drip
                  </button>
                  <button
                    onClick={() => setPacingSpeed('express')}
                    className={`py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                      pacingSpeed === 'express' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Turbo Spike
                  </button>
                  <button
                    onClick={() => setPacingSpeed('stealth')}
                    className={`py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                      pacingSpeed === 'stealth' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Stealth (Slow)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  4. Audience Targeting:
                </label>
                <select
                  value={geoTarget}
                  onChange={(e) => setGeoTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="USA 🇺🇸 & Tier-1 Western">USA 🇺🇸 & Tier-1 Western</option>
                  <option value="United Kingdom 🇬🇧 & Europe 🇪🇺">United Kingdom 🇬🇧 & Europe 🇪🇺</option>
                  <option value="Global Worldwide 🌐 (Fastest)">Global Worldwide 🌐 (Fastest)</option>
                  <option value="Crypto & Tech Specific Niche">Crypto & Tech Specific Niche</option>
                </select>
              </div>
            </div>

            {/* Step 4: Target Link & Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                5. Target Profile / Post URL / Business Link:
              </label>
              <input
                type="text"
                value={targetLink}
                onChange={(e) => setTargetLink(e.target.value)}
                placeholder="e.g. https://instagram.com/myaccount or https://trustpilot.com/review/brand.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Right Summary & Price Breakdown Card */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-gradient-to-b from-slate-900 via-[#0e1628] to-[#0a101d] border border-emerald-500/30 p-6 shadow-xl space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Configured Package Summary</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {selectedService.warrantyDays}D Non-Drop
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mt-3">
                {selectedService.name}
              </h3>

              <div className="mt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Quantity:</span>
                  <span className="font-bold text-white font-mono">{quantity.toLocaleString()} {selectedService.unitName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pacing Mode:</span>
                  <span className="font-bold text-cyan-300 capitalize">{pacingSpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Audience:</span>
                  <span className="font-bold text-slate-200">{geoTarget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Safety Guarantee:</span>
                  <span className="font-bold text-emerald-400">100% Non-Drop Warranty</span>
                </div>
              </div>

              {/* Volume Discount Alert */}
              {discountPercent > 0 && (
                <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bulk Tier Discount Applied:</span>
                  </span>
                  <span className="font-mono font-black text-sm">-{discountPercent}% OFF</span>
                </div>
              )}
            </div>

            {/* Pricing Output */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Estimated Total Price:</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-white font-['Outfit']">
                      {formatPrice(finalPriceUsd, currency)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-sm text-slate-500 line-through">
                        {formatPrice(rawPriceUsd, currency)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                  Instant Dispatch
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="calc-add-cart-btn"
                  onClick={handleAddToCart}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  id="calc-instant-buy-btn"
                  onClick={handleInstantBuy}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Instant Buy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
