"use client";

import { ChevronDown } from "lucide-react";
import { RailIcon } from "@/components/kit/payment-rail";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { PaymentRail } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface OfferFilterState {
  rails: PaymentRail[];
  rateMin: string;
  rateMax: string;
  amountMin: string;
  amountMax: string;
  merchantsOnly: boolean;
  minCompletion: string;
}

export const emptyFilters: OfferFilterState = {
  rails: [],
  rateMin: "",
  rateMax: "",
  amountMin: "",
  amountMax: "",
  merchantsOnly: false,
  minCompletion: "",
};

const RAIL_OPTIONS: { id: PaymentRail; label: string }[] = [
  { id: "alipay", label: "Alipay" },
  { id: "wechat", label: "WeChat Pay" },
];

/**
 * Marketplace filter rail (PRD §11).
 *
 * Filters are applied live as they change — "Apply Filters" is there for the
 * mobile drawer, where a tap target to dismiss and commit is expected.
 */
export function OfferFilters({
  value,
  onChange,
  onApply,
  className,
}: {
  value: OfferFilterState;
  onChange: (next: OfferFilterState) => void;
  onApply?: () => void;
  className?: string;
}) {
  const patch = (next: Partial<OfferFilterState>) => onChange({ ...value, ...next });
  const allMethods = value.rails.length === 0;

  function toggleRail(rail: PaymentRail, checked: boolean) {
    patch({
      rails: checked ? [...value.rails, rail] : value.rails.filter((r) => r !== rail),
    });
  }

  const isDirty =
    value.rails.length > 0 ||
    value.rateMin !== "" ||
    value.rateMax !== "" ||
    value.amountMin !== "" ||
    value.amountMax !== "" ||
    value.merchantsOnly ||
    value.minCompletion !== "";

  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-card p-5 shadow-card",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">
          Filters
        </h2>
        <button
          type="button"
          onClick={() => onChange(emptyFilters)}
          disabled={!isDirty}
          className="text-[13px] font-medium text-brand-600 transition-colors hover:text-brand-700 disabled:cursor-not-allowed disabled:text-neutral-300 dark:text-brand-300 dark:disabled:text-neutral-600"
        >
          Clear all
        </button>
      </div>

      <FilterGroup label="Payment Method">
        <label className="flex cursor-pointer items-center gap-2.5 py-1.5">
          <Checkbox
            checked={allMethods}
            onCheckedChange={(checked) => checked && patch({ rails: [] })}
          />
          <span className="text-[13.5px] font-medium text-neutral-700 dark:text-neutral-200">
            All Methods
          </span>
        </label>
        {RAIL_OPTIONS.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-center gap-2.5 py-1.5"
          >
            <Checkbox
              checked={value.rails.includes(option.id)}
              onCheckedChange={(checked) => toggleRail(option.id, checked === true)}
            />
            <RailIcon rail={option.id} />
            <span className="text-[13.5px] text-neutral-700 dark:text-neutral-200">
              {option.label}
            </span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup label="Rate (₦ per 1 RMB)">
        <div className="flex items-center gap-2">
          <NumberField
            placeholder="Min"
            value={value.rateMin}
            onChange={(v) => patch({ rateMin: v })}
            aria-label="Minimum rate"
          />
          <span className="text-neutral-300">to</span>
          <NumberField
            placeholder="Max"
            value={value.rateMax}
            onChange={(v) => patch({ rateMax: v })}
            aria-label="Maximum rate"
          />
        </div>
      </FilterGroup>

      <FilterGroup label="Available Amount (RMB)">
        <div className="flex items-center gap-2">
          <NumberField
            placeholder="Min"
            value={value.amountMin}
            onChange={(v) => patch({ amountMin: v })}
            aria-label="Minimum available amount"
          />
          <span className="text-neutral-300">to</span>
          <NumberField
            placeholder="Max"
            value={value.amountMax}
            onChange={(v) => patch({ amountMax: v })}
            aria-label="Maximum available amount"
          />
        </div>
      </FilterGroup>

      <details className="group border-t border-hairline pt-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[13.5px] font-medium text-neutral-700 dark:text-neutral-200">
          More Filters
          <ChevronDown
            className="size-4 text-neutral-400 transition-transform group-open:rotate-180"
            strokeWidth={2}
          />
        </summary>
        <div className="mt-3 space-y-3">
          <label className="flex cursor-pointer items-center gap-2.5">
            <Checkbox
              checked={value.merchantsOnly}
              onCheckedChange={(checked) => patch({ merchantsOnly: checked === true })}
            />
            <span className="text-[13.5px] text-neutral-700 dark:text-neutral-200">
              Verified merchants only
            </span>
          </label>
          <div>
            <p className="mb-1.5 text-[12px] text-neutral-500 dark:text-neutral-400">
              Minimum completion rate (%)
            </p>
            <NumberField
              placeholder="e.g. 98"
              value={value.minCompletion}
              onChange={(v) => patch({ minCompletion: v })}
              aria-label="Minimum completion rate"
            />
          </div>
        </div>
      </details>

      <Button className="mt-5 w-full" onClick={onApply}>
        Apply Filters
      </Button>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-hairline py-4 first-of-type:border-t-0">
      <p className="mb-2 text-[13px] font-semibold text-neutral-900 dark:text-white">
        {label}
      </p>
      {children}
    </div>
  );
}

function NumberField({
  value,
  onChange,
  placeholder,
  ...rest
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
} & React.AriaAttributes) {
  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
      className="tabular h-9 w-full min-w-0 rounded-lg border border-hairline bg-card px-2.5 text-[13px] text-neutral-900 outline-none transition-shadow placeholder:text-neutral-400 focus:border-brand-300 focus:shadow-focus dark:text-white"
      {...rest}
    />
  );
}
