import type { Metadata } from "next";
import { Panel } from "@/components/kit/primitives";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { NotificationPreferencesForm } from "@/components/settings/notification-preferences";
import { getNotificationPreferences } from "@/lib/api";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const preferences = await getNotificationPreferences();

  return (
    <div className="mx-auto max-w-[900px] space-y-5">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          Choose how ScarExchange reaches you and how it looks.
        </p>
      </div>

      <ProfileTabs active="preferences" />

      <Panel title="Notifications">
        <NotificationPreferencesForm initial={preferences} />
      </Panel>

      <Panel title="Appearance">
        <AppearanceSettings />
      </Panel>
    </div>
  );
}
