import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepState = "completed" | "current" | "pending" | "rejected";

export interface StepItem {
  id: string;
  label: string;
  /** Small line under the label — a status word or a timestamp. */
  caption?: string;
  state: StepState;
  icon?: LucideIcon;
}

const stateStyles: Record<StepState, { node: string; label: string; caption: string }> = {
  completed: {
    node: "bg-success-500 text-white ring-0",
    label: "text-neutral-900 dark:text-white",
    caption: "text-success-600 dark:text-success-300",
  },
  current: {
    node: "bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900/50",
    label: "text-neutral-900 dark:text-white",
    caption: "text-brand-600 dark:text-brand-300",
  },
  pending: {
    node: "bg-white text-neutral-400 ring-1 ring-inset ring-neutral-300 dark:bg-neutral-900 dark:ring-neutral-700",
    label: "text-neutral-500 dark:text-neutral-400",
    caption: "text-neutral-400",
  },
  rejected: {
    node: "bg-danger-500 text-white ring-0",
    label: "text-neutral-900 dark:text-white",
    caption: "text-danger-600 dark:text-danger-300",
  },
};

/**
 * Horizontal progress stepper.
 *
 * Each node carries its own icon or number and a written state underneath —
 * the connecting line is reinforcement, never the only signal of progress.
 */
export function Stepper({
  steps,
  numbered = false,
  size = "md",
  className,
}: {
  steps: StepItem[];
  /** Show 1,2,3 instead of icons on incomplete steps. */
  numbered?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const nodeSize = size === "sm" ? "size-8" : "size-11";
  const iconSize = size === "sm" ? "size-4" : "size-5";

  return (
    <ol className={cn("flex w-full items-start", className)}>
      {steps.map((step, index) => {
        const styles = stateStyles[step.state];
        const Icon = step.icon;
        const isLast = index === steps.length - 1;

        return (
          <li key={step.id} className="flex min-w-0 flex-1 flex-col items-center">
            {/*
              The connector has to reach exactly from this node's centre to
              the next one's — anchoring it to the label row (which the node
              row's width doesn't match once the connector itself stretches)
              is what put the two out of alignment. Instead it's absolutely
              positioned inside a track the same height as the node, centred
              on that track's mid-line, so it lines up regardless of size.
            */}
            <div className={cn("relative flex w-full items-center justify-center", nodeSize)}>
              {!isLast && (
                <span
                  className={cn(
                    "absolute left-1/2 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full transition-colors",
                    step.state === "completed"
                      ? "bg-success-500"
                      : "bg-neutral-200 dark:bg-neutral-700",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 grid shrink-0 place-items-center rounded-full font-semibold transition-colors",
                  nodeSize,
                  styles.node,
                )}
              >
                {step.state === "completed" && !Icon ? (
                  <Check className={iconSize} strokeWidth={2.6} />
                ) : Icon ? (
                  <Icon className={iconSize} strokeWidth={2.1} />
                ) : (
                  <span className={size === "sm" ? "text-xs" : "text-sm"}>{index + 1}</span>
                )}
              </span>
            </div>

            <div className="mt-2 w-full px-1 text-center">
              <p className={cn("text-[13px] font-medium leading-snug", styles.label)}>
                {numbered && (
                  <span className="mr-1 text-neutral-400">{index + 1}</span>
                )}
                {step.label}
              </p>
              {step.caption && (
                <p className={cn("mt-0.5 text-[11px] font-medium", styles.caption)}>
                  {step.caption}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Compact numbered stepper for multi-step forms (Create Offer). */
export function FormStepper({
  steps,
  currentIndex,
  className,
}: {
  steps: { id: string; label: string }[];
  currentIndex: number;
  className?: string;
}) {
  return (
    <ol className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <li key={step.id} className={cn("flex items-center gap-2", !isLast && "flex-1")}>
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors",
                isDone
                  ? "bg-success-500 text-white"
                  : isCurrent
                    ? "bg-brand-600 text-white"
                    : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800",
              )}
            >
              {isDone ? <Check className="size-3.5" strokeWidth={2.8} /> : index + 1}
            </span>
            <span
              className={cn(
                "whitespace-nowrap text-[13px] font-medium",
                isCurrent
                  ? "text-neutral-900 dark:text-white"
                  : "text-neutral-500 dark:text-neutral-400",
              )}
            >
              {step.label}
            </span>
            {!isLast && (
              <span className="mx-1 h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
