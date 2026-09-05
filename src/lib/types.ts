/**
 * ScarExchange domain model.
 *
 * These types mirror the relational schema in PRD §37 and the transaction
 * state machine in §16. The mock data layer and (later) the real API both
 * satisfy these shapes, so screens never need to change when the backend
 * lands behind them.
 *
 * Money convention: all amounts are stored as integers in the currency's
 * minor unit (fen for RMB, kobo for NGN). Never use floats for money.
 * Rates are stored as integers scaled by RATE_SCALE (see lib/money.ts).
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type ISODateString = string;

export type Currency = "RMB" | "NGN";

/** Minor units. ¥1 = 100 fen, ₦1 = 100 kobo. */
export type Minor = number;

/** NGN-per-RMB, scaled ×10000. ₦219.50 => 2195000. */
export type ScaledRate = number;

export type TradeSide = "buy" | "sell";

// ---------------------------------------------------------------------------
// Payment methods (PRD §25, §40)
// ---------------------------------------------------------------------------

/**
 * Deliberately open-ended: the platform must not be architected around one
 * provider (PRD §40). New rails are added here, not baked into trade logic.
 */
export type PaymentRail = "alipay" | "wechat" | "bank_transfer";

export interface PaymentMethodMeta {
  id: PaymentRail;
  label: string;
  /** Which side of the exchange this rail settles. */
  currency: Currency;
  blurb: string;
}

export interface UserPaymentMethod {
  id: string;
  userId: string;
  rail: PaymentRail;
  /** Masked for display: "155*****@gmail.com". */
  accountLabel: string;
  accountName: string;
  verified: boolean;
  isDefault: boolean;
  addedAt: ISODateString;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  bankSlug: string;
  accountName: string;
  /** Last four only; full number never reaches the client. */
  accountNumberLast4: string;
  verified: boolean;
  isDefault: boolean;
  addedAt: ISODateString;
  /**
   * PRD §25: bank changes carry a cooling-off period before the account can
   * receive settlement. Null once the delay has elapsed.
   */
  usableFrom: ISODateString | null;
}

// ---------------------------------------------------------------------------
// Users, KYC and reputation (PRD §6, §8, §21)
// ---------------------------------------------------------------------------

export type UserStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected"
  | "restricted"
  | "suspended";

/** 0 = none, 1 = basic, 2 = identity, 3 = enhanced. */
export type KycLevel = 0 | 1 | 2 | 3;

export type KycStepId =
  | "basic_information"
  | "identity_document"
  | "selfie_verification"
  | "review_approval";

export type KycStepStatus = "completed" | "in_progress" | "pending" | "rejected";

export interface KycStep {
  id: KycStepId;
  label: string;
  status: KycStepStatus;
  completedAt: ISODateString | null;
}

export interface KycVerification {
  userId: string;
  level: KycLevel;
  levelLabel: string;
  status: UserStatus;
  steps: KycStep[];
  /** 0–100, derived from completed steps. */
  progressPercent: number;
  submittedAt: ISODateString | null;
  reviewedAt: ISODateString | null;
  rejectionReason: string | null;
}

export type UserRole = "trader" | "merchant" | "admin";

export interface TraderStats {
  rating: number;
  ratingCount: number;
  completedTrades: number;
  completionRate: number;
  cancellationRate: number;
  disputeRate: number;
  /** Seconds. */
  avgReleaseTime: number;
  totalVolumeNgn: Minor;
  memberSince: ISODateString;
}

export interface TradingLimits {
  dailyTradeValueNgn: Minor;
  dailyUsedNgn: Minor;
  monthlyTradeValueNgn: Minor;
  monthlyUsedNgn: Minor;
  dailyTradeCount: number;
  dailyTradeCountUsed: number;
}

export interface User {
  id: string;
  /** Public trading handle, e.g. "TonyFX". */
  username: string;
  displayName: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  avatarUrl: string | null;
  initials: string;
  dateOfBirth: ISODateString | null;
  country: string;
  countryFlag: string;
  state: string | null;
  city: string | null;
  /** Nigerian bank verification number, masked. */
  bvnLast4: string | null;
  role: UserRole;
  status: UserStatus;
  isMerchant: boolean;
  kycLevel: KycLevel;
  stats: TraderStats;
  limits: TradingLimits;
  riskScore: number;
  twoFactorEnabled: boolean;
  createdAt: ISODateString;
  lastSeenAt: ISODateString;
}

/** The compact trader shape embedded in offers, trades and tables. */
export interface TraderSummary {
  id: string;
  username: string;
  initials: string;
  avatarColor: string;
  isMerchant: boolean;
  verified: boolean;
  rating: number;
  completedTrades: number;
  completionRate: number;
  avgReleaseTime: number;
}

// ---------------------------------------------------------------------------
// Offers (PRD §10, §12)
// ---------------------------------------------------------------------------

export type OfferStatus = "active" | "paused" | "suspended" | "expired" | "filled";

export interface Offer {
  id: string;
  /** "sell" = trader is selling RMB; buyers take this offer with NGN. */
  side: TradeSide;
  trader: TraderSummary;
  rate: ScaledRate;
  availableRmb: Minor;
  minOrderRmb: Minor;
  maxOrderRmb: Minor;
  rails: PaymentRail[];
  status: OfferStatus;
  terms: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ---------------------------------------------------------------------------
// Trade state machine (PRD §16)
// ---------------------------------------------------------------------------

export type TradeState =
  | "TRADE_CREATED"
  | "RATE_LOCKED"
  | "FUNDS_RESERVED"
  | "PAYMENT_PENDING"
  | "BUYER_MARKED_PAID"
  | "PAYMENT_VERIFICATION"
  | "SELLER_CONFIRMED"
  | "NGN_SETTLEMENT"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED"
  | "EXPIRED"
  | "FAILED"
  | "UNDER_REVIEW";

/** States from which no further transition is possible. */
export const TERMINAL_TRADE_STATES: readonly TradeState[] = [
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
  "FAILED",
] as const;

export type TradeEventType =
  | "trade_created"
  | "rate_proposed"
  | "rate_countered"
  | "rate_locked"
  | "funds_reserved"
  | "buyer_marked_paid"
  | "payment_verified"
  | "seller_confirmed"
  | "settlement_initiated"
  | "settlement_completed"
  | "trade_cancelled"
  | "trade_expired"
  | "dispute_opened"
  | "dispute_resolved"
  | "admin_action";

export interface TradeEvent {
  id: string;
  tradeId: string;
  type: TradeEventType;
  label: string;
  description: string | null;
  /** Who caused it — null for system/provider-driven transitions. */
  actorId: string | null;
  actorLabel: string | null;
  createdAt: ISODateString;
}

export interface TradeMessage {
  id: string;
  tradeId: string;
  senderId: string | null;
  /** System messages (rate locks, warnings) render differently. */
  kind: "text" | "system" | "evidence";
  body: string;
  attachmentUrl: string | null;
  createdAt: ISODateString;
  readAt: ISODateString | null;
}

export interface TradeEvidence {
  id: string;
  tradeId: string;
  uploadedById: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  paymentReference: string | null;
  uploadedAt: ISODateString;
}

export interface RateNegotiation {
  id: string;
  tradeId: string;
  proposedBy: "buyer" | "seller";
  rate: ScaledRate;
  status: "proposed" | "countered" | "accepted" | "rejected" | "expired";
  createdAt: ISODateString;
}

export interface TradeFees {
  grossNgn: Minor;
  platformFeeNgn: Minor;
  settlementFeeNgn: Minor;
  netNgn: Minor;
}

export interface Trade {
  id: string;
  /** Public reference, e.g. "SCX-84921". */
  reference: string;
  offerId: string | null;
  state: TradeState;
  /** Side from the perspective of the signed-in user. */
  side: TradeSide;
  buyer: TraderSummary;
  seller: TraderSummary;
  amountRmb: Minor;
  rate: ScaledRate;
  /** Reference mid-market rate at lock time, for the transparency panel. */
  marketRate: ScaledRate;
  amountNgn: Minor;
  fees: TradeFees;
  rail: PaymentRail;
  /** Where the buyer sends RMB — supplied by the payment provider, never hard-coded. */
  payeeLabel: string | null;
  payeeAccount: string | null;
  createdAt: ISODateString;
  paymentDeadline: ISODateString | null;
  completedAt: ISODateString | null;
  events: TradeEvent[];
  messages: TradeMessage[];
  evidence: TradeEvidence[];
  negotiations: RateNegotiation[];
  disputeId: string | null;
  rating: TradeRating | null;
}

export interface TradeRating {
  id: string;
  tradeId: string;
  raterId: string;
  rateeId: string;
  stars: number;
  review: string | null;
  createdAt: ISODateString;
}

// ---------------------------------------------------------------------------
// Disputes (PRD §19, §20)
// ---------------------------------------------------------------------------

export type DisputeReason =
  | "payment_not_received"
  | "seller_not_confirmed"
  | "buyer_claims_payment"
  | "wrong_amount"
  | "wrong_account"
  | "suspected_fraud"
  | "other";

export type DisputeStatus =
  | "open"
  | "awaiting_evidence"
  | "under_review"
  | "escalated"
  | "resolved_buyer"
  | "resolved_seller"
  | "cancelled";

export interface Dispute {
  id: string;
  reference: string;
  tradeId: string;
  tradeReference: string;
  raisedById: string;
  raisedByUsername: string;
  againstUsername: string;
  reason: DisputeReason;
  reasonLabel: string;
  description: string;
  status: DisputeStatus;
  priority: "low" | "medium" | "high" | "critical";
  amountRmb: Minor;
  amountNgn: Minor;
  assignedToId: string | null;
  openedAt: ISODateString;
  resolvedAt: ISODateString | null;
  resolutionNote: string | null;
}

// ---------------------------------------------------------------------------
// Risk engine (PRD §29)
// ---------------------------------------------------------------------------

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type RiskSignal =
  | "new_account"
  | "unusual_amount"
  | "rapid_activity"
  | "multiple_accounts"
  | "repeated_disputes"
  | "high_cancellation"
  | "suspicious_payment"
  | "device_anomaly"
  | "behaviour_change";

export interface RiskEvent {
  id: string;
  level: RiskLevel;
  signal: RiskSignal;
  title: string;
  description: string;
  score: number;
  userId: string | null;
  username: string | null;
  tradeReference: string | null;
  amountLabel: string | null;
  status: "open" | "reviewing" | "cleared" | "actioned";
  createdAt: ISODateString;
}

/** PRD §29 score bands. */
export function riskLevelFromScore(score: number): RiskLevel {
  if (score <= 30) return "low";
  if (score <= 60) return "medium";
  if (score <= 80) return "high";
  return "critical";
}

// ---------------------------------------------------------------------------
// Settlement (PRD §15, §40, §44)
// ---------------------------------------------------------------------------

export type SettlementStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "reversed";

export interface Settlement {
  id: string;
  reference: string;
  tradeId: string;
  tradeReference: string;
  provider: string;
  currency: Currency;
  amount: Minor;
  status: SettlementStatus;
  /** PRD §43 — every settlement request carries one. */
  idempotencyKey: string;
  createdAt: ISODateString;
  settledAt: ISODateString | null;
  failureReason: string | null;
}

// ---------------------------------------------------------------------------
// Notifications (PRD §27)
// ---------------------------------------------------------------------------

export type NotificationCategory =
  | "trade"
  | "payment"
  | "security"
  | "kyc"
  | "dispute"
  | "system";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: ISODateString;
}

// ---------------------------------------------------------------------------
// Admin (PRD §34, §35, §36)
// ---------------------------------------------------------------------------

export type AdminRole =
  | "super_admin"
  | "operations_admin"
  | "compliance_officer"
  | "dispute_officer"
  | "support_agent";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel: string;
  initials: string;
  status: "active" | "suspended";
  lastActiveAt: ISODateString;
  createdAt: ISODateString;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminLabel: string;
  action: string;
  target: string;
  targetType: "trade" | "user" | "offer" | "settlement" | "setting" | "dispute";
  reason: string | null;
  ipAddress: string;
  createdAt: ISODateString;
}

// ---------------------------------------------------------------------------
// Analytics shapes used by dashboards
// ---------------------------------------------------------------------------

/**
 * A day on the volume chart.
 *
 * Both plotted series share ONE unit — millions of RMB — because a chart with
 * two y-scales cannot be read honestly. The NGN leg is converted at the
 * reference rate for plotting, and its native ₦ value is carried alongside so
 * the tooltip can still show the figure a Nigerian trader actually cares about.
 */
export interface TrendPoint {
  date: ISODateString;
  /** ¥ millions. */
  rmb: number;
  /** ¥ millions — NGN volume converted at the reference rate, for plotting. */
  ngnAsRmb: number;
  /** ₦ billions — the native figure, shown in the tooltip only. */
  ngnNative: number;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string;
  deltaPercent: number;
  deltaLabel: string;
  /** Normalised 0–1 values for the inline sparkline. */
  spark: number[];
  tone: "brand" | "success" | "warning" | "danger" | "rmb" | "ngn" | "neutral";
}
