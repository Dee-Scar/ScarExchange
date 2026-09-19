"use client";

import { useMemo, useState } from "react";
import { RateTrendChart } from "@/components/charts/rate-trend-chart";
import { buildRateTrend, type RateRange } from "@/lib/mock/offers";

/** Owns the 24H/7D/30D/90D range state; the chart itself stays presentational. */
export function RateTrend() {
  const [range, setRange] = useState<RateRange>("24H");
  const data = useMemo(() => buildRateTrend(range), [range]);

  return <RateTrendChart data={data} range={range} onRangeChange={setRange} />;
}
