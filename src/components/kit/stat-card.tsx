import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Sparkline } from "@/components/charts/sparkline";
import { cn } from "@/lib/utils";

export type StatTone = "brand" | "success" | "warning" | "danger" | "rmb" | "ngn" | "purple";

const toneStyles: Record<StatTone, { tile: string; icon: string; line: string }> = {
  brand: {
    tile: "bg-brand-50 dark:bg-brand-900/30",
    icon: "text-brand-600 dark:text-brand-300",
    line: "var(--chart-1)",
  },
  success: {
    tile: "bg-success-50 dark:bg-success-900/25",
    icon: "text-success-600 dark:text-success-200",
    line: "var(--chart-2)",
  },
  warning: {
    tile: "bg-warning-50 dark:bg-warning-700/20",
    icon: "text-warning-600 dark:text-warning-200",
    line: "var(--chart-3)",
  },
  danger: {
    tile: "bg-danger-50 dark:bg-danger-700/20",
    icon: "text-danger-600 dark:text-danger-200",
    line: "var(--chart-4)",
  },
  rmb: {
    tile: "bg-danger-50 dark:bg-danger-700/20",
    icon: "text-rmb",
    line: "var(--chart-4)",
  },
  ngn: {
    tile: "bg-success-50 dark:bg-success-900/25",
    icon: "text-ngn",
    line: "var(--chart-2)",
  },
  purple: {
    tile: "bg-[#f4f3ff] dark:bg-[#5925dc]/20",
    icon: "text-[#7a5af8]",
    line: "var(--chart-5)",
  },
};

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: StatTone;
  deltaPercent?: number;
  deltaCaption?: string;
  spark?: number[];
  className?: string;
}

/**
 * KPI tile. The value is the headline, the delta chip carries direction, and
 * the sparkline shows shape — three levels of detail in one glance.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "brand",
  deltaPercent,
  deltaCaption,
  spark,
  className,
}: StatCardProps) {
  const styles = toneStyles[tone];
  const isUp = (deltaPercent ?? 0) >= 0;
  // Only fall back to the comparison caption when there is a delta to compare.
  const caption = deltaCaption ?? (deltaPercent != null ? "vs last 30 days" : undefined);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-card",
        className,
      )}
    >
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", styles.tile)}>
            <Icon className={cn("size-[18px]", styles.icon)} strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
              {label}
            </p>
            <p className="tabular mt-1 truncate text-[22px] font-bold leading-tight tracking-[-0.02em] text-neutral-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>

        {/* A caption can stand alone — some tiles state a ratio rather than a
            change over time. */}
        {(deltaPercent != null || caption) && (
          <div className="mt-2.5 flex items-center gap-1.5">
            {deltaPercent != null && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-[13px] font-semibold",
                  isUp
                    ? "text-success-600 dark:text-success-200"
                    : "text-danger-600 dark:text-danger-200",
                )}
              >
                {isUp ? (
                  <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight className="size-3.5" strokeWidth={2.5} />
                )}
                {Math.abs(deltaPercent).toFixed(1)}%
              </span>
            )}
            {caption && <span className="text-xs text-neutral-400">{caption}</span>}
          </div>
        )}
      </div>

      {spark && spark.length > 1 && (
        <Sparkline data={spark} color={styles.line} className="mt-auto h-14 w-full" />
      )}
    </div>
  );
}

/**
 * Compact metric used inside panels (Platform Health, KYC queue) where a full
 * tile would be too heavy.
 */
export function MiniStat({
  label,
  value,
  delta,
  deltaLabel,
  /** Static caption shown instead of a delta — e.g. "Uptime" for a tile with no trend. */
  caption,
  icon: Icon,
  tone = "brand",
  className,
}: {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  caption?: string;
  icon?: LucideIcon;
  tone?: StatTone;
  className?: string;
}) {
  const styles = toneStyles[tone];
  const isUp = (delta ?? 0) >= 0;

  return (
    <div className={cn("min-w-0", className)}>
      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
      <div className="mt-1.5 flex items-center gap-1.5">
        {Icon && <Icon className={cn("size-4 shrink-0", styles.icon)} strokeWidth={2.2} />}
        <span className="tabular text-lg font-bold text-neutral-900 dark:text-white">
          {value}
        </span>
      </div>
      {delta != null ? (
        <p
          className={cn(
            "mt-0.5 text-[11px] font-medium",
            isUp
              ? "text-success-600 dark:text-success-200"
              : "text-danger-600 dark:text-danger-200",
          )}
        >
          {isUp ? "+" : ""}
          {delta} {deltaLabel ?? "today"}
        </p>
      ) : (
        caption && (
          <p className="mt-0.5 text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
            {caption}
          </p>
        )
      )}
    </div>
  );
}
