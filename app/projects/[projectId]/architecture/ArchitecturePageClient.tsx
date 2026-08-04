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

import GenerateArchitectureModal from "@/components/architecture/GenerateArchitectureModal";
import GenerateCustomArchitectureModal from "@/components/architecture/GenerateCustomArchitectureModal";

import {
  Blocks,
  Sparkles,
  Search,
  FileCode2,
  Network,
  Server,
  ArrowRight,
  Clock3,
  Wand2,
  ChevronDown,
  Calendar,
  CheckCircle2,
} from "lucide-react";

interface Roadmap {
  id: string;
  title: string;
  prompt: string;
  model: string | null;
  tokens: number | null;
  generationTime: number | null;
  createdAt: Date;
}

interface Architecture {
  id: string;
  title: string;
  prompt: string;
  content: string;
  model: string | null;
  tokens: number | null;
  generationTime: number | null;
  createdAt: Date;

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

  const [showCustomGenerate, setShowCustomGenerate] =
    useState(false);

  const [selectedRoadmapId, setSelectedRoadmapId] =
    useState<string>();

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

  const architectureMapByRoadmapId = new Map<
    string,
    Architecture
  >();

  initialArchitectures.forEach((architecture) => {
    if (architecture.roadmap?.id) {
      architectureMapByRoadmapId.set(
        architecture.roadmap.id,
        architecture
      );
    }
  });

  const handleGenerateModalChange = (
    open: boolean
  ) => {
    setShowGenerate(open);

    if (!open) {
      setSelectedRoadmapId(undefined);
      router.refresh();
    }
  };

  const handleCustomModalChange = (
    open: boolean
  ) => {
    setShowCustomGenerate(open);

    if (!open) {
      router.refresh();
    }
  };

    return (
    <div className="space-y-8 pb-16">

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent p-4 sm:p-6 backdrop-blur-2xl">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-medium text-cyan-400">
              <Sparkles className="h-3 w-3" />
              <span>AI System Architecture Engine</span>
            </div>

            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
              System Architectures
            </h1>

            <p className="max-w-xl text-xs leading-relaxed text-zinc-400">
              Design scalable software architecture, database structure, APIs, services and deployment strategy for
              <span className="font-semibold text-white"> {projectTitle}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {roadmaps.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-full bg-white px-4.5 py-2.5 text-xs font-bold text-black hover:bg-zinc-200">
                    <Sparkles className="mr-1.5 h-3.5 w-3.5 text-cyan-600" />
                    New Architecture
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
                    <Blocks className="mr-2 h-4 w-4 text-cyan-400" />
                    Generate from Roadmap
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setShowCustomGenerate(true)}
                    className="cursor-pointer rounded-lg p-2.5 text-xs font-semibold hover:bg-white/10"
                  >
                    <Wand2 className="mr-2 h-4 w-4 text-indigo-400" />
                    Generate from Custom Prompt
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="rounded-full bg-white px-4.5 py-2.5 text-xs font-bold text-black hover:bg-zinc-200"
              >
                <Link href={`/projects/${projectId}/roadmap`}>
                  <Network className="mr-2 h-4 w-4" />
                  Create Roadmap First
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/[0.08] bg-white/[0.02] -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 px-5 sm:px-7 py-3.5 sm:py-4 text-xs text-[#8a8a93] sm:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-inner">
              <Blocks className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
                {initialArchitectures.length}
              </p>
              <p className="text-xs font-semibold text-zinc-400">Architectures</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-inner">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
                {roadmaps.length}
              </p>
              <p className="text-xs font-semibold text-zinc-400">Roadmaps</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-inner">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white font-mono leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
                {totalTokens > 0 ? totalTokens.toLocaleString() : "—"}
              </p>
              <p className="text-xs font-semibold text-zinc-400">AI Tokens</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-inner">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-white font-mono leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
                {initialArchitectures.length === 0
                  ? "—"
                  : `${Math.round(
                      initialArchitectures.reduce(
                        (sum, architecture) =>
                          sum + (architecture.generationTime ?? 0),
                        0
                      ) / initialArchitectures.length
                    )}s`}
              </p>
              <p className="text-xs font-semibold text-zinc-400">Avg Time</p>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs */}

      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">

          <button
            onClick={() =>
              setActiveTab("architectures")
            }
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "architectures"
                ? "bg-white text-black"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >

            <Blocks className="h-4 w-4" />

            Architectures

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                activeTab === "architectures"
                  ? "bg-black/10 text-black"
                  : "bg-white/10 text-zinc-300"
              }`}
            >
              {initialArchitectures.length}
            </span>

          </button>

          <button
            onClick={() =>
              setActiveTab("roadmaps")
            }
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "roadmaps"
                ? "bg-white text-black"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >

            <Network className="h-4 w-4" />

            Roadmaps

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                activeTab === "roadmaps"
                  ? "bg-black/10 text-black"
                  : "bg-white/10 text-zinc-300"
              }`}
            >
              {roadmaps.length}
            </span>

          </button>

        </div>

        <div className="relative w-full sm:w-72">

          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <Input
            placeholder={
              activeTab === "architectures"
                ? "Search architectures..."
                : "Search roadmaps..."
            }
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="rounded-xl border-white/10 bg-white/[0.03] pl-10 text-white"
          />

        </div>

      </div>

            {/* Tab Content 1: Architectures Grid */}
      {activeTab === "architectures" && (
        <>
          {initialArchitectures.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01] py-16 px-4 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-400">
                <Blocks className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-semibold text-white">
                No Architectures Generated Yet
              </h3>

              <p className="mt-2 max-w-md text-sm text-zinc-400">
                Generate scalable software architecture, APIs, database design,
                microservices and deployment strategy from your roadmap.
              </p>

              {roadmaps.length > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => setShowCustomGenerate(true)}
                  className="mt-4 rounded-xl"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Custom Architecture
                </Button>
              ) : (
                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-400">
                    Notice: A roadmap is required before generating architecture.
                  </p>

                  <Button
                    asChild
                    className="rounded-xl bg-white font-semibold text-black hover:bg-zinc-200"
                  >
                    <Link href={`/projects/${projectId}/roadmap`}>
                      <Network className="mr-2 h-4 w-4" />
                      Create Roadmap First
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : filteredArchitectures.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-zinc-400">
                No architectures matching "{searchQuery}"
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
              {filteredArchitectures.map((architecture) => {
                const createdDate = new Date(
                  architecture.createdAt
                ).toLocaleDateString();

                return (
                  <div
                    key={architecture.id}
                    onClick={() =>
                      router.push(
                        `/projects/${projectId}/architecture/${architecture.id}`
                      )
                    }
                    className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.04] hover:shadow-2xl"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                          <Blocks className="h-3.5 w-3.5" />
                          <span>
                            {architecture.model ?? "Architecture"}
                          </span>
                        </div>

                        {architecture.roadmap ? (
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Linked</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
                            <span>Custom</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-cyan-400">
                          {architecture.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">
                          {architecture.prompt}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {createdDate}
                        </span>

                        {architecture.tokens && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                            {architecture.tokens.toLocaleString()} tokens
                          </span>
                        )}

                        {architecture.generationTime && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                            {architecture.generationTime}s
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-4">
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-cyan-500/30 bg-cyan-500/10 font-medium text-cyan-300 hover:bg-cyan-500/20"
                      >
                        <FileCode2 className="mr-2 h-4 w-4" />
                        View Architecture
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

            {/* Tab Content 2: Source Roadmaps */}
      {activeTab === "roadmaps" && (
        <>
          {roadmaps.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01] py-16 px-4 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-indigo-400">
                <Network className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-semibold text-white">
                No Roadmaps Available
              </h3>

              <p className="mt-2 max-w-md text-sm text-zinc-400">
                Generate a roadmap first to build a complete software
                architecture automatically.
              </p>

              <Button
                asChild
                className="mt-6 rounded-xl bg-white text-black hover:bg-zinc-200"
              >
                <Link href={`/projects/${projectId}/roadmap`}>
                  <Network className="mr-2 h-4 w-4" />
                  Generate Roadmap
                </Link>
              </Button>
            </div>
          ) : filteredRoadmaps.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-zinc-400">
                No roadmaps matching "{searchQuery}"
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
                const linkedArchitecture =
                  architectureMapByRoadmapId.get(roadmap.id);

                const createdDate = new Date(
                  roadmap.createdAt
                ).toLocaleDateString();

                return (
                  <div
                    key={roadmap.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-2xl"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                          <Network className="h-3.5 w-3.5" />
                          <span>{roadmap.model ?? "Roadmap"}</span>
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

                      <div>
                        <h3 className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-cyan-400">
                          {roadmap.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">
                          {roadmap.prompt}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {createdDate}
                        </span>

                        {roadmap.tokens && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                            {roadmap.tokens.toLocaleString()} tokens
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-4">
                      {linkedArchitecture ? (
                        <Button
                          asChild
                          variant="outline"
                          className="w-full rounded-xl border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                        >
                          <Link
                            href={`/projects/${projectId}/architecture/${linkedArchitecture.id}`}
                          >
                            <Blocks className="mr-2 h-4 w-4" />
                            View Architecture
                            <ArrowRight className="ml-auto h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setSelectedRoadmapId(roadmap.id);
                            setShowGenerate(true);
                          }}
                          className="w-full rounded-xl bg-white font-semibold text-black hover:bg-zinc-200"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Architecture
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