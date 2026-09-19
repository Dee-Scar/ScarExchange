"use server";

import { revalidatePath } from "next/cache";
import { depositToWallet, withdrawFromWallet } from "@/lib/api";
import type { Minor } from "@/lib/types";

/**
 * Deposit/withdraw against the real wallet ledger. Stays on /wallet (no
 * redirect — there's nowhere more relevant to go), so a revalidate is what
 * makes the new balance show up in the same response.
 */
export async function depositAction(bankAccountId: string, amountNgn: Minor) {
  await depositToWallet(bankAccountId, amountNgn);
  revalidatePath("/wallet");
}

export async function withdrawAction(bankAccountId: string, amountNgn: Minor) {
  await withdrawFromWallet(bankAccountId, amountNgn);
  revalidatePath("/wallet");
}
