"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { formatNgn } from "@/lib/money";
import type { Minor } from "@/lib/types";

/** The hero balance card — masking is real (client-only toggle), the amount underneath is the real derived ledger balance. */
export function WalletBalanceCard({ balanceNgn }: { balanceNgn: Minor }) {
  const [hidden, setHidden] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-[12.5px] font-medium text-brand-100/85">Total Balance</p>
          <button
            type="button"
            onClick={() => setHidden((v) => !v)}
            aria-label={hidden ? "Show balance" : "Hide balance"}
            className="text-brand-100/70 transition-colors hover:text-white"
          >
            {hidden ? <EyeOff className="size-3.5" strokeWidth={2.2} /> : <Eye className="size-3.5" strokeWidth={2.2} />}
          </button>
        </div>
        <span className="rounded-lg bg-white/15 px-2.5 py-1 text-[12px] font-semibold">NGN</span>
      </div>

      <p className="tabular mt-2 text-[38px] font-bold leading-none">
        {hidden ? "₦••••••" : formatNgn(balanceNgn)}
      </p>

      <p className="mt-2 text-[12px] text-brand-100/70">
        Funded from your bank — separate from trade settlements, which pay out directly.
      </p>
    </div>
  );
}
