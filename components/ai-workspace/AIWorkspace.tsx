"use client";

import { useState } from "react";

import AIWelcome from "./AIWelcome";
import AIQuickActions from "./AIQuickActions";
import AIChat from "./AIChat";
import AIInput from "./AIInput";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIWorkspace() {

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [loading, setLoading] = useState(false);

  async function handleSend(message: string) {

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
    <div className="flex h-screen flex-col overflow-x-hidden bg-background">

      <div className="shrink-0 border-b border-white/10 bg-background/80 px-8 py-4 backdrop-blur-xl">

        <p className="text-sm font-medium text-zinc-300">
          AI Workspace
        </p>

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
  );
}