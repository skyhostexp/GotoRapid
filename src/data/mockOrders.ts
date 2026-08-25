import { LiveOrderTickerItem, OrderVerificationLookup } from '../types';

export const MOCK_LIVE_TICKER_ORDERS: LiveOrderTickerItem[] = [
  {
    id: '1',
    orderNumber: 'GR-9821',
    productName: 'Binance Verified Plus (Tier 2/3 KYC)',
    category: 'Crypto Accounts',
    amountUsd: 260,
    country: 'Germany',
    flag: '🇩🇪',
    timeAgo: '3 mins ago',
    status: 'Delivered'
  },
  {
    id: '2',
    orderNumber: 'GR-9820',
    productName: 'Wise Multi-Currency UK/EU Business',
    category: 'Bank Accounts',
    amountUsd: 280,
    country: 'United Kingdom',
    flag: '🇬🇧',
    timeAgo: '7 mins ago',
    status: 'Delivered'
  },
  {
    id: '3',
    orderNumber: 'GR-9819',
    productName: 'Trustpilot 5-Star Verified Buyer Reviews (10x)',
    category: 'Reviews Service',
    amountUsd: 120,
    country: 'United States',
    flag: '🇺🇸',
    timeAgo: '12 mins ago',
    status: 'In Escrow'
  },
  {
    id: '4',
    orderNumber: 'GR-9818',
    productName: 'TikTok Creator Rewards Monetized Account',
    category: 'SMM Accounts',
    amountUsd: 180,
    country: 'Canada',
    flag: '🇨🇦',
    timeAgo: '19 mins ago',
    status: 'Delivered'
  },
  {
    id: '5',
    orderNumber: 'GR-9817',
    productName: 'Mercury US Business Bank + EIN Docs',
    category: 'Bank Accounts',
    amountUsd: 650,
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    timeAgo: '24 mins ago',
    status: 'Delivered'
  },
  {
    id: '6',
    orderNumber: 'GR-9816',
    productName: 'Instagram High-Retention Growth Pack (25k)',
    category: 'SMM Services',
    amountUsd: 115,
    country: 'France',
    flag: '🇫🇷',
    timeAgo: '31 mins ago',
    status: 'Delivered'
  },
  {
    id: '7',
    orderNumber: 'GR-9815',
    productName: 'Aged Instagram Account (2017) + OGE',
    category: 'SMM Accounts',
    amountUsd: 65,
    country: 'Australia',
    flag: '🇦🇺',
    timeAgo: '42 mins ago',
    status: 'Delivered'
  },
  {
    id: '8',
    orderNumber: 'GR-9814',
    productName: 'Google Maps 5-Star Local Guide Reviews (20x)',
    category: 'Reviews Service',
    amountUsd: 190,
    country: 'Spain',
    flag: '🇪🇸',
    timeAgo: '50 mins ago',
    status: 'Delivered'
  }
];

export const MOCK_VERIFICATION_ORDERS: Record<string, OrderVerificationLookup> = {
  'GR-9821': {
    orderId: 'GR-9821',
    email: 'k***n@proton.me',
    status: 'Delivered',
    productName: 'Binance Verified Plus (Tier 2/3 KYC)',
    category: 'Crypto Accounts',
    date: '2026-08-16',
    deliveryVaultId: 'VAULT-BN-7740-AES256',
    proxyAssigned: 'Frankfurt Residential Static IP (Port 8443)',
    warrantyValidUntil: '2026-09-15 (30 Days Active)'
  },
  'GR-9820': {
    orderId: 'GR-9820',
    email: 'd***x@gmail.com',
    status: 'Delivered',
    productName: 'Wise Multi-Currency UK/EU Business',
    category: 'Bank Accounts',
    date: '2026-08-16',
    deliveryVaultId: 'VAULT-WS-3129-AES256',
    proxyAssigned: 'London Residential Socks5 (Port 9050)',
    warrantyValidUntil: '2026-09-15 (30 Days Active)'
  },
  'GR-9819': {
    orderId: 'GR-9819',
    email: 'm***a@ecommerce-hub.io',
    status: 'Escrow Locked',
    productName: 'Trustpilot 5-Star Verified Buyer Reviews (10x)',
    category: 'Reviews Service',
    date: '2026-08-16',
    deliveryVaultId: 'DRIP-CAMPAIGN-TP-9819',
    proxyAssigned: 'Dynamic Geo-Targeted US Residential Pool',
    warrantyValidUntil: '2026-10-15 (60 Days Active)'
  },
  'GR-9817': {
    orderId: 'GR-9817',
    email: 's***t@venturecorp.ae',
    status: 'Delivered',
    productName: 'Mercury US Business Bank + EIN Docs',
    category: 'Bank Accounts',
    date: '2026-08-16',
    deliveryVaultId: 'VAULT-MC-9901-AES256',
    proxyAssigned: 'Wyoming Dedicated Clean ISP IP',
    warrantyValidUntil: '2026-09-30 (45 Days Active)'
  }
};
