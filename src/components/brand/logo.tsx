import Image from "next/image";
import { cn } from "@/lib/utils";

/** Intrinsic size of the logo layers — used to keep every rendered size in ratio. */
const LOGO_WIDTH = 1672;
const LOGO_HEIGHT = 941;
const LOGO_RATIO = LOGO_WIDTH / LOGO_HEIGHT;

/**
 * ScarExchange wordmark, split into two layers so dark mode can invert one
 * without the other:
 *  - `logo-scar.png` — just the blue "SCAR" letters, always shown in colour.
 *  - `logo-rest.png` — the chart arrows + "EXCHANGE" text, inverted to white
 *    in dark mode (`dark:brightness-0 dark:invert`) since it's near-black in
 *    the source and would otherwise disappear on a dark background.
 * Both files are the same canvas size as the original artwork so they line
 * up stacked with no extra positioning math.
 */
export function LogoMark({
  className,
  height = 32,
}: {
  className?: string;
  /** Rendered height in px; width is derived from the source image's ratio. */
  height?: number;
}) {
  return (
    <span
      role="img"
      aria-label="ScarExchange"
      className={cn("relative inline-block shrink-0", className)}
      style={{ height, width: height * LOGO_RATIO }}
    >
      <Image
        src="/logo-scar.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes={`${Math.round(height * LOGO_RATIO)}px`}
        className="object-contain"
      />
      <Image
        src="/logo-rest.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes={`${Math.round(height * LOGO_RATIO)}px`}
        className="object-contain dark:brightness-0 dark:invert"
      />
    </span>
  );
}

export function Logo({
  className,
  height = 32,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <LogoMark height={height} />
    </span>
  );
}
