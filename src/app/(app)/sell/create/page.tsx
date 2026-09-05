import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Headphones, ShieldCheck, Users, Zap } from "lucide-react";
import { ButtonLink } from "@/components/kit/button-link";
import { Panel } from "@/components/kit/primitives";
import { CreateOfferForm } from "@/components/offers/create-offer-form";
import { getCurrentUser } from "@/lib/api";
import { formatDateTime, NOW } from "@/lib/date";
import {
  marketRateChangePercent,
  marketRateHigh,
  marketRateLow,
  marketRateUpdatedAt,
} from "@/lib/mock/offers";
import { traders } from "@/lib/mock/users";

export const metadata: Metadata = { title: "Create a Sell Offer" };

export default async function SellPage() {
  const user = await getCurrentUser();

  const trader = {
    ...traders.wealth,
    username: user.username,
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <Link
        href="/sell"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-600 transition-colors hover:text-brand-600 dark:text-neutral-300"
      >
        <span className="grid size-6 place-items-center rounded-full border border-hairline">
          <ArrowLeft className="size-3.5" strokeWidth={2.2} />
        </span>
        Sell RMB
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-bold tracking-[-0.025em] text-neutral-900 dark:text-white">
            Create a Sell Offer
          </h1>
          <p className="mt-1 max-w-xl text-[13.5px] text-neutral-500 dark:text-neutral-400">
            Set your rate, amount and payment method. Buyers will find and accept your
            offer based on the details you provide.
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-4">
          {[
            { icon: ShieldCheck, label: "Secure" },
            { icon: Users, label: "Verified Traders" },
            { icon: Zap, label: "Fast Settlement" },
          ].map((item) => (
            <li
              key={item.label}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              <item.icon
                className="size-3.5 text-brand-600 dark:text-brand-300"
                strokeWidth={2.1}
              />
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <CreateOfferForm
        trader={trader}
        nowLabel={formatDateTime(NOW.toISOString())}
        bounds={{
          rateLow: marketRateLow,
          rateHigh: marketRateHigh,
          rateChangePercent: marketRateChangePercent,
          updatedAt: marketRateUpdatedAt,
        }}
      />

      {/* Support and merchant prompts sit below the fold on narrow screens
          rather than competing with the form itself. */}
      <div className="grid gap-5 lg:grid-cols-2 xl:ml-auto xl:max-w-[700px]">
        <Panel title="Need Help?">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 dark:bg-brand-900/30">
              <Headphones
                className="size-4 text-brand-600 dark:text-brand-300"
                strokeWidth={2}
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                Our support team is always here to help you.
              </p>
              <ButtonLink
                href="/support"
                variant="outline"
                size="sm"
                className="mt-3 w-full"
              >
                Contact Support →
              </ButtonLink>
            </div>
          </div>
        </Panel>

        <Panel title="Get More Trades">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                Become a verified merchant and enjoy higher limits, lower fees and better
                visibility.
              </p>
              <ButtonLink href="/merchants/apply" size="sm" className="mt-3">
                Apply Now →
              </ButtonLink>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
