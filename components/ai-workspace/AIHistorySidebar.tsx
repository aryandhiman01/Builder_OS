"use client";

import { useMemo, useState } from "react";

import { MessageSquarePlus, MessageSquare, Trash2, Loader2 } from "lucide-react";

import Logo from "@/components/shared/Logo";

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface AIHistorySidebarProps {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  loading: boolean;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

function groupLabel(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const diffDays = Math.round(
    (startOf(now) - startOf(date)) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Previous 7 days";
  if (diffDays <= 30) return "Previous 30 days";
  return "Older";
}

export default function AIHistorySidebar({
  conversations,
  activeConversationId,
  loading,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: AIHistorySidebarProps) {

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const groups = useMemo(() => {
    const order = [
      "Today",
      "Yesterday",
      "Previous 7 days",
      "Previous 30 days",
      "Older",
    ];

    const buckets = new Map<string, ConversationSummary[]>();

    for (const conversation of conversations) {
      const label = groupLabel(conversation.updatedAt);
      const list = buckets.get(label) ?? [];
      list.push(conversation);
      buckets.set(label, list);
    }

    return order
      .filter((label) => buckets.has(label))
      .map((label) => ({ label, items: buckets.get(label)! }));
  }, [conversations]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await onDeleteConversation(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <aside className="flex h-full w-full flex-col bg-[#050505]">

      <div className="flex h-[74px] shrink-0 items-center border-b border-white/[0.08] px-4">
        <Logo />
      </div>

      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[13px] font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-200"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 pb-4">

        {loading && (
          <div className="flex items-center justify-center gap-2 pt-6 text-xs text-zinc-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading history...
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <p className="px-2 pt-4 text-xs text-zinc-600">
            Your conversations will show up here.
          </p>
        )}

        {groups.map((group) => (
          <div key={group.label}>

            <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
              {group.label}
            </p>

            <div className="flex flex-col gap-0.5">
              {group.items.map((conversation) => {
                const isActive = conversation.id === activeConversationId;

                return (
                  <div
                    key={conversation.id}
                    className={`group/item flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                      isActive
                        ? "bg-white/[0.06] text-white"
                        : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                    }`}
                  >
                    <button
                      onClick={() => onSelectConversation(conversation.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <MessageSquare className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                      <span className="truncate">{conversation.title}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(conversation.id)}
                      disabled={deletingId === conversation.id}
                      className="shrink-0 rounded-md p-1 text-zinc-600 opacity-0 transition-opacity hover:bg-white/10 hover:text-red-400 group-hover/item:opacity-100"
                      title="Delete conversation"
                    >
                      {deletingId === conversation.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        ))}

      </nav>

    </aside>
  );
}
