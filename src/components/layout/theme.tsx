"use client";

import { Moon, Sun } from "lucide-react";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  /*
   * The server cannot know the viewer's theme, so rather than deferring the
   * icon behind a mounted flag, both icons render and CSS picks one off the
   * `dark` class already on <html>. No effect, no cascading render, and no
   * hydration mismatch — the markup is identical on both sides.
   */
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle colour theme"
      className={cn(
        "grid size-9 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white",
        className,
      )}
    >
      <Moon className="size-[18px] dark:hidden" strokeWidth={1.9} />
      <Sun className="hidden size-[18px] dark:block" strokeWidth={1.9} />
    </button>
  );
}
