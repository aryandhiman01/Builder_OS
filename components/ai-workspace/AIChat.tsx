"use client";

import { useEffect, useRef } from "react";

import { Cpu, User, Loader2 } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import { ChatMessage } from "./AIWorkspace";

interface AIChatProps {
  messages: ChatMessage[];
  loading: boolean;
}

export default function AIChat({
  messages,
  loading,
}: AIChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3.5 sm:gap-6 py-2 sm:py-4">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return isUser ? (
            <div
              key={message.id}
              className="flex w-full justify-end items-start gap-2 pl-4 sm:pl-16"
            >
              <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl border border-orange-500/25 bg-orange-500/10 px-3.5 py-2.5 sm:px-5 sm:py-3.5 text-xs sm:text-sm text-white shadow-md">
                <MarkdownRenderer content={message.content} />
              </div>
              <div className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
            </div>
          ) : (
            <div
              key={message.id}
              className="flex w-full flex-col gap-2 rounded-xl sm:rounded-2xl border border-white/10 bg-[#09090c] p-3 sm:p-5 shadow-lg"
            >
              <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2 sm:pb-3">
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-400">
                  <Cpu className="h-3.5 w-3.5 text-orange-400" />
                </div>
                <span className="text-xs font-semibold text-white">
                  BuilderOS Copilot
                </span>
              </div>

              <div className="w-full min-w-0 overflow-x-auto">
                <MarkdownRenderer content={message.content} />
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex w-full flex-col gap-2 rounded-xl sm:rounded-2xl border border-white/10 bg-[#09090c] p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-400">
                <Cpu className="h-3.5 w-3.5 text-orange-400" />
              </div>
              <span className="text-xs font-semibold text-white">
                BuilderOS Copilot
              </span>
            </div>

            <div className="flex items-center gap-2.5 pt-1 text-xs text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
              <span>BuilderOS AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}