import Image from "next/image";
import { cn } from "@/lib/utils";

/** Intrinsic size of public/logo.png — used to keep every rendered size in ratio. */
const LOGO_WIDTH = 1672;
const LOGO_HEIGHT = 941;

/**
 * ScarExchange wordmark. The source file already bakes in both the mark and
 * the "EXCHANGE" text, so every call site sizes it by height only — width
 * follows automatically — and there's no separate icon-only variant.
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
    <Image
      src="/logo.png"
      alt="ScarExchange"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority
      style={{ height, width: "auto" }}
      className={cn("shrink-0 object-contain", className)}
    />
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
