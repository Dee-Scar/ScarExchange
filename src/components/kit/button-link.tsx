import Link from "next/link";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * A link that looks like a button.
 *
 * It deliberately does NOT wrap Base UI's Button. Composing that primitive
 * around an anchor stamps `role="button"` onto it, which tells assistive tech
 * this is a button and quietly costs the link affordances that matter for
 * navigation — announced as a link, opens in a new tab on modifier-click,
 * shows a target in the status bar. Borrowing just the visual variants keeps
 * the element an honest <a>.
 *
 * Use this for navigation; use <Button> for actions.
 */
export function ButtonLink({
  href,
  children,
  className,
  variant,
  size,
  prefetch,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
} & VariantProps<typeof buttonVariants> &
  Omit<React.ComponentProps<"a">, "href" | "children" | "className">) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
