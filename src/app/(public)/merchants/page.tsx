import type { Metadata } from "next";
import { Crown } from "lucide-react";
import { ButtonLink } from "@/components/kit/button-link";
import { ReleaseTime, TraderCell, TraderStatsLine } from "@/components/kit/trader";
import { getMerchants } from "@/lib/api";

export const metadata: Metadata = {
  title: "Verified Merchants",
  description: "High-volume, enhanced-verification traders on ScarExchange.",
};

export default async function MerchantsPage() {
  const merchants = await getMerchants();

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-brand-600 dark:text-brand-300">
          Verified Merchants
        </span>
        <h1 className="mt-2 text-[34px] font-bold tracking-[-0.02em] text-neutral-900 sm:text-[40px] dark:text-white">
          Trade with ScarExchange&apos;s most established traders
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          Merchants have passed enhanced verification and a compliance review on top of
          standard KYC, and carry the highest trading volume on the platform.
        </p>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {merchants.map((merchant) => (
          <li
            key={merchant.id}
            className="rounded-2xl border border-hairline bg-card p-5 shadow-card"
          >
            <TraderCell trader={merchant} size="lg" />
            <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
              <TraderStatsLine trader={merchant} />
              <ReleaseTime seconds={merchant.avgReleaseTime} />
            </div>
            <div className="mt-4 flex gap-2">
              <ButtonLink href="/buy" size="sm" className="flex-1">
                Buy from them
              </ButtonLink>
              <ButtonLink href="/sell" variant="outline" size="sm" className="flex-1">
                Sell to them
              </ButtonLink>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-14 rounded-2xl border border-hairline bg-surface-subtle p-6 text-center dark:bg-neutral-900/40">
        <Crown className="mx-auto size-7 text-warning-500" strokeWidth={2} />
        <p className="mt-3 text-[16px] font-bold text-neutral-900 dark:text-white">
          Not listed yet?
        </p>
        <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          Established traders can apply for Merchant status — higher limits, lower fees and a
          verified badge on every offer.
        </p>
        <ButtonLink href="/merchants/apply" className="mt-4">
          Apply to become a Merchant
        </ButtonLink>
      </div>
    </div>
  );
}
