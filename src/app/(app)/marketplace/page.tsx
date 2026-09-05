import type { Metadata } from "next";
import { Info } from "lucide-react";
import { MarketplaceBrowser } from "@/components/marketplace/marketplace-browser";
import { getOffers } from "@/lib/api";
import { formatRate } from "@/lib/money";
import { marketReferenceRate, marketRateUpdatedAt, marketplaceHighlights, sellPageHighlights } from "@/lib/mock/offers";
import { formatTime } from "@/lib/date";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse buy and sell offers side by side on ScarExchange.",
};

export default async function MarketplacePage() {
  const [sellOffers, buyOffers] = await Promise.all([
    getOffers({ side: "sell", sort: "best_rate" }),
    getOffers({ side: "buy", sort: "best_rate" }),
  ]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
            Marketplace
          </h1>
          <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
            Compare every live offer to buy or sell RMB in one place.
          </p>
        </div>

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
      </header>

      <MarketplaceBrowser
        sellOffers={sellOffers}
        buyOffers={buyOffers}
        totalSellers={marketplaceHighlights.totalSellers}
        totalBuyers={sellPageHighlights.activeBuyers}
      />
    </div>
  );
}
