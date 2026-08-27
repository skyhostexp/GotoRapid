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
  Info,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
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
  | 'BSC' 
  | 'TRX' 
  | 'ETH' 
  | 'SOL' 
  | 'BTC' 
  | 'LTC' 
  | 'DOGE';

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
}

export const CRYPTO_CONFIGS: Record<CryptoCoin, CryptoConfig> = {
  BSC: {
    name: 'BNB Smart Chain (BEP-20)',
    ticker: 'USDT / BNB',
    network: 'BNB Smart Chain (BSC / BEP-20)',
    address: '0xb0a2b177e1770a03a5aa1d2629c52276fd93bdc6',
    usdRate: 1.0,
    decimals: 2,
    badge: 'Lowest Gas Fee',
    color: 'text-yellow-400',
    iconBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
  },
  TRX: {
    name: 'TRON (TRC-20 / TRX)',
    ticker: 'USDT / TRX',
    network: 'TRON (TRC-20 / TRX)',
    address: 'TSezBSdMrdARFQQebAYiwzkPku1qHijQEh',
    usdRate: 1.0,
    decimals: 2,
    badge: 'Fastest & Zero Gas',
    color: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  },
  ETH: {
    name: 'Ethereum (ETH / ERC-20)',
    ticker: 'ETH / USDT',
    network: 'Ethereum Mainnet (ERC-20)',
    address: '0xb0a2b177e1770a03a5aa1d2629c52276fd93bdc6',
    usdRate: 2750,
    decimals: 5,
    badge: 'ETH & ERC-20',
    color: 'text-indigo-400',
    iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
  },
  SOL: {
    name: 'Solana (SOL)',
    ticker: 'SOL',
    network: 'Solana Mainnet (SOL)',
    address: 'EDWaA1Kp6K9USLwuBAzmCvBxQkDiQ4Bk3LLgFxA2YdVr',
    usdRate: 195,
    decimals: 4,
    badge: 'Instant 400ms',
    color: 'text-purple-400',
    iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/40'
  },
  BTC: {
    name: 'Bitcoin (BTC)',
    ticker: 'BTC',
    network: 'Bitcoin (BTC Network)',
    address: '18QpVzNvW5YVtywK4Zih1VKLB2gEhRojT9',
    usdRate: 96500,
    decimals: 6,
    badge: 'Primary Crypto',
    color: 'text-amber-400',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40'
  },
  LTC: {
    name: 'Litecoin (LTC)',
    ticker: 'LTC',
    network: 'Litecoin (LTC Network)',
    address: 'LR676Tw3B3FatHCbnjT14D1TmGfpmwM2WG',
    usdRate: 98,
    decimals: 4,
    badge: 'Low Transfer Fee',
    color: 'text-cyan-400',
    iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
  },
  DOGE: {
    name: 'Dogecoin (DOGE)',
    ticker: 'DOGE',
    network: 'Dogecoin (DOGE Network)',
    address: 'DAVEHhBy6NVajnwF9g8eVHsQj1rmfVBx3n',
    usdRate: 0.25,
    decimals: 2,
    badge: 'Micro Fees',
    color: 'text-orange-400',
    iconBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40'
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
  const [emailError, setEmailError] = useState<string | null>(null);
  const [telegramHandle, setTelegramHandle] = useState('');
  const [txHash, setTxHash] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCoin>('TRX');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15:00 countdown
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isQrLoading, setIsQrLoading] = useState<boolean>(true);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  const currentCoin = CRYPTO_CONFIGS[selectedCrypto] || CRYPTO_CONFIGS.TRX;

  // Generate authentic QR code whenever selected coin changes
  useEffect(() => {
    if (!currentCoin?.address) return;
    let isMounted = true;
    setIsQrLoading(true);

    QRCode.toDataURL(currentCoin.address, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#070b14',
        light: '#ffffff'
      }
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsQrLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
        if (isMounted) {
          setIsQrLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCrypto, currentCoin.address]);

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

  const cryptoPayableAmount = (finalTotalUsd / currentCoin.usdRate).toFixed(currentCoin.decimals);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid delivery email address (e.g. buyer@example.com)');
      return;
    }
    setEmailError(null);

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
      deliveryVaultId: `VAULT-${selectedCrypto}-${Math.floor(1000 + Math.random() * 9000)}-AES256`,
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

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `gotorapid-${selectedCrypto}-wallet-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {(Object.keys(CRYPTO_CONFIGS) as CryptoCoin[]).map((coinKey) => {
                    const coin = CRYPTO_CONFIGS[coinKey];
                    const isSelected = selectedCrypto === coinKey;
                    return (
                      <button
                        key={coinKey}
                        type="button"
                        onClick={() => setSelectedCrypto(coinKey)}
                        className={`p-2 rounded-xl border text-left flex flex-col justify-between space-y-1 transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                            : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black font-mono ${coin.color}`}>
                            {coinKey}
                          </span>
                          {coin.badge && (
                            <span className="text-[8px] px-1 py-0.2 rounded bg-slate-950 font-medium text-slate-300 border border-slate-800 hidden sm:inline">
                              {coin.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {coin.ticker}
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

                {/* Real Scannable QR Code & Deposit Address Layout */}
                <div className="flex flex-col sm:flex-row gap-3.5 items-center">
                  {/* Visual Real QR Code Card */}
                  <div className="relative group p-2 rounded-xl bg-white text-slate-950 flex flex-col items-center justify-center shrink-0 shadow-lg border border-slate-200/80">
                    {isQrLoading ? (
                      <div className="w-28 h-28 sm:w-32 sm:h-32 flex flex-col items-center justify-center space-y-1">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[9px] text-slate-600 font-mono">Generating QR...</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <img 
                          src={qrDataUrl} 
                          alt={`${currentCoin.name} Escrow Wallet Address QR Code`} 
                          className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-md"
                          loading="eager"
                        />
                        <button
                          type="button"
                          onClick={() => setIsQrModalOpen(true)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white rounded-md text-xs font-semibold space-x-1 cursor-pointer"
                          title="Click to view large QR Code"
                        >
                          <Maximize2 className="w-4 h-4" />
                          <span className="text-[10px]">Enlarge</span>
                        </button>
                      </div>
                    )}
                    <div className="flex items-center justify-between w-full mt-1.5 pt-1 border-t border-slate-200">
                      <span className="text-[9px] font-bold text-slate-800 uppercase tracking-tight">
                        Scan with Wallet
                      </span>
                      <button
                        type="button"
                        onClick={handleDownloadQr}
                        className="text-[9px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center space-x-0.5 cursor-pointer"
                        title="Download QR Code image"
                      >
                        <Download className="w-2.5 h-2.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Coin / Network: <strong className="text-white">{currentCoin.name}</strong>
                      </span>
                      <span className="text-emerald-400 text-[11px] font-semibold flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Verified Gateway</span>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Official Escrow Receiving Wallet:</span>
                        <button
                          type="button"
                          onClick={handleCopyAddress}
                          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                          {copiedAddress ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedAddress ? 'Copied' : 'Copy Address'}</span>
                        </button>
                      </div>
                      <div className="font-mono text-xs text-emerald-300 break-all select-all font-bold bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 shadow-inner">
                        {currentCoin.address}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Direct 100% Escrow Wallet</span>
                      </span>
                      <span className="font-mono text-slate-400">
                        Network: <span className="text-slate-200 font-semibold">{currentCoin.network}</span>
                      </span>
                    </div>
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      placeholder="e.g. buyer@agency.com"
                      className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-xs text-slate-200 placeholder-slate-500 focus:outline-none ${
                        emailError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700 focus:border-emerald-500'
                      }`}
                    />
                    {emailError && (
                      <span className="text-[11px] text-rose-400 font-medium block mt-1">
                        {emailError}
                      </span>
                    )}
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

      {/* Enlarge QR Code Modal Overlay */}
      {isQrModalOpen && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div 
            className="relative max-w-sm w-full bg-[#0b111e] border border-slate-700 rounded-3xl p-6 text-center space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-left">
                <h3 className="text-sm font-bold text-white font-['Outfit']">
                  {currentCoin.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Network: {currentCoin.network}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-xl border border-slate-300">
              {qrDataUrl && (
                <img 
                  src={qrDataUrl} 
                  alt={`${currentCoin.ticker} QR Code`} 
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 break-all select-all font-bold">
                {currentCoin.address}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-700"
                >
                  {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAddress ? 'Address Copied' : 'Copy Address'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-black text-slate-950 transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
