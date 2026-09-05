"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * A sensitive identifier that stays masked until deliberately revealed.
 *
 * Only the last four digits ever reach the client, so "revealing" shows the
 * masked-but-readable form rather than the full number — the full value is
 * never in the page for someone reading over a shoulder to find.
 */
export function MaskedField({
  last4,
  groups = 4,
  label,
}: {
  last4: string;
  /** How many 4-character groups the full identifier has. */
  groups?: number;
  label: string;
}) {
  const [revealed, setRevealed] = useState(false);

  const hidden = Array.from({ length: groups - 1 }, () => "••••").join(" ");

  return (
    <span className="inline-flex items-center gap-2">
      <span className="tabular text-[13px] font-medium text-neutral-900 dark:text-white">
        {hidden} {revealed ? last4 : "••••"}
      </span>
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        aria-label={revealed ? `Hide ${label}` : `Show last four digits of ${label}`}
        aria-pressed={revealed}
        className="grid size-6 place-items-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
      >
        {revealed ? (
          <EyeOff className="size-3.5" strokeWidth={2} />
        ) : (
          <Eye className="size-3.5" strokeWidth={2} />
        )}
      </button>
    </span>
  );
}
