"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { TraderAvatar } from "@/components/kit/trader";
import { Button } from "@/components/ui/button";
import type { TraderSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

const MAX_REVIEW = 200;

/**
 * Post-trade rating (PRD §21).
 *
 * Reputation is the trust currency of the marketplace, so rating is offered
 * immediately after settlement while the experience is fresh — but the review
 * text stays optional so a rating is never blocked behind writing.
 */
export function RateCounterparty({
  counterparty,
  role,
}: {
  counterparty: TraderSummary;
  role: "Buyer" | "Seller";
}) {
  const [stars, setStars] = useState(5);
  const [hovered, setHovered] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const shown = hovered ?? stars;

  if (submitted) {
    return (
      <div className="rounded-2xl border border-hairline bg-card p-5 text-center shadow-card">
        <Star className="mx-auto size-8 fill-warning-500 text-warning-500" />
        <p className="mt-2 text-[14px] font-semibold text-neutral-900 dark:text-white">
          Thanks for rating {counterparty.username}
        </p>
        <p className="mt-1 text-[12.5px] text-neutral-500 dark:text-neutral-400">
          Your feedback helps keep the marketplace trustworthy.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
      <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">
        Rate the {role}
      </h2>
      <p className="mt-1 text-[12.5px] text-neutral-500 dark:text-neutral-400">
        How was your trading experience with {counterparty.username}?
      </p>

      <div className="mt-3 flex items-center gap-2">
        <TraderAvatar trader={counterparty} size="sm" />
        <span className="text-[13px] font-semibold text-neutral-900 dark:text-white">
          {counterparty.username}
        </span>
        {counterparty.isMerchant && (
          <span className="text-[11px] font-semibold text-brand-700 dark:text-brand-300">
            Verified Merchant
          </span>
        )}
      </div>

      <div
        className="mt-3 flex gap-1"
        role="radiogroup"
        aria-label={`Rate ${counterparty.username} out of five stars`}
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={stars === value}
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
            onClick={() => setStars(value)}
            onPointerEnter={() => setHovered(value)}
            onPointerLeave={() => setHovered(null)}
            className="rounded transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "size-7",
                value <= shown
                  ? "fill-warning-500 text-warning-500"
                  : "fill-transparent text-neutral-300 dark:text-neutral-600",
              )}
              strokeWidth={1.8}
            />
          </button>
        ))}
      </div>

      <div className="mt-3">
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value.slice(0, MAX_REVIEW))}
          placeholder="Write a review (optional)"
          rows={3}
          aria-label="Review"
          className="w-full resize-none rounded-xl border border-hairline bg-card p-3 text-[13px] text-neutral-900 outline-none transition-shadow placeholder:text-neutral-400 focus:border-brand-300 focus:shadow-focus dark:text-white"
        />
        <p className="tabular mt-1 text-right text-[11px] text-neutral-400">
          {review.length}/{MAX_REVIEW}
        </p>
      </div>

      <Button
        className="mt-2 w-full"
        onClick={() => {
          setSubmitted(true);
          toast.success(`You rated ${counterparty.username} ${stars} stars`);
        }}
      >
        Submit Rating
      </Button>
    </section>
  );
}
