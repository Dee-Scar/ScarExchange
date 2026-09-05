import type { Metadata } from "next";
import { SecuritySettings } from "@/components/security/security-settings";
import { getCurrentUser } from "@/lib/api";

export const metadata: Metadata = { title: "Security" };

export default async function SecurityPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
          Security
        </h1>
        <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          Keep your account locked down — this is the part of ScarExchange worth taking
          seriously.
        </p>
      </div>

      <SecuritySettings twoFactorEnabled={user.twoFactorEnabled} lastSignIn={user.lastSeenAt} />
    </div>
  );
}
