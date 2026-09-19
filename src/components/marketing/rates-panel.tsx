import Link from "next/link";
import { ArrowRight, Info, TrendingUp } from "lucide-react";
import { formatRate } from "@/lib/money";
import {
  marketRateChangePercent,
  marketRateHigh,
  marketRateLow,
  marketReferenceRate,
  marketRateUpdatedAt,
  marketplaceHighlights,
  sellPageHighlights,
} from "@/lib/mock/offers";
import { formatTime } from "@/lib/date";

/**
 * Live-rate summary shown on the homepage, linking through to the full
 * /rates page. All figures are the same reference-rate mock data the Buy/Sell
 * pages already show — never a separately invented number.
 */
export function RatesPanel() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-hairline bg-card p-6 shadow-card sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-brand-600 dark:text-brand-300">
              Live rates
            </span>
            <h2 className="mt-2 text-[28px] font-bold tracking-[-0.02em] text-neutral-900 sm:text-[32px] dark:text-white">
              RMB ↔ NGN, updated continuously
            </h2>
            <p className="mt-2 max-w-md text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              A transparent reference rate, plus the best live prices traders are actually
              offering right now.
            </p>
          </div>

          <Link
            href="/rates"
            className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface-subtle px-4 py-2.5 text-[13px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            See full rates
            <ArrowRight className="size-3.5" strokeWidth={2.4} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-surface-subtle p-5 dark:bg-neutral-900/50">
            <p className="flex items-center gap-1 text-[12px] text-neutral-500 dark:text-neutral-400">
              Reference Rate
              <Info className="size-3 text-neutral-400" strokeWidth={2} />
            </p>
            <p className="tabular mt-1.5 text-[26px] font-bold text-neutral-900 dark:text-white">
              {formatRate(marketReferenceRate)}
            </p>
            <p className="tabular mt-1 flex items-center gap-1.5 text-[12px] text-neutral-500 dark:text-neutral-400">
              Range {formatRate(marketRateLow)} – {formatRate(marketRateHigh)}
              <span className="inline-flex items-center gap-0.5 font-semibold text-success-600 dark:text-success-300">
                <TrendingUp className="size-3" strokeWidth={2.4} />↑{marketRateChangePercent}%
              </span>
            </p>
          </div>

          <div className="rounded-2xl bg-surface-subtle p-5 dark:bg-neutral-900/50">
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
              Best rate to Buy RMB
            </p>
            <p className="tabular mt-1.5 text-[26px] font-bold text-success-600 dark:text-success-300">
              {formatRate(marketplaceHighlights.bestRate)}
            </p>
            <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
              Across {marketplaceHighlights.totalSellers} active sellers
            </p>
          </div>

          <div className="rounded-2xl bg-surface-subtle p-5 dark:bg-neutral-900/50">
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
              Best rate to Sell RMB
            </p>
            <p className="tabular mt-1.5 text-[26px] font-bold text-success-600 dark:text-success-300">
              {formatRate(sellPageHighlights.bestRate)}
            </p>
            <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
              Across {sellPageHighlights.activeBuyers} active buyers
            </p>
          </div>
        </div>

        <p className="mt-5 text-[11.5px] text-neutral-400">
          Last updated {formatTime(marketRateUpdatedAt)} · reference rate only, shown for
          transparency — never used to settle a trade.
        </p>
      </div>
    </section>
  );
}
