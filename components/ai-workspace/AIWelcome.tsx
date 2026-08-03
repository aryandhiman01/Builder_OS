import { Bot, Sparkles } from "lucide-react";

export default function AIWelcome() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">

      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-500/20 bg-cyan-500/10 shadow-[0_0_50px_rgba(34,211,238,0.15)]">

        <Bot className="h-8 w-8 text-cyan-400" />

      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300">

        <Sparkles className="h-3.5 w-3.5" />

        BuilderOS AI

      </div>

      <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">

        Ready when you are.

      </h1>

      <p className="mt-4 max-w-lg text-base leading-7 text-zinc-400">

        Ask about your product, architecture, roadmap or
        codebase — or attach files to get started.

      </p>

    </div>
  );
}
