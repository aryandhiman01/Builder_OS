"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Plus,
  Search,
  Sparkles,
  Zap,
  Layers,
  SearchCode,
  Target,
  BarChart2,
  PieChart,
} from "lucide-react";

import GenerateResearchModal from "./GenerateResearchModal";
import ResearchCard from "./ResearchCard";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  category: string;
  color: string;
}

export interface Research {
  id: string;
  title: string;
  prompt: string;
  content: string;
  model: string | null;
  tokens: number | null;
  generationTime: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ResearchClientProps {
  project: Project;
  researches: Research[];
}

export default function ResearchClient({
  project,
  researches,
}: ResearchClientProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredResearch = useMemo(() => {
    return researches.filter((research) => {
      return (
        research.title.toLowerCase().includes(search.toLowerCase()) ||
        research.prompt.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [researches, search]);

  const quickTopics = [
    { label: "Competitor Analysis", text: "Top 3 competitors analysis and SWOT positioning matrix" },
    { label: "Target Audience", text: "Target user personas, pain points, and user journey" },
    { label: "Market Sizing", text: "TAM, SAM, SOM market size breakdown and growth potential" },
  ];

  return (
    <>
      <div className="space-y-8">
        {/* Landing Page & Dashboard Mockup Card Hero Banner */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="
          mockup-card
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-[#09090c]/95
          backdrop-blur-2xl
          shadow-2xl
          "
        >
          {/* Top Window Header (Landing Page Mockup UI Style) */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.07] bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-0.5 shadow-inner">
              <Layers className="h-3 w-3 text-orange-400" />
              <span className="text-[11px] font-semibold text-white/90">
                BuilderOS — AI Research &amp; Product Intelligence Engine
              </span>
            </div>

            <div className="hidden sm:block w-16" />
          </div>

          {/* Hero Banner Body */}
          <div className="relative p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-[11px] text-[#8a8a93] backdrop-blur-sm shadow-inner">
                <Zap className="h-3 w-3 text-orange-400" />
                <span className="font-semibold text-white/90">Autonomous Copilot</span>
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-orange-400 font-mono">{researches.length} Briefs Ready</span>
              </div>

              <h1
                className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight"
                style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.02em" }}
              >
                Market Research &amp;{" "}
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                  Product Intelligence
                </span>
                .
              </h1>

              <p className="text-xs text-[#9a9a9f] max-w-xl leading-relaxed">
                Generate competitor analysis, market sizing, target persona breakdowns, and product insights for{" "}
                <span className="font-bold text-white">{project.title}</span>.
              </p>
            </div>

            {/* Action Trigger Button */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="
                btn-shimmer
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white
                px-4.5
                py-2.5
                text-xs
                font-bold
                text-black
                shadow-xl
                shadow-white/10
                transition-all
                hover:bg-zinc-100
                active:scale-95
                "
              >
                <Sparkles size={14} className="text-orange-500" />
                <span>New Research</span>
              </button>
            </div>
          </div>
        </motion.section>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            className="
            w-full
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-white/10
            bg-[#09090c]/90
            px-4
            py-3
            backdrop-blur-xl
            shadow-lg
            "
          >
            <Search size={18} className="text-orange-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search research briefs by title or keyword..."
              className="
              w-full
              bg-transparent
              text-xs sm:text-sm
              text-white
              outline-none
              placeholder:text-[#8a8a93]
              "
            />
          </div>

          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-mono font-semibold text-[#8a8a93]">
            {filteredResearch.length} Brief{filteredResearch.length === 1 ? "" : "s"} Found
          </span>
        </div>

        {/* Research Briefs List */}
        {filteredResearch.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="
            flex
            flex-col
            items-center
            justify-center
            rounded-3xl
            border
            border-dashed
            border-white/15
            bg-[#09090c]/60
            py-20
            px-6
            text-center
            backdrop-blur-xl
            "
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-orange-400 mb-5 shadow-inner">
              <Brain size={32} />
            </div>

            <h3
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              No AI Research Briefs Found
            </h3>

            <p className="mt-2 max-w-md text-xs sm:text-sm text-[#8a8a93] leading-relaxed">
              Generate structured market research, competitor analysis, and target audience persona to build your product specification.
            </p>

            {/* Quick Topic Chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-lg">
              {quickTopics.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() => setOpen(true)}
                  className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-3.5
                  py-2
                  text-xs
                  font-semibold
                  text-[#8a8a93]
                  transition-all
                  hover:border-orange-500/30
                  hover:bg-white/[0.08]
                  hover:text-white
                  active:scale-95
                  "
                >
                  <Sparkles size={13} className="text-orange-400" />
                  <span>{topic.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setOpen(true)}
              className="
              btn-shimmer
              mt-8
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-white
              px-6
              py-2.5
              text-xs
              font-bold
              text-black
              shadow-lg
              transition-all
              hover:bg-zinc-100
              active:scale-95
              "
            >
              <Plus size={15} />
              <span>Generate First Research</span>
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredResearch.map((research) => (
              <ResearchCard
                key={research.id}
                projectId={project.id}
                research={research}
              />
            ))}
          </div>
        )}
      </div>

      <GenerateResearchModal
        open={open}
        onClose={() => setOpen(false)}
        projectId={project.id}
      />
    </>
  );
}