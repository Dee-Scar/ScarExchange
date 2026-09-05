import {
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  FilePlus2,
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatDateTime } from "./date";
import type { Trade, TradeEventType, TradeState } from "./types";

/**
 * The seven-stage journey a trade walks through, derived from the state
 * machine in PRD §16.
 *
 * The stage list is fixed and the current state selects a position within it —
 * so the UI can never invent a step order, and a state added to the machine
 * must be mapped here deliberately rather than silently rendering as "done".
 */

export interface ProgressStage {
  id: string;
  label: string;
  icon: LucideIcon;
  /** The event whose timestamp marks this stage complete. */
  event: TradeEventType;
  /** Shown while this stage is the current one. */
  activeCaption: string;
}

export const TRADE_STAGES: ProgressStage[] = [
  {
    id: "created",
    label: "Trade Created",
    icon: FilePlus2,
    event: "trade_created",
    activeCaption: "Setting up",
  },
  {
    id: "rate_locked",
    label: "Rate Locked",
    icon: Lock,
    event: "rate_locked",
    activeCaption: "Agreeing rate",
  },
  {
    id: "funds_reserved",
    label: "RMB Secured",
    icon: ShieldCheck,
    event: "funds_reserved",
    activeCaption: "Waiting for payment",
  },
  {
    id: "buyer_paid",
    label: "Buyer Paid",
    icon: UserCheck,
    event: "buyer_marked_paid",
    activeCaption: "Payment sent",
  },
  {
    id: "payment_confirmed",
    label: "Payment Confirmed",
    icon: CircleDollarSign,
    event: "payment_verified",
    activeCaption: "Verifying",
  },
  {
    id: "naira_released",
    label: "Naira Released",
    icon: Banknote,
    event: "settlement_completed",
    activeCaption: "Settling",
  },
  {
    id: "completed",
    label: "Trade Completed",
    icon: CheckCircle2,
    event: "settlement_completed",
    activeCaption: "Done",
  },
];

/** How far along the stage list each state sits. */
const STATE_POSITION: Record<TradeState, number> = {
  TRADE_CREATED: 0,
  RATE_LOCKED: 1,
  FUNDS_RESERVED: 2,
  PAYMENT_PENDING: 2,
  BUYER_MARKED_PAID: 3,
  PAYMENT_VERIFICATION: 4,
  SELLER_CONFIRMED: 4,
  NGN_SETTLEMENT: 5,
  COMPLETED: 7,
  // Terminal or exceptional states freeze the walk where it stopped; the
  // surrounding UI shows the reason rather than pretending progress continues.
  CANCELLED: 0,
  DISPUTED: 3,
  EXPIRED: 2,
  FAILED: 3,
  UNDER_REVIEW: 4,
};

export interface ResolvedStage {
  id: string;
  label: string;
  icon: LucideIcon;
  state: "completed" | "current" | "pending";
  caption: string;
}

export function resolveTradeStages(trade: Trade): ResolvedStage[] {
  const position = STATE_POSITION[trade.state];

  return TRADE_STAGES.map((stage, index) => {
    const state: ResolvedStage["state"] =
      index < position ? "completed" : index === position ? "current" : "pending";

    // Prefer the real event timestamp; fall back to a status word.
    const event = trade.events.find((e) => e.type === stage.event);
    const caption =
      state === "completed" && event
        ? formatDateTime(event.createdAt)
        : state === "current"
          ? stage.activeCaption
          : "Pending";

    return { id: stage.id, label: stage.label, icon: stage.icon, state, caption };
  });
}
