import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Check, 
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currency: Currency;
  onProceedToCheckout: (appliedDiscountPercent: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currency,
  onProceedToCheckout
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  const rawSubtotalUsd = cartItems.reduce(
    (sum, item) => sum + item.product.priceUsd * item.quantity, 
    0
  );

  const discountAmountUsd = (rawSubtotalUsd * discountPercent) / 100;
  const finalTotalUsd = rawSubtotalUsd - discountAmountUsd;

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    const code = promoCode.trim().toUpperCase();
    if (code === 'RAPID10' || code === 'WELCOME10') {
      setDiscountPercent(10);
      setPromoSuccess('10% Promo Code Applied!');
      setPromoError('');
    } else if (code === 'VIP20') {
      setDiscountPercent(20);
      setPromoSuccess('20% VIP Agency Discount Applied!');
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try "RAPID10"');
      setPromoSuccess('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="cart-drawer"
          className="w-screen max-w-md bg-[#0d1424] border-l border-slate-800 shadow-2xl flex flex-col justify-between text-slate-100"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Your Cart ({cartItems.length})</h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-300">Your cart is currently empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse our inventory of verified bank accounts, crypto exchanges, aged SMM accounts, and reviews packages.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition cursor-pointer"
                >
                  Browse Assets Catalog
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Selected Assets & Services</span>
                  <button 
                    onClick={onClearCart}
                    className="text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div 
                      key={item.product.id}
                      className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            {item.product.categoryLabel}
                          </span>
                          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {formatPrice(item.product.priceUsd, currency)} {item.product.unitLabel || ''}
                          </span>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.customRequirements && (
                        <div className="p-2 rounded-lg bg-slate-950 text-[11px] text-slate-400 border border-slate-800/80">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Target / Specs:</span>
                          <span className="text-slate-300 line-clamp-1">{item.customRequirements}</span>
                        </div>
                      )}

                      {/* Quantity & Item Subtotal */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-white text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-white font-mono text-sm">
                            {formatPrice(item.product.priceUsd * item.quantity, currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Box */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Have a Coupon or Agency Promo Code?</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. RAPID10"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono uppercase text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoSuccess && <span className="text-[11px] text-emerald-400 font-bold block">{promoSuccess}</span>}
                  {promoError && <span className="text-[11px] text-rose-400 font-bold block">{promoError}</span>}
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-900/95 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-200 font-bold">{formatPrice(rawSubtotalUsd, currency)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount ({discountPercent}%):</span>
                    <span className="font-mono">-{formatPrice(discountAmountUsd, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Automated 15-Min Vault Delivery:</span>
                  <span className="text-emerald-400 font-mono font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Replacement Warranty:</span>
                  <span className="text-amber-300 font-bold">30-90 Days Escrow</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Final Total:</span>
                  <span className="text-emerald-400 font-['Outfit'] font-mono">
                    {formatPrice(finalTotalUsd, currency)}
                  </span>
                </div>
              </div>

              <button
                id="drawer-checkout-btn"
                onClick={() => onProceedToCheckout(discountPercent)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Proceed to Instant Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
