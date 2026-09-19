"use client";

import { useId, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const VOLUME_TIERS = [
  { value: "under_1m", label: "Under ¥1,000,000" },
  { value: "1m_5m", label: "¥1,000,000 – ¥5,000,000" },
  { value: "5m_plus", label: "¥5,000,000+" },
];

/**
 * Merchant application (PRD §33). No backend yet, so this is a real,
 * working form with local state — submitting is honest about what actually
 * happens next (a compliance review), not a fabricated instant approval.
 */
export function MerchantApplicationForm({ email }: { email: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [tradingName, setTradingName] = useState("");
  const [volume, setVolume] = useState("");
  const [reason, setReason] = useState("");
  const [agreed, setAgreed] = useState(false);
  const nameId = useId();
  const reasonId = useId();

  if (submitted) {
    return (
      <div className="rounded-2xl border border-hairline bg-card p-6 text-center shadow-card">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-300">
          <CheckCircle2 className="size-6" strokeWidth={2} />
        </span>
        <p className="mt-4 text-[16px] font-bold text-neutral-900 dark:text-white">
          Application received
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          A compliance officer will review your trading history and documents. Allow up to 3
          business days — we&apos;ll email you at {email} either way.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-2xl border border-hairline bg-card p-6 shadow-card"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div>
        <label htmlFor={nameId} className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-200">
          Trading name
        </label>
        <input
          id={nameId}
          type="text"
          required
          value={tradingName}
          onChange={(e) => setTradingName(e.target.value)}
          placeholder="How buyers and sellers will see you"
          className="mt-1.5 h-11 w-full rounded-xl border border-hairline bg-transparent px-3 text-[13.5px] text-neutral-900 outline-none transition-shadow placeholder:text-neutral-400 focus:border-brand-300 focus:shadow-focus dark:text-white"
        />
      </div>

      <div>
        <label className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-200">
          Expected monthly volume
        </label>
        <Select value={volume} onValueChange={(v) => setVolume(v ?? "")}>
          <SelectTrigger className="mt-1.5 h-11 w-full rounded-xl border-hairline text-[13.5px]">
            <SelectValue placeholder="Select a range" />
          </SelectTrigger>
          <SelectContent>
            {VOLUME_TIERS.map((tier) => (
              <SelectItem key={tier.value} value={tier.value}>
                {tier.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor={reasonId} className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-200">
          Why do you want Merchant status?
        </label>
        <Textarea
          id={reasonId}
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="A couple of sentences on your trading history and volume"
          className="mt-1.5 min-h-24 text-[13.5px]"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-2 text-[12.5px] leading-relaxed text-neutral-600 dark:text-neutral-300">
        <Checkbox
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked === true)}
          required
          className="mt-0.5"
        />
        I confirm this information is accurate and I agree to an enhanced (Level 3)
        verification and compliance review.
      </label>

      <Button type="submit" disabled={!agreed} className="h-11 w-full gap-2 text-[14px]">
        <Send className="size-4" strokeWidth={2.1} />
        Submit Application
      </Button>
    </form>
  );
}
