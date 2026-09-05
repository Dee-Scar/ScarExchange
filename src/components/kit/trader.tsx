import { BadgeCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCount, formatDuration, formatPercent } from "@/lib/money";
import type { TraderSummary } from "@/lib/types";

/**
 * Trader identity primitives. Reputation is the trust signal in a P2P
 * marketplace (PRD §21), so it is always rendered the same way.
 */

const AVATAR_SIZES = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-20 text-2xl",
} as const;

export function TraderAvatar({
  trader,
  size = "sm",
  className,
}: {
  trader: Pick<TraderSummary, "initials" | "avatarColor" | "username">;
  size?: keyof typeof AVATAR_SIZES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold text-white",
        AVATAR_SIZES[size],
        className,
      )}
      style={{ backgroundColor: trader.avatarColor }}
      aria-label={trader.username}
    >
      {trader.initials}
    </span>
  );
}

/** The blue tick. Only ever shown for genuinely verified accounts. */
export function VerifiedTick({ className }: { className?: string }) {
  return (
    <BadgeCheck
      className={cn("size-4 shrink-0 fill-brand-600 text-white", className)}
      aria-label="Verified"
    />
  );
}

export function MerchantBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-200",
        className,
      )}
    >
      <BadgeCheck className="size-3" strokeWidth={2.4} />
      Verified Merchant
    </span>
  );
}

export function Rating({
  value,
  count,
  className,
  showStar = true,
}: {
  value: number;
  count?: number;
  className?: string;
  showStar?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[13px]", className)}>
      {showStar && <Star className="size-3.5 fill-warning-500 text-warning-500" />}
      <span className="tabular font-medium text-neutral-700 dark:text-neutral-200">
        {value.toFixed(2)}
      </span>
      {count != null && (
        <span className="text-neutral-400">({formatCount(count)})</span>
      )}
    </span>
  );
}

/** Avatar + username + badges — the marketplace table's first column. */
export function TraderCell({
  trader,
  size = "md",
  showStats = true,
  className,
}: {
  trader: TraderSummary;
  size?: keyof typeof AVATAR_SIZES;
  showStats?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <TraderAvatar trader={trader} size={size} />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
            {trader.username}
          </span>
          {trader.verified && <VerifiedTick />}
        </div>
        {showStats && (
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {trader.isMerchant && (
              <span className="text-[11px] font-semibold text-brand-700 dark:text-brand-300">
                Verified Merchant
              </span>
            )}
            <Rating value={trader.rating} className="text-[11px]" />
          </div>
        )}
      </div>
    </div>
  );
}

/** Secondary line: "1,284 trades · 99.8%". */
export function TraderStatsLine({
  trader,
  className,
}: {
  trader: TraderSummary;
  className?: string;
}) {
  return (
    <span className={cn("text-xs text-neutral-500 dark:text-neutral-400", className)}>
      {formatCount(trader.completedTrades)} trades · {formatPercent(trader.completionRate)}
    </span>
  );
}

export function ReleaseTime({
  seconds,
  className,
}: {
  seconds: number;
  className?: string;
}) {
  return (
    <span className={cn("text-[13px] text-neutral-500 dark:text-neutral-400", className)}>
      {formatDuration(seconds)} avg
    </span>
  );
}
