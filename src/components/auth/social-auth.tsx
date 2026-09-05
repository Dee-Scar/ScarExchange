import type { ComponentType } from "react";
import { AppleIcon, GoogleIcon } from "@/components/kit/brand-icons";

/** "or continue with" divider + Google/Apple buttons, shared by login and signup. */
export function SocialAuth() {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-hairline" />
        <span className="text-[12px] font-medium text-neutral-400">or continue with</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <SocialButton icon={GoogleIcon} label="Continue with Google" />
        <SocialButton icon={AppleIcon} label="Continue with Apple" />
      </div>
    </div>
  );
}

function SocialButton({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-hairline bg-card text-[13.5px] font-semibold text-neutral-700 transition-colors hover:bg-surface-subtle dark:text-neutral-200 dark:hover:bg-neutral-800"
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
