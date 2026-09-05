import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The merchant upsell pinned to the bottom of the user sidebar (PRD §33).
 * Dark card against a white sidebar — the one deliberately loud element.
 */
export function MerchantCta({
  copy = "Unlock higher limits, lower fees and more visibility.",
  className,
}: {
  copy?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 p-4 text-white",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-8 size-24 rounded-full bg-brand-400/20 blur-2xl"
      />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
          <Crown className="size-4 text-warning-500" strokeWidth={2.2} />
          Become a Merchant
        </span>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-brand-100/85">{copy}</p>
        <Link
          href="/merchants/apply"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-500"
        >
          Apply Now
          <ArrowRight className="size-3.5" strokeWidth={2.4} />
        </Link>
      </div>
    </div>
  );
}
