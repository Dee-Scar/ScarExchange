import { cn } from "@/lib/utils";

/**
 * The micro-trend inside a stat tile.
 *
 * It is annotation, not the headline — the tile's big number carries the
 * value and the delta chip carries the direction, so the sparkline has no
 * axes, no labels and no hover layer. It exists to show shape.
 */
export function Sparkline({
  data,
  color,
  className,
  width = 260,
  height = 56,
  fill = true,
  strokeWidth = 2,
}: {
  data: number[];
  color: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  strokeWidth?: number;
}) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = strokeWidth;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = pad + (1 - (value - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });

  // Catmull-Rom style smoothing keeps the curve readable without inventing
  // peaks the data does not have.
  const line = points
    .map(([x, y], i) => {
      if (i === 0) return `M ${x.toFixed(2)} ${y.toFixed(2)}`;
      const [px, py] = points[i - 1];
      const cx = (px + x) / 2;
      return `C ${cx.toFixed(2)} ${py.toFixed(2)} ${cx.toFixed(2)} ${y.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const gradientId = `spark-${color.replace(/[^a-z0-9]/gi, "")}-${data.length}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-14 w-full", className)}
      aria-hidden="true"
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line} L ${width} ${height} L 0 ${height} Z`} fill={`url(#${gradientId})`} />
        </>
      )}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
