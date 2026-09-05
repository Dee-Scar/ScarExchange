"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-12 w-full rounded-xl border border-hairline bg-transparent pl-10 pr-3 text-[13.5px] text-neutral-900 outline-none transition-shadow placeholder:text-neutral-400 focus:border-brand-300 focus:shadow-focus dark:text-white";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
}

/** Labelled, icon-prefixed input shared by the login and signup forms. */
export function AuthField({ label, icon: Icon, className, id, ...props }: AuthFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-200"
        >
          {label}
        </label>
      )}
      <div className="relative mt-1.5">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
          strokeWidth={2}
        />
        <input id={inputId} className={cn(fieldClass, className)} {...props} />
      </div>
    </div>
  );
}

interface AuthPasswordFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  icon: LucideIcon;
}

/** Same as `AuthField`, plus a show/hide toggle for password entry. */
export function AuthPasswordField({
  label,
  icon: Icon,
  className,
  id,
  ...props
}: AuthPasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-200"
        >
          {label}
        </label>
      )}
      <div className="relative mt-1.5">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
          strokeWidth={2}
        />
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(fieldClass, "pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          {visible ? (
            <EyeOff className="size-4" strokeWidth={2} />
          ) : (
            <Eye className="size-4" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}
