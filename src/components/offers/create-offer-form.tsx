"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Info,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { ButtonLink } from "@/components/kit/button-link";
import { RailIcon, railLabel } from "@/components/kit/payment-rail";
import { Callout, Panel } from "@/components/kit/primitives";
import { FormStepper } from "@/components/kit/stepper";
import { StatusPill } from "@/components/kit/status-badge";
import { TraderAvatar, VerifiedTick } from "@/components/kit/trader";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/date";
import {
  convertRmbToNgn,
  formatCount,
  formatDuration,
  formatNgn,
  formatPercent,
  formatRate,
  formatRmb,
  toMinor,
  toScaledRate,
} from "@/lib/money";
import type { PaymentRail, TraderSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "details", label: "Offer Details" },
  { id: "payment", label: "Payment Method" },
  { id: "review", label: "Review & Publish" },
];

const MAX_NOTES = 200;

/** Platform-wide bounds (PRD §30 — configurable from admin, not hard-coded). */
const AMOUNT_MIN = 1_000;
const AMOUNT_MAX = 50_000;

interface Bounds {
  rateLow: number;
  rateHigh: number;
  rateChangePercent: number;
  updatedAt: string;
}

/**
 * Offer creation (PRD §12).
 *
 * Everything the seller types recomputes the preview beside it, because the
 * number that matters — what they actually receive in Naira — is a product of
 * three separate fields and should never have to be worked out mentally.
 */
export function CreateOfferForm({
  trader,
  bounds,
  /** Rendered as the preview's timestamp. Supplied by the server so the first
      client paint matches it exactly instead of reading the local clock. */
  nowLabel,
}: {
  trader: TraderSummary;
  bounds: Bounds;
  nowLabel: string;
}) {
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState("218");
  const [minOrder, setMinOrder] = useState("1000");
  const [maxOrder, setMaxOrder] = useState("20000");
  const [rails, setRails] = useState<PaymentRail[]>(["alipay"]);
  const [notes, setNotes] = useState("");

  const amountNumber = Number(amount) || 0;
  const rateNumber = Number(rate) || 0;

  const totalNgn = useMemo(
    () => convertRmbToNgn(toMinor(amountNumber), toScaledRate(rateNumber)),
    [amountNumber, rateNumber],
  );

  // Validation the seller can act on, shown inline rather than on submit.
  const errors = {
    amount:
      amountNumber > 0 && (amountNumber < AMOUNT_MIN || amountNumber > AMOUNT_MAX)
        ? `Enter an amount between ¥${formatCount(AMOUNT_MIN)} and ¥${formatCount(AMOUNT_MAX)}`
        : null,
    maxOrder:
      Number(maxOrder) > 0 && Number(minOrder) > Number(maxOrder)
        ? "Maximum order must be at least the minimum order"
        : Number(maxOrder) > amountNumber && amountNumber > 0
          ? "Maximum order cannot exceed the amount you are offering"
          : null,
    rails: rails.length === 0 ? "Select at least one payment method" : null,
  };

  const hasErrors = Object.values(errors).some(Boolean);

  function toggleRail(rail: PaymentRail) {
    setRails((prev) =>
      prev.includes(rail) ? prev.filter((r) => r !== rail) : [...prev, rail],
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      {/* Form */}
      <section className="min-w-0 rounded-2xl border border-hairline bg-card p-5 shadow-card">
        <FormStepper steps={STEPS} currentIndex={0} className="pb-5" />

        <div className="border-t border-hairline pt-5">
          <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">
            1. Amount &amp; Rate
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field
              label="RMB Amount (¥)"
              prefix="¥"
              value={amount}
              onChange={setAmount}
              hint={`¥${formatCount(AMOUNT_MIN)} – ¥${formatCount(AMOUNT_MAX)}`}
              error={errors.amount}
            />
            <Field
              label="Exchange Rate (₦/RMB)"
              suffix="₦"
              value={rate}
              onChange={setRate}
              hint={`Current market rate: ${formatRate(bounds.rateLow)} – ${formatRate(bounds.rateHigh)}`}
              hintIcon
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-brand-50 px-4 py-3 dark:bg-brand-900/25">
            <div className="flex items-start gap-2.5">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-brand-600 dark:text-brand-300"
                strokeWidth={2.1}
              />
              <div>
                <p className="text-[12px] text-neutral-600 dark:text-neutral-300">
                  You will receive (approx.)
                </p>
                <p className="tabular mt-0.5 text-[19px] font-bold text-neutral-900 dark:text-white">
                  {formatNgn(totalNgn)}
                </p>
              </div>
            </div>
            <p className="tabular inline-flex items-center gap-1 text-[11.5px] text-neutral-500 dark:text-neutral-400">
              {formatCount(amountNumber)} RMB × {formatRate(toScaledRate(rateNumber))}
              <Info className="size-3 text-neutral-400" strokeWidth={2} />
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-hairline pt-5">
          <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">
            2. Limits
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field
              label="Minimum Order (¥)"
              prefix="¥"
              value={minOrder}
              onChange={setMinOrder}
              hint={`¥${formatCount(AMOUNT_MIN)} – ¥${formatCount(AMOUNT_MAX)}`}
            />
            <Field
              label="Maximum Order (¥)"
              prefix="¥"
              value={maxOrder}
              onChange={setMaxOrder}
              hint={`¥${formatCount(AMOUNT_MIN)} – ¥${formatCount(AMOUNT_MAX)}`}
              error={errors.maxOrder}
            />
          </div>
        </div>

        <div className="mt-5 border-t border-hairline pt-5">
          <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">
            3. Payment Method
          </h2>
          <p className="mt-1 text-[12.5px] text-neutral-500 dark:text-neutral-400">
            Select the Chinese payment methods you accept.
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(["alipay", "wechat"] as PaymentRail[]).map((rail) => {
              const selected = rails.includes(rail);
              return (
                <button
                  key={rail}
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => toggleRail(rail)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors",
                    selected
                      ? "border-brand-500 bg-brand-50/50 dark:bg-brand-900/20"
                      : "border-hairline hover:bg-surface-subtle dark:hover:bg-neutral-800/50",
                  )}
                >
                  <RailIcon rail={rail} className="size-9 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {railLabel(rail)}
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {rail === "alipay"
                        ? "Fast and secure payments via Alipay."
                        : "Receive payments via WeChat Pay."}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border transition-colors",
                      selected
                        ? "border-brand-600 bg-brand-600"
                        : "border-neutral-300 dark:border-neutral-600",
                    )}
                  >
                    {selected && (
                      <CheckCircle2 className="size-3 text-white" strokeWidth={3} />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.rails && (
            <p className="mt-2 text-[12px] text-danger-600 dark:text-danger-300">
              {errors.rails}
            </p>
          )}
        </div>

        <div className="mt-5 border-t border-hairline pt-5">
          <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">
            4. Additional Notes{" "}
            <span className="font-normal text-neutral-400">(Optional)</span>
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, MAX_NOTES))}
            rows={3}
            placeholder="Add any extra information for buyers (e.g. preferred amount, response time, etc.)"
            aria-label="Additional notes"
            className="mt-3 w-full resize-none rounded-xl border border-hairline bg-card p-3 text-[13px] text-neutral-900 outline-none transition-shadow placeholder:text-neutral-400 focus:border-brand-300 focus:shadow-focus dark:text-white"
          />
          <p className="tabular mt-1 text-right text-[11px] text-neutral-400">
            {notes.length}/{MAX_NOTES}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
          <ButtonLink href="/dashboard" variant="outline" className="px-6">
            Cancel
          </ButtonLink>
          <Button disabled={hasErrors} className="gap-2 px-5">
            Next: Payment Method
            <ArrowRight className="size-4" strokeWidth={2.3} />
          </Button>
        </div>
      </section>

      {/* Live preview + guidance */}
      <aside className="min-w-0 space-y-5">
        <Panel
          title="Offer Preview"
          action={<Eye className="size-4 text-neutral-400" strokeWidth={1.9} />}
        >
          <div className="rounded-xl border border-hairline p-3.5">
            <div className="flex items-center justify-between gap-2">
              <StatusPill tone="success" icon={TrendingUp}>
                Selling RMB
              </StatusPill>
              <span className="tabular text-[11px] text-neutral-400">{nowLabel}</span>
            </div>

            <div className="mt-3 flex items-center gap-2.5">
              <TraderAvatar trader={trader} size="md" />
              <div className="min-w-0">
                <span className="flex items-center gap-1">
                  <span className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                    {trader.username}
                  </span>
                  {trader.verified && <VerifiedTick className="size-3.5" />}
                </span>
                <span className="text-[11px] font-semibold text-brand-700 dark:text-brand-300">
                  {trader.isMerchant ? "Verified Merchant" : "Verified Trader"}
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 border-y border-hairline py-3 text-center">
              <PreviewStat
                value={formatPercent(trader.completionRate)}
                label="Completion Rate"
              />
              <PreviewStat
                value={formatCount(trader.completedTrades)}
                label="Completed Trades"
              />
              <PreviewStat
                value={formatDuration(trader.avgReleaseTime)}
                label="Avg. Release Time"
              />
            </div>

            <dl className="mt-3 space-y-2 text-[12.5px]">
              <PreviewRow label="RMB Amount" value={formatRmb(toMinor(amountNumber))} />
              <PreviewRow
                label="Rate"
                value={`${formatRate(toScaledRate(rateNumber))} / RMB`}
              />
              <PreviewRow
                label="Total (approx.)"
                value={formatNgn(totalNgn)}
                emphasis
              />
              <PreviewRow
                label="Payment Method"
                value={
                  rails.length === 0 ? (
                    <span className="text-neutral-400">None selected</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      {rails.map((rail) => (
                        <span key={rail} className="inline-flex items-center gap-1">
                          <RailIcon rail={rail} className="size-4" />
                          <span className="text-[12px]">{railLabel(rail)}</span>
                        </span>
                      ))}
                    </span>
                  )
                }
              />
              <PreviewRow label="Min. Order" value={formatRmb(toMinor(Number(minOrder) || 0))} />
              <PreviewRow label="Max. Order" value={formatRmb(toMinor(Number(maxOrder) || 0))} />
            </dl>

            <Callout tone="success" icon={CheckCircle2} className="mt-3">
              Your offer will be visible to verified buyers once published.
            </Callout>
          </div>
        </Panel>

        {/* Market context, so the seller can price against something real. */}
        <div className="rounded-2xl bg-gradient-to-br from-brand-900 to-brand-950 p-4 text-white">
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-brand-100">
            <TrendingUp className="size-3.5" strokeWidth={2.2} />
            Current Market Rate
          </p>
          <p className="tabular mt-2 text-[19px] font-bold">
            ¥1 = {formatRate(bounds.rateLow)} – {formatRate(bounds.rateHigh)}
            <span className="ml-2 text-[12px] font-semibold text-success-200">
              ↑ +{bounds.rateChangePercent}%
            </span>
          </p>
          <p className="mt-1 text-[11px] text-brand-200/80">
            Last updated: {formatDateTime(bounds.updatedAt).split(", ")[1]}
          </p>
        </div>

        <Panel
          title={
            <span className="flex items-center gap-1.5 text-[15px] font-semibold text-neutral-900 dark:text-white">
              <Lightbulb className="size-4 text-warning-500" strokeWidth={2.1} />
              Tips for a Successful Offer
            </span>
          }
        >
          <ul className="space-y-2">
            {[
              "Set a competitive rate",
              "Use verified payment methods",
              "Keep your available amount updated",
              "Respond to buyers quickly",
              "Maintain a high completion rate",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-success-500"
                  strokeWidth={2.2}
                />
                <span className="text-[12.5px] text-neutral-600 dark:text-neutral-300">
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  hintIcon,
  prefix,
  suffix,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  hintIcon?: boolean;
  prefix?: string;
  suffix?: string;
  error?: string | null;
}) {
  const id = label.replace(/\W+/g, "-").toLowerCase();

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[12.5px] font-medium text-neutral-700 dark:text-neutral-200"
      >
        {label}
      </label>
      <div
        className={cn(
          "mt-1.5 flex h-11 items-center rounded-xl border bg-card px-3 transition-shadow focus-within:shadow-focus",
          error
            ? "border-danger-300 focus-within:border-danger-400"
            : "border-hairline focus-within:border-brand-300",
        )}
      >
        {prefix && <span className="mr-1.5 text-[14px] text-neutral-400">{prefix}</span>}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-hint`}
          className="tabular min-w-0 flex-1 bg-transparent text-[14px] font-medium text-neutral-900 outline-none dark:text-white"
        />
        {suffix && <span className="ml-1.5 text-[14px] text-neutral-400">{suffix}</span>}
      </div>
      <p
        id={`${id}-hint`}
        className={cn(
          "mt-1 inline-flex items-center gap-1 text-[11.5px]",
          error ? "text-danger-600 dark:text-danger-300" : "text-neutral-400",
        )}
      >
        {error ?? hint}
        {!error && hintIcon && <Info className="size-3" strokeWidth={2} />}
      </p>
    </div>
  );
}

function PreviewStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="tabular text-[13px] font-bold text-neutral-900 dark:text-white">
        {value}
      </p>
      <p className="mt-0.5 text-[10px] leading-tight text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
    </div>
  );
}

function PreviewRow({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-neutral-500 dark:text-neutral-400">{label}</dt>
      <dd
        className={cn(
          "tabular text-right font-medium text-neutral-900 dark:text-white",
          emphasis && "text-[14px] font-bold",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
