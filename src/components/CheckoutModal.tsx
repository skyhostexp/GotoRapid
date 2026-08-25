import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Coins, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Key, 
  Lock, 
  Sparkles,
  ArrowRight,
  Send,
  QrCode,
  Clock,
  ExternalLink,
  Wallet,
  AlertTriangle,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../utils/formatters';
import { addOrder } from '../utils/orderStorage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  discountPercent: number;
  onOrderSuccess: (orderId: string) => void;
}

export type CryptoCoin = 
  | 'USDT_TRC20' 
  | 'USDT_BEP20' 
  | 'USDT_ERC20' 
  | 'BTC' 
  | 'ETH' 
  | 'SOL' 
  | 'TON' 
  | 'LTC' 
  | 'USDC_SOL';

interface CryptoConfig {
  name: string;
  ticker: string;
  network: string;
  address: string;
  usdRate: number; // approximate rate for conversion
  decimals: number;
  badge?: string;
  color: string;
  iconBg: string;
  qrPayload: string;
}

const CRYPTO_CONFIGS: Record<CryptoCoin, CryptoConfig> = {
  USDT_TRC20: {
    name: 'Tether USD',
    ticker: 'USDT',
    network: 'TRON (TRC-20)',
    address: 'TX9rqK2jLm8gX7N4vP8Z1wQ3mB5yC7dE2A',
    usdRate: 1.0,
    decimals: 2,
    badge: 'Fastest & Zero Gas',
    color: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    qrPayload: 'tron:TX9rqK2jLm8gX7N4vP8Z1wQ3mB5yC7dE2A'
  },
  USDT_BEP20: {
    name: 'Tether USD',
    ticker: 'USDT',
    network: 'BNB Smart Chain (BEP-20)',
    address: '0x9a83B389148d42c8928A4739249b2c8928A47E5B',
    usdRate: 1.0,
    decimals: 2,
    badge: 'Lowest Fee',
    color: 'text-yellow-400',
    iconBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    qrPayload: '0x9a83B389148d42c8928A4739249b2c8928A47E5B'
  },
  USDT_ERC20: {
    name: 'Tether USD',
    ticker: 'USDT',
    network: 'Ethereum (ERC-20)',
    address: '0x71C49b2c8928A47392a83B389148d428A4739249',
    usdRate: 1.0,
    decimals: 2,
    color: 'text-cyan-400',
    iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    qrPayload: 'ethereum:0x71C49b2c8928A47392a83B389148d428A4739249'
  },
  BTC: {
    name: 'Bitcoin',
    ticker: 'BTC',
    network: 'Bitcoin Native SegWit',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    usdRate: 96500,
    decimals: 6,
    badge: 'Decentralized',
    color: 'text-amber-400',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    qrPayload: 'bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
  },
  ETH: {
    name: 'Ethereum',
    ticker: 'ETH',
    network: 'Ethereum Mainnet',
    address: '0x89D987349F279b47289d04F78248312987349F27',
    usdRate: 2750,
    decimals: 5,
    color: 'text-indigo-400',
    iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
    qrPayload: 'ethereum:0x89D987349F279b47289d04F78248312987349F27'
  },
  SOL: {
    name: 'Solana',
    ticker: 'SOL',
    network: 'Solana Mainnet-Beta',
    address: '7v91N4bL8Qp2x9wZ4mR5tK7dE2A89N4bL8Qp2x9wZ4mR',
    usdRate: 195,
    decimals: 4,
    badge: 'Instant 400ms',
    color: 'text-purple-400',
    iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    qrPayload: 'solana:7v91N4bL8Qp2x9wZ4mR5tK7dE2A89N4bL8Qp2x9wZ4mR'
  },
  TON: {
    name: 'The Open Network',
    ticker: 'TON',
    network: 'TON Mainnet (Telegram Wallet)',
    address: 'EQBvW8Z5huBkMJYdn3PCDpjuvuBp36OPFvJP2keAssGMTTHI',
    usdRate: 6.40,
    decimals: 3,
    badge: 'Telegram Wallet',
    color: 'text-sky-400',
    iconBg: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
    qrPayload: 'ton://transfer/EQBvW8Z5huBkMJYdn3PCDpjuvuBp36OPFvJP2keAssGMTTHI'
  },
  LTC: {
    name: 'Litecoin',
    ticker: 'LTC',
    network: 'Litecoin Network',
    address: 'ltc1q9x287h2k93kflq298sdmfnq928120302mfnq92',
    usdRate: 98,
    decimals: 4,
    color: 'text-slate-300',
    iconBg: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    qrPayload: 'litecoin:ltc1q9x287h2k93kflq298sdmfnq928120302mfnq92'
  },
  USDC_SOL: {
    name: 'USD Coin',
    ticker: 'USDC',
    network: 'Solana SPL',
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    usdRate: 1.0,
    decimals: 2,
    color: 'text-blue-400',
    iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    qrPayload: 'solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
  }
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  discountPercent,
  onOrderSuccess
}) => {
  const [email, setEmail] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [txHash, setTxHash] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCoin>('USDT_TRC20');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15:00 countdown

  // Timer countdown for rate lock
  useEffect(() => {
    if (!isOpen || isSuccess) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  const rawSubtotalUsd = cartItems.reduce(
    (sum, item) => sum + item.product.priceUsd * item.quantity, 
    0
  );
  const discountAmountUsd = (rawSubtotalUsd * discountPercent) / 100;
  const finalTotalUsd = rawSubtotalUsd - discountAmountUsd;

  const currentCoin = CRYPTO_CONFIGS[selectedCrypto];
  const cryptoPayableAmount = (finalTotalUsd / currentCoin.usdRate).toFixed(currentCoin.decimals);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your delivery email address.');
      return;
    }

    setIsProcessing(true);
    const randomOrderNum = `GR-${Math.floor(1000 + Math.random() * 9000)}`;

    // Persist to Admin Order Management
    addOrder({
      id: randomOrderNum,
      orderNumber: randomOrderNum,
      customerEmail: email,
      telegramUsername: telegramHandle || undefined,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        category: item.product.categoryLabel,
        quantity: item.quantity,
        priceUsd: item.product.priceUsd,
        customRequirements: item.customRequirements
      })),
      totalUsd: finalTotalUsd,
      discountPercent: discountPercent,
      paymentMethod: 'Crypto',
      cryptoCoin: selectedCrypto,
      cryptoNetwork: currentCoin.network,
      cryptoAmount: `${cryptoPayableAmount} ${currentCoin.ticker}`,
      txHash: txHash || undefined,
      status: 'Escrow Locked',
      deliveryVaultId: `VAULT-${selectedCrypto.split('_')[0]}-${Math.floor(1000 + Math.random() * 9000)}-AES256`,
      masterDecryptionKey: `GOTORAPID-${randomOrderNum}-VAULT-KEY-AES256`,
      proxyAssigned: 'Dedicated Residential Static Proxy (Port 8443)',
      warrantyDays: cartItems[0]?.product.warrantyDays || 30,
      warrantyValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      adminNotes: txHash ? `Auto-detected TXID: ${txHash}` : 'Waiting on-chain transaction verification'
    });

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setGeneratedOrderId(randomOrderNum);
      onOrderSuccess(randomOrderNum);

      // Trigger confetti celebration
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 2200);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(currentCoin.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(cryptoPayableAmount);
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2500);
  };

  const handleCopyMasterKey = () => {
    navigator.clipboard.writeText(`GOTORAPID-${generatedOrderId}-VAULT-KEY-AES256`);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        id="crypto-checkout-modal"
        className="relative w-full max-w-2xl my-auto rounded-3xl bg-[#090e18] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[95vh]"
      >
        {/* Gateway Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-white font-['Outfit']">
                  {isSuccess ? 'Payment Confirmed & Vault Ready' : 'Crypto Escrow Payment Gateway'}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CRYPTO ONLY
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                100% Anonymous • Zero Chargeback Risk • Instant 15-Min Delivery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {isSuccess ? (
            /* Success State */
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  BLOCKCHAIN INVOICE #{generatedOrderId}
                </span>
                <h3 className="text-2xl font-black text-white mt-3 font-['Outfit']">
                  Payment Confirmed & Vault Dispatched!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
                  We have verified your on-chain crypto transaction and generated your encrypted credentials vault.
                </p>
              </div>

              {/* Delivery Destination Confirmation */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>Dispatched to Primary Delivery:</span>
                <strong className="text-emerald-400 font-mono">{email}</strong>
              </div>

              {/* Master Key Card */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                    <Key className="w-4 h-4" />
                    <span>Your Master AES-256 Vault Key:</span>
                  </span>
                  <button
                    onClick={handleCopyMasterKey}
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 break-all select-all border border-emerald-500/20">
                  GOTORAPID-{generatedOrderId}-VAULT-KEY-AES256
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 text-left space-y-1">
                <span className="font-bold block flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>30 to 90-Day Full Escrow Warranty Active</span>
                </span>
                <p className="text-slate-400 text-[11px]">
                  Your crypto payment is protected in automated escrow. If you have questions or require custom warmup assistance, message our 24/7 Telegram VIP desk quoting Order #{generatedOrderId}.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="https://t.me/Go2Rapid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-700"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Contact Telegram @Go2Rapid</span>
                </a>
                <button
                  onClick={() => {
                    alert(`Downloading encrypted credentials package for Order #${generatedOrderId}...`);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Credentials Vault (.ZIP)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Gateway Form */
            <form onSubmit={handleCompleteOrder} className="space-y-5">
              {/* Step 1: Select Cryptocurrency Coin & Network */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">1</span>
                    <span>Select Cryptocurrency & Network</span>
                  </h4>
                  <div className="flex items-center space-x-1 text-[11px] text-amber-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>Rate Lock: {formatTimer(timeLeft)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(CRYPTO_CONFIGS) as CryptoCoin[]).map((coinKey) => {
                    const coin = CRYPTO_CONFIGS[coinKey];
                    const isSelected = selectedCrypto === coinKey;
                    return (
                      <button
                        key={coinKey}
                        type="button"
                        onClick={() => setSelectedCrypto(coinKey)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between space-y-1 transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                            : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold font-mono ${coin.color}`}>
                            {coin.ticker}
                          </span>
                          {coin.badge && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-950 font-medium text-slate-300 border border-slate-800">
                              {coin.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {coin.network}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Payment Deposit Box (QR + Address + Amount) */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Payable Amount ({currentCoin.ticker}):
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                        {cryptoPayableAmount} {currentCoin.ticker}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        (≈ {formatPrice(finalTotalUsd, currency)})
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center space-x-1 transition cursor-pointer border border-slate-700"
                  >
                    {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedAmount ? 'Copied' : 'Copy Amount'}</span>
                  </button>
                </div>

                {/* QR Code & Deposit Address Layout */}
                <div className="flex flex-col sm:flex-row gap-3.5 items-center">
                  {/* Visual QR Code Card */}
                  <div className="p-2.5 rounded-xl bg-white text-slate-950 flex flex-col items-center justify-center shrink-0 shadow-md">
                    <svg
                      className="w-24 h-24 sm:w-28 sm:h-28"
                      viewBox="0 0 100 100"
                      fill="currentColor"
                    >
                      {/* Stylized QR Code Pattern */}
                      <rect x="0" y="0" width="30" height="30" rx="3" fill="#0c1220" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="9" y="9" width="12" height="12" fill="#0c1220" />

                      <rect x="70" y="0" width="30" height="30" rx="3" fill="#0c1220" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="79" y="9" width="12" height="12" fill="#0c1220" />

                      <rect x="0" y="70" width="30" height="30" rx="3" fill="#0c1220" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="9" y="79" width="12" height="12" fill="#0c1220" />

                      {/* Data dots matrix */}
                      <circle cx="45" cy="15" r="3" fill="#0c1220" />
                      <circle cx="55" cy="15" r="3" fill="#0c1220" />
                      <circle cx="40" cy="25" r="3" fill="#0c1220" />
                      <circle cx="60" cy="25" r="3" fill="#0c1220" />
                      <circle cx="45" cy="35" r="3" fill="#0c1220" />

                      <circle cx="15" cy="45" r="3" fill="#0c1220" />
                      <circle cx="25" cy="45" r="3" fill="#0c1220" />
                      <circle cx="35" cy="50" r="3" fill="#0c1220" />
                      <circle cx="50" cy="50" r="4" fill="#10b981" />
                      <circle cx="65" cy="50" r="3" fill="#0c1220" />
                      <circle cx="75" cy="45" r="3" fill="#0c1220" />
                      <circle cx="85" cy="45" r="3" fill="#0c1220" />

                      <circle cx="45" cy="65" r="3" fill="#0c1220" />
                      <circle cx="55" cy="65" r="3" fill="#0c1220" />
                      <circle cx="40" cy="75" r="3" fill="#0c1220" />
                      <circle cx="60" cy="75" r="3" fill="#0c1220" />
                      <circle cx="75" cy="75" r="3" fill="#0c1220" />
                      <circle cx="85" cy="85" r="3" fill="#0c1220" />
                      <circle cx="75" cy="95" r="3" fill="#0c1220" />
                    </svg>
                    <span className="text-[9px] font-bold text-slate-800 uppercase tracking-tight mt-1">
                      Scan in Wallet App
                    </span>
                  </div>

                  {/* Address Details */}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Network: <strong className="text-white">{currentCoin.network}</strong></span>
                      <span className="text-emerald-400 text-[11px] font-semibold flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Gateway Active</span>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Send to Official Escrow Address:</span>
                        <button
                          type="button"
                          onClick={handleCopyAddress}
                          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                          {copiedAddress ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedAddress ? 'Copied' : 'Copy Address'}</span>
                        </button>
                      </div>
                      <div className="font-mono text-xs text-emerald-300 break-all select-all font-semibold bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        {currentCoin.address}
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-tight">
                      ⚠️ Send only <strong className="text-white">{currentCoin.ticker}</strong> via <strong className="text-white">{currentCoin.network}</strong>. Sending via any other network will result in delay.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Delivery Information & TXID Verification */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">2</span>
                  <span>Delivery Destination & Transaction Verification</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">
                      Delivery Email Address <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. buyer@agency.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">
                      Telegram Username (Optional Backup)
                    </label>
                    <input
                      type="text"
                      value={telegramHandle}
                      onChange={(e) => setTelegramHandle(e.target.value)}
                      placeholder="e.g. @telegram_buyer"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    Transaction Hash / TXID / Sender Address (Optional for instant speedup)
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="e.g. 0x7f9a... or Tron tx hash"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Summary & Submit Button */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Due (Crypto):</span>
                    <span className="text-xl font-black text-emerald-400 font-['Outfit'] font-mono">
                      {cryptoPayableAmount} {currentCoin.ticker}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    ≈ {formatPrice(finalTotalUsd, currency)}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  id="confirm-crypto-payment-btn"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying On-Chain Mempool...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>I Have Sent Payment • Confirm Order</span>
                    </>
                  )}
                </button>
              </div>

              {/* Escrow Guarantee Disclaimer */}
              <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-1 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Protected by automated 24h Escrow Lock & 30-90 Day Replacement Warranty</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
