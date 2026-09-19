import { adminUsers, auditLog, disputes, riskEvents, settlements } from "./mock/admin";
import { notifications } from "./mock/notifications";
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CHANNELS,
  notificationPreferences,
} from "./mock/preferences";
import { buyOffers, myOffers, offers } from "./mock/offers";
import { activeTrades, allTrades, createdTrades, createTradeFromOffer, tradeHistory } from "./mock/trades";
import type { NegotiationResult } from "./negotiation";
import {
  currentUser,
  currentUserBankAccounts,
  currentUserKyc,
  currentUserPaymentMethods,
  traderList,
} from "./mock/users";
import { addWalletEntry, getWalletBalance, walletEntries } from "./mock/wallet";
import type {
  AdminUser,
  AppNotification,
  AuditLogEntry,
  BankAccount,
  Dispute,
  KycVerification,
  Minor,
  NotificationCategory,
  NotificationChannel,
  NotificationPreferences,
  Offer,
  PaymentRail,
  RiskEvent,
  ScaledRate,
  Settlement,
  Trade,
  TradeSide,
  TraderSummary,
  User,
  UserPaymentMethod,
  WalletEntry,
} from "./types";

/**
 * Data access layer.
 *
 * Every screen reads through these functions rather than importing seed data
 * directly. They are async and shaped like the endpoints in PRD §41, so
 * replacing a body with `fetch("/api/offers")` later is a one-line change per
 * function with no screen edits.
 */

/** Async boundary — keeps call sites honest about suspense and loading states. */
async function resolve<T>(value: T): Promise<T> {
  return value;
}

// ---------------------------------------------------------------------------
// Session — GET /me
// ---------------------------------------------------------------------------

export async function getCurrentUser(): Promise<User> {
  return resolve(currentUser);
}

// ---------------------------------------------------------------------------
// Offers — GET /offers
// ---------------------------------------------------------------------------

export type OfferSort = "best_rate" | "fastest" | "highest_rated" | "most_trades";

export interface OfferQuery {
  side?: TradeSide;
  rails?: PaymentRail[];
  minRate?: ScaledRate;
  maxRate?: ScaledRate;
  minAmountRmb?: number;
  maxAmountRmb?: number;
  merchantsOnly?: boolean;
  minCompletionRate?: number;
  search?: string;
  sort?: OfferSort;
}

export async function getOffers(query: OfferQuery = {}): Promise<Offer[]> {
  const { side = "sell", sort = "best_rate" } = query;
  const pool = side === "sell" ? offers : buyOffers;

  const filtered = pool.filter((offer) => {
    if (offer.status !== "active") return false;
    if (query.rails?.length && !offer.rails.some((r) => query.rails!.includes(r))) return false;
    if (query.minRate != null && offer.rate < query.minRate) return false;
    if (query.maxRate != null && offer.rate > query.maxRate) return false;
    if (query.minAmountRmb != null && offer.availableRmb < query.minAmountRmb) return false;
    if (query.maxAmountRmb != null && offer.availableRmb > query.maxAmountRmb) return false;
    if (query.merchantsOnly && !offer.trader.isMerchant) return false;
    if (query.minCompletionRate != null && offer.trader.completionRate < query.minCompletionRate) {
      return false;
    }
    if (query.search) {
      const needle = query.search.toLowerCase();
      if (!offer.trader.username.toLowerCase().includes(needle)) return false;
    }
    return true;
  });

  return resolve(sortOffers(filtered, sort, side));
}

function sortOffers(list: Offer[], sort: OfferSort, side: TradeSide): Offer[] {
  const sorted = [...list];
  switch (sort) {
    case "best_rate":
      // Buyers of RMB want the lowest NGN rate; sellers want the highest.
      return sorted.sort((a, b) => (side === "sell" ? a.rate - b.rate : b.rate - a.rate));
    case "fastest":
      return sorted.sort((a, b) => a.trader.avgReleaseTime - b.trader.avgReleaseTime);
    case "highest_rated":
      return sorted.sort((a, b) => b.trader.rating - a.trader.rating);
    case "most_trades":
      return sorted.sort((a, b) => b.trader.completedTrades - a.trader.completedTrades);
  }
}

export async function getOffer(id: string): Promise<Offer | null> {
  const all = [...offers, ...buyOffers, ...myOffers];
  return resolve(all.find((o) => o.id === id) ?? null);
}

export async function getMyOffers(): Promise<Offer[]> {
  return resolve(myOffers);
}

/** Every offer platform-wide, both sides plus the signed-in user's own (PRD §34 admin Offers screen). */
export async function getAllOffers(): Promise<Offer[]> {
  return resolve([...offers, ...buyOffers, ...myOffers]);
}

/**
 * Quick Trade (PRD §32): surface the single best offer under three lenses so
 * the user picks an intent rather than reading a table.
 */
export async function getQuickTradeMatches(
  side: TradeSide,
  amountRmb: number,
): Promise<{ bestRate: Offer | null; fastest: Offer | null; topRated: Offer | null }> {
  const pool = (side === "sell" ? offers : buyOffers).filter(
    (o) =>
      o.status === "active" &&
      amountRmb >= o.minOrderRmb &&
      amountRmb <= Math.min(o.maxOrderRmb, o.availableRmb),
  );

  if (pool.length === 0) {
    return resolve({ bestRate: null, fastest: null, topRated: null });
  }

  return resolve({
    bestRate: sortOffers(pool, "best_rate", side)[0] ?? null,
    fastest: sortOffers(pool, "fastest", side)[0] ?? null,
    topRated: sortOffers(pool, "highest_rated", side)[0] ?? null,
  });
}

// ---------------------------------------------------------------------------
// Trades — GET /trades, GET /trades/:id
// ---------------------------------------------------------------------------

export interface TradeQuery {
  side?: TradeSide | "all";
  status?: "all" | "completed" | "pending" | "cancelled" | "disputed";
  rails?: PaymentRail[];
  search?: string;
}

export async function getTrades(query: TradeQuery = {}): Promise<Trade[]> {
  const { side = "all", status = "all" } = query;

  const filtered = [...tradeHistory, ...createdTrades].filter((trade) => {
    if (side !== "all" && trade.side !== side) return false;
    if (status !== "all" && statusBucket(trade) !== status) return false;
    if (query.rails?.length && !query.rails.includes(trade.rail)) return false;
    if (query.search) {
      const needle = query.search.toLowerCase();
      const haystack = `${trade.reference} ${trade.buyer.username} ${trade.seller.username}`;
      if (!haystack.toLowerCase().includes(needle)) return false;
    }
    return true;
  });

  return resolve(filtered);
}

/** Collapse the full state machine into the four buckets the UI filters on. */
export function statusBucket(
  trade: Trade,
): "completed" | "pending" | "cancelled" | "disputed" {
  switch (trade.state) {
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
    case "EXPIRED":
    case "FAILED":
      return "cancelled";
    case "DISPUTED":
    case "UNDER_REVIEW":
      return "disputed";
    default:
      return "pending";
  }
}

export async function getTrade(reference: string): Promise<Trade | null> {
  const match = [...allTrades, ...createdTrades].find(
    (t) => t.reference.toLowerCase() === reference.toLowerCase(),
  );
  return resolve(match ?? null);
}

export async function getActiveTrades(): Promise<Trade[]> {
  return resolve([...activeTrades, ...createdTrades]);
}

/**
 * POST /trades — accepts an offer's listed rate outright (no negotiation UI
 * yet) and opens a real trade. The amount is re-clamped to the offer's own
 * limits server-side, never trusted as-is from the client.
 */
export async function createTrade(
  offerId: string,
  amountRmb: Minor,
  negotiation?: NegotiationResult,
): Promise<Trade> {
  const offer = await getOffer(offerId);
  if (!offer) throw new Error(`Offer ${offerId} not found`);

  const ceiling = Math.min(offer.maxOrderRmb, offer.availableRmb);
  const clamped = Math.min(Math.max(amountRmb, offer.minOrderRmb), ceiling);

  return resolve(createTradeFromOffer(offer, clamped, negotiation));
}

// ---------------------------------------------------------------------------
// Traders — GET /traders/:username
// ---------------------------------------------------------------------------

export async function getTraders(): Promise<TraderSummary[]> {
  return resolve(traderList);
}

export async function getTrader(username: string): Promise<TraderSummary | null> {
  const needle = username.toLowerCase().replace(/^@/, "");
  return resolve(traderList.find((t) => t.username.toLowerCase() === needle) ?? null);
}

/** Verified Merchants directory (PRD §47, §33). */
export async function getMerchants(): Promise<TraderSummary[]> {
  return resolve(traderList.filter((t) => t.isMerchant));
}

// ---------------------------------------------------------------------------
// KYC, payment methods, banks
// ---------------------------------------------------------------------------

export async function getKycStatus(): Promise<KycVerification> {
  return resolve(currentUserKyc);
}

export async function getPaymentMethods(): Promise<UserPaymentMethod[]> {
  return resolve(currentUserPaymentMethods);
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  return resolve(currentUserBankAccounts);
}

// ---------------------------------------------------------------------------
// Wallet — GET /wallet, POST /wallet/deposit, POST /wallet/withdraw
// ---------------------------------------------------------------------------

export async function getWallet(): Promise<{ balanceNgn: Minor; entries: WalletEntry[] }> {
  return resolve({
    balanceNgn: getWalletBalance(),
    entries: [...walletEntries].reverse(),
  });
}

function requireOwnBankAccount(bankAccountId: string): BankAccount {
  const account = currentUserBankAccounts.find((a) => a.id === bankAccountId);
  if (!account) throw new Error("That bank account isn't on your profile.");
  return account;
}

export async function depositToWallet(bankAccountId: string, amountNgn: Minor): Promise<WalletEntry> {
  requireOwnBankAccount(bankAccountId);
  if (!Number.isFinite(amountNgn) || amountNgn <= 0) {
    throw new Error("Enter an amount greater than ₦0.");
  }
  return resolve(addWalletEntry("deposit", amountNgn, bankAccountId));
}

export async function withdrawFromWallet(bankAccountId: string, amountNgn: Minor): Promise<WalletEntry> {
  requireOwnBankAccount(bankAccountId);
  if (!Number.isFinite(amountNgn) || amountNgn <= 0) {
    throw new Error("Enter an amount greater than ₦0.");
  }
  if (amountNgn > getWalletBalance()) {
    throw new Error("That's more than your available balance.");
  }
  return resolve(addWalletEntry("withdrawal", amountNgn, bankAccountId));
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export async function getNotifications(): Promise<AppNotification[]> {
  return resolve(notifications);
}

/** GET /me/notification-preferences */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return resolve(structuredClone(notificationPreferences));
}

/**
 * PUT /me/notification-preferences — category and channel arrive as plain
 * strings from a Server Action, so both are checked against the known lists
 * rather than trusted (an unknown key would otherwise silently grow the record).
 */
export async function setNotificationPreference(
  category: NotificationCategory,
  channel: NotificationChannel,
  enabled: boolean,
): Promise<void> {
  if (!NOTIFICATION_CATEGORIES.includes(category) || !NOTIFICATION_CHANNELS.includes(channel)) {
    throw new Error("Unknown notification setting.");
  }
  notificationPreferences[category][channel] = enabled;
  return resolve(undefined);
}

// ---------------------------------------------------------------------------
// Disputes
// ---------------------------------------------------------------------------

export async function getDisputes(): Promise<Dispute[]> {
  return resolve(disputes);
}

/** The signed-in user's own dispute centre (PRD §19) — admin's full queue lives in getDisputes(). */
export async function getMyDisputes(): Promise<Dispute[]> {
  return resolve(disputes.filter((d) => d.raisedById === currentUser.id));
}

export async function getDispute(reference: string): Promise<Dispute | null> {
  const needle = reference.toLowerCase();
  return resolve(
    disputes.find(
      (d) => d.reference.toLowerCase() === needle || d.id.toLowerCase() === needle,
    ) ?? null,
  );
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export async function getRiskEvents(): Promise<RiskEvent[]> {
  return resolve(riskEvents);
}

export async function getSettlements(): Promise<Settlement[]> {
  return resolve(settlements);
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return resolve(adminUsers);
}

export async function getAuditLog(): Promise<AuditLogEntry[]> {
  return resolve(auditLog);
}
