import React, { useState } from 'react';
import { 
  X, 
  SearchCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Download, 
  Key, 
  Copy, 
  Check, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { MOCK_VERIFICATION_ORDERS } from '../data/mockOrders';
import { OrderVerificationLookup } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = 'GR-9821'
}) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderId);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const foundOrder: OrderVerificationLookup = MOCK_VERIFICATION_ORDERS[orderQuery.toUpperCase()] || {
    orderId: orderQuery.toUpperCase() || 'GR-NEW',
    email: 'user***@gotorapid.com',
    status: 'Delivered',
    productName: 'Verified Digital Asset Package',
    category: 'Bank & Crypto Vault',
    date: '2026-08-16',
    deliveryVaultId: 'VAULT-AES256-DIRECT',
    proxyAssigned: 'Dedicated Residential IP (Port 8080)',
    warrantyValidUntil: '30 Days Active'
  };

  const steps = [
    { title: 'Payment Confirmed', desc: 'Crypto / Card escrow initialized', done: true },
    { title: 'Security & KYC Verification', desc: 'Identity scans and 2FA keys validated', done: true },
    { title: 'Anti-Detect Profile Bind', desc: 'Clean residential IP & cookie sync', done: true },
    { title: 'Encrypted Vault Generated', desc: '256-bit AES vault ready for download', done: true },
    { title: '30-Day Escrow Warranty Active', desc: 'Zero-risk technical replacement window', done: true }
  ];

  const handleCopyKey = () => {
    navigator.clipboard.writeText(`GOTORAPID-${foundOrder.orderId}-KEY-99420-AES256`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadVault = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="order-tracker-modal"
        className="relative w-full max-w-2xl flex flex-col rounded-3xl bg-[#0c1220] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <SearchCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-base font-bold text-white">GoToRapid Real-Time Order Verification</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Search bar for Order ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Enter Order Invoice / Vault ID:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="e.g. GR-9821, GR-9820, GR-9817"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => {}}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer"
              >
                Lookup
              </button>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                Order #{foundOrder.orderId}
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Status: {foundOrder.status}</span>
              </span>
            </div>

            <div className="text-sm font-bold text-white">
              {foundOrder.productName}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Registered To</span>
                <span className="font-mono">{foundOrder.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Proxy Subnet</span>
                <span className="font-mono text-cyan-300 text-[11px]">{foundOrder.proxyAssigned}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Escrow Warranty</span>
                <span className="font-mono text-amber-300">{foundOrder.warrantyValidUntil}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Vault Dispatch ID</span>
                <span className="font-mono text-slate-400 text-[11px]">{foundOrder.deliveryVaultId}</span>
              </div>
            </div>
          </div>

          {/* 5-Step Fulfillment Progress */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Fulfillment & Security Timeline:
            </h4>
            <div className="space-y-2.5">
              {steps.map((st, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{st.title}</div>
                    <div className="text-[11px] text-slate-400">{st.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Vault Download Box */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Private Master Decryption Key</span>
              </div>
              <button
                onClick={handleCopyKey}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Key'}</span>
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 select-all break-all border border-emerald-500/20">
              GOTORAPID-{foundOrder.orderId}-KEY-99420-AES256
            </div>

            <button
              onClick={handleDownloadVault}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'Downloaded Encrypted Vault Archive!' : 'Download Credentials & Anti-Detect Profile (.ZIP)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
