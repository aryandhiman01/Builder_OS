"use client";

import { useCallback, useEffect, useState } from "react";

import AIWelcome from "./AIWelcome";
import AIQuickActions from "./AIQuickActions";
import AIChat from "./AIChat";
import AIInput from "./AIInput";
import AIHistorySidebar, {
  ConversationSummary,
} from "./AIHistorySidebar";

import Link from "next/link";
import { ArrowLeft, History, Plus, Sparkles, X } from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface SendOptions {
  context?: string;
  mode?: string | null;
}

export default function AIWorkspace() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/ai/conversations");
      const data = await response.json();

      if (response.ok) {
        setConversations(data.conversations ?? []);
      }
    } catch {
      // Silently ignore — history is optional.
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  function handleNewChat() {
    setMessages([]);
    setActiveConversationId(null);
  }

  async function handleSelectConversation(id: string) {
    if (id === activeConversationId) return;

    try {
      const response = await fetch(`/api/ai/conversations/${id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      const loadedMessages: ChatMessage[] = (data.conversation.messages ?? []).map(
        (item: { role: "user" | "assistant"; content: string }) => ({
          id: crypto.randomUUID(),
          role: item.role,
          content: item.content,
        })
      );

      setMessages(loadedMessages);
      setActiveConversationId(id);
      setIsHistoryOpen(false);
    } catch {
      // If loading fails, keep the current view untouched.
    }
  }

  async function handleDeleteConversation(id: string) {
    setConversations((prev) => prev.filter((item) => item.id !== id));

    if (id === activeConversationId) {
      handleNewChat();
    }

    try {
      await fetch(`/api/ai/conversations/${id}`, { method: "DELETE" });
    } catch {
      // Non-fatal — the list already updated optimistically.
    }
  }

  async function handleSend(message: string, options?: SendOptions) {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: messages.map((item) => ({
            role: item.role,
            content: item.content,
          })),
          conversationId: activeConversationId,
          context: options?.context,
          mode: options?.mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to generate response.");
      }

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.conversationId) {
        const isNew = data.conversationId !== activeConversationId;

        setActiveConversationId(data.conversationId);

        setConversations((prev) => {
          const now = new Date().toISOString();

          if (isNew) {
            return [
              {
                id: data.conversationId,
                title: data.conversationTitle ?? "New conversation",
                createdAt: now,
                updatedAt: now,
              },
              ...prev,
            ];
          }

          return prev
            .map((item) =>
              item.id === data.conversationId
                ? { ...item, updatedAt: now }
                : item
            )
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            );
        });
      }
    } catch (error) {
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#060606] text-white">
      {/* Optional History Overlay Drawer (Toggled from Header) */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsHistoryOpen(false)}
          />
          <div className="relative z-10 w-80 h-full border-r border-white/10 bg-[#09090c] shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
              <span className="text-xs font-bold uppercase tracking-wider text-white">Chat History</span>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="rounded-lg p-1 text-[#8a8a93] hover:text-white hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>
            <AIHistorySidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              loading={historyLoading}
              onNewChat={() => {
                handleNewChat();
                setIsHistoryOpen(false);
              }}
              onSelectConversation={handleSelectConversation}
              onDeleteConversation={handleDeleteConversation}
            />
          </div>
        </div>
      )}

      {/* Main Full-Width AI Workspace Canvas (No Left Sidebar by default) */}
      <div className="flex h-screen flex-1 flex-col overflow-x-hidden min-w-0 bg-[#060606]">
        {/* Top Header Bar with Back to Dashboard button */}
        <header className="flex h-[73px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#09090c]/90 px-4 sm:px-8 backdrop-blur-2xl shadow-lg">
          {/* Left: Back to Dashboard Button & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="
              btn-shimmer
              flex
              cursor-pointer
              items-center
              gap-2
              rounded-full
              border
              border-white/15
              bg-white/[0.05]
              px-4
              py-2
              text-xs
              font-semibold
              text-white
              shadow-md
              transition-all
              hover:bg-white/10
              hover:border-white/25
              active:scale-95
              "
            >
              <ArrowLeft size={14} className="text-orange-400 shrink-0" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-3">
              <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider text-orange-400">
                Copilot Engine
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-[#8a8a93] transition-all hover:bg-white/[0.08] hover:text-white"
              title="Toggle Chat History"
            >
              <History size={14} className="text-amber-400" />
              <span className="hidden sm:inline">History</span>
            </button>

            <button
              onClick={handleNewChat}
              className="
              btn-shimmer
              flex
              items-center
              gap-1.5
              rounded-full
              bg-white
              px-4
              py-1.5
              text-xs
              font-semibold
              text-black
              shadow-lg
              shadow-white/10
              transition-all
              hover:bg-zinc-100
              active:scale-95
              "
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>New Chat</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        {messages.length === 0 ? (
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-4 sm:px-8 py-8 overflow-y-auto">
            <AIWelcome />

            <div className="w-full">
              <AIInput loading={loading} onSend={handleSend} />
            </div>

            <AIQuickActions onSelectPrompt={handleSend} />
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col overflow-hidden px-4 sm:px-8 py-6">
            <AIChat messages={messages} loading={loading} />

            <div className="mt-6 shrink-0">
              <AIInput loading={loading} onSend={handleSend} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
