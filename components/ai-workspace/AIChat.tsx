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
    <div className="flex-1 min-h-[420px] overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-4">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex gap-2 sm:gap-3.5 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                  <Cpu className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                </div>
              )}

              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl border px-3.5 py-3 sm:px-5 sm:py-4 ${
                  isUser
                    ? "border-orange-500/25 bg-orange-500/10 text-white"
                    : "border-white/10 bg-[#09090c]"
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-zinc-200 prose-code:text-orange-300 prose-code:before:content-none prose-code:after:content-none overflow-x-auto">
                  <MarkdownRenderer content={message.content} />
                </div>
              </div>

              {isUser && (
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-white/5">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10">
              <Cpu className="h-5 w-5 text-orange-400" />
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#09090c] px-5 py-4">
              <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
              <span className="text-xs text-[#8a8a93]">
                BuilderOS AI is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />

      </div>

    </div>

  );

}