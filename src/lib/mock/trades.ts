import { ahead, NOW } from "../date";
import { applyBps, convertRmbToNgn, formatRate, toMinor, toScaledRate } from "../money";
import { clampRate, proposalBounds, type NegotiationResult } from "../negotiation";
import type { Minor, Offer, RateNegotiation, Trade, TradeFees, TradeState } from "../types";
import { marketReferenceRate } from "./offers";
import { traders } from "./users";

/**
 * Seed trades.
 *
 * Note on references: the supplied designs show SCX-84921 both mid-trade and
 * completed — the same trade at two moments. History and the success screen
 * both list it as completed, so SCX-84921 is seeded COMPLETED and the live
 * trade room is driven by SCX-84930, which carries identical figures.
 */

/** PRD §31 — platform fee, configurable from admin, never hard-coded in trade logic. */
export const PLATFORM_FEE_BPS = 10; // 0.10%
export const SETTLEMENT_FEE_NGN = 0;

export function computeFees(grossNgn: number): TradeFees {
  const platformFeeNgn = applyBps(grossNgn, PLATFORM_FEE_BPS);
  const settlementFeeNgn = SETTLEMENT_FEE_NGN;
  return {
    grossNgn,
    platformFeeNgn,
    settlementFeeNgn,
    netNgn: grossNgn - platformFeeNgn - settlementFeeNgn,
  };
}

const rate219 = toScaledRate(219);
const amount10k = toMinor(10_000);
const gross10k = convertRmbToNgn(amount10k, rate219);

// ---------------------------------------------------------------------------
// SCX-84930 — live trade room: RMB secured, awaiting buyer payment
// ---------------------------------------------------------------------------

export const activeTrade: Trade = {
  id: "trd_84930",
  reference: "SCX-84930",
  offerId: "off_mine_1",
  state: "FUNDS_RESERVED",
  side: "sell",
  buyer: traders.tonyfx,
  seller: traders.wealth,
  amountRmb: amount10k,
  rate: rate219,
  marketRate: marketReferenceRate,
  amountNgn: gross10k,
  fees: computeFees(gross10k),
  rail: "alipay",
  payeeLabel: "ScarExchange Official",
  payeeAccount: "138 0000 8888",
  createdAt: "2026-08-31T10:32:00+01:00",
  paymentDeadline: ahead(14.5, "min"),
  completedAt: null,
  disputeId: null,
  rating: null,
  negotiations: [
    {
      id: "neg_1",
      tradeId: "trd_84930",
      proposedBy: "seller",
      rate: toScaledRate(220),
      status: "countered",
      createdAt: "2026-08-31T10:33:30+01:00",
    },
    {
      id: "neg_2",
      tradeId: "trd_84930",
      proposedBy: "buyer",
      rate: rate219,
      status: "accepted",
      createdAt: "2026-08-31T10:34:00+01:00",
    },
  ],
  events: [
    {
      id: "ev_1",
      tradeId: "trd_84930",
      type: "trade_created",
      label: "Trade Created",
      description: null,
      actorId: traders.tonyfx.id,
      actorLabel: "TonyFX",
      createdAt: "2026-08-31T10:32:00+01:00",
    },
    {
      id: "ev_2",
      tradeId: "trd_84930",
      type: "rate_locked",
      label: "Rate Locked",
      description: "Both parties agreed ₦219.00 per RMB.",
      actorId: null,
      actorLabel: "ScarExchange",
      createdAt: "2026-08-31T10:36:00+01:00",
    },
    {
      id: "ev_3",
      tradeId: "trd_84930",
      type: "funds_reserved",
      label: "RMB Secured",
      description: "Waiting for payment",
      actorId: null,
      actorLabel: "ScarExchange",
      createdAt: "2026-08-31T10:37:00+01:00",
    },
  ],
  messages: [
    {
      id: "msg_1",
      tradeId: "trd_84930",
      senderId: traders.tonyfx.id,
      kind: "text",
      body: "Hello, I want to buy ¥10,000",
      attachmentUrl: null,
      createdAt: "2026-08-31T10:33:00+01:00",
      readAt: "2026-08-31T10:33:10+01:00",
    },
    {
      id: "msg_2",
      tradeId: "trd_84930",
      senderId: traders.wealth.id,
      kind: "text",
      body: "Hello! Sure, I can sell to you.",
      attachmentUrl: null,
      createdAt: "2026-08-31T10:33:40+01:00",
      readAt: "2026-08-31T10:33:50+01:00",
    },
    {
      id: "msg_3",
      tradeId: "trd_84930",
      senderId: traders.tonyfx.id,
      kind: "text",
      body: "Can you do ₦219?",
      attachmentUrl: null,
      createdAt: "2026-08-31T10:34:00+01:00",
      readAt: "2026-08-31T10:34:05+01:00",
    },
    {
      id: "msg_4",
      tradeId: "trd_84930",
      senderId: traders.wealth.id,
      kind: "text",
      body: "Yes, ₦219 is my best rate.",
      attachmentUrl: null,
      createdAt: "2026-08-31T10:34:40+01:00",
      readAt: "2026-08-31T10:34:50+01:00",
    },
    {
      id: "msg_5",
      tradeId: "trd_84930",
      senderId: traders.tonyfx.id,
      kind: "text",
      body: "Okay, let's proceed.",
      attachmentUrl: null,
      createdAt: "2026-08-31T10:35:00+01:00",
      readAt: "2026-08-31T10:35:10+01:00",
    },
    {
      id: "msg_6",
      tradeId: "trd_84930",
      senderId: null,
      kind: "system",
      body: "Rate locked at ₦219.00",
      attachmentUrl: null,
      createdAt: "2026-08-31T10:36:00+01:00",
      readAt: null,
    },
  ],
  evidence: [],
};

// ---------------------------------------------------------------------------
// SCX-84921 — completed, drives the success screen and history detail
// ---------------------------------------------------------------------------

export const completedTrade: Trade = {
  id: "trd_84921",
  reference: "SCX-84921",
  offerId: "off_mine_1",
  state: "COMPLETED",
  side: "sell",
  buyer: traders.tonyfx,
  seller: traders.wealth,
  amountRmb: amount10k,
  rate: rate219,
  marketRate: toScaledRate(219.5),
  amountNgn: gross10k,
  fees: computeFees(gross10k),
  rail: "alipay",
  payeeLabel: "ScarExchange Official",
  payeeAccount: "138 0000 8888",
  createdAt: "2026-08-31T10:30:00+01:00",
  paymentDeadline: null,
  completedAt: "2026-08-31T10:46:00+01:00",
  disputeId: null,
  rating: null,
  negotiations: [],
  events: [
    {
      id: "cev_1",
      tradeId: "trd_84921",
      type: "trade_created",
      label: "Trade created",
      description: null,
      actorId: traders.tonyfx.id,
      actorLabel: "TonyFX",
      createdAt: "2026-08-31T10:30:00+01:00",
    },
    {
      id: "cev_2",
      tradeId: "trd_84921",
      type: "rate_locked",
      label: "Rate agreed",
      description: "₦219.00 per RMB",
      actorId: null,
      actorLabel: "ScarExchange",
      createdAt: "2026-08-31T10:33:00+01:00",
    },
    {
      id: "cev_3",
      tradeId: "trd_84921",
      type: "funds_reserved",
      label: "RMB secured",
      description: null,
      actorId: null,
      actorLabel: "ScarExchange",
      createdAt: "2026-08-31T10:35:00+01:00",
    },
    {
      id: "cev_4",
      tradeId: "trd_84921",
      type: "buyer_marked_paid",
      label: "Buyer Paid (RMB)",
      description: "Payment received via Alipay",
      actorId: traders.tonyfx.id,
      actorLabel: "TonyFX",
      createdAt: "2026-08-31T10:38:00+01:00",
    },
    {
      id: "cev_5",
      tradeId: "trd_84921",
      type: "payment_verified",
      label: "Payment Confirmed",
      description: "You confirmed receipt of payment",
      actorId: traders.wealth.id,
      actorLabel: "You",
      createdAt: "2026-08-31T10:40:00+01:00",
    },
    {
      id: "cev_6",
      tradeId: "trd_84921",
      type: "settlement_completed",
      label: "Naira Released",
      description: "Naira sent to your bank account",
      actorId: null,
      actorLabel: "ScarExchange",
      createdAt: "2026-08-31T10:46:00+01:00",
    },
  ],
  messages: [],
  evidence: [
    {
      id: "evd_1",
      tradeId: "trd_84921",
      uploadedById: traders.tonyfx.id,
      fileName: "alipay-receipt.png",
      fileType: "image/png",
      fileSize: 284_112,
      paymentReference: "2026083122001438201234567890",
      uploadedAt: "2026-08-31T10:38:20+01:00",
    },
  ],
};

// ---------------------------------------------------------------------------
// Transaction history (PRD §23) — matches the History design
// ---------------------------------------------------------------------------

interface HistorySeed {
  reference: string;
  side: "buy" | "sell";
  rmb: number;
  rate: number;
  state: TradeState;
  at: string;
  rail: "alipay" | "wechat";
  bank: string;
}

const historySeeds: HistorySeed[] = [
  { reference: "SCX-84921", side: "buy", rmb: 10_000, rate: 219, state: "COMPLETED", at: "2026-08-31T10:46:00+01:00", rail: "alipay", bank: "GTBank" },
  { reference: "SCX-84876", side: "sell", rmb: 5_000, rate: 218, state: "COMPLETED", at: "2026-08-30T16:12:00+01:00", rail: "wechat", bank: "Access Bank" },
  { reference: "SCX-84730", side: "buy", rmb: 20_000, rate: 220, state: "PAYMENT_PENDING", at: "2026-08-30T11:23:00+01:00", rail: "alipay", bank: "GTBank" },
  { reference: "SCX-84672", side: "sell", rmb: 8_000, rate: 217, state: "COMPLETED", at: "2026-08-29T20:45:00+01:00", rail: "wechat", bank: "Zenith Bank" },
  { reference: "SCX-84511", side: "buy", rmb: 15_000, rate: 219, state: "DISPUTED", at: "2026-08-28T14:17:00+01:00", rail: "alipay", bank: "GTBank" },
  { reference: "SCX-84392", side: "sell", rmb: 12_000, rate: 216, state: "COMPLETED", at: "2026-08-27T09:31:00+01:00", rail: "wechat", bank: "Fidelity Bank" },
  { reference: "SCX-84218", side: "buy", rmb: 6_000, rate: 218, state: "CANCELLED", at: "2026-08-26T18:52:00+01:00", rail: "alipay", bank: "UBA" },
  { reference: "SCX-84102", side: "sell", rmb: 9_000, rate: 217.5, state: "COMPLETED", at: "2026-08-25T13:04:00+01:00", rail: "alipay", bank: "GTBank" },
  { reference: "SCX-83988", side: "buy", rmb: 4_500, rate: 218.5, state: "COMPLETED", at: "2026-08-24T15:40:00+01:00", rail: "wechat", bank: "Access Bank" },
  { reference: "SCX-83870", side: "sell", rmb: 25_000, rate: 216.5, state: "COMPLETED", at: "2026-08-23T10:12:00+01:00", rail: "alipay", bank: "GTBank" },
  { reference: "SCX-83744", side: "buy", rmb: 7_500, rate: 219.5, state: "COMPLETED", at: "2026-08-22T17:28:00+01:00", rail: "wechat", bank: "Zenith Bank" },
  { reference: "SCX-83610", side: "sell", rmb: 11_000, rate: 218, state: "COMPLETED", at: "2026-08-21T08:55:00+01:00", rail: "alipay", bank: "GTBank" },
  { reference: "SCX-83502", side: "buy", rmb: 3_000, rate: 220.5, state: "COMPLETED", at: "2026-08-20T12:33:00+01:00", rail: "alipay", bank: "UBA" },
  { reference: "SCX-83415", side: "sell", rmb: 18_000, rate: 217, state: "COMPLETED", at: "2026-08-19T19:07:00+01:00", rail: "wechat", bank: "Fidelity Bank" },
];

/** Metadata the history table shows alongside each row. */
export const historyRails = new Map(historySeeds.map((s) => [s.reference, s.rail]));
export const historyBanks = new Map(historySeeds.map((s) => [s.reference, s.bank]));

function seedToTrade(seed: HistorySeed): Trade {
  const rate = toScaledRate(seed.rate);
  const amountRmb = toMinor(seed.rmb);
  const gross = convertRmbToNgn(amountRmb, rate);
  const counterparty =
    seed.side === "buy" ? traders.tonyfx : traders.chinahub;

  return {
    id: `trd_${seed.reference.replace("SCX-", "")}`,
    reference: seed.reference,
    offerId: null,
    state: seed.state,
    side: seed.side,
    buyer: seed.side === "buy" ? traders.wealth : counterparty,
    seller: seed.side === "buy" ? counterparty : traders.wealth,
    amountRmb,
    rate,
    marketRate: marketReferenceRate,
    amountNgn: gross,
    fees: computeFees(gross),
    rail: seed.rail,
    payeeLabel: "ScarExchange Official",
    payeeAccount: "138 0000 8888",
    createdAt: seed.at,
    paymentDeadline: null,
    completedAt: seed.state === "COMPLETED" ? seed.at : null,
    disputeId: seed.state === "DISPUTED" ? "dsp_84511" : null,
    rating: null,
    negotiations: [],
    events: [],
    messages: [],
    evidence: [],
  };
}

export const tradeHistory: Trade[] = historySeeds.map(seedToTrade);

/** Every seeded trade, keyed for lookup by public reference. */
export const allTrades: Trade[] = [
  activeTrade,
  completedTrade,
  ...tradeHistory.filter((t) => t.reference !== completedTrade.reference),
];

export const activeTrades: Trade[] = allTrades.filter(
  (t) => t.state === "FUNDS_RESERVED" || t.state === "PAYMENT_PENDING",
);

// ---------------------------------------------------------------------------
// Trade creation — the real "Buy"/"Sell" flow, not a seed
// ---------------------------------------------------------------------------
//
// Not a database — an in-memory array that lives for this server process,
// the same footing as every other piece of "no DB yet" state this phase
// runs on (see api.ts's header comment: swapping this for real persistence
// later is a one-line change per function, no screen edits). Resets on
// restart, and isn't safe for concurrent users — fine for a single-user
// mock preview, not fine past it.

export const createdTrades: Trade[] = [];
let createdSequence = 90000;

/**
 * Trade starts one step past rate negotiation: rate already locked, RMB
 * already reserved, waiting on the buyer's payment. `negotiation` (PRD §13),
 * when supplied, is a real chat transcript the buyer just had on the offer
 * page (see `lib/negotiation.ts` + `RateNegotiationPanel`) — its final rate
 * is re-clamped against the same bounds the client UI enforced, never
 * trusted as-is, the same discipline `amountRmb` already gets below.
 * Omitted, the trade simply accepts the offer's listed rate outright.
 */
export function createTradeFromOffer(
  offer: Offer,
  amountRmb: Minor,
  negotiation?: NegotiationResult,
): Trade {
  createdSequence += 1;
  const id = `trd_${createdSequence}`;
  const reference = `SCX-${createdSequence}`;
  const now = NOW.toISOString();

  // The offer's side is the counterparty's side — the signed-in user takes the other one.
  const isBuying = offer.side === "sell";
  const counterparty = offer.trader;
  const buyer = isBuying ? traders.wealth : counterparty;
  const seller = isBuying ? counterparty : traders.wealth;

  const bounds = proposalBounds(offer.rate, isBuying ? "Buy" : "Sell");
  const rate = negotiation
    ? clampRate(negotiation.finalRate, Math.min(bounds.min, bounds.max), Math.max(bounds.min, bounds.max))
    : offer.rate;

  const amountNgn = convertRmbToNgn(amountRmb, rate);
  const rail = offer.rails[0];

  const negotiations: RateNegotiation[] = negotiation
    ? negotiation.transcript.map((turn, i) => ({
        id: `neg_${id}_${i + 1}`,
        tradeId: id,
        proposedBy: turn.by,
        rate: turn.rate,
        status: i === negotiation.transcript.length - 1 ? "accepted" : "countered",
        createdAt: now,
      }))
    : [
        {
          id: `neg_${id}_1`,
          tradeId: id,
          proposedBy: isBuying ? "seller" : "buyer",
          rate: offer.rate,
          status: "accepted",
          createdAt: now,
        },
      ];

  const rateMessage = negotiation
    ? `Rate negotiated from ${formatRate(offer.rate)} to ${formatRate(rate)}/RMB and locked.`
    : `Trade opened at ${offer.trader.username}'s listed rate of ${formatRate(offer.rate)}/RMB.`;

  const trade: Trade = {
    id,
    reference,
    offerId: offer.id,
    state: "FUNDS_RESERVED",
    side: isBuying ? "buy" : "sell",
    buyer,
    seller,
    amountRmb,
    rate,
    marketRate: marketReferenceRate,
    amountNgn,
    fees: computeFees(amountNgn),
    rail,
    payeeLabel: "ScarExchange Official",
    payeeAccount: rail === "wechat" ? "ScarExchange_Escrow" : "138 0000 8888",
    createdAt: now,
    paymentDeadline: ahead(15, "min"),
    completedAt: null,
    disputeId: null,
    rating: null,
    negotiations,
    events: [
      {
        id: `ev_${id}_1`,
        tradeId: id,
        type: "trade_created",
        label: "Trade Created",
        description: null,
        actorId: counterparty.id,
        actorLabel: counterparty.username,
        createdAt: now,
      },
      {
        id: `ev_${id}_2`,
        tradeId: id,
        type: "rate_locked",
        label: "Rate Locked",
        description: `Both parties agreed ${formatRate(rate)} per RMB.`,
        actorId: null,
        actorLabel: "ScarExchange",
        createdAt: now,
      },
      {
        id: `ev_${id}_3`,
        tradeId: id,
        type: "funds_reserved",
        label: "RMB Secured",
        description: "Waiting for payment",
        actorId: null,
        actorLabel: "ScarExchange",
        createdAt: now,
      },
    ],
    messages: [
      {
        id: `msg_${id}_1`,
        tradeId: id,
        senderId: null,
        kind: "system",
        body: rateMessage,
        attachmentUrl: null,
        createdAt: now,
        readAt: null,
      },
    ],
    evidence: [],
  };

  createdTrades.push(trade);
  return trade;
}

// ---------------------------------------------------------------------------
// History summary tiles
// ---------------------------------------------------------------------------

export const historySummary = {
  totalTrades: 24,
  totalTradesDeltaPercent: 12,
  totalSpentRmb: toMinor(318_000),
  totalSpentDeltaPercent: 8,
  totalReceivedNgn: toMinor(69_540_000),
  totalReceivedDeltaPercent: 15,
  completionRate: 1,
  completedCount: 24,
};
