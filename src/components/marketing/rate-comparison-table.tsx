"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { RailIcon } from "@/components/kit/payment-rail";
import { formatCount, formatRate } from "@/lib/money";
import type { RateComparisonRow } from "@/lib/mock/offers";
import { marketplaceHighlights, sellPageHighlights } from "@/lib/mock/offers";
import type { Offer, TradeSide } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Rails with no seeded offer (bank_transfer) fall back to the overall best rate for that side. */
function bestRateForRail(offers: Offer[], rail: RateComparisonRow["rail"], side: TradeSide) {
  if (rail === "usdt") return null;
  const matching = offers.filter((o) => o.rails.includes(rail));
  if (matching.length === 0) return null;
  const rates = matching.map((o) => o.rate);
  return side === "sell" ? Math.min(...rates) : Math.max(...rates);
}

export function RateComparisonTable({
  rows,
  sellOffers,
  buyOffers,
}: {
  rows: RateComparisonRow[];
  sellOffers: Offer[];
  buyOffers: Offer[];
}) {
  const [side, setSide] = useState<TradeSide>("sell"); // "sell" pool = Buy RMB view

  const offerPool = side === "sell" ? sellOffers : buyOffers;
  const fallbackBest = side === "sell" ? marketplaceHighlights.bestRate : sellPageHighlights.bestRate;
  const targetHref = side === "sell" ? "/buy" : "/sell";

  const withRates = useMemo(
    () =>
      rows.map((row) => ({
        row,
        bestRate: row.available ? (bestRateForRail(offerPool, row.rail, side) ?? fallbackBest) : null,
      })),
    [rows, offerPool, side, fallbackBest],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-brand-600 dark:text-brand-300">
            Live market rates
          </p>
          <h2 className="mt-1 text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
            Today&apos;s best exchange rates
          </h2>
        </div>

        <div className="inline-flex rounded-xl border border-hairline bg-card p-1 shadow-card">
          <ToggleButton active={side === "sell"} onClick={() => setSide("sell")} label="Buy RMB" />
          <ToggleButton active={side === "buy"} onClick={() => setSide("buy")} label="Sell RMB" />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline bg-surface-subtle dark:bg-neutral-900/50">
                {["Payment Method", "Best Rate", "Market Average", "24h Change", "Available Traders", ""].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-5 py-3 text-[12px] font-semibold text-neutral-500 dark:text-neutral-400"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {withRates.map(({ row, bestRate }) => (
                <tr
                  key={row.rail}
                  className={cn(
                    "border-b border-hairline last:border-0",
                    row.available && "hover:bg-surface-subtle dark:hover:bg-neutral-900/40",
                    !row.available && "opacity-60",
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {row.rail === "usdt" ? (
                        <span className="grid size-8 shrink-0 place-items-center rounded-[7px] bg-neutral-200 text-[10px] font-bold text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300">
                          ₮
                        </span>
                      ) : (
                        <RailIcon rail={row.rail} className="size-8" />
                      )}
                      <div>
                        <p className="text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                          {row.label}
                        </p>
                        <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400">
                          {row.blurb}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="tabular px-5 py-4 text-[15px] font-bold text-neutral-900 dark:text-white">
                    {bestRate != null ? formatRate(bestRate) : "—"}
                    {bestRate != null && (
                      <span className="ml-1 text-[11px] font-normal text-neutral-400">/RMB</span>
                    )}
                  </td>
                  <td className="tabular px-5 py-4 text-[13px] text-neutral-500 dark:text-neutral-400">
                    {formatRate(row.marketAverage)}/RMB
                  </td>
                  <td className="tabular px-5 py-4 text-[13px] font-semibold">
                    <span
                      className={
                        row.changePercent >= 0
                          ? "text-success-600 dark:text-success-300"
                          : "text-danger-600 dark:text-danger-300"
                      }
                    >
                      {row.changePercent >= 0 ? "↑" : "↓"} {Math.abs(row.changePercent).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-neutral-600 dark:text-neutral-300">
                    {row.available ? (
                      <>
                        <span className="tabular font-semibold">{formatCount(row.traderCount)}+</span>{" "}
                        <span className="text-neutral-400">trusted traders</span>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[12px] font-medium text-neutral-400">
                        <Clock className="size-3.5" strokeWidth={2} />
                        Coming soon
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {row.available ? (
                      <Link
                        href={targetHref}
                        className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
                      >
                        View offers
                        <ArrowRight className="size-3.5" strokeWidth={2.4} />
                      </Link>
                    ) : (
                      <span className="text-[12.5px] text-neutral-300 dark:text-neutral-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors",
        active
          ? "bg-brand-600 text-white"
          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
      )}
    >
      {label}
    </button>
  );
}
