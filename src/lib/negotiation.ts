import type { ScaledRate } from "./types";

/**
 * Rate Negotiation (PRD §13) — "one of ScarExchange's signature features":
 * Original rate → buyer offer → seller counter-offer → buyer accepts → RATE
 * LOCKED. This module is the deterministic engine behind that chat: pure
 * functions shared by the client (renders the exchange live) and the server
 * (re-derives the same bounds to sanity-check whatever final rate a Server
 * Action is handed, the same clamping discipline `createTrade` already
 * applies to amount).
 */

/** Neither side may move more than this far off the listed rate — real negotiation has bounds, not unlimited haggling. */
export const NEGOTIATION_BAND_BPS = 300; // ±3%

/** Rates snap to the nearest 25 kobo so a counter-offer never looks like float noise. */
const RATE_SNAP = 2_500; // ₦0.25 in ScaledRate units (RATE_SCALE = 10,000)

function snap(rate: number): ScaledRate {
  return Math.round(rate / RATE_SNAP) * RATE_SNAP;
}

export function clampRate(rate: ScaledRate, min: ScaledRate, max: ScaledRate): ScaledRate {
  return Math.min(Math.max(rate, min), max);
}

/**
 * The band a proposal must land in. A `"Buy"` action (the signed-in user is
 * buying RMB) only ever proposes below the listed rate; `"Sell"` only above.
 */
export function proposalBounds(
  listedRate: ScaledRate,
  action: "Buy" | "Sell",
): { min: ScaledRate; max: ScaledRate } {
  const delta = snap(Math.round((listedRate * NEGOTIATION_BAND_BPS) / 10_000));
  return action === "Buy"
    ? { min: snap(listedRate - delta), max: listedRate }
    : { min: listedRate, max: snap(listedRate + delta) };
}

/** The counterparty's single deterministic counter-offer — the midpoint, snapped. */
export function counterRate(listedRate: ScaledRate, proposedRate: ScaledRate): ScaledRate {
  return snap((listedRate + proposedRate) / 2);
}

export type NegotiationRole = "buyer" | "seller";

export interface NegotiationTurn {
  by: NegotiationRole;
  rate: ScaledRate;
}

export interface NegotiationResult {
  finalRate: ScaledRate;
  transcript: NegotiationTurn[];
}
