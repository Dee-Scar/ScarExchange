"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Copy-to-clipboard affordance for trade IDs and payment accounts.
 *
 * Getting a payment reference wrong is expensive, so this exists everywhere a
 * user might otherwise retype one by hand.
 */
export function CopyButton({
  value,
  label,
  className,
  iconClassName,
}: {
  value: string;
  label?: string;
  className?: string;
  iconClassName?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label ?? "Copied"} copied to clipboard`);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — select the text and copy manually");
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label ?? value}`}
      className={cn(
        "inline-grid size-6 shrink-0 place-items-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200",
        className,
      )}
    >
      {copied ? (
        <Check className={cn("size-3.5 text-success-600", iconClassName)} strokeWidth={2.4} />
      ) : (
        <Copy className={cn("size-3.5", iconClassName)} strokeWidth={2} />
      )}
    </button>
  );
}
