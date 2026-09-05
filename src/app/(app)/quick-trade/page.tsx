import type { Metadata } from "next";
import { QuickTradeForm } from "@/components/marketplace/quick-trade-form";
import { getOffers } from "@/lib/api";

export const metadata: Metadata = {
  title: "Quick Trade",
  description: "Tell us what you need — ScarExchange finds the best matching offer.",
};

export default async function QuickTradePage() {
  const [sellOffers, buyOffers] = await Promise.all([
    getOffers({ side: "sell" }),
    getOffers({ side: "buy" }),
  ]);

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
          Quick Trade
        </h1>
        <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          Tell us what you need and we&apos;ll surface the best rate, the fastest release, and the
          top-rated trader — no scrolling the order book required.
        </p>
      </div>

      <QuickTradeForm sellOffers={sellOffers} buyOffers={buyOffers} />
    </div>
  );
}
