"use client";

import { useEffect, useRef } from "react";

import {
  Bot,
  User,
  Loader2,
} from "lucide-react";

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

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-4">

        {messages.map((message) => {

          const isUser =
            message.role === "user";

          return (

            <div
              key={message.id}
              className={`flex gap-4 ${
                isUser
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              {!isUser && (

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">

                  <Bot className="h-5 w-5 text-cyan-400" />

                </div>

              )}

              <div
                className={`max-w-[85%] rounded-3xl border px-6 py-5 ${
                  isUser
                    ? "border-cyan-500/20 bg-cyan-500/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >

                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-zinc-300 prose-code:text-cyan-300 prose-code:before:content-none prose-code:after:content-none">

                  <MarkdownRenderer
                    content={message.content}
                  />

                </div>

              </div>

              {isUser && (

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">

                  <User className="h-5 w-5 text-white" />

                </div>

              )}

            </div>

          );

        })}

                {loading && (

          <div className="flex gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">

              <Bot className="h-5 w-5 text-cyan-400" />

            </div>

            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5">

              <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />

              <span className="text-sm text-zinc-400">

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