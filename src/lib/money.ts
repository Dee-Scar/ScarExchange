import type { Currency, Minor, ScaledRate } from "./types";

/**
 * Money and rate arithmetic.
 *
 * Everything is integer maths. A trade of ¥10,000 at ₦219.00 must produce
 * exactly ₦2,190,000.00 every time, on every machine — floats cannot promise
 * that, so amounts live in minor units and rates are scaled integers.
 */

/** ¥1 = 100 fen, ₦1 = 100 kobo. */
export const MINOR_UNITS = 100;

/** Rates carry 4 decimal places: ₦219.5000 => 2_195_000. */
export const RATE_SCALE = 10_000;

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  RMB: "¥",
  NGN: "₦",
};

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

/** ¥10,000 => 1_000_000 fen. */
export function toMinor(major: number): Minor {
  return Math.round(major * MINOR_UNITS);
}

export function toMajor(minor: Minor): number {
  return minor / MINOR_UNITS;
}

/** ₦219.5 => 2_195_000. */
export function toScaledRate(rate: number): ScaledRate {
  return Math.round(rate * RATE_SCALE);
}

export function fromScaledRate(rate: ScaledRate): number {
  return rate / RATE_SCALE;
}

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

/**
 * Convert an RMB amount to NGN at a given rate.
 * Both inputs are integers, so the result is exact and reproducible.
 */
export function convertRmbToNgn(amountRmb: Minor, rate: ScaledRate): Minor {
  return Math.round((amountRmb * rate) / RATE_SCALE);
}

export function convertNgnToRmb(amountNgn: Minor, rate: ScaledRate): Minor {
  return Math.round((amountNgn * RATE_SCALE) / rate);
}

/** Basis points, so a 0.5% fee is `applyBps(amount, 50)`. */
export function applyBps(amount: Minor, bps: number): Minor {
  return Math.round((amount * bps) / 10_000);
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

interface FormatOptions {
  /** Show decimal places even when the amount is whole. Default: false. */
  decimals?: boolean;
  /** Omit the currency symbol. Default: false. */
  bare?: boolean;
  /** Collapse to 4.2M / 45.7K. Default: false. */
  compact?: boolean;
}

function group(value: number, min: number, max: number): string {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  }).format(value);
}

function formatMinor(
  minor: Minor,
  currency: Currency,
  { decimals = false, bare = false, compact = false }: FormatOptions = {},
): string {
  const major = toMajor(minor);
  const symbol = bare ? "" : CURRENCY_SYMBOL[currency];

  if (compact) {
    return symbol + compactNumber(major);
  }

  const isWhole = Number.isInteger(major);
  const body = decimals || !isWhole ? group(major, 2, 2) : group(major, 0, 0);
  return symbol + body;
}

/** ¥10,000 — the RMB leg of every trade. */
export function formatRmb(minor: Minor, options?: FormatOptions): string {
  return formatMinor(minor, "RMB", options);
}

/** ₦2,190,000 — the NGN leg. */
export function formatNgn(minor: Minor, options?: FormatOptions): string {
  return formatMinor(minor, "NGN", options);
}

export function formatMoney(
  minor: Minor,
  currency: Currency,
  options?: FormatOptions,
): string {
  return formatMinor(minor, currency, options);
}

/** "₦219.00" — rates always show 2dp so columns align. */
export function formatRate(rate: ScaledRate, withSymbol = true): string {
  const value = fromScaledRate(rate);
  return (withSymbol ? CURRENCY_SYMBOL.NGN : "") + group(value, 2, 2);
}

/** "₦219.00 / RMB" for the marketplace rate column. */
export function formatRatePerRmb(rate: ScaledRate): string {
  return `${formatRate(rate)}/RMB`;
}

/** 4_200_000 => "4.2M". Used by KPI tiles where space is tight. */
export function compactNumber(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return trimZero(value / 1_000_000_000) + "B";
  if (abs >= 1_000_000) return trimZero(value / 1_000_000) + "M";
  if (abs >= 1_000) return trimZero(value / 1_000) + "K";
  return group(value, 0, 0);
}

function trimZero(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** 12450 => "12,450". */
export function formatCount(value: number): string {
  return group(value, 0, 0);
}

/** 0.998 => "99.8%". */
export function formatPercent(fraction: number, decimals = 1): string {
  return `${(fraction * 100).toFixed(decimals)}%`;
}

/** Already-a-percentage variant: 18.5 => "18.5%". */
export function formatPercentValue(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** Signed delta for trend chips: 18.5 => "↑ 18.5%". */
export function formatDelta(percent: number): string {
  const arrow = percent >= 0 ? "↑" : "↓";
  return `${arrow} ${Math.abs(percent).toFixed(1)}%`;
}

/** 120 => "2 min". Release times and response times. */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} sec`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

/** Countdown for payment deadlines: 872 => "14:32". */
export function formatCountdown(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/** Fraction of a limit consumed, clamped for progress bars. */
export function usageFraction(used: Minor, total: Minor): number {
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, used / total));
}
