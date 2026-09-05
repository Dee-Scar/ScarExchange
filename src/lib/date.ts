import type { ISODateString } from "./types";

/**
 * Date formatting.
 *
 * The mock data is pinned to a fixed "now" so screenshots and screens stay
 * reproducible — relative timestamps like "2 min ago" are computed against
 * NOW rather than the wall clock, which also keeps SSR and client render in
 * agreement instead of producing hydration mismatches.
 */

/** The moment the seed data is frozen at (matches the PRD's Aug 31, 2026). */
export const NOW = new Date("2026-08-31T10:46:00+01:00");

export function now(): Date {
  return new Date(NOW);
}

/** Build a seed timestamp relative to NOW. */
export function ago(
  amount: number,
  unit: "min" | "hour" | "day" | "month" | "year",
): ISODateString {
  const ms = {
    min: 60_000,
    hour: 3_600_000,
    day: 86_400_000,
    month: 2_592_000_000,
    year: 31_536_000_000,
  }[unit];
  return new Date(NOW.getTime() - amount * ms).toISOString();
}

export function ahead(amount: number, unit: "min" | "hour" | "day"): ISODateString {
  const ms = { min: 60_000, hour: 3_600_000, day: 86_400_000 }[unit];
  return new Date(NOW.getTime() + amount * ms).toISOString();
}

const TZ = "Africa/Lagos";

/** "Aug 31, 2026" */
export function formatDate(iso: ISODateString): string {
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}

/** "Aug 31" — for chart axes and dense tables. */
export function formatDateShort(iso: ISODateString): string {
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}

/** "10:46 AM" */
export function formatTime(iso: ISODateString): string {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  }).format(new Date(iso));
}

/** "Aug 31, 10:38 AM" — trade timelines. */
export function formatDateTime(iso: ISODateString): string {
  return `${formatDateShort(iso)}, ${formatTime(iso)}`;
}

/** "Aug 31, 2026 10:46 AM" — receipts and audit logs. */
export function formatDateTimeLong(iso: ISODateString): string {
  return `${formatDate(iso)} ${formatTime(iso)}`;
}

/** "2026-08-31 14:32:18" — audit log precision. */
export function formatTimestamp(iso: ISODateString): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

/** "2 min ago", "3 hours ago", "12 Aug". */
export function formatRelative(iso: ISODateString, from: Date = NOW): string {
  const diff = from.getTime() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;

  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;

  return formatDateShort(iso);
}

/** Seconds remaining until a deadline, floored at zero. */
export function secondsUntil(iso: ISODateString, from: Date = NOW): number {
  return Math.max(0, Math.floor((new Date(iso).getTime() - from.getTime()) / 1000));
}

/** "Aug 1 – Aug 31, 2026" for the dashboard range picker. */
export function formatDateRange(start: ISODateString, end: ISODateString): string {
  return `${formatDateShort(start)} – ${formatDate(end)}`;
}

/** Group chat messages under a single day heading. */
export function isSameDay(a: ISODateString, b: ISODateString): boolean {
  return formatDate(a) === formatDate(b);
}
