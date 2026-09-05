"use client";

import { useMemo, useState } from "react";
import { formatCount } from "@/lib/money";
import { cn } from "@/lib/utils";

export interface DonutSegment {
  key: string;
  label: string;
  count: number;
  percent: number;
  color: string;
}

/**
 * Trade status distribution.
 *
 * These are status colours, not a categorical series — green settled, amber
 * waiting, red needs attention, grey inert — so they are never reused for
 * anything else, and every segment ships with a written label and count in the
 * legend beside it. Colour is the secondary cue here, never the only one.
 */
export function DonutChart({
  segments,
  total,
  totalLabel,
  size = 190,
  thickness = 26,
  className,
}: {
  segments: DonutSegment[];
  total: number;
  totalLabel?: string;
  size?: number;
  thickness?: number;
  className?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // A 2px gap of surface colour between segments keeps adjacent fills from
  // reading as one mass.
  const gap = 2;

  // Cumulative start offsets, derived without mutating anything: each arc's
  // offset is the sum of the arcs before it. Quadratic, over a handful of
  // segments — worth it to keep the render free of reassignment.
  const arcs = useMemo(() => {
    const lengths = segments.map((s) => (s.percent / 100) * circumference);
    return segments.map((segment, i) => ({
      segment,
      length: lengths[i],
      offset: lengths.slice(0, i).reduce((sum, l) => sum + l, 0),
    }));
  }, [segments, circumference]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label={`Trade status distribution across ${formatCount(total)} trades`}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-neutral-100)"
            strokeWidth={thickness}
            className="dark:stroke-neutral-800"
          />
          {arcs.map(({ segment, length, offset }) => {
            const dash = Math.max(0, length - gap);
            const isDimmed = hovered != null && hovered !== segment.key;
            return (
              <circle
                key={segment.key}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={hovered === segment.key ? thickness + 4 : thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                opacity={isDimmed ? 0.35 : 1}
                className="cursor-pointer transition-[stroke-width,opacity] duration-150"
                onPointerEnter={() => setHovered(segment.key)}
                onPointerLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          {hovered ? (
            (() => {
              const segment = segments.find((s) => s.key === hovered)!;
              return (
                <div>
                  <p className="tabular text-2xl font-bold text-neutral-900 dark:text-white">
                    {formatCount(segment.count)}
                  </p>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {segment.label}
                  </p>
                </div>
              );
            })()
          ) : (
            <div>
              <p className="tabular text-2xl font-bold text-neutral-900 dark:text-white">
                {formatCount(total)}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {totalLabel ?? "Total"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** The written legend that carries the same information without colour. */
export function DonutLegend({
  segments,
  className,
}: {
  segments: DonutSegment[];
  className?: string;
}) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {segments.map((segment) => (
        <li key={segment.key} className="flex items-center gap-2 text-[13px]">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: segment.color }}
            aria-hidden="true"
          />
          <span className="text-neutral-600 dark:text-neutral-300">{segment.label}</span>
          <span className="tabular ml-auto font-semibold text-neutral-900 dark:text-white">
            {formatCount(segment.count)}
          </span>
          <span className="tabular w-14 text-right text-neutral-400">
            ({segment.percent.toFixed(1)}%)
          </span>
        </li>
      ))}
    </ul>
  );
}
