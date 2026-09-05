import { ago } from "../date";
import { toMinor } from "../money";
import type {
  AdminUser,
  AuditLogEntry,
  Dispute,
  RiskEvent,
  Settlement,
  TrendPoint,
} from "../types";

/**
 * Admin-side seed data (PRD §34–§36). Figures match the Admin Dashboard design.
 */

// ---------------------------------------------------------------------------
// Headline KPIs (PRD §54)
// ---------------------------------------------------------------------------

export const adminKpis = {
  totalUsers: 12_450,
  totalUsersDelta: 18.5,
  verifiedUsers: 9_832,
  activeTraders: 3_287,
  activeTradersDelta: 14.2,
  totalTrades: 8_932,
  totalTradesDelta: 22.8,
  rmbVolume: toMinor(45_680_000),
  rmbVolumeDelta: 16.3,
  ngnVolume: toMinor(10_238_400_000),
  ngnVolumeDelta: 20.1,
  disputeRate: 0.004,
  activeMerchants: 128,
};

/**
 * Sparkline series for the KPI tiles. Deterministic so the server and client
 * draw the same shape — a random series would flicker on hydration.
 */
function series(seed: number, length = 24, drift = 0.5): number[] {
  return Array.from({ length }, (_, i) => {
    const noise = Math.sin((i + seed) * 12.9898) * 43758.5453;
    return 40 + i * drift + (noise - Math.floor(noise)) * 30;
  });
}

export const kpiSparks = {
  totalUsers: series(3, 24, 0.9),
  activeTraders: series(11, 24, 0.6),
  totalTrades: series(19, 24, 1.1),
  rmbVolume: series(27, 24, 0.4),
  ngnVolume: series(41, 24, 0.8),
};

export const tradeStatusBreakdown = [
  { key: "completed", label: "Completed", count: 7_892, percent: 88.4, color: "var(--color-success-500)" },
  { key: "pending", label: "Pending", count: 623, percent: 7.0, color: "var(--color-warning-500)" },
  { key: "disputed", label: "Disputed", count: 152, percent: 1.7, color: "var(--color-danger-500)" },
  { key: "cancelled", label: "Cancelled", count: 265, percent: 3.0, color: "var(--color-neutral-300)" },
];

export const completionRate = { value: 99.1, delta: 2.4 };

export const platformHealth = {
  kycPending: { value: 128, delta: 12 },
  disputesOpen: { value: 23, delta: -5 },
  activeOffers: { value: 1_284, delta: 74 },
  serverUptime: 99.9,
};

export const kycQueueCounts = {
  newApplications: 56,
  underReview: 72,
  needsAttention: 15,
};

export const topMerchants = [
  { rank: 1, username: "TonyFX", trades: 1_284, volumeNgn: toMinor(128_450_000), verified: true },
  { rank: 2, username: "ChinaHub", trades: 982, volumeNgn: toMinor(96_230_000), verified: true },
  { rank: 3, username: "RMBPro", trades: 756, volumeNgn: toMinor(78_560_000), verified: true },
];

export const systemAnnouncements = [
  {
    id: "ann_1",
    tone: "success" as const,
    title: "System Update Completed Successfully",
    body: "All services are running smoothly.",
    at: ago(2, "hour"),
  },
  {
    id: "ann_2",
    tone: "warning" as const,
    title: "Scheduled Maintenance — Sep 3, 02:00 WAT",
    body: "Settlement processing pauses for roughly 20 minutes.",
    at: ago(9, "hour"),
  },
];

// ---------------------------------------------------------------------------
// Trading volume trend (Aug 1 – Aug 31)
// ---------------------------------------------------------------------------

/** Deterministic wobble so server and client render identical charts. */
function wobble(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Reference rate used to express the NGN leg on the shared ¥ axis. */
const TREND_RATE = 219.5;

export const volumeTrend: TrendPoint[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const base = 18 + i * 0.45;
  const swing = wobble(day) * 12 - 4;
  const rmb = Math.max(6, Math.round((base + swing) * 10) / 10);

  // The NGN leg trails the RMB leg slightly — not every RMB trade settles the
  // same day. Plotted as its RMB equivalent so both series share one scale.
  const ngnAsRmb = Math.round(rmb * (0.78 + wobble(day + 100) * 0.14) * 10) / 10;
  const ngnNative = Math.round(((ngnAsRmb * TREND_RATE) / 1000) * 100) / 100;

  return {
    date: `2026-08-${String(day).padStart(2, "0")}T00:00:00+01:00`,
    rmb,
    ngnAsRmb,
    ngnNative,
  };
});

export const dashboardRange = {
  start: "2026-08-01T00:00:00+01:00",
  end: "2026-08-31T00:00:00+01:00",
};

// ---------------------------------------------------------------------------
// Recent trades strip
// ---------------------------------------------------------------------------

export const adminRecentTrades = [
  { reference: "SCX-84921", side: "buy" as const, username: "wealth_a", verified: true, rmb: 10_000, rate: 219.0, ngn: 2_190_000, state: "COMPLETED" as const, at: "2026-08-31T10:46:00+01:00" },
  { reference: "SCX-84920", side: "sell" as const, username: "TonyFX", verified: true, rmb: 25_000, rate: 218.5, ngn: 5_462_500, state: "PAYMENT_PENDING" as const, at: "2026-08-31T10:32:00+01:00" },
  { reference: "SCX-84919", side: "buy" as const, username: "RMBPro", verified: true, rmb: 5_000, rate: 219.2, ngn: 1_096_000, state: "COMPLETED" as const, at: "2026-08-31T09:58:00+01:00" },
  { reference: "SCX-84918", side: "buy" as const, username: "ChinaHub", verified: true, rmb: 20_000, rate: 220.0, ngn: 4_400_000, state: "DISPUTED" as const, at: "2026-08-31T09:15:00+01:00" },
  { reference: "SCX-84917", side: "sell" as const, username: "FastTrader", verified: true, rmb: 8_000, rate: 217.0, ngn: 1_736_000, state: "COMPLETED" as const, at: "2026-08-31T08:41:00+01:00" },
];

// ---------------------------------------------------------------------------
// Risk alerts (PRD §29)
// ---------------------------------------------------------------------------

export const riskEvents: RiskEvent[] = [
  {
    id: "rsk_1",
    level: "critical",
    signal: "unusual_amount",
    title: "High Risk Transaction",
    description: "Transaction value far exceeds the account's 30-day average.",
    score: 88,
    userId: "usr_tonyfx",
    username: "TonyFX",
    tradeReference: "SCX-84920",
    amountLabel: "¥250,000",
    status: "open",
    createdAt: ago(2, "min"),
  },
  {
    id: "rsk_2",
    level: "high",
    signal: "multiple_accounts",
    title: "Multiple Accounts Detected",
    description: "3 linked accounts share a device fingerprint.",
    score: 74,
    userId: "usr_chinahub",
    username: "ChinaHub",
    tradeReference: null,
    amountLabel: "3 linked accounts",
    status: "reviewing",
    createdAt: ago(15, "min"),
  },
  {
    id: "rsk_3",
    level: "high",
    signal: "rapid_activity",
    title: "Unusual Activity",
    description: "12 trades opened in under 10 minutes.",
    score: 68,
    userId: "usr_fasttrader",
    username: "FastTrader",
    tradeReference: null,
    amountLabel: "Rapid transactions",
    status: "open",
    createdAt: ago(32, "min"),
  },
  {
    id: "rsk_4",
    level: "medium",
    signal: "high_cancellation",
    title: "Elevated Cancellation Rate",
    description: "Cancellation rate rose to 14% over the last 7 days.",
    score: 52,
    userId: "usr_fastrmb",
    username: "FastRMB",
    tradeReference: null,
    amountLabel: "14% cancellations",
    status: "open",
    createdAt: ago(2, "hour"),
  },
  {
    id: "rsk_5",
    level: "medium",
    signal: "new_account",
    title: "New Account, Large First Trade",
    description: "Account created 3 days ago opened a ¥80,000 trade.",
    score: 46,
    userId: "usr_globalfx",
    username: "GlobalFX",
    tradeReference: "SCX-84899",
    amountLabel: "¥80,000",
    status: "cleared",
    createdAt: ago(5, "hour"),
  },
];

export const openRiskAlertCount = 12;

// ---------------------------------------------------------------------------
// Disputes (PRD §19, §20)
// ---------------------------------------------------------------------------

export const disputes: Dispute[] = [
  {
    id: "dsp_84511",
    reference: "DSP-1041",
    tradeId: "trd_84511",
    tradeReference: "SCX-84511",
    raisedById: "usr_wealth",
    raisedByUsername: "wealth_a",
    againstUsername: "TonyFX",
    reason: "payment_not_received",
    reasonLabel: "Payment not received",
    description:
      "I sent the RMB via Alipay 40 minutes ago but the seller has not confirmed receipt.",
    status: "under_review",
    priority: "high",
    amountRmb: toMinor(15_000),
    amountNgn: toMinor(3_285_000),
    assignedToId: "adm_004",
    openedAt: ago(3, "day"),
    resolvedAt: null,
    resolutionNote: null,
  },
  {
    id: "dsp_84918",
    reference: "DSP-1042",
    tradeId: "trd_84918",
    tradeReference: "SCX-84918",
    raisedById: "usr_chinahub",
    raisedByUsername: "ChinaHub",
    againstUsername: "GlobalFX",
    reason: "wrong_amount",
    reasonLabel: "Wrong amount",
    description: "Buyer sent ¥18,400 instead of the agreed ¥20,000.",
    status: "awaiting_evidence",
    priority: "critical",
    amountRmb: toMinor(20_000),
    amountNgn: toMinor(4_400_000),
    assignedToId: null,
    openedAt: ago(95, "min"),
    resolvedAt: null,
    resolutionNote: null,
  },
  {
    id: "dsp_84702",
    reference: "DSP-1039",
    tradeId: "trd_84702",
    tradeReference: "SCX-84702",
    raisedById: "usr_rmbpro",
    raisedByUsername: "RMBPro",
    againstUsername: "FastRMB",
    reason: "seller_not_confirmed",
    reasonLabel: "Seller hasn't confirmed",
    description: "Payment proof uploaded, seller unresponsive for over an hour.",
    status: "open",
    priority: "medium",
    amountRmb: toMinor(6_500),
    amountNgn: toMinor(1_423_500),
    assignedToId: "adm_005",
    openedAt: ago(6, "hour"),
    resolvedAt: null,
    resolutionNote: null,
  },
  {
    id: "dsp_84330",
    reference: "DSP-1036",
    tradeId: "trd_84330",
    tradeReference: "SCX-84330",
    raisedById: "usr_fasttrader",
    raisedByUsername: "FastTrader",
    againstUsername: "ChinaHub",
    reason: "suspected_fraud",
    reasonLabel: "Suspected fraud",
    description: "Counterparty asked to settle outside the platform.",
    status: "escalated",
    priority: "critical",
    amountRmb: toMinor(32_000),
    amountNgn: toMinor(6_976_000),
    assignedToId: "adm_002",
    openedAt: ago(2, "day"),
    resolvedAt: null,
    resolutionNote: null,
  },
  {
    id: "dsp_84118",
    reference: "DSP-1030",
    tradeId: "trd_84118",
    tradeReference: "SCX-84118",
    raisedById: "usr_globalfx",
    raisedByUsername: "GlobalFX",
    againstUsername: "RMBPro",
    reason: "wrong_account",
    reasonLabel: "Wrong account",
    description: "RMB was sent to an account not shown in the trade.",
    status: "resolved_buyer",
    priority: "low",
    amountRmb: toMinor(4_000),
    amountNgn: toMinor(872_000),
    assignedToId: "adm_004",
    openedAt: ago(8, "day"),
    resolvedAt: ago(7, "day"),
    resolutionNote: "Funds recovered from the receiving account and returned to the buyer.",
  },
];

export const openDisputeCount = 5;

// ---------------------------------------------------------------------------
// Settlements (PRD §15, §44)
// ---------------------------------------------------------------------------

export const settlements: Settlement[] = [
  { id: "stl_1", reference: "STL-20260831-001", tradeId: "trd_84921", tradeReference: "SCX-84921", provider: "NGN Rail A", currency: "NGN", amount: toMinor(2_187_810), status: "completed", idempotencyKey: "idem_9f2c41a8", createdAt: "2026-08-31T10:44:00+01:00", settledAt: "2026-08-31T10:46:00+01:00", failureReason: null },
  { id: "stl_2", reference: "STL-20260831-002", tradeId: "trd_84920", tradeReference: "SCX-84920", provider: "NGN Rail A", currency: "NGN", amount: toMinor(5_457_037), status: "processing", idempotencyKey: "idem_4b71de02", createdAt: ago(12, "min"), settledAt: null, failureReason: null },
  { id: "stl_3", reference: "STL-20260831-003", tradeId: "trd_84919", tradeReference: "SCX-84919", provider: "NGN Rail B", currency: "NGN", amount: toMinor(1_094_904), status: "completed", idempotencyKey: "idem_77aa10bc", createdAt: ago(48, "min"), settledAt: ago(46, "min"), failureReason: null },
  { id: "stl_4", reference: "STL-20260831-004", tradeId: "trd_84899", tradeReference: "SCX-84899", provider: "NGN Rail A", currency: "NGN", amount: toMinor(892_310), status: "failed", idempotencyKey: "idem_2c9e5510", createdAt: ago(3, "hour"), settledAt: null, failureReason: "Beneficiary account name mismatch" },
  { id: "stl_5", reference: "STL-20260831-005", tradeId: "trd_84870", tradeReference: "SCX-84870", provider: "NGN Rail B", currency: "NGN", amount: toMinor(3_410_500), status: "queued", idempotencyKey: "idem_8d0f77e1", createdAt: ago(4, "hour"), settledAt: null, failureReason: null },
];

// ---------------------------------------------------------------------------
// Admin team and audit trail (PRD §35, §36)
// ---------------------------------------------------------------------------

export const adminUsers: AdminUser[] = [
  { id: "adm_001", name: "Admin", email: "admin@scarexchange.com", role: "super_admin", roleLabel: "Super Admin", initials: "AD", status: "active", lastActiveAt: ago(1, "min"), createdAt: ago(9, "month") },
  { id: "adm_002", name: "Ngozi Eze", email: "ngozi@scarexchange.com", role: "compliance_officer", roleLabel: "Compliance Officer", initials: "NE", status: "active", lastActiveAt: ago(22, "min"), createdAt: ago(7, "month") },
  { id: "adm_003", name: "Ibrahim Musa", email: "ibrahim@scarexchange.com", role: "operations_admin", roleLabel: "Operations Admin", initials: "IM", status: "active", lastActiveAt: ago(2, "hour"), createdAt: ago(6, "month") },
  { id: "adm_004", name: "Chidera Okafor", email: "chidera@scarexchange.com", role: "dispute_officer", roleLabel: "Dispute Officer", initials: "CO", status: "active", lastActiveAt: ago(35, "min"), createdAt: ago(5, "month") },
  { id: "adm_005", name: "Tunde Bello", email: "tunde@scarexchange.com", role: "support_agent", roleLabel: "Support Agent", initials: "TB", status: "active", lastActiveAt: ago(4, "hour"), createdAt: ago(3, "month") },
  { id: "adm_006", name: "Amara Nwosu", email: "amara@scarexchange.com", role: "support_agent", roleLabel: "Support Agent", initials: "AN", status: "suspended", lastActiveAt: ago(21, "day"), createdAt: ago(4, "month") },
];

export const currentAdmin = adminUsers[0];

export const auditLog: AuditLogEntry[] = [
  { id: "aud_1", adminId: "adm_004", adminLabel: "admin_004", action: "Transaction Released", target: "SCX-84921", targetType: "trade", reason: "Seller confirmed payment", ipAddress: "102.89.34.17", createdAt: "2026-08-31T14:32:18+01:00" },
  { id: "aud_2", adminId: "adm_002", adminLabel: "admin_002", action: "KYC Approved", target: "usr_globalfx", targetType: "user", reason: "Documents verified against NIN record", ipAddress: "102.89.34.22", createdAt: ago(48, "min") },
  { id: "aud_3", adminId: "adm_001", adminLabel: "admin_001", action: "Platform Fee Updated", target: "fees.platform_bps", targetType: "setting", reason: "Quarterly pricing review — 12bps to 10bps", ipAddress: "197.210.64.9", createdAt: ago(3, "hour") },
  { id: "aud_4", adminId: "adm_003", adminLabel: "admin_003", action: "Offer Suspended", target: "off_84006", targetType: "offer", reason: "Rate far outside market band", ipAddress: "102.89.34.51", createdAt: ago(5, "hour") },
  { id: "aud_5", adminId: "adm_002", adminLabel: "admin_002", action: "Account Restricted", target: "usr_fastrmb", targetType: "user", reason: "Open risk alert pending review", ipAddress: "102.89.34.22", createdAt: ago(9, "hour") },
  { id: "aud_6", adminId: "adm_004", adminLabel: "admin_004", action: "Dispute Resolved (Buyer)", target: "DSP-1030", targetType: "dispute", reason: "Funds recovered from receiving account", ipAddress: "102.89.34.17", createdAt: ago(7, "day") },
  { id: "aud_7", adminId: "adm_001", adminLabel: "admin_001", action: "Settlement Retried", target: "STL-20260831-004", targetType: "settlement", reason: "Beneficiary details corrected by user", ipAddress: "197.210.64.9", createdAt: ago(2, "hour") },
];
