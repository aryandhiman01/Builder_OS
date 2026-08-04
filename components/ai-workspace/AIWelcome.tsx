import { Cpu, Sparkles } from "lucide-react";

export default function AIWelcome() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400 shadow-inner">
        <Cpu className="h-8 w-8" />
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400">
        <Sparkles className="h-3.5 w-3.5" />
        <span>BuilderOS Copilot</span>
      </div>

      <h1
        className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl"
        style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.03em" }}
      >
        Ready when you are.
      </h1>

      <p className="mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-[#9a9a9f]">
        Ask about your product, architecture, PRD, roadmap or codebase — or attach files to start building.
      </p>
    </div>
  );
}
