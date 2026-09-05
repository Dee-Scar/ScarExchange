import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PAYMENT_RAILS } from "@/lib/mock/offers";
import type { PaymentRail } from "@/lib/types";

/**
 * Payment rail marks. Simplified glyphs in each provider's brand colour —
 * recognisable at 16px without shipping third-party logo assets.
 */

const RAIL_COLORS: Record<PaymentRail, string> = {
  alipay: "#1677ff",
  wechat: "#07c160",
  bank_transfer: "#475467",
};

function AlipayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#1677ff" />
      <path
        d="M6 8.2h5.1V6.9h1.9v1.3H18v1.4h-5v1.7h4.1v1.4H13v2.1c1.6.4 3.2 1 4.7 1.7l-.9 1.6a29 29 0 0 0-3.8-1.5c-.4 1.4-1.7 2.3-3.8 2.3-2.3 0-3.7-1-3.7-2.6 0-1.7 1.6-2.6 4-2.6 1 0 2 .1 3 .3v-1.3H6.6v-1.4h4.5V9.6H6V8.2Zm3.4 8c-1.3 0-2.1.4-2.1 1.1 0 .7.7 1.1 1.9 1.1 1.4 0 2.2-.6 2.3-1.8-.7-.2-1.4-.3-2.1-.4Z"
        fill="#fff"
      />
    </svg>
  );
}

function WeChatGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#07c160" />
      <path
        d="M9.6 5.5c-3 0-5.4 2-5.4 4.5 0 1.4.8 2.7 2 3.5l-.5 1.6 1.9-1a6.6 6.6 0 0 0 1.6.3 4 4 0 0 1-.2-1.2c0-2.5 2.4-4.5 5.4-4.5h.5c-.5-1.9-2.6-3.2-5.3-3.2Zm-1.9 2.8a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Zm3.9 0a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z"
        fill="#fff"
      />
      <path
        d="M20.2 13.2c0-2.1-2-3.8-4.5-3.8s-4.6 1.7-4.6 3.8c0 2.1 2 3.8 4.6 3.8.5 0 1-.1 1.5-.2l1.6.8-.4-1.3c1.1-.7 1.8-1.8 1.8-3.1Zm-6-1.3a.7.7 0 1 1 0 1.3.7.7 0 0 1 0-1.3Zm3.1 0a.7.7 0 1 1 0 1.3.7.7 0 0 1 0-1.3Z"
        fill="#fff"
      />
    </svg>
  );
}

export function RailIcon({
  rail,
  className,
}: {
  rail: PaymentRail;
  className?: string;
}) {
  const size = cn("size-5 shrink-0 rounded-[5px]", className);
  if (rail === "alipay") return <AlipayGlyph className={size} />;
  if (rail === "wechat") return <WeChatGlyph className={size} />;
  return (
    <span className={cn("grid place-items-center bg-neutral-600 text-white", size)}>
      <Building2 className="size-3" />
    </span>
  );
}

/** Icon plus label — the standard inline treatment in tables and summaries. */
export function RailBadge({
  rail,
  className,
  iconClassName,
  labelClassName,
}: {
  rail: PaymentRail;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <RailIcon rail={rail} className={iconClassName} />
      <span className={cn("text-[13px] font-medium text-neutral-700 dark:text-neutral-200", labelClassName)}>
        {PAYMENT_RAILS[rail].label}
      </span>
    </span>
  );
}

export function railLabel(rail: PaymentRail): string {
  return PAYMENT_RAILS[rail].label;
}

export function railColor(rail: PaymentRail): string {
  return RAIL_COLORS[rail];
}

/** Nigerian bank chip used in history rows and settlement tables. */
export function BankChip({ name, className }: { name: string; className?: string }) {
  const initials = name
    .replace(/bank/i, "")
    .trim()
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="grid size-5 shrink-0 place-items-center rounded-[5px] bg-neutral-100 text-[9px] font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
        {initials}
      </span>
      <span className="text-[13px] text-neutral-600 dark:text-neutral-300">{name}</span>
    </span>
  );
}
