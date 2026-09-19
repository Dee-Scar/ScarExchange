"use server";

import { revalidatePath } from "next/cache";
import { setNotificationPreference } from "@/lib/api";
import type { NotificationCategory, NotificationChannel } from "@/lib/types";

/** Stays on /settings — revalidate so a reload reads the saved value, not the stale render. */
export async function setNotificationPreferenceAction(
  category: NotificationCategory,
  channel: NotificationChannel,
  enabled: boolean,
) {
  await setNotificationPreference(category, channel, enabled);
  revalidatePath("/settings");
}
