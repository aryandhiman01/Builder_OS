"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import GenerateRoadmapModal from "@/components/roadmap/GenerateRoadmapModal";
import GenerateCustomRoadmapModal from "@/components/roadmap/GenerateCustomRoadmapModal";

import {
  Map as MapIcon,
  Sparkles,
  Search,
  Plus,
  FileText,
  Layers,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock3,
  Wand2,
  ChevronDown,
  Calendar,
} from "lucide-react";

interface PRD {
  id: string;
  title: string;
  prompt: string;
  model: string | null;
  tokens: number | null;
  generationTime: number | null;
  createdAt: Date;
}

interface Roadmap {
  id: string;
  title: string;
  prompt: string;
  content: string;
  model: string | null;
  tokens: number | null;
  generationTime: number | null;
  createdAt: Date;
  prd?: {
    id: string;
    title: string;
  } | null;
}

interface RoadmapPageClientProps {
  projectId: string;
  projectTitle: string;
  initialRoadmaps: Roadmap[];
  prds: PRD[];
}

export default function RoadmapPageClient({
  projectId,
  projectTitle,
  initialRoadmaps,
  prds,
}: RoadmapPageClientProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"roadmaps" | "prds">("roadmaps");
  const [searchQuery, setSearchQuery] = useState("");
  const [showGenerate, setShowGenerate] = useState(false);
  const [showCustomGenerate, setShowCustomGenerate] = useState(false);
  const [selectedPrdId, setSelectedPrdId] = useState<string>();

  const filteredRoadmaps = useMemo(
    () =>
      initialRoadmaps.filter((roadmap) =>
        roadmap.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [initialRoadmaps, searchQuery]
  );

  const filteredPrds = useMemo(
    () =>
      prds.filter(
        (prd) =>
          prd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prd.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [prds, searchQuery]
  );

  const totalTokens = initialRoadmaps.reduce(
    (sum, roadmap) => sum + (roadmap.tokens ?? 0),
    0
  );

  // Map PRD id -> roadmap generated from it
  const roadmapMapByPrdId = new Map<string, Roadmap>();
  initialRoadmaps.forEach((roadmap) => {
    if (roadmap.prd?.id) {
      roadmapMapByPrdId.set(roadmap.prd.id, roadmap);
    }
  });

  const handleGenerateModalChange = (open: boolean) => {
    setShowGenerate(open);

    if (!open) {
      setSelectedPrdId(undefined);
      router.refresh();
    }
  };

  const handleCustomModalChange = (open: boolean) => {
    setShowCustomGenerate(open);
    if (!open) router.refresh();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent p-4 sm:p-6 backdrop-blur-2xl">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-medium text-blue-400">
              <Sparkles className="h-3 w-3" />
              <span>AI Execution Planning Engine</span>
            </div>

            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
              Product Roadmaps
            </h1>

            <p className="max-w-xl text-xs leading-relaxed text-zinc-400">
              Generate, manage, and review detailed execution roadmaps derived from your PRDs for{" "}
              <span className="font-semibold text-white">{projectTitle}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {prds.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-white text-black hover:bg-zinc-200 font-bold rounded-full px-4.5 py-2.5 text-xs">
                    <Sparkles className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                    New Roadmap
                    <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-xl border-white/10 bg-[#0a0a0c] text-white p-2"
                >
                  <DropdownMenuItem
                    onClick={() => setShowGenerate(true)}
                    className="cursor-pointer rounded-lg p-2.5 text-xs font-semibold hover:bg-white/10"
                  >
                    <MapIcon className="mr-2 h-4 w-4 text-blue-400" />
                    Generate from PRD
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setShowCustomGenerate(true)}
                    className="cursor-pointer rounded-lg p-2.5 text-xs font-semibold hover:bg-white/10"
                  >
                    <Wand2 className="mr-2 h-4 w-4 text-purple-400" />
                    Generate from Custom Prompt
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="bg-white text-black hover:bg-zinc-200 font-bold rounded-full px-4.5 py-2.5 text-xs"
              >
                <Link href={`/projects/${projectId}/prd`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Create a PRD First
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/[0.08] bg-white/[0.02] -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 px-5 sm:px-7 py-3.5 sm:py-4 text-xs text-[#8a8a93] sm:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
              <MapIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
                {initialRoadmaps.length}
              </p>
              <p className="text-xs font-semibold text-zinc-400">Roadmaps</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white leading-snug" style={{ fontFamily: "var(--font-sora)" }}>{prds.length}</p>
              <p className="text-xs font-semibold text-zinc-400">Source PRDs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white font-mono leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
                {totalTokens > 0 ? totalTokens.toLocaleString() : "—"}
              </p>
              <p className="text-xs font-semibold text-zinc-400">AI Tokens Processed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white font-mono leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
                {initialRoadmaps.length === 0
                  ? "—"
                  : `${Math.round(
                    initialRoadmaps.reduce(
                      (sum, r) => sum + (r.generationTime ?? 0),
                      0
                    ) / initialRoadmaps.length
                  )}s`}
              </p>
              <p className="text-xs font-semibold text-zinc-400">Avg. Gen Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("roadmaps")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${activeTab === "roadmaps"
                ? "bg-white text-black shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
          >
            <MapIcon className="h-4 w-4" />
            <span>Generated Roadmaps</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === "roadmaps"
                  ? "bg-black/10 text-black"
                  : "bg-white/10 text-zinc-300"
                }`}
            >
              {initialRoadmaps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("prds")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${activeTab === "prds"
                ? "bg-white text-black shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
          >
            <FileText className="h-4 w-4" />
            <span>Source PRDs</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === "prds"
                  ? "bg-black/10 text-black"
                  : "bg-white/10 text-zinc-300"
                }`}
            >
              {prds.length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder={
              activeTab === "roadmaps"
                ? "Search roadmaps..."
                : "Search PRDs..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-500 focus:border-white/30 focus:ring-0 rounded-xl"
          />
        </div>
      </div>

      {/* Tab Content 1: Roadmaps Grid */}
      {activeTab === "roadmaps" && (
        <>
          {initialRoadmaps.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01] py-16 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05] text-zinc-400 border border-white/10 mb-4">
                <MapIcon className="h-8 w-8 text-blue-400" />
              </div>

              <h3 className="text-xl font-semibold text-white">
                No Roadmaps Generated Yet
              </h3>
              <p className="mt-2 max-w-md text-sm text-zinc-400">
                Convert your PRDs into detailed implementation roadmaps with
                milestones, sprint planning, priorities and timelines.
              </p>

              {prds.length > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => setShowCustomGenerate(true)}
                  className="mt-3 rounded-xl"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Custom Roadmap
                </Button>
              ) : (
                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="text-xs text-amber-400/90 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                    Notice: A PRD is required before generating a roadmap.
                  </p>
                  <Button
                    asChild
                    className="bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl"
                  >
                    <Link href={`/projects/${projectId}/prd`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Create a PRD First
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : filteredRoadmaps.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-zinc-400">
                No roadmaps matching &quot;{searchQuery}&quot;
              </p>
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
                const createdTimeAgo = new Date(
                  roadmap.createdAt
                ).toLocaleDateString();

                return (
                  <div
                    key={roadmap.id}
                    onClick={() =>
                      router.push(
                        `/projects/${projectId}/roadmap/${roadmap.id}`
                      )
                    }
                    className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-2xl"
                  >
                    <div className="space-y-4">
                      {/* Header Badge */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                          <MapIcon className="h-3.5 w-3.5" />
                          <span>{roadmap.model || "Roadmap"}</span>
                        </div>

                        {roadmap.prd ? (
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Linked to PRD</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
                            <span>Custom Prompt</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Prompt */}
                      <div>
                        <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                          {roadmap.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">
                          {roadmap.prompt}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 border-t border-white/5 pt-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {createdTimeAgo}
                        </span>
                        {roadmap.tokens && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                            {roadmap.tokens.toLocaleString()} tokens
                          </span>
                        )}
                        {roadmap.generationTime && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                            {roadmap.generationTime}s
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <Button
                        variant="outline"
                        className="w-full border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 font-medium rounded-xl"
                      >
                        <FileText className="mr-2 h-4 w-4 text-blue-400" />
                        View Roadmap
                        <ArrowRight className="ml-auto h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Tab Content 2: Source PRDs */}
      {activeTab === "prds" && (
        <>
          {prds.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01] py-16 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05] text-purple-400 border border-white/10 mb-4">
                <FileText className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-semibold text-white">
                No PRDs Available
              </h3>
              <p className="mt-2 max-w-md text-sm text-zinc-400">
                Generate a product requirements document to form the
                foundation for a roadmap.
              </p>

              <Button
                asChild
                className="mt-6 bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl"
              >
                <Link href={`/projects/${projectId}/prd`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate a PRD
                </Link>
              </Button>
            </div>
          ) : filteredPrds.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-zinc-400">
                No PRDs matching &quot;{searchQuery}&quot;
              </p>
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
              {filteredPrds.map((prd) => {
                const linkedRoadmap = roadmapMapByPrdId.get(prd.id);
                const createdTimeAgo = new Date(
                  prd.createdAt
                ).toLocaleDateString();

                return (
                  <div
                    key={prd.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-2xl"
                  >
                    <div className="space-y-4">
                      {/* Header Badge */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                          <FileText className="h-3.5 w-3.5" />
                          <span>{prd.model || "PRD"}</span>
                        </div>

                        {linkedRoadmap ? (
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Roadmap Ready</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
                            <span>No Roadmap Yet</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Prompt */}
                      <div>
                        <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                          {prd.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">
                          {prd.prompt}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 border-t border-white/5 pt-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {createdTimeAgo}
                        </span>
                        {prd.tokens && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                            {prd.tokens.toLocaleString()} tokens
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                      {linkedRoadmap ? (
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 font-medium rounded-xl"
                        >
                          <Link
                            href={`/projects/${projectId}/roadmap/${linkedRoadmap.id}`}
                          >
                            <MapIcon className="mr-2 h-4 w-4 text-emerald-400" />
                            View Linked Roadmap
                            <ArrowRight className="ml-auto h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setSelectedPrdId(prd.id);
                            setShowGenerate(true);
                          }}
                          className="w-full bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Roadmap for this PRD
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal for Roadmap Generation */}
      <GenerateRoadmapModal
        open={showGenerate}
        onOpenChange={handleGenerateModalChange}
        projectId={projectId}
        prdId={selectedPrdId}
        prds={prds.map((prd) => ({
          id: prd.id,
          title: prd.title,
        }))}
      />

      <GenerateCustomRoadmapModal
        open={showCustomGenerate}
        onOpenChange={handleCustomModalChange}
        projectId={projectId}
      />
    </div>
  );
}
