import React, { useState, useEffect, useMemo } from 'react';
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
  ExternalLink,
  ShieldAlert,
  FileCode2,
  Terminal,
  RotateCcw
} from 'lucide-react';
import { MOCK_VERIFICATION_ORDERS } from '../data/mockOrders';
import { OrderVerificationLookup } from '../types';
import { getStoredOrders, AdminOrder } from '../utils/orderStorage';

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
  const [allStoredOrders, setAllStoredOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    if (isOpen) {
      setAllStoredOrders(getStoredOrders());
      if (initialOrderId) {
        setOrderQuery(initialOrderId);
      }
    }
  }, [isOpen, initialOrderId]);

  // Find matching order in stored orders or mock lookup table
  const foundOrderData = useMemo(() => {
    const query = orderQuery.trim().toUpperCase();
    if (!query) return null;

    // 1. Search in localStorage Admin Orders
    const storedMatch = allStoredOrders.find(
      (o) =>
        o.id.toUpperCase() === query ||
        o.orderNumber.toUpperCase() === query ||
        o.deliveryVaultId.toUpperCase() === query ||
        o.customerEmail.toUpperCase() === query ||
        (o.telegramUsername && o.telegramUsername.toUpperCase() === query)
    );

    if (storedMatch) {
      const itemsTitle = storedMatch.items.map((i) => `${i.quantity}x ${i.productName}`).join(' + ');
      return {
        orderId: storedMatch.orderNumber || storedMatch.id,
        email: storedMatch.customerEmail,
        status: storedMatch.status,
        productName: itemsTitle,
        category: storedMatch.items[0]?.category || 'Digital Asset',
        date: storedMatch.createdAt ? storedMatch.createdAt.split('T')[0] : '2026-08-20',
        deliveryVaultId: storedMatch.deliveryVaultId,
        proxyAssigned: storedMatch.proxyAssigned || 'Dedicated Residential Static Proxy (Port 8443)',
        warrantyValidUntil: storedMatch.warrantyValidUntil ? `Active until ${storedMatch.warrantyValidUntil}` : `${storedMatch.warrantyDays} Days Active`,
        masterDecryptionKey: storedMatch.masterDecryptionKey,
        totalUsd: storedMatch.totalUsd,
        cryptoAmount: storedMatch.cryptoAmount,
        cryptoCoin: storedMatch.cryptoCoin,
        txHash: storedMatch.txHash,
        adminNotes: storedMatch.adminNotes
      };
    }

    // 2. Search in mock orders
    const mockMatch = MOCK_VERIFICATION_ORDERS[query];
    if (mockMatch) {
      return {
        orderId: mockMatch.orderId,
        email: mockMatch.email,
        status: mockMatch.status as AdminOrder['status'],
        productName: mockMatch.productName,
        category: mockMatch.category,
        date: mockMatch.date,
        deliveryVaultId: mockMatch.deliveryVaultId,
        proxyAssigned: mockMatch.proxyAssigned,
        warrantyValidUntil: mockMatch.warrantyValidUntil,
        masterDecryptionKey: `GOTORAPID-${mockMatch.orderId}-VAULT-KEY-AES256`,
        totalUsd: 260,
        cryptoAmount: '260.00 USDT',
        cryptoCoin: 'TRX',
        txHash: '0x991823abf1092471829471928410294810294810294810294810294810294812',
        adminNotes: 'Automated escrow verification passed.'
      };
    }

    return null;
  }, [orderQuery, allStoredOrders]);

  if (!isOpen) return null;

  const currentStatus = foundOrderData?.status || 'Pending Verification';

  const steps = [
    { 
      title: '1. Crypto Escrow Payment Received', 
      desc: foundOrderData ? `${foundOrderData.cryptoAmount || 'Cryptocurrency'} locked in smart escrow` : 'Blockchain transaction broadcast & verified', 
      done: true 
    },
    { 
      title: '2. Identity Verification & Anti-Detect Profiling', 
      desc: 'Security scan, 2FA generation & residential cookie pairing', 
      done: currentStatus !== 'Pending Verification' 
    },
    { 
      title: '3. Encrypted Vault Sealed (AES-256)', 
      desc: 'Private credentials sealed in offline cryptographic container', 
      done: currentStatus === 'Processing Vault' || currentStatus === 'Delivered' || currentStatus === 'Completed' 
    },
    { 
      title: '4. Vault Dispatched to Buyer', 
      desc: 'Master decryption key activated and download enabled', 
      done: currentStatus === 'Delivered' || currentStatus === 'Completed' 
    },
    { 
      title: '5. 30-Day Escrow Warranty Protection', 
      desc: foundOrderData?.warrantyValidUntil || 'Zero-risk technical replacement window active', 
      done: currentStatus === 'Delivered' || currentStatus === 'Completed' 
    }
  ];

  const handleCopyKey = () => {
    if (!foundOrderData) return;
    navigator.clipboard.writeText(foundOrderData.masterDecryptionKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadVault = () => {
    if (!foundOrderData) return;
    setDownloadSuccess(true);

    const vaultContent = `=====================================================
GOTORAPID.COM - ENCRYPTED ASSET DELIVERY PACKAGE
=====================================================
ORDER INVOICE ID   : #${foundOrderData.orderId}
PRODUCT DELIVERED  : ${foundOrderData.productName}
CATEGORY           : ${foundOrderData.category}
REGISTRATION EMAIL : ${foundOrderData.email}
STATUS             : ${foundOrderData.status}
TIMESTAMP          : ${foundOrderData.date}
ESCROW WARRANTY    : ${foundOrderData.warrantyValidUntil}

-----------------------------------------------------
SECURITY CREDENTIALS & ACCESS KEYS
-----------------------------------------------------
VAULT CONTAINER ID : ${foundOrderData.deliveryVaultId}
MASTER AES-256 KEY : ${foundOrderData.masterDecryptionKey}
ASSIGNED PROXY     : ${foundOrderData.proxyAssigned}
TRANSACTION TXID   : ${foundOrderData.txHash || 'Verified On-Chain'}

-----------------------------------------------------
ANTI-DETECT & QUICK-START INSTRUCTIONS
-----------------------------------------------------
1. Launch your anti-detect browser (AdsPower / Dolphin{anty} / Multilogin).
2. Configure a new profile using the Dedicated Residential Proxy assigned above.
3. Import the session cookies and 2FA seed provided in your secured vault.
4. Verify your account balance and KYC Tier.
5. All assets are protected under GoToRapid's 30-Day Escrow Replacement Warranty.

OFFICIAL SUPPORT TELEGRAM : @Go2Rapid
OFFICIAL CONCIERGE EMAIL   : support@gotorapid.com
=====================================================`;

    const blob = new Blob([vaultContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gotorapid-vault-${foundOrderData.orderId}-credentials.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="order-tracker-modal"
        className="relative w-full max-w-2xl flex flex-col rounded-3xl bg-[#0c1220] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100 max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <SearchCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-base font-bold text-white font-['Outfit']">GoToRapid Real-Time Order Verification</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Search bar for Order ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Enter Order Invoice / Vault ID / Email:
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
                type="button"
                onClick={() => setAllStoredOrders(getStoredOrders())}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer flex items-center space-x-1"
              >
                <SearchCheck className="w-3.5 h-3.5" />
                <span>Lookup</span>
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-400">
              <span>Quick View:</span>
              {['GR-9821', 'GR-9820', 'GR-9819', 'GR-9818', 'GR-9817'].map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setOrderQuery(id)}
                  className={`px-2 py-0.5 rounded-md font-mono text-[10px] border transition cursor-pointer ${
                    orderQuery.toUpperCase() === id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  #{id}
                </button>
              ))}
            </div>
          </div>

          {foundOrderData ? (
            <>
              {/* Order Details Card */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    Order #{foundOrderData.orderId}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center space-x-1 ${
                    foundOrderData.status === 'Delivered' || foundOrderData.status === 'Completed'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : foundOrderData.status === 'Escrow Locked'
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Status: {foundOrderData.status}</span>
                  </span>
                </div>

                <div className="text-sm font-bold text-white">
                  {foundOrderData.productName}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Registered Email</span>
                    <span className="font-mono text-slate-200">{foundOrderData.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Proxy Subnet</span>
                    <span className="font-mono text-cyan-300 text-[11px] truncate block">{foundOrderData.proxyAssigned}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Escrow Warranty</span>
                    <span className="font-mono text-amber-300">{foundOrderData.warrantyValidUntil}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Vault Container</span>
                    <span className="font-mono text-slate-300 text-[11px] truncate block">{foundOrderData.deliveryVaultId}</span>
                  </div>
                </div>

                {foundOrderData.txHash && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-slate-500">TXID:</span>
                    <span className="font-mono text-slate-300 truncate max-w-xs">{foundOrderData.txHash}</span>
                  </div>
                )}
              </div>

              {/* 5-Step Fulfillment Progress */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Fulfillment & Security Timeline:
                </h4>
                <div className="space-y-2">
                  {steps.map((st, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-start space-x-3 p-2.5 rounded-xl border transition ${
                        st.done 
                          ? 'bg-slate-950/80 border-slate-800 text-white' 
                          : 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className={`p-1 rounded-full mt-0.5 ${st.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                        {st.done ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{st.title}</div>
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
                    type="button"
                    onClick={handleCopyKey}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer font-semibold"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Key'}</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 select-all break-all border border-emerald-500/20 font-bold">
                  {foundOrderData.masterDecryptionKey}
                </div>

                <button
                  type="button"
                  onClick={handleDownloadVault}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadSuccess ? 'Downloaded Credentials Package (.TXT)!' : 'Download Credentials & Anti-Detect Profile'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 px-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Order Found Matching "{orderQuery}"</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Please double check your Order ID (e.g. <span className="text-emerald-400 font-mono">GR-9821</span>) or verify using the email address entered during checkout.
              </p>
              <button
                type="button"
                onClick={() => setOrderQuery('GR-9821')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer"
              >
                Reset to Sample Order #GR-9821
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
