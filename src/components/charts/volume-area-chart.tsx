"use client";

import { useMemo, useState } from "react";
import { formatDateShort } from "@/lib/date";
import type { TrendPoint } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMeasure } from "./use-measure";

/**
 * Trading volume over time.
 *
 * Both series are plotted in millions of RMB against a SINGLE axis. The NGN
 * leg is converted at the reference rate rather than given its own scale —
 * two y-axes on one chart cannot be compared honestly, so the conversion
 * happens in the data and the tooltip restores the native ₦ figure.
 */

const SERIES = [
  { key: "rmb" as const, label: "RMB Volume (¥)", color: "var(--chart-1)" },
  { key: "ngnAsRmb" as const, label: "NGN Volume (₦)", color: "var(--chart-2)" },
];

const PAD = { top: 16, right: 16, bottom: 28, left: 44 };

export function VolumeAreaChart({
  data,
  height = 260,
  className,
}: {
  data: TrendPoint[];
  height?: number;
  className?: string;
}) {
  const { ref, width } = useMeasure<HTMLDivElement>();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plot = useMemo(() => {
    const innerW = Math.max(0, width - PAD.left - PAD.right);
    const innerH = height - PAD.top - PAD.bottom;

    const values = data.flatMap((d) => [d.rmb, d.ngnAsRmb]);
    const rawMax = Math.max(...values, 1);
    // Round the ceiling up to a clean 10 so the gridline labels are readable.
    const max = Math.ceil(rawMax / 10) * 10;

    const x = (i: number) =>
      PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
    const y = (v: number) => PAD.top + (1 - v / max) * innerH;

    const ticks = Array.from({ length: 5 }, (_, i) => (max / 4) * i);

    return { innerW, innerH, max, x, y, ticks };
  }, [data, width, height]);

  if (data.length === 0) return null;

  const buildPath = (key: (typeof SERIES)[number]["key"]) =>
    data
      .map((d, i) => {
        const px = plot.x(i);
        const py = plot.y(d[key]);
        if (i === 0) return `M ${px.toFixed(2)} ${py.toFixed(2)}`;
        const prevX = plot.x(i - 1);
        const prevY = plot.y(data[i - 1][key]);
        const cx = (prevX + px) / 2;
        return `C ${cx.toFixed(2)} ${prevY.toFixed(2)} ${cx.toFixed(2)} ${py.toFixed(2)} ${px.toFixed(2)} ${py.toFixed(2)}`;
      })
      .join(" ");

  const baseline = PAD.top + plot.innerH;
  const active = hoverIndex != null ? data[hoverIndex] : null;

  function handleMove(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = event.clientX - rect.left - PAD.left;
    const ratio = plot.innerW === 0 ? 0 : relX / plot.innerW;
    const index = Math.round(ratio * (data.length - 1));
    setHoverIndex(Math.min(data.length - 1, Math.max(0, index)));
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Legend — always present for two or more series, so identity never
          depends on colour alone. */}
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
              aria-hidden="true"
            />
            <span className="text-[13px] font-medium text-neutral-600 dark:text-neutral-300">
              {s.label}
            </span>
          </span>
        ))}
        <span className="ml-auto text-[11px] text-neutral-400">
          Both series in ¥ millions
        </span>
      </div>

      <div ref={ref} className="relative w-full" style={{ height }}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            className="touch-none overflow-visible"
            onPointerMove={handleMove}
            onPointerLeave={() => setHoverIndex(null)}
            role="img"
            aria-label="Trading volume over the last 30 days, RMB and NGN, both in RMB millions"
          >
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.key} id={`area-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.20" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0.01" />
                </linearGradient>
              ))}
            </defs>

            {/* Recessive grid — present enough to read a value against, quiet
                enough to stay behind the data. */}
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
                  x={PAD.left - 10}
                  y={plot.y(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-neutral-400 text-[11px]"
                >
                  {tick === 0 ? "0" : `${Math.round(tick)}M`}
                </text>
              </g>
            ))}

            {SERIES.map((s) => (
              <path
                key={`fill-${s.key}`}
                d={`${buildPath(s.key)} L ${plot.x(data.length - 1)} ${baseline} L ${plot.x(0)} ${baseline} Z`}
                fill={`url(#area-${s.key})`}
              />
            ))}

            {SERIES.map((s) => (
              <path
                key={`line-${s.key}`}
                d={buildPath(s.key)}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* X labels at a readable density rather than every day. */}
            {data.map((d, i) =>
              i % 6 === 0 || i === data.length - 1 ? (
                <text
                  key={d.date}
                  x={plot.x(i)}
                  y={height - 8}
                  textAnchor={i === data.length - 1 ? "end" : i === 0 ? "start" : "middle"}
                  className="fill-neutral-400 text-[11px]"
                >
                  {formatDateShort(d.date)}
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
                {SERIES.map((s) => (
                  <circle
                    key={`dot-${s.key}`}
                    cx={plot.x(hoverIndex)}
                    cy={plot.y(active[s.key])}
                    r={5}
                    fill={s.color}
                    stroke="var(--surface)"
                    strokeWidth={2}
                  />
                ))}
              </g>
            )}
          </svg>
        )}

        {hoverIndex != null && active && width > 0 && (
          <div
            className="pointer-events-none absolute z-10 min-w-[168px] -translate-x-1/2 rounded-xl border border-hairline bg-popover p-3 shadow-popover"
            style={{
              left: Math.min(Math.max(plot.x(hoverIndex), 92), width - 92),
              top: 4,
            }}
          >
            <p className="mb-2 text-xs font-semibold text-neutral-900 dark:text-white">
              {formatDateShort(active.date)}, 2026
            </p>
            <div className="space-y-1.5">
              <TooltipRow
                color="var(--chart-1)"
                label="RMB"
                value={`¥${active.rmb.toFixed(1)}M`}
              />
              <TooltipRow
                color="var(--chart-2)"
                label="NGN"
                value={`₦${active.ngnNative.toFixed(2)}B`}
                note={`¥${active.ngnAsRmb.toFixed(1)}M equiv.`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TooltipRow({
  color,
  label,
  value,
  note,
}: {
  color: string;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="tabular ml-auto font-semibold text-neutral-900 dark:text-white">
        {value}
      </span>
      {note && <span className="text-[10px] text-neutral-400">{note}</span>}
    </div>
  );
}
