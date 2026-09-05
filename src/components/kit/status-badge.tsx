import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock,
  Loader2,
  Lock,
  ShieldCheck,
  TimerOff,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DisputeStatus, OfferStatus, RiskLevel, SettlementStatus, TradeState, UserStatus } from "@/lib/types";

/**
 * One badge vocabulary for the whole product. Colour carries meaning here —
 * green is settled, amber is waiting on someone, red needs attention — so it
 * is defined once rather than re-picked per screen.
 */

export type BadgeTone = "success" | "warning" | "danger" | "neutral" | "brand" | "purple";

const toneClasses: Record<BadgeTone, string> = {
  success: "bg-success-50 text-success-700 ring-success-200 dark:bg-success-900/25 dark:text-success-200 dark:ring-success-700/40",
  warning: "bg-warning-50 text-warning-700 ring-warning-200 dark:bg-warning-700/20 dark:text-warning-200 dark:ring-warning-700/40",
  danger: "bg-danger-50 text-danger-700 ring-danger-200 dark:bg-danger-700/20 dark:text-danger-200 dark:ring-danger-700/40",
  neutral: "bg-neutral-100 text-neutral-600 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700",
  brand: "bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-900/30 dark:text-brand-200 dark:ring-brand-700/40",
  purple: "bg-[#f4f3ff] text-[#5925dc] ring-[#e0e0ff] dark:bg-[#5925dc]/20 dark:text-[#c3b5fd] dark:ring-[#5925dc]/40",
};

interface StatusPillProps {
  tone: BadgeTone;
  icon?: LucideIcon | null;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export function StatusPill({
  tone,
  icon: Icon,
  children,
  className,
  size = "sm",
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-[13px]",
        toneClasses[tone],
        className,
      )}
    >
      {Icon && <Icon className={size === "sm" ? "size-3.5" : "size-4"} strokeWidth={2.2} />}
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Trade state
// ---------------------------------------------------------------------------

const tradeStateMeta: Record<TradeState, { label: string; tone: BadgeTone; icon: LucideIcon }> = {
  TRADE_CREATED: { label: "Created", tone: "brand", icon: Clock },
  RATE_LOCKED: { label: "Rate Locked", tone: "brand", icon: Lock },
  FUNDS_RESERVED: { label: "RMB Secured", tone: "success", icon: ShieldCheck },
  PAYMENT_PENDING: { label: "Pending", tone: "warning", icon: Clock },
  BUYER_MARKED_PAID: { label: "Payment Sent", tone: "warning", icon: Clock },
  PAYMENT_VERIFICATION: { label: "Verifying", tone: "warning", icon: Loader2 },
  SELLER_CONFIRMED: { label: "Confirmed", tone: "brand", icon: CheckCircle2 },
  NGN_SETTLEMENT: { label: "Settling", tone: "brand", icon: Loader2 },
  COMPLETED: { label: "Completed", tone: "success", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", tone: "neutral", icon: XCircle },
  DISPUTED: { label: "Disputed", tone: "danger", icon: AlertTriangle },
  EXPIRED: { label: "Expired", tone: "neutral", icon: TimerOff },
  FAILED: { label: "Failed", tone: "danger", icon: XCircle },
  UNDER_REVIEW: { label: "Under Review", tone: "warning", icon: AlertTriangle },
};

export function TradeStateBadge({
  state,
  size = "sm",
  className,
}: {
  state: TradeState;
  size?: "sm" | "md";
  className?: string;
}) {
  const meta = tradeStateMeta[state];
  return (
    <StatusPill tone={meta.tone} icon={meta.icon} size={size} className={className}>
      {meta.label}
    </StatusPill>
  );
}

export function tradeStateLabel(state: TradeState): string {
  return tradeStateMeta[state].label;
}

// ---------------------------------------------------------------------------
// Trade side
// ---------------------------------------------------------------------------

export function SideBadge({
  side,
  className,
}: {
  side: "buy" | "sell";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold capitalize",
        side === "buy"
          ? "bg-buy-soft text-buy dark:bg-success-900/30 dark:text-success-200"
          : "bg-sell-soft text-sell dark:bg-danger-700/20 dark:text-danger-200",
        className,
      )}
    >
      {side}
    </span>
  );
}

// ---------------------------------------------------------------------------
// User, offer, dispute, settlement, risk
// ---------------------------------------------------------------------------

const userStatusMeta: Record<UserStatus, { label: string; tone: BadgeTone }> = {
  unverified: { label: "Unverified", tone: "neutral" },
  pending: { label: "Pending", tone: "warning" },
  verified: { label: "Verified", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
  restricted: { label: "Restricted", tone: "warning" },
  suspended: { label: "Suspended", tone: "danger" },
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const meta = userStatusMeta[status];
  return <StatusPill tone={meta.tone}>{meta.label}</StatusPill>;
}

const offerStatusMeta: Record<OfferStatus, { label: string; tone: BadgeTone }> = {
  active: { label: "Active", tone: "success" },
  paused: { label: "Paused", tone: "neutral" },
  suspended: { label: "Suspended", tone: "danger" },
  expired: { label: "Expired", tone: "neutral" },
  filled: { label: "Filled", tone: "brand" },
};

export function OfferStatusBadge({ status }: { status: OfferStatus }) {
  const meta = offerStatusMeta[status];
  return <StatusPill tone={meta.tone}>{meta.label}</StatusPill>;
}

const disputeStatusMeta: Record<DisputeStatus, { label: string; tone: BadgeTone }> = {
  open: { label: "Open", tone: "danger" },
  awaiting_evidence: { label: "Awaiting Evidence", tone: "warning" },
  under_review: { label: "Under Review", tone: "warning" },
  escalated: { label: "Escalated", tone: "danger" },
  resolved_buyer: { label: "Resolved — Buyer", tone: "success" },
  resolved_seller: { label: "Resolved — Seller", tone: "success" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export function DisputeStatusBadge({
  status,
  size = "sm",
  className,
}: {
  status: DisputeStatus;
  size?: "sm" | "md";
  className?: string;
}) {
  const meta = disputeStatusMeta[status];
  return (
    <StatusPill tone={meta.tone} size={size} className={className}>
      {meta.label}
    </StatusPill>
  );
}

const settlementStatusMeta: Record<SettlementStatus, { label: string; tone: BadgeTone; icon: LucideIcon }> = {
  queued: { label: "Queued", tone: "neutral", icon: Clock },
  processing: { label: "Processing", tone: "warning", icon: Loader2 },
  completed: { label: "Completed", tone: "success", icon: CheckCircle2 },
  failed: { label: "Failed", tone: "danger", icon: XCircle },
  reversed: { label: "Reversed", tone: "neutral", icon: Ban },
};

export function SettlementStatusBadge({ status }: { status: SettlementStatus }) {
  const meta = settlementStatusMeta[status];
  return (
    <StatusPill tone={meta.tone} icon={meta.icon}>
      {meta.label}
    </StatusPill>
  );
}

const riskMeta: Record<RiskLevel, { label: string; tone: BadgeTone }> = {
  low: { label: "Low", tone: "success" },
  medium: { label: "Medium", tone: "warning" },
  high: { label: "High", tone: "danger" },
  critical: { label: "Critical", tone: "danger" },
};

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  const meta = riskMeta[level];
  return <StatusPill tone={meta.tone}>{meta.label}</StatusPill>;
}
