import { cn } from "@/lib/utils";

/**
 * A single-value completion ring (KYC progress, verification benefits).
 *
 * This is a hero number with a gauge around it, not a chart — one value, no
 * axis, no legend, no hover. The percentage is written in the middle so the
 * ring never has to be measured by eye.
 */
export function ProgressRing({
  value,
  size = 132,
  thickness = 10,
  color = "var(--color-success-500)",
  trackColor,
  label,
  className,
  children,
}: {
  /** 0–100. */
  value: number;
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        role="img"
        aria-label={label ? `${label}: ${clamped}% complete` : `${clamped}% complete`}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor ?? "var(--color-neutral-200)"}
          strokeWidth={thickness}
          className={trackColor ? undefined : "dark:stroke-neutral-800"}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center">
        {children ?? (
          <div>
            <p className="tabular text-2xl font-bold text-neutral-900 dark:text-white">
              {Math.round(clamped)}%
            </p>
            {label && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Horizontal usage meter for trading limits. */
export function UsageMeter({
  fraction,
  color = "var(--color-brand-600)",
  className,
}: {
  fraction: number;
  color?: string;
  className?: string;
}) {
  const percent = Math.min(100, Math.max(0, fraction * 100));
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800",
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
    </div>
  );
}
