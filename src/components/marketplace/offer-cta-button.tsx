"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * Trade creation isn't wired up in this UI-first preview (PRD §50 is still
 * mock-data only), so the primary CTA is honest about that instead of either
 * silently doing nothing or linking to a trade with different figures.
 */
export function OfferCtaButton({ label }: { label: string }) {
  const router = useRouter();

  return (
    <Button
      className="h-12 w-full text-[14px]"
      onClick={() =>
        toast.info("Trade creation isn't wired up in this preview yet.", {
          action: {
            label: "See a live trade →",
            onClick: () => router.push("/trades/SCX-84930"),
          },
        })
      }
    >
      {label}
    </Button>
  );
}
