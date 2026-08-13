"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  FileText,
  LayoutTemplate,
  Rocket,
  Search,
  Workflow,
  Zap,
  Layers,
  Cpu,
} from "lucide-react";

export default function AIHeroCard() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const samplePrompts = [
    { label: "Draft PRD", icon: FileText, text: "Generate a detailed PRD for an AI task manager app", color: "text-blue-400" },
    { label: "Analyze Competitors", icon: Search, text: "Research top 3 competitors for dev tool SaaS", color: "text-violet-400" },
    { label: "Product Roadmap", icon: LayoutTemplate, text: "Create a Q3/Q4 product roadmap for MVP", color: "text-emerald-400" },
    { label: "Launch Strategy", icon: Rocket, text: "Outline a Product Hunt launch strategy", color: "text-indigo-400" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      router.push("/ai-workspace");
      return;
    }
    router.push(`/ai-workspace?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  const handleChipClick = (text: string) => {
    setPrompt(text);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="
      mockup-card
      relative
      overflow-hidden
      rounded-2xl
      border
      border-white/10
      bg-[#09090c]/95
      backdrop-blur-2xl
      shadow-2xl
      "
    >
      {/* Top Window Header (Landing Page Mockup UI Style) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1 shadow-inner">
          <Layers className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-xs font-semibold text-white/90">
            BuilderOS — AI Copilot Workspace
          </span>
        </div>

        <div className="hidden sm:block w-16" />
      </div>

      {/* Main Container Body */}
      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="relative z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 text-xs text-[#8a8a93] backdrop-blur-sm shadow-inner">
            <Zap className="h-3.5 w-3.5 text-orange-400" />
            <span className="font-semibold text-white/90">Autonomous Copilot</span>
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-orange-400 font-mono">1.2s Response</span>
          </div>

          {/* Headline */}
          <div className="mt-5 max-w-none">
            <h2
              className="text-xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold tracking-tight text-white leading-tight sm:whitespace-nowrap"
              style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.03em" }}
            >
              Turn raw ideas into{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                shipped software
              </span>
              .
            </h2>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#9a9a9f] max-w-2xl">
              Connect market research, PRDs, roadmaps, architecture diagrams, and developer tasks in one workspace.
            </p>
          </div>

          {/* Interactive AI Prompt Form */}
          <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-4 flex items-center text-orange-400">
                <Cpu size={18} />
              </div>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What do you want to build today? (e.g. Draft PRD for AI product manager)"
                className="
                w-full
                rounded-xl
                border
                border-white/15
                bg-black/60
                py-3.5 sm:py-4
                pl-11
                pr-32 sm:pr-36
                text-xs sm:text-sm
                text-white
                placeholder-[#8a8a93]
                backdrop-blur-md
                transition-all
                duration-300
                focus:border-orange-500/60
                focus:bg-black/80
                focus:outline-none
                focus:ring-2
                focus:ring-orange-500/20
                "
              />
              <button
                type="submit"
                className="
                btn-shimmer
                absolute
                right-2
                flex
                items-center
                justify-center
                gap-1.5
                whitespace-nowrap
                shrink-0
                rounded-lg
                bg-white
                px-4
                py-2 sm:py-2.5
                text-xs
                font-semibold
                text-black
                shadow-lg
                shadow-white/10
                transition-all
                duration-200
                hover:bg-zinc-100
                active:scale-95
                "
              >
                <span>Ask AI</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </form>

          {/* Quick Prompts Chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#8a8a93] font-medium mr-1">Quick Prompts:</span>
            {samplePrompts.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleChipClick(item.text)}
                  className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-white/[0.08]
                  bg-white/[0.03]
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-[#8a8a93]
                  transition-all
                  duration-200
                  hover:border-orange-500/30
                  hover:bg-white/[0.07]
                  hover:text-white
                  active:scale-95
                  "
                >
                  <Icon size={13} className={item.color} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t border-white/[0.07] bg-white/[0.02] px-6 py-3 flex items-center justify-between text-xs text-[#8a8a93]">
        <span className="flex items-center gap-2 font-medium text-white/80">
          <Workflow className="h-3.5 w-3.5 text-orange-400" />
          Unified Product OS Engine
        </span>

        <div className="flex gap-1.5 items-center">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 w-3.5 rounded-full bg-orange-400/80"
              animate={{ scaleX: [1, 0.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}