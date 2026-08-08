import { Cpu, Sparkles } from "lucide-react";

export default function AIWelcome() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center px-2">
      <div className="mb-2.5 sm:mb-5 flex h-11 w-11 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400 shadow-inner">
        <Cpu className="h-5 w-5 sm:h-8 sm:w-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-orange-400">
        <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span>BuilderOS Copilot</span>
      </div>

      <h1
        className="mt-3 sm:mt-6 text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white"
        style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.03em" }}
      >
        Ready when you are.
      </h1>

      <p className="mt-1.5 sm:mt-3 max-w-md text-xs sm:text-base leading-relaxed text-[#9a9a9f]">
        Ask about your product, architecture, PRD, roadmap or codebase — or attach files to start building.
      </p>
    </div>
  );
}
