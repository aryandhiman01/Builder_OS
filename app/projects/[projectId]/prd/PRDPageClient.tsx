"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { PRDCard } from "@/components/prd/PRDCard";
import { GeneratePRDModal } from "@/components/prd/GeneratePRDModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
} from "lucide-react";

interface ResearchItem {
  id: string;
  title: string;
  prompt: string;
  model: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetResearchId, setTargetResearchId] = useState<string | undefined>(
    undefined
  );

  const handleOpenGenerateModal = (researchId?: string) => {
    setTargetResearchId(researchId);
    setIsModalOpen(true);
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
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent p-8 backdrop-blur-2xl">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-medium text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Product Specification Engine</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Product Requirements & Research
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
              Generate, manage, and review detailed PRDs derived from your project research for{" "}
              <span className="font-semibold text-white">{projectTitle}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {researches.length > 0 ? (
              <Button
                onClick={() => handleOpenGenerateModal()}
                className="bg-white text-black hover:bg-zinc-200 font-semibold shadow-xl shadow-white/10 rounded-xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Generate PRD from Research
              </Button>
            ) : (
              <Button
                asChild
                className="bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl"
              >
                <Link href={`/projects/${projectId}/research`}>
                  <Brain className="mr-2 h-4 w-4" />
                  Create Research First
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {initialPrds.length}
              </p>
              <p className="text-xs text-zinc-400">PRD Documents</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {researches.length}
              </p>
              <p className="text-xs text-zinc-400">Research Modules</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 col-span-2 sm:col-span-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {totalTokens > 0 ? totalTokens.toLocaleString() : "—"}
              </p>
              <p className="text-xs text-zinc-400">AI Tokens Processed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("prds")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "prds"
                ? "bg-white text-black shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Generated PRDs</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] ${
              activeTab === "prds" ? "bg-black/10 text-black" : "bg-white/10 text-zinc-300"
            }`}>
              {initialPrds.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("research")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "research"
                ? "bg-white text-black shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Brain className="h-4 w-4" />
            <span>Source Research Modules</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] ${
              activeTab === "research" ? "bg-black/10 text-black" : "bg-white/10 text-zinc-300"
            }`}>
              {researches.length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder={
              activeTab === "prds"
                ? "Search PRDs..."
                : "Search research items..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-500 focus:border-white/30 focus:ring-0 rounded-xl"
          />
        </div>
      </div>

      {/* Tab Content 1: PRDs Grid */}
      {activeTab === "prds" && (
        <>
          {initialPrds.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01] py-16 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05] text-zinc-400 border border-white/10 mb-4">
                <FileText className="h-8 w-8 text-blue-400" />
              </div>

              <h3 className="text-xl font-semibold text-white">No PRDs Generated Yet</h3>
              <p className="mt-2 max-w-md text-sm text-zinc-400">
                Create detailed product requirement specifications from your project research with a single click.
              </p>

              {researches.length > 0 ? (
                <Button
                  onClick={() => handleOpenGenerateModal()}
                  className="mt-6 bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Your First PRD
                </Button>
              ) : (
                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="text-xs text-amber-400/90 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                    Notice: Market research is required before generating a PRD.
                  </p>
                  <Button
                    asChild
                    className="bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl"
                  >
                    <Link href={`/projects/${projectId}/research`}>
                      <Brain className="mr-2 h-4 w-4" />
                      Start Research First
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : filteredPrds.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-zinc-400">No PRDs matching &quot;{searchQuery}&quot;</p>
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
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01] py-16 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05] text-purple-400 border border-white/10 mb-4">
                <Brain className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-semibold text-white">No Research Data Available</h3>
              <p className="mt-2 max-w-md text-sm text-zinc-400">
                Conduct AI market and competitor research to form the foundation for PRDs.
              </p>

              <Button
                asChild
                className="mt-6 bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl"
              >
                <Link href={`/projects/${projectId}/research`}>
                  <Brain className="mr-2 h-4 w-4" />
                  Generate Market Research
                </Link>
              </Button>
            </div>
          ) : filteredResearches.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-zinc-400">No research items matching &quot;{searchQuery}&quot;</p>
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
                  <div
                    key={res.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-2xl"
                  >
                    <div className="space-y-4">
                      {/* Header Badge */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                          <Brain className="h-3.5 w-3.5" />
                          <span>{res.model || "Research"}</span>
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
                        <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                          {res.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">
                          {res.prompt}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 border-t border-white/5 pt-3">
                        {createdTimeAgo && <span>Created {createdTimeAgo}</span>}
                        {res.tokens && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
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
                          className="w-full border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 font-medium rounded-xl"
                        >
                          <Link href={`/projects/${projectId}/prd/${linkedPrd.id}`}>
                            <FileText className="mr-2 h-4 w-4 text-emerald-400" />
                            View Linked PRD
                            <ArrowRight className="ml-auto h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleOpenGenerateModal(res.id)}
                          className="w-full bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate PRD for this Research
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

      {/* Modal for PRD Generation */}
      <GeneratePRDModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        projectId={projectId}
        researchId={targetResearchId}
        researches={researches}
      />
    </div>
  );
}
