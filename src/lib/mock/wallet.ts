import { NOW } from "../date";
import type { Minor, WalletEntry, WalletEntryType } from "../types";
import { currentUser } from "./users";

/**
 * The wallet ledger (PRD §22, §44). Starts empty rather than seeded with
 * fabricated history — there's no real prior deposit/withdrawal event to
 * ground one in, unlike everywhere else in this app that reuses real data.
 * Deposits and withdrawals through /wallet are the only way this grows, and
 * it's real in-memory server state for this process — see lib/api.ts's
 * header comment on why that's the deliberate pattern this phase uses, and
 * `createdTrades` in mock/trades.ts for the same approach applied to trades.
 */
export const walletEntries: WalletEntry[] = [];
let entrySequence = 0;

export function getWalletBalance(): Minor {
  return walletEntries.reduce(
    (sum, entry) => sum + (entry.type === "deposit" ? entry.amountNgn : -entry.amountNgn),
    0,
  );
}

export function addWalletEntry(type: WalletEntryType, amountNgn: Minor, bankAccountId: string): WalletEntry {
  entrySequence += 1;
  const entry: WalletEntry = {
    id: `wal_${entrySequence}`,
    userId: currentUser.id,
    type,
    amountNgn,
    bankAccountId,
    createdAt: NOW.toISOString(),
  };
  walletEntries.push(entry);
  return entry;
}
