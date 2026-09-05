import type { Metadata } from "next";
import { Plus, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/kit/button-link";
import { Callout } from "@/components/kit/primitives";
import { RailIcon, railLabel } from "@/components/kit/payment-rail";
import { getPaymentMethods } from "@/lib/api";
import { PAYMENT_RAILS } from "@/lib/mock/offers";
import { formatDate } from "@/lib/date";

export const metadata: Metadata = { title: "Payment Methods" };

export default async function PaymentMethodsPage() {
  const methods = await getPaymentMethods();

  return (
    <div className="mx-auto max-w-[860px] space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
            Payment Methods
          </h1>
          <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
            The Alipay and WeChat accounts buyers pay you through on Sell RMB trades.
          </p>
        </div>
        <ButtonLink href="/payment-methods/new" className="gap-2">
          <Plus className="size-4" strokeWidth={2.2} />
          Add Payment Method
        </ButtonLink>
      </div>

      <div className="space-y-3">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-hairline bg-card p-4 shadow-card"
          >
            <RailIcon rail={method.rail} className="size-11 rounded-xl" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[14px] font-semibold text-neutral-900 dark:text-white">
                  {railLabel(method.rail)}
                </p>
                {method.isDefault && (
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
                    Default
                  </span>
                )}
                {method.verified && (
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-success-600 dark:text-success-300">
                    <ShieldCheck className="size-3.5" strokeWidth={2.2} />
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[13px] text-neutral-600 dark:text-neutral-300">
                {method.accountLabel} · {method.accountName}
              </p>
              <p className="mt-0.5 text-[11.5px] text-neutral-400">
                {PAYMENT_RAILS[method.rail].blurb} Added {formatDate(method.addedAt)}.
              </p>
            </div>
          </div>
        ))}
      </div>

      <Callout tone="brand" icon={ShieldCheck}>
        Only accounts registered in your legal name are accepted. Buyers can only ever see the
        account details attached to their specific trade.
      </Callout>
    </div>
  );
}
