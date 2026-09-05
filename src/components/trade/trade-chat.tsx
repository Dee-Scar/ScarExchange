"use client";

import { useMemo, useRef, useState } from "react";
import { Check, CheckCheck, Lock, Send, Smile } from "lucide-react";
import { TraderAvatar } from "@/components/kit/trader";
import { formatDate, formatTime } from "@/lib/date";
import type { Trade, TradeMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * In-trade chat and timeline (PRD §13).
 *
 * Negotiation happens here, so system events (rate locks especially) are
 * rendered inline with the conversation rather than in a separate log — the
 * agreed rate needs to sit in the same scroll as the message that produced it.
 */
export function TradeChat({
  trade,
  currentUserId,
}: {
  trade: Trade;
  currentUserId: string;
}) {
  const [tab, setTab] = useState<"chat" | "timeline">("chat");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<TradeMessage[]>(trade.messages);
  const listRef = useRef<HTMLDivElement>(null);

  const grouped = useMemo(() => {
    const days = new Map<string, TradeMessage[]>();
    for (const message of messages) {
      const day = formatDate(message.createdAt);
      days.set(day, [...(days.get(day) ?? []), message]);
    }
    return [...days.entries()];
  }, [messages]);

  function send(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;

    // Optimistic append. The real implementation emits over the trade socket
    // and reconciles on the server's echo.
    setMessages((prev) => [
      ...prev,
      {
        id: `local_${prev.length + 1}`,
        tradeId: trade.id,
        senderId: currentUserId,
        kind: "text",
        body,
        attachmentUrl: null,
        createdAt: new Date().toISOString(),
        readAt: null,
      },
    ]);
    setDraft("");
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  return (
    <section className="flex h-full min-h-[430px] flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
      <div className="flex gap-1 border-b border-hairline px-4 pt-3" role="tablist">
        {(["chat", "timeline"] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "-mb-px border-b-2 px-3 pb-2.5 text-[13.5px] font-medium transition-colors",
              tab === id
                ? "border-brand-600 text-brand-600 dark:text-brand-300"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400",
            )}
          >
            {id === "chat" ? "Chat" : "Trade Timeline"}
          </button>
        ))}
      </div>

      {tab === "chat" ? (
        <>
          <div
            ref={listRef}
            className="scrollbar-slim flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {grouped.map(([day, dayMessages]) => (
              <div key={day} className="space-y-3">
                <p className="text-center text-[11.5px] text-neutral-400">{day}</p>
                {dayMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    trade={trade}
                    isMine={message.senderId === currentUserId}
                  />
                ))}
              </div>
            ))}
          </div>

          <form
            onSubmit={send}
            className="flex items-center gap-2 border-t border-hairline px-3 py-2.5"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message..."
              aria-label="Message"
              className="h-9 min-w-0 flex-1 bg-transparent px-1 text-[13.5px] text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white"
            />
            <button
              type="button"
              aria-label="Add emoji"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Smile className="size-4" strokeWidth={2} />
            </button>
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-brand-600 transition-colors hover:bg-brand-50 disabled:text-neutral-300 dark:text-brand-300 dark:hover:bg-brand-900/30 dark:disabled:text-neutral-600"
            >
              <Send className="size-4" strokeWidth={2.1} />
            </button>
          </form>
        </>
      ) : (
        <ol className="scrollbar-slim flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {trade.events.map((event, index) => (
            <li key={event.id} className="relative flex gap-3 pb-1">
              {index < trade.events.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[7px] top-5 h-full w-px bg-hairline"
                />
              )}
              <span className="relative mt-1 size-3.5 shrink-0 rounded-full border-2 border-success-500 bg-card" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                  {event.label}
                </p>
                {event.description && (
                  <p className="mt-0.5 text-[12.5px] text-neutral-500 dark:text-neutral-400">
                    {event.description}
                  </p>
                )}
                <p className="tabular mt-0.5 text-[11.5px] text-neutral-400">
                  {formatDate(event.createdAt)} · {formatTime(event.createdAt)}
                  {event.actorLabel ? ` · ${event.actorLabel}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function MessageBubble({
  message,
  trade,
  isMine,
}: {
  message: TradeMessage;
  trade: Trade;
  isMine: boolean;
}) {
  if (message.kind === "system") {
    return (
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-[12px] font-medium text-brand-700 dark:bg-brand-900/35 dark:text-brand-200">
          <Lock className="size-3" strokeWidth={2.4} />
          {message.body}
          <span className="tabular ml-1 text-brand-500/70 dark:text-brand-300/70">
            {formatTime(message.createdAt)}
          </span>
        </span>
      </div>
    );
  }

  const sender = message.senderId === trade.buyer.id ? trade.buyer : trade.seller;

  return (
    <div className={cn("flex items-end gap-2", isMine && "flex-row-reverse")}>
      {!isMine && <TraderAvatar trader={sender} size="xs" />}
      <div className={cn("max-w-[78%]", isMine && "text-right")}>
        <div
          className={cn(
            "inline-block rounded-2xl px-3 py-2 text-left text-[13px] leading-relaxed",
            isMine
              ? "rounded-br-sm bg-brand-600 text-white"
              : "rounded-bl-sm bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",
          )}
        >
          {message.body}
        </div>
        <p
          className={cn(
            "tabular mt-1 flex items-center gap-1 text-[10.5px] text-neutral-400",
            isMine && "justify-end",
          )}
        >
          {formatTime(message.createdAt)}
          {isMine &&
            (message.readAt ? (
              <CheckCheck className="size-3 text-brand-500" strokeWidth={2.4} />
            ) : (
              <Check className="size-3" strokeWidth={2.4} />
            ))}
        </p>
      </div>
    </div>
  );
}
