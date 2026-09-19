"use client";

import { ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

/** No internal transfer-between-users feature exists yet — honest "not wired up" toast, matching the pattern in security-settings.tsx. */
export function TransferButton() {
  return (
    <button
      type="button"
      onClick={() => toast.info("Internal transfers aren't wired up in this preview yet.")}
      className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-hairline bg-card px-4 text-[13px] font-semibold text-neutral-700 transition-colors hover:bg-surface-subtle dark:text-neutral-200"
    >
      <ArrowLeftRight className="size-4" strokeWidth={2.2} />
      Transfer
    </button>
  );
}
