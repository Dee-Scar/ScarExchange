import { Clock, Headphones, ShieldCheck, TrendingUp, Users, Zap } from "lucide-react";
import { TraderAvatar } from "@/components/kit/trader";
import { traders } from "@/lib/mock/users";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure & Verified",
    body: "All users are KYC verified for a safe trading environment.",
  },
  {
    icon: Zap,
    title: "Best Market Rates",
    body: "Get the most competitive rates in the market.",
  },
  {
    icon: Users,
    title: "Fast & Reliable",
    body: "Quick payments and real-time transaction updates.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    body: "Our support team is always here to help you.",
  },
];

const stats = [
  { icon: Users, value: "50K+", label: "Active Traders" },
  { icon: TrendingUp, value: "₦28.45B+", label: "Total Volume" },
  { icon: ShieldCheck, value: "99.7%", label: "Completion Rate" },
  { icon: Clock, value: "2 min", label: "Avg. Response" },
];

/**
 * Left-hand branding panel for the login and signup screens. Always dark,
 * regardless of the site theme — this is a fixed hero treatment, not a
 * dark-mode surface, so colours are hard-coded rather than themed.
 */
export function AuthShowcase() {
  return (
    <div className="relative hidden overflow-hidden bg-neutral-950 px-10 py-9 lg:flex lg:flex-col xl:px-14">
      {/* Faint dot grid, deliberately far in the background. */}
      <svg
        className="pointer-events-none absolute inset-0 size-full opacity-[0.35]"
        aria-hidden="true"
      >
        <defs>
          <pattern id="auth-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#2a3452" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-dots)" />
      </svg>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-500/20 blur-3xl"
      />

      <div className="relative flex flex-1 flex-col">
        <h1 className="text-[32px] font-bold leading-[1.12] tracking-[-0.02em] text-white xl:text-[36px]">
          Trade RMB.
          <br />
          <span className="text-brand-400">Secure Payments.</span>
          <br />
          Better Rates.
        </h1>

        <p className="mt-3.5 max-w-sm text-[13.5px] leading-relaxed text-neutral-400">
          The trusted P2P platform for buying and selling Chinese Yuan (RMB) with ease
          and confidence.
        </p>

        <ul className="mt-6 space-y-3">
          {features.map((feature) => (
            <li key={feature.title} className="group flex items-start gap-3.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 transition-colors duration-300 group-hover:bg-brand-500/20">
                <feature.icon className="size-4 text-brand-400" strokeWidth={2} />
              </span>
              <div className="pt-0.5">
                <p className="text-[13.5px] font-semibold text-white">{feature.title}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-neutral-400">
                  {feature.body}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="my-8 flex flex-1 items-center justify-center">
          <DeviceShowcase />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
          <p className="text-[12px] font-semibold text-neutral-300">
            Trusted by thousands of traders
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {stats.map((stat) => (
              <div key={stat.label}>
                <stat.icon className="size-4 text-brand-400" strokeWidth={2} />
                <p className="tabular mt-1.5 text-[14px] font-bold text-white">{stat.value}</p>
                <p className="text-[10.5px] leading-tight text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[11.5px] text-neutral-600">
          © 2026 ScarExchange. All rights reserved.
        </p>
      </div>
    </div>
  );
}

const topTraders = [traders.tonyfx, traders.chinahub, traders.rmbpro];

const recentTrades = [
  { amount: "¥2,190.00", note: "Completed", tone: "done" as const },
  { amount: "¥5,000.00", note: "5 min ago", tone: "pending" as const },
  { amount: "¥10,000.00", note: "8 min ago", tone: "pending" as const },
];

/** Two overlapping phone frames — a simplified, decorative stand-in for product screens. */
function DeviceShowcase() {
  return (
    <div className="relative h-[300px] w-full max-w-[320px]">
      {/* The stand the phones rest on. */}
      <div
        aria-hidden="true"
        className="absolute bottom-3 left-1/2 h-8 w-[210px] -translate-x-1/2 rounded-full bg-brand-500/15 blur-xl"
      />

      <Phone className="absolute left-0 top-0 -rotate-6">
        <PhoneChrome />
        <p className="mt-2.5 text-[9.5px] font-semibold text-neutral-300">Buy RMB</p>

        <div className="mt-2.5 flex items-center justify-between">
          <p className="text-[8px] text-neutral-500">You pay</p>
        </div>
        <p className="text-[13.5px] font-bold text-white">₦100,000.00</p>

        <p className="mt-1.5 text-[8px] text-neutral-500">You get</p>
        <p className="text-[13.5px] font-bold text-brand-400">¥1,219.00</p>

        <p className="mt-1.5 text-[7.5px] text-neutral-600">Rate ¥7.19 / RMB</p>

        <div className="mt-2.5 rounded-lg bg-brand-600 py-1.5 text-center text-[9px] font-semibold text-white">
          Buy Now
        </div>

        <p className="mt-3 text-[8px] font-semibold text-neutral-400">Top Traders</p>
        <ul className="mt-1.5 space-y-1.5">
          {topTraders.map((trader) => (
            <li key={trader.id} className="flex items-center gap-1.5">
              <TraderAvatar trader={trader} size="xs" className="size-4 text-[7px]" />
              <span className="min-w-0 flex-1 truncate text-[8px] font-medium text-neutral-300">
                {trader.username}
              </span>
              <span className="tabular flex items-center gap-0.5 text-[7.5px] text-neutral-500">
                <StarGlyph />
                {trader.rating.toFixed(2)}
                <span className="text-neutral-600">({trader.completedTrades})</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-right text-[7.5px] font-semibold text-brand-400">View all</p>
      </Phone>

      <Phone className="absolute right-0 top-6 rotate-6">
        <PhoneChrome />
        <p className="mt-2.5 text-[9.5px] font-semibold text-neutral-300">Market Overview</p>

        <p className="mt-2.5 text-[8px] text-neutral-500">RMB/NGN</p>
        <div className="flex items-baseline gap-1.5">
          <p className="text-[13.5px] font-bold text-white">¥7.19</p>
          <span className="text-[9px] font-semibold text-success-500">+0.35%</span>
        </div>

        <div className="mt-1.5 flex gap-1.5 text-[6.5px] font-medium text-neutral-500">
          {["1D", "1W", "1M", "3M", "1Y"].map((range, i) => (
            <span key={range} className={i === 0 ? "text-brand-400" : undefined}>
              {range}
            </span>
          ))}
        </div>

        <svg viewBox="0 0 100 28" className="mt-1.5 h-7 w-full" aria-hidden="true">
          <polyline
            points="0,22 14,18 28,20 42,10 56,14 70,6 84,9 100,2"
            fill="none"
            stroke="#6086ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="mt-2.5 text-[8px] font-semibold text-neutral-400">Recent Trades</p>
        <ul className="mt-1.5 space-y-1.5">
          {recentTrades.map((trade) => (
            <li key={trade.amount} className="flex items-center justify-between">
              <span className="text-[8px] font-medium text-neutral-300">{trade.amount}</span>
              <span
                className={
                  trade.tone === "done"
                    ? "rounded bg-success-500/15 px-1 py-[1px] text-[7px] font-semibold text-success-500"
                    : "text-[7px] text-neutral-500"
                }
              >
                {trade.note}
              </span>
            </li>
          ))}
        </ul>
      </Phone>

      <span className="absolute bottom-1 left-[32%] grid size-9 place-items-center rounded-full border-2 border-neutral-950 bg-brand-600 text-white shadow-lg">
        <ShieldCheck className="size-4" strokeWidth={2.4} />
      </span>
      <span className="absolute -bottom-1 right-[24%] grid size-9 place-items-center rounded-full border-2 border-neutral-950 bg-brand-600 text-[14px] font-bold text-white shadow-lg">
        ¥
      </span>
    </div>
  );
}

function StarGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="size-[7px] fill-warning-500" aria-hidden="true">
      <path d="M10 1.5l2.47 5.6 6.03.55-4.57 4.02 1.36 5.92L10 14.6l-5.29 3-1.36-5.93-4.57-4.02 6.03-.55L10 1.5z" />
    </svg>
  );
}

/** Tiny status-bar row + camera notch, so the frame reads as a phone at a glance. */
function PhoneChrome() {
  return (
    <div className="flex items-center justify-between">
      <span className="h-2.5 w-9 rounded-full bg-neutral-800" />
      <span className="flex items-center gap-[2.5px]">
        <span className="h-[5px] w-[3px] rounded-[1px] bg-neutral-600" />
        <span className="h-[7px] w-[3px] rounded-[1px] bg-neutral-600" />
        <span className="h-[5px] w-2 rounded-[1px] bg-neutral-600" />
      </span>
    </div>
  );
}

function Phone({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`w-[160px] rounded-[22px] border border-white/10 bg-neutral-900 p-3 shadow-[0_20px_40px_-12px_rgb(0_0_0_/_0.6)] transition-transform duration-500 ease-out hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_28px_48px_-12px_rgb(22_82_240_/_0.35)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
