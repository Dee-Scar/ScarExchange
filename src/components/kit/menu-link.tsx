"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * A dropdown item that navigates.
 *
 * Base UI composes through a `render` element rather than Radix's `asChild`,
 * so that detail is absorbed here instead of repeated at every call site.
 */
export function MenuLink({
  href,
  icon: Icon,
  children,
  danger = false,
  className,
}: {
  href: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  danger?: boolean;
  className?: string;
}) {
  return (
    <DropdownMenuItem
      render={<Link href={href} />}
      className={cn("flex items-center gap-2", danger && "text-danger-600", className)}
    >
      {Icon && (
        <Icon
          className={cn("size-4", danger ? "text-danger-500" : "text-neutral-400")}
          strokeWidth={1.9}
        />
      )}
      {children}
    </DropdownMenuItem>
  );
}
