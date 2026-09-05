import type { Metadata } from "next";
import { Info, ShieldCheck, Star, TrendingUp, Zap } from "lucide-react";
import { OfferBrowser } from "@/components/marketplace/offer-browser";
import { TrustSection } from "@/components/marketing/trust-section";
import { getOffers } from "@/lib/api";
import { formatDuration, formatRate } from "@/lib/money";
import { marketReferenceRate, marketRateUpdatedAt, marketplaceHighlights } from "@/lib/mock/offers";
import { formatTime } from "@/lib/date";

export const metadata: Metadata = {
  title: "Buy RMB",
  description:
    "Choose from verified sellers and buy RMB at the best rates on ScarExchange.",
};

export default async function BuyRmbPage() {
  const offers = await getOffers({ side: "sell", sort: "best_rate" });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-[32px] font-bold tracking-[-0.025em] text-neutral-900 dark:text-white">
            Buy RMB
          </h1>
          <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
            Choose from verified sellers and buy RMB at the best rates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Highlight
            icon={TrendingUp}
            label="Best Rate"
            value={formatRate(marketplaceHighlights.bestRate)}
            tone="success"
          />
          <Highlight
            icon={Zap}
            label="Fastest Release"
            value={formatDuration(marketplaceHighlights.fastestReleaseSeconds)}
            tone="brand"
          />
          <Highlight
            icon={Star}
            label="Top Rated"
            value={marketplaceHighlights.topRating.toFixed(2)}
            tone="warning"
          />
          <Highlight
            icon={ShieldCheck}
            label="Verified Merchants"
            value={String(marketplaceHighlights.verifiedMerchants)}
            tone="brand"
          />

          <div className="rounded-xl border border-hairline bg-surface-subtle px-4 py-2.5 dark:bg-neutral-900">
            <p className="flex items-center gap-1 text-[11.5px] text-neutral-500 dark:text-neutral-400">
              Reference Rate
              <Info className="size-3 text-neutral-400" strokeWidth={2} />
              <span className="tabular ml-1 font-bold text-success-600 dark:text-success-300">
                {formatRate(marketReferenceRate)}
              </span>
            </p>
            <p className="mt-0.5 text-[11px] text-neutral-400">
              Last updated: {formatTime(marketRateUpdatedAt)}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-7">
        <OfferBrowser
          offers={offers}
          side="sell"
          totalCount={marketplaceHighlights.totalSellers}
        />
      </div>

      <TrustSection />
    </div>
  );
}

function Highlight({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  tone: "success" | "brand" | "warning";
}) {
  const toneClass = {
    success: "text-success-600 dark:text-success-300",
    brand: "text-brand-600 dark:text-brand-300",
    warning: "text-warning-500",
  }[tone];

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-hairline bg-card px-4 py-2.5 shadow-card">
      <Icon className={`size-[18px] shrink-0 ${toneClass}`} strokeWidth={2} />
      <div className="leading-tight">
        <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400">{label}</p>
        <p className="tabular text-[13.5px] font-bold text-neutral-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
