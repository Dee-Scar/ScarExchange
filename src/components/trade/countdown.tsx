"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { formatCountdown } from "@/lib/money";
import { cn } from "@/lib/utils";

/**
 * Payment deadline countdown.
 *
 * Rendered from a server-supplied seconds value so the first paint matches the
 * server exactly, then ticked on the client. Reading the wall clock during
 * render would produce a hydration mismatch on every load.
 */
export function Countdown({
  seconds,
  className,
  showIcon = true,
  onExpire,
}: {
  seconds: number;
  className?: string;
  showIcon?: boolean;
  onExpire?: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const [seenSeconds, setSeenSeconds] = useState(seconds);

  // Re-sync when the server hands down a new deadline. Adjusting state during
  // render is React's documented way to derive from props — an effect here
  // would render once with the stale value first.
  if (seconds !== seenSeconds) {
    setSeenSeconds(seconds);
    setRemaining(seconds);
  }

  // One interval for the component's life, not a new one every tick.
  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (remaining <= 0) onExpire?.();
  }, [remaining, onExpire]);

  const expired = remaining <= 0;
  // Under two minutes the deadline stops being informational and starts being
  // urgent, so it changes colour rather than only counting down.
  const urgent = remaining > 0 && remaining <= 120;

  return (
    <span
      className={cn(
        "tabular inline-flex items-center gap-1.5 font-semibold",
        expired
          ? "text-neutral-400"
          : urgent
            ? "text-danger-600 dark:text-danger-300"
            : "text-danger-500",
        className,
      )}
      role="timer"
      aria-live={urgent ? "polite" : "off"}
    >
      {showIcon && <Clock className="size-3.5" strokeWidth={2.2} />}
      {expired ? "Expired" : formatCountdown(remaining)}
    </span>
  );
}
