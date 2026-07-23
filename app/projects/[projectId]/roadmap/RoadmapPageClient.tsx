"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Search,
  Map,
  Plus,
  Sparkles,
  FileText,
  Calendar,
  Clock,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



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

  const [roadmaps, setRoadmaps] = useState(initialRoadmaps);

  const [search, setSearch] = useState("");

  const [tab, setTab] = useState<"roadmaps" | "prds">("roadmaps");

  const [showGenerate, setShowGenerate] = useState(false);

  const [showCustomGenerate, setShowCustomGenerate] = useState(false);

  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((roadmap) =>
      roadmap.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [roadmaps, search]);

  const totalTokens = roadmaps.reduce(
    (sum, roadmap) => sum + (roadmap.tokens ?? 0),
    0
  );

  const avgGenerationTime =
    roadmaps.length === 0
      ? 0
      : Math.round(
          roadmaps.reduce(
            (sum, roadmap) => sum + (roadmap.generationTime ?? 0),
            0
          ) / roadmaps.length
        );

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold tracking-tight">
            Product Roadmaps
          </h1>

          <p className="mt-2 text-muted-foreground">
            Generate AI-powered execution plans for{" "}
            <span className="font-semibold">
              {projectTitle}
            </span>
          </p>

        </div>

        <DropdownMenu>

        <DropdownMenuTrigger asChild>

            <Button>

            <Plus className="mr-2 h-4 w-4" />

            New Roadmap

            <ChevronDown className="ml-2 h-4 w-4" />

            </Button>

        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60">

            <DropdownMenuItem
            onClick={() => setShowGenerate(true)}
            >
            <Sparkles className="mr-2 h-4 w-4" />

            Generate from PRD

            </DropdownMenuItem>

            <DropdownMenuItem
            onClick={() =>
                setShowCustomGenerate(true)
            }
            >
            <FileText className="mr-2 h-4 w-4" />

            Custom Prompt

            </DropdownMenuItem>

        </DropdownMenuContent>

        </DropdownMenu>

      </div>

      {/* Hero */}

      <div className="rounded-2xl border bg-card p-8">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-primary/10 p-3">

            <Map className="h-7 w-7 text-primary" />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              AI Product Roadmaps
            </h2>

            <p className="text-muted-foreground">
              Convert your PRDs into detailed implementation
              roadmaps with milestones, sprint planning,
              priorities and timelines.
            </p>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-4">

        <div className="rounded-xl border p-5">

          <Map className="mb-3 h-5 w-5 text-primary" />

          <p className="text-3xl font-bold">
            {roadmaps.length}
          </p>

          <p className="text-sm text-muted-foreground">
            Total Roadmaps
          </p>

        </div>

        <div className="rounded-xl border p-5">

          <FileText className="mb-3 h-5 w-5 text-primary" />

          <p className="text-3xl font-bold">
            {prds.length}
          </p>

          <p className="text-sm text-muted-foreground">
            Available PRDs
          </p>

        </div>

        <div className="rounded-xl border p-5">

          <Sparkles className="mb-3 h-5 w-5 text-primary" />

          <p className="text-3xl font-bold">
            {totalTokens.toLocaleString()}
          </p>

          <p className="text-sm text-muted-foreground">
            AI Tokens Used
          </p>

        </div>

        <div className="rounded-xl border p-5">

          <Clock className="mb-3 h-5 w-5 text-primary" />

          <p className="text-3xl font-bold">
            {avgGenerationTime}s
          </p>

          <p className="text-sm text-muted-foreground">
            Avg Generation Time
          </p>

        </div>

      </div>

      {/* Search */}

      <div className="relative">

        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search roadmaps..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Tabs */}

      <div className="flex gap-3">

        <Button
          variant={
            tab === "roadmaps"
              ? "default"
              : "outline"
          }
          onClick={() =>
            setTab("roadmaps")
          }
        >
          Roadmaps
        </Button>

        <Button
          variant={
            tab === "prds"
              ? "default"
              : "outline"
          }
          onClick={() =>
            setTab("prds")
          }
        >
          Source PRDs
        </Button>

      </div>

        {/* ================================
            Roadmaps
        ================================ */}

        {tab === "roadmaps" && (
        <>
            {filteredRoadmaps.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-16 text-center">

                <Map className="mx-auto mb-5 h-12 w-12 text-muted-foreground" />

                <h3 className="text-xl font-semibold">
                {search
                    ? "No Roadmaps Found"
                    : "No Roadmaps Yet"}
                </h3>

                <p className="mt-2 text-muted-foreground">
                {search
                    ? "Try another search keyword."
                    : "Generate your first AI roadmap from a PRD."}
                </p>

                {!search && (
                <Button
                    className="mt-6"
                    onClick={() => setShowGenerate(true)}
                >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Roadmap
                </Button>
                )}

            </div>
            ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {filteredRoadmaps.map((roadmap) => (

                <div
                    key={roadmap.id}
                    onClick={() =>
                    router.push(
                        `/projects/${projectId}/roadmap/${roadmap.id}`
                    )
                    }
                    className="cursor-pointer rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                >

                    <div className="flex items-start justify-between">

                    <div>

                        <h3 className="line-clamp-2 text-lg font-semibold">
                        {roadmap.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {roadmap.prompt}
                        </p>

                    </div>

                    <Map className="h-5 w-5 text-primary" />

                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">

                    {roadmap.prd && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {roadmap.prd.title}
                        </span>
                    )}

                    <span className="rounded-full border px-3 py-1 text-xs">
                        {roadmap.model}
                    </span>

                    </div>

                    <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">

                    <div className="flex items-center gap-1">

                        <Sparkles className="h-4 w-4" />

                        {(roadmap.tokens ?? 0).toLocaleString()} Tokens

                    </div>

                    <div className="flex items-center gap-1">

                        <Clock className="h-4 w-4" />

                        {roadmap.generationTime ?? 0}s

                    </div>

                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">

                    <Calendar className="h-4 w-4" />

                    {new Date(
                        roadmap.createdAt
                    ).toLocaleDateString()}

                    </div>

                </div>

                ))}

            </div>
            )}
        </>
        )}

        {/* ================================
            PRDs
        ================================ */}

        {tab === "prds" && (
        <>
            {prds.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-16 text-center">

                <FileText className="mx-auto mb-5 h-12 w-12 text-muted-foreground" />

                <h3 className="text-xl font-semibold">
                No PRDs Available
                </h3>

                <p className="mt-2 text-muted-foreground">
                Generate a PRD before creating roadmaps.
                </p>

                <Button
                className="mt-6"
                onClick={() =>
                    router.push(`/projects/${projectId}/prd`)
                }
                >
                View PRDs
                </Button>

            </div>
            ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {prds.map((prd) => (

                <div
                    key={prd.id}
                    className="rounded-2xl border bg-card p-6 transition-all hover:border-primary"
                >

                    <div className="flex items-center justify-between">

                    <FileText className="h-5 w-5 text-primary" />

                    <span className="rounded-full border px-3 py-1 text-xs">
                        {prd.model}
                    </span>

                    </div>

                    <h3 className="mt-4 line-clamp-2 text-lg font-semibold">
                    {prd.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {prd.prompt}
                    </p>

                    <div className="mt-6 flex justify-between text-sm text-muted-foreground">

                    <span>
                        {(prd.tokens ?? 0).toLocaleString()} Tokens
                    </span>

                    <span>
                        {prd.generationTime ?? 0}s
                    </span>

                    </div>

                    <Button
                    className="mt-6 w-full"
                    onClick={() => setShowGenerate(true)}
                    >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Roadmap
                    </Button>

                </div>

                ))}

            </div>
            )}
        </>
        )}

      {/* <GenerateRoadmapModal
        open={showGenerate}
        onOpenChange={(open) => {
            setShowGenerate(open);

            if (!open) {
            router.refresh();
            }
        }}
        projectId={projectId}
        />

        <GenerateCustomRoadmapModal
        open={showCustomGenerate}
        onOpenChange={(open) => {
            setShowCustomGenerate(open);

            if (!open) {
            router.refresh();
            }
        }}
        projectId={projectId}
        /> */}

    </div>
  );
}