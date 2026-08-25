import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { MOCK_LIVE_TICKER_ORDERS } from '../data/mockOrders';
import { Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface LiveOrderTickerProps {
  currency: Currency;
  onTrackOrderClick: (orderId: string) => void;
}

export const LiveOrderTicker: React.FC<LiveOrderTickerProps> = ({
  currency,
  onTrackOrderClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_LIVE_TICKER_ORDERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const order = MOCK_LIVE_TICKER_ORDERS[currentIndex];

  return (
    <div className="bg-[#080d18] border-b border-slate-800/80 py-2 px-4 text-xs overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1 inline-block"></span>
            Live Vault Dispatch Ticker
          </span>
        </div>

        {/* Animated Item */}
        <div className="flex items-center space-x-2 text-slate-300 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-slate-500 font-mono">[{order.orderNumber}]</span>
          <span>{order.flag}</span>
          <span className="text-white font-bold">{order.productName}</span>
          <span className="text-emerald-400 font-mono font-bold">
            ({formatPrice(order.amountUsd, currency)})
          </span>
          <span className="text-slate-500">• {order.timeAgo}</span>
          <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-0.5 inline" /> {order.status}
          </span>
        </div>

        {/* Fast Action */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={() => onTrackOrderClick(order.orderNumber)}
            className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center space-x-0.5 cursor-pointer"
          >
            <span>Verify Proof</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
