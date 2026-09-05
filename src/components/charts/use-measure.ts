"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measure a container so charts can draw in real pixels.
 *
 * Scaling a fixed viewBox would distort stroke widths — a "2px" line would
 * render at whatever the scale factor made it. Measuring keeps marks crisp
 * and honest at every breakpoint.
 */
export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        Math.abs(prev.width - width) < 0.5 && Math.abs(prev.height - height) < 0.5
          ? prev
          : { width, height },
      );
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, ...size };
}
