"use client";

import { useMemo, useState } from "react";
import { formatDateShort, formatTime } from "@/lib/date";
import type { RateRange, RateTrendPoint } from "@/lib/mock/offers";
import { cn } from "@/lib/utils";
import { useMeasure } from "./use-measure";

const RANGES: RateRange[] = ["24H", "7D", "30D", "90D"];
const PAD = { top: 16, right: 12, bottom: 26, left: 44 };

/** Single-series RMB/NGN rate line, with a range tab strip (PRD-adjacent — no real history exists, see buildRateTrend). */
export function RateTrendChart({
  data,
  range,
  onRangeChange,
  height = 220,
}: {
  data: RateTrendPoint[];
  range: RateRange;
  onRangeChange: (range: RateRange) => void;
  height?: number;
}) {
  const { ref, width } = useMeasure<HTMLDivElement>();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plot = useMemo(() => {
    const innerW = Math.max(0, width - PAD.left - PAD.right);
    const innerH = height - PAD.top - PAD.bottom;
    const values = data.map((d) => d.rate);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = Math.max(0.3, (max - min) * 0.15);
    const lo = min - pad;
    const hi = max + pad;

    const x = (i: number) =>
      PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
    const y = (v: number) => PAD.top + (1 - (v - lo) / (hi - lo || 1)) * innerH;
    const ticks = Array.from({ length: 4 }, (_, i) => lo + ((hi - lo) / 3) * i);

    return { innerW, innerH, x, y, ticks };
  }, [data, width, height]);

  if (data.length === 0) return null;

  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${plot.x(i).toFixed(2)} ${plot.y(d.rate).toFixed(2)}`)
    .join(" ");
  const baseline = PAD.top + plot.innerH;
  const areaPath = `${path} L ${plot.x(data.length - 1).toFixed(2)} ${baseline} L ${plot.x(0).toFixed(2)} ${baseline} Z`;
  const active = hoverIndex != null ? data[hoverIndex] : null;

  function handleMove(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = event.clientX - rect.left - PAD.left;
    const ratio = plot.innerW === 0 ? 0 : relX / plot.innerW;
    const index = Math.round(ratio * (data.length - 1));
    setHoverIndex(Math.min(data.length - 1, Math.max(0, index)));
  }

  const formatLabel = (iso: string) => (range === "24H" ? formatTime(iso) : formatDateShort(iso));

  return (
    <div>
      <div className="flex items-center gap-1 rounded-lg bg-surface-subtle p-1 dark:bg-neutral-900">
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onRangeChange(r)}
            className={cn(
              "rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors",
              r === range
                ? "bg-brand-600 text-white"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <div ref={ref} className="relative mt-4 w-full" style={{ height }}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            className="touch-none overflow-visible"
            onPointerMove={handleMove}
            onPointerLeave={() => setHoverIndex(null)}
            role="img"
            aria-label={`RMB to NGN rate over the last ${range}`}
          >
            <defs>
              <linearGradient id="rate-trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {plot.ticks.map((tick) => (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  x2={width - PAD.right}
                  y1={plot.y(tick)}
                  y2={plot.y(tick)}
                  stroke="var(--hairline)"
                  strokeWidth={1}
                />
                <text
                  x={PAD.left - 8}
                  y={plot.y(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-neutral-400 text-[11px]"
                >
                  ₦{tick.toFixed(0)}
                </text>
              </g>
            ))}

            <path d={areaPath} fill="url(#rate-trend-fill)" />
            <path
              d={path}
              fill="none"
              stroke="var(--color-brand-600)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {data.map((d, i) =>
              i % Math.ceil(data.length / 6) === 0 || i === data.length - 1 ? (
                <text
                  key={d.at}
                  x={plot.x(i)}
                  y={height - 6}
                  textAnchor={i === data.length - 1 ? "end" : i === 0 ? "start" : "middle"}
                  className="fill-neutral-400 text-[11px]"
                >
                  {formatLabel(d.at)}
                </text>
              ) : null,
            )}

            {hoverIndex != null && active && (
              <g pointerEvents="none">
                <line
                  x1={plot.x(hoverIndex)}
                  x2={plot.x(hoverIndex)}
                  y1={PAD.top}
                  y2={baseline}
                  stroke="var(--color-neutral-400)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <circle
                  cx={plot.x(hoverIndex)}
                  cy={plot.y(active.rate)}
                  r={5}
                  fill="var(--color-brand-600)"
                  stroke="var(--surface)"
                  strokeWidth={2}
                />
              </g>
            )}
          </svg>
        )}

        {hoverIndex != null && active && width > 0 && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-xl border border-hairline bg-popover px-3 py-2 shadow-popover"
            style={{ left: Math.min(Math.max(plot.x(hoverIndex), 60), width - 60), top: 4 }}
          >
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {formatLabel(active.at)}
            </p>
            <p className="tabular text-[13px] font-bold text-neutral-900 dark:text-white">
              ₦{active.rate.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
