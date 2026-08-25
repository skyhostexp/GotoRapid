import { OrderVerificationLookup, LiveOrderTickerItem } from '../types';

export interface AdminOrder {
  id: string; // e.g. "GR-9821"
  orderNumber: string;
  customerEmail: string;
  telegramUsername?: string;
  createdAt: string;
  items: {
    productId: string;
    productName: string;
    category: string;
    quantity: number;
    priceUsd: number;
    customRequirements?: string;
  }[];
  totalUsd: number;
  discountPercent: number;
  paymentMethod: 'Crypto' | 'Manual' | 'Escrow';
  cryptoCoin: string; // e.g. "USDT_TRC20"
  cryptoNetwork: string; // e.g. "TRON (TRC-20)"
  cryptoAmount: string; // e.g. "260.00 USDT"
  txHash?: string;
  status: 'Pending Verification' | 'Escrow Locked' | 'Processing Vault' | 'Delivered' | 'Completed' | 'Refunded';
  deliveryVaultId: string;
  masterDecryptionKey: string;
  proxyAssigned: string;
  warrantyDays: number;
  warrantyValidUntil: string;
  adminNotes?: string;
}

const STORAGE_KEY = 'gotorapid_admin_orders_v1';
const ADMIN_AUTH_KEY = 'gotorapid_admin_auth_v1';

export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: 'GR-9821',
    orderNumber: 'GR-9821',
    customerEmail: 'klaus.n@proton.me',
    telegramUsername: '@klaus_crypto',
    createdAt: '2026-08-20T02:45:00Z',
    items: [
      {
        productId: 'crypto-binance-plus',
        productName: 'Binance Verified Plus (Tier 2/3 KYC)',
        category: 'Crypto Accounts',
        quantity: 1,
        priceUsd: 260,
        customRequirements: 'Need clean Frankfurt residential IP proxy'
      }
    ],
    totalUsd: 260,
    discountPercent: 0,
    paymentMethod: 'Crypto',
    cryptoCoin: 'USDT_TRC20',
    cryptoNetwork: 'TRON (TRC-20)',
    cryptoAmount: '260.00 USDT',
    txHash: 'e4a8b79c3f1208947b19df51940982348ab1248c081e3271a938c92841029e71',
    status: 'Delivered',
    deliveryVaultId: 'VAULT-BN-7740-AES256',
    masterDecryptionKey: 'GOTORAPID-GR-9821-VAULT-KEY-AES256',
    proxyAssigned: 'Frankfurt Residential Static IP (Port 8443)',
    warrantyDays: 30,
    warrantyValidUntil: '2026-09-19',
    adminNotes: 'KYC verified with German passport scans. 2FA seed generated.'
  },
  {
    id: 'GR-9820',
    orderNumber: 'GR-9820',
    customerEmail: 'david.x@gmail.com',
    telegramUsername: '@david_agency',
    createdAt: '2026-08-20T01:30:00Z',
    items: [
      {
        productId: 'bank-wise-business',
        productName: 'Wise Multi-Currency UK/EU Business',
        category: 'Bank Accounts',
        quantity: 1,
        priceUsd: 280,
        customRequirements: 'UK LTD documentation included'
      }
    ],
    totalUsd: 280,
    discountPercent: 10,
    paymentMethod: 'Crypto',
    cryptoCoin: 'SOL',
    cryptoNetwork: 'Solana Mainnet-Beta',
    cryptoAmount: '1.4358 SOL',
    txHash: '5K2bM7N8vP9x4qW3rT6yU1oP8aS2dF3gH4jK5lZ6x7c8v9b0n1m2',
    status: 'Delivered',
    deliveryVaultId: 'VAULT-WS-3129-AES256',
    masterDecryptionKey: 'GOTORAPID-GR-9820-VAULT-KEY-AES256',
    proxyAssigned: 'London Residential Socks5 (Port 9050)',
    warrantyDays: 30,
    warrantyValidUntil: '2026-09-19',
    adminNotes: 'Full Wise Corporate profile handed over with 16-digit 2FA recovery string.'
  },
  {
    id: 'GR-9819',
    orderNumber: 'GR-9819',
    customerEmail: 'media@ecommerce-hub.io',
    telegramUsername: '@ecom_media',
    createdAt: '2026-08-20T00:15:00Z',
    items: [
      {
        productId: 'reviews-trustpilot-10',
        productName: 'Trustpilot 5-Star Verified Buyer Reviews (10x)',
        category: 'Reviews Service',
        quantity: 1,
        priceUsd: 120,
        customRequirements: 'Target: https://trustpilot.com/review/myshop.com - Pace 1 review/day'
      }
    ],
    totalUsd: 120,
    discountPercent: 0,
    paymentMethod: 'Crypto',
    cryptoCoin: 'USDT_BEP20',
    cryptoNetwork: 'BNB Smart Chain (BEP-20)',
    cryptoAmount: '120.00 USDT',
    txHash: '0x991823abf1092471829471928410294810294810294810294810294810294812',
    status: 'Escrow Locked',
    deliveryVaultId: 'DRIP-CAMPAIGN-TP-9819',
    masterDecryptionKey: 'GOTORAPID-GR-9819-VAULT-KEY-AES256',
    proxyAssigned: 'Dynamic Geo-Targeted US Residential Pool',
    warrantyDays: 60,
    warrantyValidUntil: '2026-10-19',
    adminNotes: 'Active drip pacing: 3/10 reviews published and sticky.'
  },
  {
    id: 'GR-9818',
    orderNumber: 'GR-9818',
    customerEmail: 'creator.pro@outlook.com',
    telegramUsername: '@tiktok_guru',
    createdAt: '2026-08-19T22:40:00Z',
    items: [
      {
        productId: 'smm-tiktok-creator',
        productName: 'TikTok Creator Rewards Monetized Account',
        category: 'SMM Accounts',
        quantity: 1,
        priceUsd: 180
      }
    ],
    totalUsd: 180,
    discountPercent: 0,
    paymentMethod: 'Crypto',
    cryptoCoin: 'BTC',
    cryptoNetwork: 'Bitcoin Native SegWit',
    cryptoAmount: '0.001865 BTC',
    txHash: '3b89f10928471092841029481029481029481029481029481029481029481029',
    status: 'Delivered',
    deliveryVaultId: 'VAULT-TT-5510-AES256',
    masterDecryptionKey: 'GOTORAPID-GR-9818-VAULT-KEY-AES256',
    proxyAssigned: 'USA Static Residential Proxy (Port 3128)',
    warrantyDays: 30,
    warrantyValidUntil: '2026-09-18',
    adminNotes: 'Transferred with Original Creation Email (OGE).'
  },
  {
    id: 'GR-9817',
    orderNumber: 'GR-9817',
    customerEmail: 'sari.t@venturecorp.ae',
    telegramUsername: '@sari_venture',
    createdAt: '2026-08-19T18:10:00Z',
    items: [
      {
        productId: 'bank-mercury-us',
        productName: 'Mercury US Business Bank + EIN Docs',
        category: 'Bank Accounts',
        quantity: 1,
        priceUsd: 650,
        customRequirements: 'Wyoming LLC documentation required'
      }
    ],
    totalUsd: 650,
    discountPercent: 0,
    paymentMethod: 'Crypto',
    cryptoCoin: 'USDT_TRC20',
    cryptoNetwork: 'TRON (TRC-20)',
    cryptoAmount: '650.00 USDT',
    txHash: '7a8f901928410294810294810294810294810294810294810294810294810294',
    status: 'Delivered',
    deliveryVaultId: 'VAULT-MC-9901-AES256',
    masterDecryptionKey: 'GOTORAPID-GR-9817-VAULT-KEY-AES256',
    proxyAssigned: 'Wyoming Dedicated Clean ISP IP',
    warrantyDays: 45,
    warrantyValidUntil: '2026-10-03',
    adminNotes: 'EIN registration certificates and video KYC archive packaged.'
  }
];

export function getStoredOrders(): AdminOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_ORDERS));
      return INITIAL_ADMIN_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored orders', e);
    return INITIAL_ADMIN_ORDERS;
  }
}

export function saveOrders(orders: AdminOrder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
}

export function addOrder(newOrder: Omit<AdminOrder, 'createdAt'> & { createdAt?: string }): AdminOrder {
  const current = getStoredOrders();
  const orderWithDate: AdminOrder = {
    ...newOrder,
    createdAt: newOrder.createdAt || new Date().toISOString()
  };
  const updated = [orderWithDate, ...current];
  saveOrders(updated);
  return orderWithDate;
}

export function updateOrderStatus(orderId: string, status: AdminOrder['status'], notes?: string): AdminOrder[] {
  const current = getStoredOrders();
  const updated = current.map(o => {
    if (o.id === orderId || o.orderNumber === orderId) {
      return {
        ...o,
        status,
        adminNotes: notes !== undefined ? notes : o.adminNotes
      };
    }
    return o;
  });
  saveOrders(updated);
  return updated;
}

export function deleteOrder(orderId: string): AdminOrder[] {
  const current = getStoredOrders();
  const updated = current.filter(o => o.id !== orderId && o.orderNumber !== orderId);
  saveOrders(updated);
  return updated;
}

export function resetOrdersToDefault(): AdminOrder[] {
  saveOrders(INITIAL_ADMIN_ORDERS);
  return INITIAL_ADMIN_ORDERS;
}

// Admin Credentials
export interface AdminCredentials {
  username: string;
  passwordHash: string; // Plain/encrypted representation for demo
  lastLogin?: string;
}

export const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'RapidAdmin2026!'
};

export function checkAdminAuth(): boolean {
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function setAdminAuth(isAuth: boolean): void {
  try {
    if (isAuth) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  } catch (e) {
    console.error('Failed to update admin auth status', e);
  }
}
