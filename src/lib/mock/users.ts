import { ago } from "../date";
import { toMinor } from "../money";
import type { BankAccount, KycVerification, TraderSummary, User, UserPaymentMethod } from "../types";

/**
 * Seed users. Figures match the supplied designs exactly so rebuilt screens
 * can be compared against them side by side.
 */

// ---------------------------------------------------------------------------
// Trader summaries — the compact shape embedded in offers and trades
// ---------------------------------------------------------------------------

export const traders = {
  tonyfx: {
    id: "usr_tonyfx",
    username: "TonyFX",
    initials: "T",
    avatarColor: "#7a5af8",
    isMerchant: true,
    verified: true,
    rating: 4.98,
    completedTrades: 1284,
    completionRate: 0.998,
    avgReleaseTime: 120,
  },
  chinahub: {
    id: "usr_chinahub",
    username: "ChinaHub",
    initials: "C",
    avatarColor: "#12b76a",
    isMerchant: true,
    verified: true,
    rating: 4.94,
    completedTrades: 2105,
    completionRate: 0.994,
    avgReleaseTime: 180,
  },
  rmbpro: {
    id: "usr_rmbpro",
    username: "RMBPro",
    initials: "R",
    avatarColor: "#f79009",
    isMerchant: false,
    verified: true,
    rating: 4.92,
    completedTrades: 645,
    completionRate: 0.989,
    avgReleaseTime: 120,
  },
  globalfx: {
    id: "usr_globalfx",
    username: "GlobalFX",
    initials: "G",
    avatarColor: "#1652f0",
    isMerchant: false,
    verified: true,
    rating: 4.9,
    completedTrades: 798,
    completionRate: 0.987,
    avgReleaseTime: 240,
  },
  fastrmb: {
    id: "usr_fastrmb",
    username: "FastRMB",
    initials: "F",
    avatarColor: "#f04438",
    isMerchant: false,
    verified: false,
    rating: 4.88,
    completedTrades: 532,
    completionRate: 0.981,
    avgReleaseTime: 180,
  },
  fasttrader: {
    id: "usr_fasttrader",
    username: "FastTrader",
    initials: "F",
    avatarColor: "#e5484d",
    isMerchant: false,
    verified: true,
    rating: 4.71,
    completedTrades: 318,
    completionRate: 0.964,
    avgReleaseTime: 300,
  },
  wealth: {
    id: "usr_wealth",
    username: "wealth_a",
    initials: "WA",
    avatarColor: "#2f3d8f",
    isMerchant: false,
    verified: true,
    rating: 4.98,
    completedTrades: 1284,
    completionRate: 0.998,
    avgReleaseTime: 120,
  },
} satisfies Record<string, TraderSummary>;

export const traderList: TraderSummary[] = Object.values(traders);

export function findTrader(username: string): TraderSummary | undefined {
  return traderList.find(
    (t) => t.username.toLowerCase() === username.toLowerCase().replace(/^@/, ""),
  );
}

// ---------------------------------------------------------------------------
// The signed-in user
// ---------------------------------------------------------------------------

export const currentUser: User = {
  id: "usr_wealth",
  username: "wealth_a",
  displayName: "Wealth A.",
  fullName: "Wealth Anthony",
  email: "wealtha@gmail.com",
  emailVerified: true,
  phone: "+234 803 123 4567",
  phoneVerified: true,
  avatarUrl: null,
  initials: "WA",
  dateOfBirth: "1998-05-10T00:00:00.000Z",
  country: "Nigeria",
  countryFlag: "🇳🇬",
  state: "Kaduna",
  city: "Kaduna",
  bvnLast4: "4821",
  role: "trader",
  status: "verified",
  isMerchant: false,
  kycLevel: 2,
  stats: {
    rating: 4.98,
    ratingCount: 1102,
    completedTrades: 1284,
    completionRate: 0.998,
    cancellationRate: 0.002,
    disputeRate: 0.004,
    avgReleaseTime: 120,
    totalVolumeNgn: toMinor(28_450_000),
    memberSince: "2026-05-14T09:00:00.000Z",
  },
  limits: {
    dailyTradeValueNgn: toMinor(5_000_000),
    dailyUsedNgn: toMinor(1_285_000),
    monthlyTradeValueNgn: toMinor(50_000_000),
    monthlyUsedNgn: toMinor(18_650_000),
    dailyTradeCount: 10,
    dailyTradeCountUsed: 3,
  },
  riskScore: 12,
  twoFactorEnabled: true,
  createdAt: "2026-05-14T09:00:00.000Z",
  lastSeenAt: ago(2, "min"),
};

/** Public trading ID shown on the profile screen. */
export const currentUserPublicId = "SCX-U-475839";

// ---------------------------------------------------------------------------
// KYC (PRD §8) — level 2 reached, selfie step in progress
// ---------------------------------------------------------------------------

export const currentUserKyc: KycVerification = {
  userId: currentUser.id,
  level: 2,
  levelLabel: "Identity Verified",
  status: "verified",
  steps: [
    {
      id: "basic_information",
      label: "Basic Information",
      status: "completed",
      completedAt: ago(110, "day"),
    },
    {
      id: "identity_document",
      label: "Identity Document",
      status: "completed",
      completedAt: ago(11, "day"),
    },
    {
      id: "selfie_verification",
      label: "Selfie Verification",
      status: "in_progress",
      completedAt: null,
    },
    {
      id: "review_approval",
      label: "Review & Approval",
      status: "pending",
      completedAt: null,
    },
  ],
  progressPercent: 66,
  submittedAt: ago(11, "day"),
  reviewedAt: null,
  rejectionReason: null,
};

// ---------------------------------------------------------------------------
// Payment methods and bank accounts (PRD §25, §26)
// ---------------------------------------------------------------------------

export const currentUserPaymentMethods: UserPaymentMethod[] = [
  {
    id: "pm_alipay_1",
    userId: currentUser.id,
    rail: "alipay",
    accountLabel: "155*****@gmail.com",
    accountName: "Wealth Anthony",
    verified: true,
    isDefault: true,
    addedAt: ago(90, "day"),
  },
  {
    id: "pm_wechat_1",
    userId: currentUser.id,
    rail: "wechat",
    accountLabel: "Wealth_A",
    accountName: "Wealth Anthony",
    verified: true,
    isDefault: false,
    addedAt: ago(60, "day"),
  },
];

export const currentUserBankAccounts: BankAccount[] = [
  {
    id: "bank_gtb_1",
    userId: currentUser.id,
    bankName: "GTBank",
    bankSlug: "gtbank",
    accountName: "Wealth Anthony",
    accountNumberLast4: "4821",
    verified: true,
    isDefault: true,
    addedAt: ago(13, "day"),
    usableFrom: null,
  },
];

/** Nigerian banks offered when adding a settlement account. */
export const NIGERIAN_BANKS = [
  { slug: "gtbank", name: "GTBank" },
  { slug: "access", name: "Access Bank" },
  { slug: "zenith", name: "Zenith Bank" },
  { slug: "fidelity", name: "Fidelity Bank" },
  { slug: "uba", name: "UBA" },
  { slug: "first-bank", name: "First Bank" },
  { slug: "kuda", name: "Kuda" },
  { slug: "opay", name: "OPay" },
  { slug: "moniepoint", name: "Moniepoint" },
  { slug: "sterling", name: "Sterling Bank" },
  { slug: "union", name: "Union Bank" },
  { slug: "wema", name: "Wema Bank" },
] as const;
