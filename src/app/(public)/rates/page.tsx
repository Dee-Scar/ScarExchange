import type { Metadata } from "next";
import { Info, TrendingUp } from "lucide-react";
import { ExchangeCalculator } from "@/components/marketing/exchange-calculator";
import { RateComparisonTable } from "@/components/marketing/rate-comparison-table";
import { RateTrend } from "@/components/marketing/rate-trend";
import { getOffers } from "@/lib/api";
import { formatTime } from "@/lib/date";
import { formatRate } from "@/lib/money";
import {
  marketRateChangePercent,
  marketRateHigh,
  marketRateLow,
  marketReferenceRate,
  marketRateUpdatedAt,
  marketplaceHighlights,
  rateComparisonRows,
  sellPageHighlights,
} from "@/lib/mock/offers";

export const metadata: Metadata = {
  title: "Rates",
  description: "The live RMB ↔ NGN reference rate and the best prices on the marketplace right now.",
};

// Matches the homepage's own "¥4.2M+ 24h Trading Volume" stat — one number, not re-invented.
const VOLUME_24H = "¥4.2M+";

export default async function RatesPage() {
  const [sellOffers, buyOffers] = await Promise.all([
    getOffers({ side: "sell", sort: "best_rate" }),
    getOffers({ side: "buy", sort: "best_rate" }),
  ]);

  return (
    <div>
      <section className="mx-auto max-w-[1400px] px-4 py-14 text-center sm:px-6">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-[12.5px] font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          RMB ↔ NGN Live Market
        </span>
        <h1 className="mx-auto mt-5 text-[40px] font-bold leading-[1.08] tracking-[-0.03em] text-neutral-900 sm:text-[48px] dark:text-white">
          Live RMB to Naira rates
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          Compare real-time exchange rates from verified traders and find the best rate for
          every transaction.
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid gap-6 divide-y divide-hairline rounded-2xl border border-hairline bg-card px-6 py-6 shadow-card sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          <StatCell
            icon={TrendingUp}
            label="Current Rate"
            value={`${formatRate(marketReferenceRate)}/RMB`}
            note={`↑${marketRateChangePercent}%`}
          />
          <StatCell
            icon={Info}
            label="Best Buy"
            value={formatRate(marketplaceHighlights.bestRate)}
          />
          <StatCell
            icon={Info}
            label="Best Sell"
            value={formatRate(sellPageHighlights.bestRate)}
          />
          <StatCell icon={TrendingUp} label="24h Volume" value={VOLUME_24H} />
        </div>
        <p className="mt-3 text-center text-[11.5px] text-neutral-400 sm:text-left">
          Reference range {formatRate(marketRateLow)} – {formatRate(marketRateHigh)} · last
          updated {formatTime(marketRateUpdatedAt)}
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <RateComparisonTable rows={rateComparisonRows} sellOffers={sellOffers} buyOffers={buyOffers} />
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
            <p className="text-[14px] font-bold text-neutral-900 dark:text-white">
              RMB / NGN market trend
            </p>
            <RateTrend />
          </div>
          <ExchangeCalculator rate={marketReferenceRate} />
        </div>
      </section>
    </div>
  );
}

function StatCell({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex items-center gap-3 pt-6 first:pt-0 sm:pt-0 sm:pl-6 sm:first:pl-0">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
        <Icon className="size-[18px]" strokeWidth={2} />
      </span>
      <div>
        <p className="text-[12px] text-neutral-500 dark:text-neutral-400">{label}</p>
        <p className="tabular text-[18px] font-bold text-neutral-900 dark:text-white">
          {value}
          {note && (
            <span className="ml-1.5 text-[12px] font-semibold text-success-600 dark:text-success-300">
              {note}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
