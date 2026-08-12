"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ArchitectureCard } from "@/components/architecture/ArchitectureCard";
import GenerateArchitectureModal from "@/components/architecture/GenerateArchitectureModal";
import GenerateCustomArchitectureModal from "@/components/architecture/GenerateCustomArchitectureModal";

import {
  Blocks,
  Sparkles,
  Search,
  FileCode2,
  Network,
  Zap,
  ArrowRight,
  Clock3,
  Wand2,
  ChevronDown,
  CheckCircle2,
  Layers,
  Brain,
} from "lucide-react";

interface Roadmap {
  id: string;
  title: string;
  prompt: string;
  model: string | null;
  tokens: number | null;
  generationTime: number | null;
  createdAt: Date | string;
}

interface Architecture {
  id: string;
  title: string;
  prompt: string;
  content: string;
  model: string | null;
  tokens: number | null;
  generationTime: number | null;
  createdAt: Date | string;

  roadmap?: {
    id: string;
    title: string;
  } | null;
}

interface ArchitecturePageClientProps {
  projectId: string;
  projectTitle: string;
  initialArchitectures: Architecture[];
  roadmaps: Roadmap[];
}

export default function ArchitecturePageClient({
  projectId,
  projectTitle,
  initialArchitectures,
  roadmaps,
}: ArchitecturePageClientProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "architectures" | "roadmaps"
  >("architectures");

  const [searchQuery, setSearchQuery] = useState("");
  const [showGenerate, setShowGenerate] = useState(false);
  const [showCustomGenerate, setShowCustomGenerate] = useState(false);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>();

  const filteredArchitectures = useMemo(
    () =>
      initialArchitectures.filter((architecture) =>
        architecture.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [initialArchitectures, searchQuery]
  );

  const filteredRoadmaps = useMemo(
    () =>
      roadmaps.filter(
        (roadmap) =>
          roadmap.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          roadmap.prompt
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      ),
    [roadmaps, searchQuery]
  );

  const totalTokens = initialArchitectures.reduce(
    (sum, architecture) =>
      sum + (architecture.tokens ?? 0),
    0
  );

  const architectureMapByRoadmapId = useMemo(() => {
    const map = new Map<string, Architecture>();
    initialArchitectures.forEach((architecture) => {
      if (architecture.roadmap?.id) {
        map.set(architecture.roadmap.id, architecture);
      }
    });
    return map;
  }, [initialArchitectures]);

  const handleGenerateModalChange = (open: boolean) => {
    setShowGenerate(open);
    if (!open) {
      setSelectedRoadmapId(undefined);
      router.refresh();
    }
  };

  const handleCustomModalChange = (open: boolean) => {
    setShowCustomGenerate(open);
    if (!open) {
      router.refresh();
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner Mockup Card */}
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
        {/* Top Window Header Bar */}
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
              BuilderOS — System Architecture Engine
            </span>
          </div>

          <div className="hidden sm:block w-16" />
        </div>

        {/* Hero Banner Content */}
        <div className="relative p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-[11px] text-[#8a8a93] backdrop-blur-sm shadow-inner">
              <Sparkles className="h-3 w-3 text-orange-400" />
              <span className="font-semibold text-white/90">AI Architecture Suite</span>
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-orange-400 font-mono">{initialArchitectures.length} Specs</span>
            </div>

            <h1
              className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.02em" }}
            >
              System Architectures &amp;{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                AI Specifications
              </span>
              .
            </h1>

            <p className="text-xs text-[#9a9a9f] max-w-xl leading-relaxed">
              Design scalable software architecture, database structure, APIs, services and deployment strategy for{" "}
              <span className="font-bold text-white">{projectTitle}</span>.
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="shrink-0 flex items-center gap-3">
            {roadmaps.length > 0 ? (
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
                    <span>New Architecture</span>
                    <ChevronDown size={13} />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-2xl border-white/15 bg-[#09090c] p-2 text-white shadow-2xl backdrop-blur-2xl"
                >
                  <DropdownMenuItem
                    onClick={() => setShowGenerate(true)}
                    className="cursor-pointer rounded-xl p-2.5 text-xs font-semibold hover:bg-white/10"
                  >
                    <Blocks className="mr-2 h-4 w-4 text-sky-400" />
                    Generate from Roadmap
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setShowCustomGenerate(true)}
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
                <Link href={`/projects/${projectId}/roadmap`}>
                  <Network className="mr-2 h-4 w-4 text-orange-500" />
                  Create Roadmap First
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid inside Hero */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/[0.08] bg-white/[0.02] px-5 sm:px-7 py-3.5 sm:py-4 text-xs text-[#8a8a93]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-400 shadow-inner">
              <Blocks className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
                {initialArchitectures.length}
              </p>
              <p className="text-xs font-semibold text-[#8a8a93]">Architectures</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400 shadow-inner">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
                {roadmaps.length}
              </p>
              <p className="text-xs font-semibold text-[#8a8a93]">Source Roadmaps</p>
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
            onClick={() => setActiveTab("architectures")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "architectures"
                ? "bg-white text-black shadow-md"
                : "text-[#8a8a93] hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Blocks className="h-3.5 w-3.5" />
            <span>Generated Architectures</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
              activeTab === "architectures" ? "bg-black/10 text-black font-bold" : "bg-white/10 text-zinc-300"
            }`}>
              {initialArchitectures.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("roadmaps")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "roadmaps"
                ? "bg-white text-black shadow-md"
                : "text-[#8a8a93] hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Source Roadmaps</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
              activeTab === "roadmaps" ? "bg-black/10 text-black font-bold" : "bg-white/10 text-zinc-300"
            }`}>
              {roadmaps.length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400" />
          <Input
            type="text"
            placeholder={
              activeTab === "architectures"
                ? "Search architectures..."
                : "Search roadmaps..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#09090c]/90 border-white/10 text-xs sm:text-sm text-white placeholder:text-[#8a8a93] focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 rounded-xl"
          />
        </div>
      </div>

      {/* Tab Content 1: Architectures Grid */}
      {activeTab === "architectures" && (
        <>
          {initialArchitectures.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-[#09090c]/60 py-20 px-6 text-center backdrop-blur-xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-orange-400 mb-5 shadow-inner">
                <Blocks className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                No Architectures Generated Yet
              </h3>
              <p className="mt-2 max-w-md text-xs sm:text-sm text-[#8a8a93] leading-relaxed">
                Generate scalable software architecture, APIs, database design, microservices and deployment strategy from your roadmap.
              </p>

              {roadmaps.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGenerate(true)}
                  className="btn-shimmer mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black shadow-lg hover:bg-zinc-100 transition active:scale-95 cursor-pointer"
                >
                  <Wand2 className="h-4 w-4 text-orange-500" />
                  <span>Generate Custom Architecture</span>
                </button>
              ) : (
                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="text-xs text-amber-400/90 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 font-mono">
                    Notice: A roadmap is recommended before generating architecture.
                  </p>
                  <Button
                    asChild
                    className="btn-shimmer rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-zinc-200"
                  >
                    <Link href={`/projects/${projectId}/roadmap`}>
                      <Network className="mr-2 h-4 w-4 text-orange-500" />
                      Start Roadmap First
                    </Link>
                  </Button>
                </div>
              )}
            </motion.div>
          ) : filteredArchitectures.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-12 text-center">
              <p className="text-xs text-[#8a8a93]">No architectures matching &quot;{searchQuery}&quot;</p>
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
              {filteredArchitectures.map((architecture) => (
                <ArchitectureCard
                  key={architecture.id}
                  projectId={projectId}
                  architecture={architecture}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab Content 2: Source Roadmaps */}
      {activeTab === "roadmaps" && (
        <>
          {roadmaps.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-[#09090c]/60 py-20 px-6 text-center backdrop-blur-xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-orange-400 mb-5 shadow-inner">
                <Network className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                No Roadmaps Available
              </h3>
              <p className="mt-2 max-w-md text-xs sm:text-sm text-[#8a8a93] leading-relaxed">
                Generate a roadmap first to build a complete software architecture automatically.
              </p>

              <Button
                asChild
                className="btn-shimmer mt-6 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-zinc-200"
              >
                <Link href={`/projects/${projectId}/roadmap`}>
                  <Network className="mr-2 h-4 w-4 text-orange-500" />
                  Generate Roadmap
                </Link>
              </Button>
            </motion.div>
          ) : filteredRoadmaps.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-12 text-center">
              <p className="text-xs text-[#8a8a93]">No roadmaps matching &quot;{searchQuery}&quot;</p>
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
              {filteredRoadmaps.map((roadmap) => {
                const linkedArchitecture = architectureMapByRoadmapId.get(roadmap.id);
                const createdTimeAgo = roadmap.createdAt
                  ? formatDistanceToNow(new Date(roadmap.createdAt), { addSuffix: true })
                  : "";

                return (
                  <motion.div
                    key={roadmap.id}
                    whileHover={{ y: -3 }}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-orange-500/30 hover:shadow-xl"
                  >
                    <div className="space-y-4">
                      {/* Header Badge */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-mono font-semibold text-sky-400">
                          <Network className="h-3.5 w-3.5" />
                          <span>{roadmap.model || "Gemini 3.6"}</span>
                        </div>

                        {linkedArchitecture ? (
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Architecture Ready</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
                            <span>No Architecture</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Prompt */}
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-orange-400 transition-colors" style={{ fontFamily: "var(--font-sora)" }}>
                          {roadmap.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#8a8a93]">
                          {roadmap.prompt}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#8a8a93] border-t border-white/5 pt-3">
                        {createdTimeAgo && <span>Created {createdTimeAgo}</span>}
                        {roadmap.tokens && (
                          <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-zinc-300">
                            {roadmap.tokens.toLocaleString()} tokens
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                      {linkedArchitecture ? (
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 font-bold text-xs rounded-xl"
                        >
                          <Link href={`/projects/${projectId}/architecture/${linkedArchitecture.id}`}>
                            <FileCode2 className="mr-2 h-4 w-4 text-emerald-400" />
                            <span>View Architecture</span>
                            <ArrowRight className="ml-auto h-4 w-4 text-emerald-400" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setSelectedRoadmapId(roadmap.id);
                            setShowGenerate(true);
                          }}
                          className="btn-shimmer w-full bg-white text-black hover:bg-zinc-200 font-bold text-xs rounded-xl"
                        >
                          <Sparkles className="mr-2 h-4 w-4 text-orange-500" />
                          <span>Generate Architecture for this Roadmap</span>
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

      {/* Generate Architecture Modal */}
      <GenerateArchitectureModal
        open={showGenerate}
        onOpenChange={handleGenerateModalChange}
        projectId={projectId}
        roadmapId={selectedRoadmapId}
        roadmaps={roadmaps.map((roadmap) => ({
          id: roadmap.id,
          title: roadmap.title,
        }))}
      />

      {/* Generate Custom Architecture Modal */}
      <GenerateCustomArchitectureModal
        open={showCustomGenerate}
        onOpenChange={handleCustomModalChange}
        projectId={projectId}
      />
    </div>
  );
}