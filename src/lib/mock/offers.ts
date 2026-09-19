import { ago } from "../date";
import { fromScaledRate, toMinor, toScaledRate } from "../money";
import type { Offer, PaymentMethodMeta, PaymentRail, ScaledRate } from "../types";
import { traders } from "./users";

/**
 * Marketplace offers (PRD §10). Rates and volumes match the Buy RMB design.
 */

// ---------------------------------------------------------------------------
// Payment rails (PRD §40 — providers are pluggable, never hard-coded)
// ---------------------------------------------------------------------------

export const PAYMENT_RAILS: Record<PaymentRail, PaymentMethodMeta> = {
  alipay: {
    id: "alipay",
    label: "Alipay",
    currency: "RMB",
    blurb: "Fast and secure payments via Alipay.",
  },
  wechat: {
    id: "wechat",
    label: "WeChat Pay",
    currency: "RMB",
    blurb: "Receive payments via WeChat Pay.",
  },
  bank_transfer: {
    id: "bank_transfer",
    label: "Bank Transfer",
    currency: "NGN",
    blurb: "Naira settlement to a verified Nigerian bank account.",
  },
};

export const RMB_RAILS: PaymentRail[] = ["alipay", "wechat"];

// ---------------------------------------------------------------------------
// Reference rate (PRD §31 — shown for transparency, never used to settle)
// ---------------------------------------------------------------------------

export const marketReferenceRate = toScaledRate(219.5);
export const marketRateLow = toScaledRate(216);
export const marketRateHigh = toScaledRate(221);
export const marketRateChangePercent = 0.8;
export const marketRateUpdatedAt = ago(65, "min");

// ---------------------------------------------------------------------------
// Sell-side offers: traders selling RMB, buyers pay NGN
// ---------------------------------------------------------------------------

export const offers: Offer[] = [
  {
    id: "off_84001",
    side: "sell",
    trader: traders.tonyfx,
    rate: toScaledRate(218),
    availableRmb: toMinor(50_000),
    minOrderRmb: toMinor(1_000),
    maxOrderRmb: toMinor(50_000),
    rails: ["alipay"],
    status: "active",
    terms: "Please pay within 15 minutes. Send the exact amount shown.",
    createdAt: ago(3, "hour"),
    updatedAt: ago(12, "min"),
  },
  {
    id: "off_84002",
    side: "sell",
    trader: traders.chinahub,
    rate: toScaledRate(219),
    availableRmb: toMinor(100_000),
    minOrderRmb: toMinor(1_000),
    maxOrderRmb: toMinor(100_000),
    rails: ["wechat"],
    status: "active",
    terms: "Large orders welcome. WeChat only.",
    createdAt: ago(5, "hour"),
    updatedAt: ago(28, "min"),
  },
  {
    id: "off_84003",
    side: "sell",
    trader: traders.rmbpro,
    rate: toScaledRate(220),
    availableRmb: toMinor(25_000),
    minOrderRmb: toMinor(500),
    maxOrderRmb: toMinor(25_000),
    rails: ["alipay"],
    status: "active",
    terms: null,
    createdAt: ago(7, "hour"),
    updatedAt: ago(44, "min"),
  },
  {
    id: "off_84004",
    side: "sell",
    trader: traders.globalfx,
    rate: toScaledRate(221),
    availableRmb: toMinor(80_000),
    minOrderRmb: toMinor(2_000),
    maxOrderRmb: toMinor(80_000),
    rails: ["wechat"],
    status: "active",
    terms: "Online 9am – 9pm WAT.",
    createdAt: ago(9, "hour"),
    updatedAt: ago(52, "min"),
  },
  {
    id: "off_84005",
    side: "sell",
    trader: traders.fastrmb,
    rate: toScaledRate(222),
    availableRmb: toMinor(40_000),
    minOrderRmb: toMinor(1_000),
    maxOrderRmb: toMinor(40_000),
    rails: ["alipay"],
    status: "active",
    terms: null,
    createdAt: ago(11, "hour"),
    updatedAt: ago(70, "min"),
  },
  {
    id: "off_84006",
    side: "sell",
    trader: traders.fasttrader,
    rate: toScaledRate(222.5),
    availableRmb: toMinor(15_000),
    minOrderRmb: toMinor(500),
    maxOrderRmb: toMinor(15_000),
    rails: ["alipay", "wechat"],
    status: "active",
    terms: null,
    createdAt: ago(14, "hour"),
    updatedAt: ago(95, "min"),
  },
];

// ---------------------------------------------------------------------------
// Buy-side offers: traders buying RMB, sellers receive NGN
// ---------------------------------------------------------------------------

export const buyOffers: Offer[] = [
  {
    id: "off_85001",
    side: "buy",
    trader: traders.chinahub,
    rate: toScaledRate(217.5),
    availableRmb: toMinor(120_000),
    minOrderRmb: toMinor(1_000),
    maxOrderRmb: toMinor(60_000),
    rails: ["alipay", "wechat"],
    status: "active",
    terms: "Instant Naira settlement after RMB confirmation.",
    createdAt: ago(4, "hour"),
    updatedAt: ago(9, "min"),
  },
  {
    id: "off_85002",
    side: "buy",
    trader: traders.tonyfx,
    rate: toScaledRate(217),
    availableRmb: toMinor(70_000),
    minOrderRmb: toMinor(1_000),
    maxOrderRmb: toMinor(50_000),
    rails: ["alipay"],
    status: "active",
    terms: null,
    createdAt: ago(6, "hour"),
    updatedAt: ago(21, "min"),
  },
  {
    id: "off_85003",
    side: "buy",
    trader: traders.globalfx,
    rate: toScaledRate(216.5),
    availableRmb: toMinor(45_000),
    minOrderRmb: toMinor(2_000),
    maxOrderRmb: toMinor(45_000),
    rails: ["wechat"],
    status: "active",
    terms: null,
    createdAt: ago(8, "hour"),
    updatedAt: ago(37, "min"),
  },
  {
    id: "off_85004",
    side: "buy",
    trader: traders.rmbpro,
    rate: toScaledRate(216),
    availableRmb: toMinor(30_000),
    minOrderRmb: toMinor(500),
    maxOrderRmb: toMinor(30_000),
    rails: ["alipay"],
    status: "active",
    terms: null,
    createdAt: ago(10, "hour"),
    updatedAt: ago(58, "min"),
  },
];

// ---------------------------------------------------------------------------
// The signed-in user's own offers
// ---------------------------------------------------------------------------

export const myOffers: Offer[] = [
  {
    id: "off_mine_1",
    side: "sell",
    trader: traders.wealth,
    rate: toScaledRate(218),
    availableRmb: toMinor(10_000),
    minOrderRmb: toMinor(1_000),
    maxOrderRmb: toMinor(20_000),
    rails: ["alipay"],
    status: "active",
    terms: null,
    createdAt: ago(2, "day"),
    updatedAt: ago(3, "hour"),
  },
  {
    id: "off_mine_2",
    side: "sell",
    trader: traders.wealth,
    rate: toScaledRate(219.5),
    availableRmb: toMinor(5_000),
    minOrderRmb: toMinor(500),
    maxOrderRmb: toMinor(5_000),
    rails: ["wechat"],
    status: "paused",
    terms: null,
    createdAt: ago(6, "day"),
    updatedAt: ago(1, "day"),
  },
];

// ---------------------------------------------------------------------------
// Marketplace headline stats (Buy RMB design)
// ---------------------------------------------------------------------------

export const marketplaceHighlights = {
  bestRate: toScaledRate(218),
  fastestReleaseSeconds: 120,
  topRating: 4.98,
  verifiedMerchants: 128,
  totalSellers: 42,
};

// ---------------------------------------------------------------------------
// Rate comparison table (/rates)
// ---------------------------------------------------------------------------
//
// "Best Rate" per rail is computed live from the real offers above — never
// duplicated here. Market Average, 24h Change and Available Traders have no
// real per-rail source (only ~7 traders are seeded, total, across every
// rail), so these are independent platform-scale marketing figures — the
// same footing as the homepage's "12,450+ Active Traders" — not a claim
// about the seed data. USDT is listed unavailable: the PRD names
// cryptocurrency trading as an explicit MVP non-goal (§5).

export interface RateComparisonRow {
  rail: PaymentRail | "usdt";
  label: string;
  blurb: string;
  marketAverage: ScaledRate;
  changePercent: number;
  traderCount: number;
  available: boolean;
}

export const rateComparisonRows: RateComparisonRow[] = [
  {
    rail: "alipay",
    label: "Alipay",
    blurb: "Fast · Secure · Popular",
    marketAverage: toScaledRate(218.75),
    changePercent: 1.12,
    traderCount: 4230,
    available: true,
  },
  {
    rail: "wechat",
    label: "WeChat Pay",
    blurb: "Fast · Secure · Widely used",
    marketAverage: toScaledRate(219.6),
    changePercent: 0.96,
    traderCount: 3842,
    available: true,
  },
  {
    rail: "bank_transfer",
    label: "Bank Transfer",
    blurb: "Reliable · High limits",
    marketAverage: toScaledRate(220.75),
    changePercent: -0.45,
    traderCount: 2167,
    available: true,
  },
  {
    rail: "usdt",
    label: "USDT",
    blurb: "Not yet supported on ScarExchange",
    marketAverage: toScaledRate(221.8),
    changePercent: 0.73,
    traderCount: 0,
    available: false,
  },
];

// ---------------------------------------------------------------------------
// Rate trend chart (/rates) — deterministic, not real history. Same
// generation approach as admin.ts's volumeTrend: a seeded wobble, not
// Math.random, so the server and client render identical points.
// ---------------------------------------------------------------------------

export type RateRange = "24H" | "7D" | "30D" | "90D";

const RANGE_POINTS: Record<RateRange, number> = { "24H": 24, "7D": 7, "30D": 30, "90D": 90 };
const RANGE_UNIT: Record<RateRange, "hour" | "day"> = {
  "24H": "hour",
  "7D": "day",
  "30D": "day",
  "90D": "day",
};

function rateWobble(seed: number): number {
  const x = Math.sin(seed * 78.233) * 12345.6789;
  return x - Math.floor(x);
}

export interface RateTrendPoint {
  at: string;
  rate: number;
}

/** The most recent point always equals the real current reference rate. */
export function buildRateTrend(range: RateRange): RateTrendPoint[] {
  const count = RANGE_POINTS[range];
  const unit = RANGE_UNIT[range];
  const base = fromScaledRate(marketReferenceRate);
  const low = fromScaledRate(marketRateLow);
  const high = fromScaledRate(marketRateHigh);
  const band = high - low;

  return Array.from({ length: count }, (_, i) => {
    const swing = (rateWobble(i + count * 13) - 0.5) * band * 0.7;
    const drift = low + band * 0.4 + (i / Math.max(1, count - 1)) * band * 0.3;
    const raw = i === count - 1 ? base : Math.min(high, Math.max(low, drift + swing));
    return {
      at: ago(count - 1 - i, unit),
      rate: Math.round(raw * 100) / 100,
    };
  });
}

// ---------------------------------------------------------------------------
// Marketplace headline stats (Sell RMB design) — mirrors the buy-side block
// above, but over the buyOffers pool.
// ---------------------------------------------------------------------------

export const sellPageHighlights = {
  bestRate: toScaledRate(217.5),
  fastestReleaseSeconds: 150,
  topRating: 4.96,
  activeBuyers: 31,
};
