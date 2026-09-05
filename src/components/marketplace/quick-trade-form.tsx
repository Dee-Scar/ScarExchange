"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Coins, ShoppingBag, Star, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RailBadge } from "@/components/kit/payment-rail";
import { EmptyState } from "@/components/kit/primitives";
import { TraderAvatar, VerifiedTick } from "@/components/kit/trader";
import { formatCount, formatDuration, formatRate, toMinor } from "@/lib/money";
import type { Offer, TradeSide } from "@/lib/types";
import { cn } from "@/lib/utils";

type MatchKey = "best_rate" | "fastest" | "top_rated";

const MATCH_META: Record<MatchKey, { label: string; icon: LucideIcon; tone: string }> = {
  best_rate: { label: "Best Rate", icon: Star, tone: "text-success-600 dark:text-success-300" },
  fastest: { label: "Fastest Release", icon: Zap, tone: "text-brand-600 dark:text-brand-300" },
  top_rated: { label: "Top Trader", icon: Star, tone: "text-warning-500" },
};

/** Find the single best offer under three lenses, matching an amount (PRD §32). */
function match(pool: Offer[], side: TradeSide, amountRmb: number) {
  const eligible = pool.filter(
    (o) =>
      o.status === "active" &&
      amountRmb >= o.minOrderRmb &&
      amountRmb <= Math.min(o.maxOrderRmb, o.availableRmb),
  );
  if (eligible.length === 0) return null;

  const bestRate = [...eligible].sort((a, b) => (side === "sell" ? a.rate - b.rate : b.rate - a.rate))[0];
  const fastest = [...eligible].sort((a, b) => a.trader.avgReleaseTime - b.trader.avgReleaseTime)[0];
  const topRated = [...eligible].sort((a, b) => b.trader.rating - a.trader.rating)[0];

  return { best_rate: bestRate, fastest, top_rated: topRated };
}

export function QuickTradeForm({
  sellOffers,
  buyOffers,
}: {
  /** Sell-side pool (traders selling RMB) — what a buyer matches against. */
  sellOffers: Offer[];
  /** Buy-side pool (traders buying RMB) — what a seller matches against. */
  buyOffers: Offer[];
}) {
  const [side, setSide] = useState<TradeSide>("sell");
  const [amount, setAmount] = useState("10000");

  const amountRmb = toMinor(Number(amount) || 0);
  const pool = side === "sell" ? sellOffers : buyOffers;
  const matches = useMemo(() => match(pool, side, amountRmb), [pool, side, amountRmb]);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
        <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">I want to</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <SideButton
            active={side === "sell"}
            onClick={() => setSide("sell")}
            icon={ShoppingBag}
            label="Buy RMB"
          />
          <SideButton
            active={side === "buy"}
            onClick={() => setSide("buy")}
            icon={Coins}
            label="Sell RMB"
          />
        </div>

        <label className="mt-5 block text-[13px] font-semibold text-neutral-900 dark:text-white">
          Amount
        </label>
        <div className="relative mt-1.5">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-neutral-400">
            ¥
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-12 w-full rounded-xl border border-hairline bg-transparent pl-8 pr-3 text-[16px] font-semibold text-neutral-900 outline-none transition-shadow focus:border-brand-300 focus:shadow-focus dark:text-white"
          />
        </div>

        <label className="mt-5 block text-[13px] font-semibold text-neutral-900 dark:text-white">
          Payment
        </label>
        <p className="mt-1.5 rounded-xl border border-hairline bg-surface-subtle px-3.5 py-3 text-[13px] text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
          {side === "sell" ? "You pay in NGN, receive RMB" : "You pay in RMB, receive NGN"}
        </p>
      </div>

      <div>
        {!matches ? (
          <div className="rounded-2xl border border-hairline bg-card shadow-card">
            <EmptyState
              icon={Coins}
              title="No offers match that amount"
              description="Try a smaller amount, or check back — the offer book refreshes constantly."
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {(Object.keys(MATCH_META) as MatchKey[]).map((key) => (
              <MatchCard key={key} matchKey={key} offer={matches[key]} side={side} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MatchCard({
  matchKey,
  offer,
  side,
}: {
  matchKey: MatchKey;
  offer: Offer;
  side: TradeSide;
}) {
  const meta = MATCH_META[matchKey];
  const action = side === "sell" ? "Buy" : "Sell";

  return (
    <div className="flex flex-col rounded-2xl border border-hairline bg-card p-4 shadow-card">
      <p className={cn("inline-flex items-center gap-1.5 text-[12px] font-bold", meta.tone)}>
        <meta.icon className="size-3.5" strokeWidth={2.4} />
        {meta.label}
      </p>

      <div className="mt-3 flex items-center gap-2.5">
        <TraderAvatar trader={offer.trader} size="md" />
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="truncate text-[13.5px] font-semibold text-neutral-900 dark:text-white">
              {offer.trader.username}
            </span>
            {offer.trader.verified && <VerifiedTick className="size-3.5" />}
          </div>
          <p className="tabular text-[11.5px] text-neutral-500 dark:text-neutral-400">
            {formatCount(offer.trader.completedTrades)} trades ·{" "}
            {formatDuration(offer.trader.avgReleaseTime)}
          </p>
        </div>
      </div>

      <p className="tabular mt-3 text-[22px] font-bold leading-none text-neutral-900 dark:text-white">
        {formatRate(offer.rate)}
      </p>
      <p className="text-[11px] text-neutral-400">per RMB</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {offer.rails.map((rail) => (
          <RailBadge key={rail} rail={rail} />
        ))}
      </div>

      <Link
        href={`/offers/${offer.id}`}
        className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-700"
      >
        {action} now
        <ArrowRight className="size-3.5" strokeWidth={2.4} />
      </Link>
    </div>
  );
}

function SideButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof ShoppingBag;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[13px] font-semibold transition-colors",
        active
          ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
          : "border-hairline text-neutral-600 hover:bg-surface-subtle dark:text-neutral-300",
      )}
    >
      <Icon className="size-4" strokeWidth={2.1} />
      {label}
    </button>
  );
}
