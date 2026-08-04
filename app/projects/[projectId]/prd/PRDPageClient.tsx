"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PRDCard } from "@/components/prd/PRDCard";
import { GeneratePRDModal } from "@/components/prd/GeneratePRDModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GenerateCustomPRDModal } from "@/components/prd/GenerateCustomPRDModal";

import {
  FileText,
  Sparkles,
  Search,
  Plus,
  Brain,
  Layers,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock3,
  Wand2,
  ChevronDown,
} from "lucide-react";

interface ResearchItem {
  id: string;
  title: string;
  prompt: string;
  model: string | null;
  tokens: number | null;
  generationTime: number | null;
  createdAt: Date | string;
}

interface PRDItem {
  id: string;
  title: string;
  prompt: string;
  model: string | null;
  tokens: number | null;
  generationTime: number | null;
  createdAt: Date | string;
}

interface PRDPageClientProps {
  projectId: string;
  projectTitle: string;
  initialPrds: PRDItem[];
  researches: ResearchItem[];
}

export default function PRDPageClient({
  projectId,
  projectTitle,
  initialPrds,
  researches,
}: PRDPageClientProps) {
  const [activeTab, setActiveTab] = useState<"prds" | "research">("prds");
  const [searchQuery, setSearchQuery] = useState("");
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [targetResearchId, setTargetResearchId] = useState<string | undefined>(
    undefined
  );

  const handleOpenGenerateModal = (researchId?: string) => {
    setTargetResearchId(researchId);
    setIsResearchModalOpen(true);
  };

  const filteredPrds = initialPrds.filter((prd) =>
    prd.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResearches = researches.filter((res) =>
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTokens = initialPrds.reduce(
    (acc, prd) => acc + (prd.tokens || 0),
    0
  );

  // Map research prompt to existing PRD
  const prdMapByPrompt = new Map<string, PRDItem>();
  initialPrds.forEach((prd) => {
    if (prd.prompt) {
      prdMapByPrompt.set(prd.prompt.trim(), prd);
    }
  });

  return (
    <div className="space-y-8 pb-16">
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
              BuilderOS — Product Requirement Specification Engine
            </span>
          </div>

          <div className="hidden sm:block w-16" />
        </div>

        {/* Hero Banner Content */}
        <div className="relative p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-[11px] text-[#8a8a93] backdrop-blur-sm shadow-inner">
              <Sparkles className="h-3 w-3 text-orange-400" />
              <span className="font-semibold text-white/90">AI Specification Suite</span>
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-orange-400 font-mono">{initialPrds.length} PRD Specs</span>
            </div>

            <h1
              className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.02em" }}
            >
              Product Requirements &amp;{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                AI Specifications
              </span>
              .
            </h1>

            <p className="text-xs text-[#9a9a9f] max-w-xl leading-relaxed">
              Generate, manage, and review detailed product requirement specifications (PRDs) derived from research for{" "}
              <span className="font-bold text-white">{projectTitle}</span>.
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="shrink-0 flex items-center gap-3">
            {researches.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
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
                    cursor-pointer
                    "
                  >
                    <Sparkles size={14} className="text-orange-500" />
                    <span>Create New PRD</span>
                    <ChevronDown size={13} />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-2xl border-white/15 bg-[#09090c] p-2 text-white shadow-2xl backdrop-blur-2xl"
                >
                  <DropdownMenuItem
                    onClick={() => handleOpenGenerateModal()}
                    className="cursor-pointer rounded-xl p-2.5 text-xs font-semibold hover:bg-white/10"
                  >
                    <Brain className="mr-2 h-4 w-4 text-sky-400" />
                    Generate from Research
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setIsCustomModalOpen(true)}
                    className="cursor-pointer rounded-xl p-2.5 text-xs font-semibold hover:bg-white/10"
                  >
                    <Wand2 className="mr-2 h-4 w-4 text-orange-400" />
                    Generate from Custom Prompt
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="btn-shimmer rounded-full bg-white px-4.5 py-2.5 text-xs font-bold text-black hover:bg-zinc-200"
              >
                <Link href={`/projects/${projectId}/research`}>
                  <Brain className="mr-2 h-4 w-4 text-orange-500" />
                  Create Research First
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid inside Hero */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/[0.08] bg-white/[0.02] px-5 sm:px-7 py-3.5 sm:py-4 text-xs text-[#8a8a93]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-400 shadow-inner">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
                {initialPrds.length}
              </p>
              <p className="text-xs font-semibold text-[#8a8a93]">PRD Documents</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400 shadow-inner">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
                {researches.length}
              </p>
              <p className="text-xs font-semibold text-[#8a8a93]">Source Research Modules</p>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-inner">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white font-mono leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
                {totalTokens > 0 ? totalTokens.toLocaleString() : "—"}
              </p>
              <p className="text-xs font-semibold text-[#8a8a93]">AI Tokens Processed</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tabs & Search Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#09090c]/90 p-1.5 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("prds")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "prds"
                ? "bg-white text-black shadow-md"
                : "text-[#8a8a93] hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Generated PRDs</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
              activeTab === "prds" ? "bg-black/10 text-black font-bold" : "bg-white/10 text-zinc-300"
            }`}>
              {initialPrds.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("research")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "research"
                ? "bg-white text-black shadow-md"
                : "text-[#8a8a93] hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            <span>Source Research Modules</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
              activeTab === "research" ? "bg-black/10 text-black font-bold" : "bg-white/10 text-zinc-300"
            }`}>
              {researches.length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400" />
          <Input
            type="text"
            placeholder={
              activeTab === "prds"
                ? "Search PRDs..."
                : "Search research items..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#09090c]/90 border-white/10 text-xs sm:text-sm text-white placeholder:text-[#8a8a93] focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 rounded-xl"
          />
        </div>
      </div>

      {/* Tab Content 1: PRDs Grid */}
      {activeTab === "prds" && (
        <>
          {initialPrds.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-[#09090c]/60 py-20 px-6 text-center backdrop-blur-xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-orange-400 mb-5 shadow-inner">
                <FileText className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                No PRDs Generated Yet
              </h3>
              <p className="mt-2 max-w-md text-xs sm:text-sm text-[#8a8a93] leading-relaxed">
                Create detailed product requirement specifications from your project research with a single click.
              </p>

              {researches.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(true)}
                  className="btn-shimmer mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black shadow-lg hover:bg-zinc-100 transition active:scale-95"
                >
                  <Wand2 className="h-4 w-4 text-orange-500" />
                  <span>Generate Custom PRD</span>
                </button>
              ) : (
                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="text-xs text-amber-400/90 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 font-mono">
                    Notice: Market research is recommended before generating a PRD.
                  </p>
                  <Button
                    asChild
                    className="btn-shimmer rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-zinc-200"
                  >
                    <Link href={`/projects/${projectId}/research`}>
                      <Brain className="mr-2 h-4 w-4 text-orange-500" />
                      Start Research First
                    </Link>
                  </Button>
                </div>
              )}
            </motion.div>
          ) : filteredPrds.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-12 text-center">
              <p className="text-xs text-[#8a8a93]">No PRDs matching &quot;{searchQuery}&quot;</p>
              <Button
                variant="ghost"
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs text-white hover:underline"
              >
                Clear Search Filter
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrds.map((prd) => (
                <PRDCard key={prd.id} projectId={projectId} prd={prd} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab Content 2: Source Research Modules */}
      {activeTab === "research" && (
        <>
          {researches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-[#09090c]/60 py-20 px-6 text-center backdrop-blur-xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-orange-400 mb-5 shadow-inner">
                <Brain className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                No Research Data Available
              </h3>
              <p className="mt-2 max-w-md text-xs sm:text-sm text-[#8a8a93] leading-relaxed">
                Conduct AI market and competitor research to form the foundation for PRDs.
              </p>

              <Button
                asChild
                className="btn-shimmer mt-6 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-zinc-200"
              >
                <Link href={`/projects/${projectId}/research`}>
                  <Brain className="mr-2 h-4 w-4 text-orange-500" />
                  Generate Market Research
                </Link>
              </Button>
            </motion.div>
          ) : filteredResearches.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-12 text-center">
              <p className="text-xs text-[#8a8a93]">No research items matching &quot;{searchQuery}&quot;</p>
              <Button
                variant="ghost"
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs text-white hover:underline"
              >
                Clear Search Filter
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResearches.map((res) => {
                const linkedPrd = prdMapByPrompt.get(res.prompt.trim());
                const createdTimeAgo = res.createdAt
                  ? formatDistanceToNow(new Date(res.createdAt), { addSuffix: true })
                  : "";

                return (
                  <motion.div
                    key={res.id}
                    whileHover={{ y: -3 }}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-orange-500/30 hover:shadow-xl"
                  >
                    <div className="space-y-4">
                      {/* Header Badge */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-mono font-semibold text-sky-400">
                          <Brain className="h-3.5 w-3.5" />
                          <span>{res.model || "Gemini 3.6 Flash"}</span>
                        </div>

                        {linkedPrd ? (
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>PRD Ready</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
                            <span>No PRD Yet</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Prompt */}
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-orange-400 transition-colors" style={{ fontFamily: "var(--font-sora)" }}>
                          {res.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#8a8a93]">
                          {res.prompt}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#8a8a93] border-t border-white/5 pt-3">
                        {createdTimeAgo && <span>Created {createdTimeAgo}</span>}
                        {res.tokens && (
                          <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-zinc-300">
                            {res.tokens.toLocaleString()} tokens
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                      {linkedPrd ? (
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 font-bold text-xs rounded-xl"
                        >
                          <Link href={`/projects/${projectId}/prd/${linkedPrd.id}`}>
                            <FileText className="mr-2 h-4 w-4 text-emerald-400" />
                            <span>View Linked PRD</span>
                            <ArrowRight className="ml-auto h-4 w-4 text-emerald-400" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleOpenGenerateModal(res.id)}
                          className="btn-shimmer w-full bg-white text-black hover:bg-zinc-200 font-bold text-xs rounded-xl"
                        >
                          <Sparkles className="mr-2 h-4 w-4 text-orange-500" />
                          <span>Generate PRD for this Research</span>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal for PRD Generation */}
      <GeneratePRDModal
        open={isResearchModalOpen}
        onOpenChange={setIsResearchModalOpen}
        projectId={projectId}
        researchId={targetResearchId}
        researches={researches}
      />

      <GenerateCustomPRDModal
        open={isCustomModalOpen}
        onOpenChange={setIsCustomModalOpen}
        projectId={projectId}
      />
    </div>
  );
}
