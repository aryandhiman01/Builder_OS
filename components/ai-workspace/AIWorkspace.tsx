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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">

      <div className="border-b border-white/10 bg-background/80 backdrop-blur-xl">

        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-5">

          <div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              AI Workspace
            </h1>

            <p className="mt-1 text-sm text-zinc-400">
              Your intelligent software engineering assistant powered by
              BuilderOS AI.
            </p>

          </div>

        </div>

      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-8 py-6">

        {messages.length === 0 ? (

          <div className="flex flex-1 flex-col gap-6">

            <AIWelcome />

            <div className="mt-2">

              <AIQuickActions
                onSelectPrompt={handleSend}
              />

            </div>

            <div className="sticky bottom-0 z-10 mt-2">

              <AIInput
                loading={loading}
                onSend={handleSend}
              />

            </div>

          </div>

        ) : (

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

            <AIChat
              messages={messages}
              loading={loading}
            />

          </div>

        )}

        {messages.length > 0 && (
          <div className="mt-6">

            <AIInput
              loading={loading}
              onSend={handleSend}
            />

          </div>
        )}

      </div>

    </div>
  );
}