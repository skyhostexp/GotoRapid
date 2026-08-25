import { Currency } from '../types';

export const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number; prefix: boolean }> = {
  USD: { symbol: '$', rate: 1.0, prefix: true },
  EUR: { symbol: '€', rate: 0.92, prefix: false },
  GBP: { symbol: '£', rate: 0.79, prefix: true },
  USDT: { symbol: '₮', rate: 1.0, prefix: false }
};

export function formatPrice(priceUsd: number, currency: Currency): string {
  const config = CURRENCY_RATES[currency];
  const converted = priceUsd * config.rate;
  const formattedNumber = converted.toLocaleString('en-US', {
    minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  });

  if (currency === 'USDT') {
    return `${formattedNumber} USDT`;
  }

  return config.prefix ? `${config.symbol}${formattedNumber}` : `${formattedNumber} ${config.symbol}`;
}

export function calculateDiscount(original?: number, current?: number): number | null {
  if (!original || !current || original <= current) return null;
  return Math.round(((original - current) / original) * 100);
}
