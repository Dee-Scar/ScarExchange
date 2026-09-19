"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
] as const;

const subscribeNoop = () => () => {};

/** Colour theme — the real next-themes setting the header toggle also drives. */
export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  // The server can't know the stored theme, so nothing is marked active until the client has mounted.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Colour theme">
      {OPTIONS.map((option) => {
        const active = mounted && theme === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(option.id)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border py-3 text-[13px] font-semibold transition-colors",
              active
                ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                : "border-hairline text-neutral-600 hover:bg-surface-subtle dark:text-neutral-300 dark:hover:bg-neutral-800/50",
            )}
          >
            <option.icon className="size-4" strokeWidth={2} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
