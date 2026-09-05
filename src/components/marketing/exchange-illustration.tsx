import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Hero illustration: two currency coins in a continuous exchange loop, over a
 * faint skyline. Built from CSS and SVG rather than a raster asset so it stays
 * sharp at every density and re-themes with the rest of the page.
 *
 * The coins are sized and centred in percentages of the container (not fixed
 * px with a top/left corner anchor) so they scale exactly like the SVG loop
 * beneath them and stay locked to the arrow endpoints at every viewport width.
 */
export function ExchangeIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("group relative aspect-[4/3] w-full max-w-lg", className)}>
      {/* Skyline — a soft sense of place, deliberately far in the background. */}
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 size-full text-brand-100 dark:text-brand-900/40"
        aria-hidden="true"
      >
        <g fill="currentColor" opacity="0.6">
          <rect x="18" y="180" width="30" height="100" rx="3" />
          <rect x="56" y="152" width="22" height="128" rx="3" />
          <rect x="300" y="168" width="26" height="112" rx="3" />
          <rect x="334" y="196" width="34" height="84" rx="3" />
          <path d="M92 280V128l14-10 14 10v152H92Z" />
          <circle cx="106" cy="96" r="13" />
          <rect x="103" y="60" width="6" height="34" rx="3" />
          <path d="M262 280V150l16-14 16 14v130h-32Z" />
        </g>
        <g className="text-brand-200 dark:text-brand-800/50" fill="currentColor" opacity="0.5">
          <ellipse cx="330" cy="66" rx="30" ry="12" />
          <ellipse cx="352" cy="60" rx="20" ry="10" />
          <ellipse cx="66" cy="52" rx="26" ry="10" />
        </g>
      </svg>

      {/* The exchange loop — echoes the coin hover with a gentle bloom. */}
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 size-full origin-center transition-transform duration-500 ease-out group-hover:scale-[1.035]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="loop-red" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f04438" />
            <stop offset="100%" stopColor="#e5484d" />
          </linearGradient>
          <linearGradient id="loop-green" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#039855" />
            <stop offset="100%" stopColor="#12b76a" />
          </linearGradient>
        </defs>
        <path
          d="M148 108c40-30 96-24 118 14"
          stroke="url(#loop-red)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          markerEnd="url(#arrow-red)"
        />
        <path
          d="M252 196c-40 30-96 24-118-14"
          stroke="url(#loop-green)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <polygon points="266,120 274,126 264,134" fill="#e5484d" />
        <polygon points="134,184 126,178 136,170" fill="#12b76a" />
      </svg>

      {/* Coins — centred on the arrow endpoints above (148,108)/(266,122) for
          the yen coin and (280,165) for the naira coin, out of the 400x300
          viewBox). */}
      <Coin
        symbol="¥"
        className="left-[31%] top-[48%] bg-gradient-to-br from-[#f04438] to-[#c0342c]"
      />
      <Coin
        symbol="₦"
        className="left-[70%] top-[55%] bg-gradient-to-br from-[#12b76a] to-[#04663b]"
      />

      {/* Floating action chips */}
      <FloatChip
        label="Buy RMB"
        sub="with NGN"
        tone="success"
        className="absolute right-[2%] top-[12%]"
      />
      <FloatChip
        label="Sell RMB"
        sub="for NGN"
        tone="danger"
        className="absolute bottom-[24%] left-[2%]"
      />
    </div>
  );
}

function Coin({ symbol, className }: { symbol: string; className?: string }) {
  return (
    <div
      className={cn(
        "absolute grid aspect-square w-[24%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-4xl font-bold text-white shadow-[0_12px_28px_-8px_rgb(16_24_40_/_0.35)] ring-4 ring-white/40 transition-transform duration-300 ease-out hover:scale-110 sm:text-5xl",
        className,
      )}
      aria-hidden="true"
    >
      {symbol}
    </div>
  );
}

function FloatChip({
  label,
  sub,
  tone,
  className,
}: {
  label: string;
  sub: string;
  tone: "success" | "danger";
  className?: string;
}) {
  const Icon = tone === "success" ? ArrowUpRight : ArrowDownRight;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-hairline bg-card px-3 py-2 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
    >
      <div className="leading-tight">
        <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">{label}</p>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{sub}</p>
      </div>
      <span
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full text-white transition-transform duration-300",
          tone === "success" ? "bg-success-500" : "bg-danger-500",
        )}
      >
        <Icon className="size-3.5" strokeWidth={2.6} />
      </span>
    </div>
  );
}
