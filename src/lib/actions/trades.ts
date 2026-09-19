"use server";

import { redirect } from "next/navigation";
import { createTrade } from "@/lib/api";
import type { NegotiationResult } from "@/lib/negotiation";
import type { Minor } from "@/lib/types";

/**
 * The real "Buy"/"Sell" action from an offer's detail page. Only an offer id,
 * an amount, and an optional negotiation transcript cross the wire from the
 * client — everything else (rate bounds, counterparty, fees) is re-derived
 * or re-clamped server-side from the real offer, per the framework's own
 * guidance: never trust more than a reference plus the user's change.
 */
export async function createTradeAction(
  offerId: string,
  amountRmb: Minor,
  negotiation?: NegotiationResult,
) {
  const trade = await createTrade(offerId, amountRmb, negotiation);
  redirect(`/trades/${trade.reference}`);
}
