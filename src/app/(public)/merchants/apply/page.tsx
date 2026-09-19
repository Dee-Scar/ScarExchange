import type { Metadata } from "next";
import {
  BadgeCheck,
  BarChart3,
  Percent,
  ScanFace,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Callout, Panel } from "@/components/kit/primitives";
import { Rating } from "@/components/kit/trader";
import { MerchantApplicationForm } from "@/components/merchants/merchant-application-form";
import { getCurrentUser, getKycStatus } from "@/lib/api";
import { formatCount } from "@/lib/money";

export const metadata: Metadata = {
  title: "Become a Merchant",
  description: "Apply for ScarExchange Merchant status — higher limits, lower fees, more visibility.",
};

const BENEFITS = [
  { icon: TrendingUp, title: "Higher Limits", body: "Raised daily and monthly trading limits." },
  { icon: BadgeCheck, title: "Merchant Badge", body: "A verified badge on every offer you list." },
  { icon: Zap, title: "Better Visibility", body: "Higher placement in the marketplace." },
  { icon: BarChart3, title: "Merchant Analytics", body: "Deeper reporting on your trading activity." },
  { icon: Percent, title: "Lower Fees", body: "Reduced platform fees on approved pricing tiers." },
];

export default async function MerchantApplyPage() {
  const [user, kyc] = await Promise.all([getCurrentUser(), getKycStatus()]);
  const meetsEnhanced = kyc.level >= 3;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-brand-600 dark:text-brand-300">
          Merchant Program
        </span>
        <h1 className="mt-2 text-[34px] font-bold tracking-[-0.02em] text-neutral-900 sm:text-[40px] dark:text-white">
          Become a ScarExchange Merchant
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          For established traders ready for higher volume — enhanced verification and a
          compliance review sit on top of standard KYC.
        </p>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {BENEFITS.map((benefit) => (
          <li key={benefit.title} className="rounded-2xl border border-hairline bg-card p-4 shadow-card">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
              <benefit.icon className="size-4" strokeWidth={2} />
            </span>
            <p className="mt-3 text-[13px] font-semibold text-neutral-900 dark:text-white">
              {benefit.title}
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {benefit.body}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-12 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-5">
          <Panel title="Your Eligibility">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 dark:bg-brand-900/30">
                <ScanFace className="size-5 text-brand-600 dark:text-brand-300" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                  Current verification
                </p>
                <p className="text-[14px] font-bold text-neutral-900 dark:text-white">
                  Level {kyc.level} — {kyc.levelLabel}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-hairline pt-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-warning-50 dark:bg-warning-700/20">
                <Star className="size-5 text-warning-500" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                  Trading history
                </p>
                <p className="flex items-center gap-1.5 text-[14px] font-bold text-neutral-900 dark:text-white">
                  <Rating value={user.stats.rating} />
                  <span className="font-normal text-neutral-400">·</span>
                  {formatCount(user.stats.completedTrades)} trades
                </p>
              </div>
            </div>

            {!meetsEnhanced && (
              <Callout tone="warning" className="mt-4">
                Merchant status requires Level 3 (Enhanced) verification. You&apos;re at Level{" "}
                {kyc.level} — you can still apply, and enhanced verification is part of the
                review.
              </Callout>
            )}
          </Panel>
        </div>

        <MerchantApplicationForm email={user.email} />
      </div>
    </div>
  );
}
