"use client";

import { useCallback, useEffect, useState } from "react";

import AIWelcome from "./AIWelcome";
import AIQuickActions from "./AIQuickActions";
import AIChat from "./AIChat";
import AIInput from "./AIInput";
import AIHistorySidebar, {
  ConversationSummary,
} from "./AIHistorySidebar";

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

  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/ai/conversations");
      const data = await response.json();

      if (response.ok) {
        setConversations(data.conversations ?? []);
      }
    } catch {
      // Silently ignore — history is a nice-to-have, not blocking.
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
        throw new Error(
          data.message ?? "Failed to generate response."
        );
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
    <div className="flex h-screen overflow-hidden bg-background">

      <AIHistorySidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        loading={historyLoading}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex h-screen flex-1 flex-col overflow-x-hidden bg-[linear-gradient(180deg,rgba(10,10,10,0.98),rgba(6,6,6,1))]">

        <div className="flex h-[74px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-black/35 px-8 backdrop-blur-xl">

          <div className="flex items-center gap-3">
            <p className="text-[15px] font-medium tracking-[0.02em] text-zinc-100">
              AI Workspace
            </p>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
              Project AI
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-300">
              Context ready
            </span>
            <button
              onClick={handleNewChat}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              New chat
            </button>
          </div>

        </div>

        {messages.length === 0 ? (

          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-8">

            <AIWelcome />

            <div className="w-full">

              <AIInput
                loading={loading}
                onSend={handleSend}
              />

            </div>

            <AIQuickActions
              onSelectPrompt={handleSend}
            />

          </div>

        ) : (

          <div className="mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col overflow-hidden px-8 py-6">

            <AIChat
              messages={messages}
              loading={loading}
            />

            <div className="mt-6 shrink-0">

              <AIInput
                loading={loading}
                onSend={handleSend}
              />

            </div>

          </div>

        )}

      </div>

    </div>
  );
}
