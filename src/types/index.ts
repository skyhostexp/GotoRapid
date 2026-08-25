export type ProductCategory = 
  | 'all'
  | 'bank-accounts'
  | 'crypto-accounts'
  | 'smm-accounts'
  | 'smm-services'
  | 'reviews-services';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'USDT';

export interface Product {
  id: string;
  name: string;
  category: 'bank-accounts' | 'crypto-accounts' | 'smm-accounts' | 'smm-services' | 'reviews-services';
  categoryLabel: string;
  subtitle: string;
  priceUsd: number;
  originalPriceUsd?: number;
  unitLabel?: string; // e.g., "/ account", "/ 1,000 units", "/ 10 reviews"
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  deliveryTime: string; // e.g., "5-15 mins (Instant)", "< 2 Hours"
  region: string; // "USA 🇺🇸", "UK 🇬🇧", "EU 🇪🇺", "Global 🌐"
  verificationLevel: 'Basic' | 'Tier 1' | 'Tier 2 (Full KYC)' | 'Enterprise LLC' | 'Aged High-Trust' | 'Local Guide Level 7+';
  badge?: 'Best Seller' | 'Instant Delivery' | 'Hot' | 'Verified' | 'Limited Stock' | 'Top Rated';
  iconName: string;
  shortDescription: string;
  description: string;
  features: string[];
  documentsIncluded: string[];
  safetyScore: number; // e.g. 99 (99%)
  warrantyDays: number; // e.g. 30 days replacement
  warmupGuideIncluded: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  isService?: boolean;
  popular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customRequirements?: string;
  selectedVariant?: string;
  targetLinkOrUsername?: string;
}

export interface LiveOrderTickerItem {
  id: string;
  orderNumber: string;
  productName: string;
  category: string;
  amountUsd: number;
  country: string;
  flag: string;
  timeAgo: string;
  status: 'Delivered' | 'In Escrow' | 'Processing';
}

export interface FAQItem {
  id: string;
  category: ProductCategory | 'general' | 'safety' | 'payment';
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  handle: string;
  avatar: string;
  role: string;
  servicePurchased: string;
  rating: number;
  date: string;
  verifiedBuyer: boolean;
  content: string;
  platform: 'Trustpilot' | 'Telegram' | 'Google' | 'Direct';
}

export interface OrderVerificationLookup {
  orderId: string;
  email: string;
  status: 'Received' | 'Verifying' | 'Escrow Locked' | 'Credentials Encrypted' | 'Delivered' | 'Completed';
  productName: string;
  category: string;
  date: string;
  deliveryVaultId: string;
  proxyAssigned: string;
  warrantyValidUntil: string;
}
