"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import {
  FileText,
  Clock3,
  Brain,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PRDCardProps {
  projectId: string;
  prd: {
    id: string;
    title: string;
    model: string | null;
    tokens: number | null;
    generationTime: number | null;
    createdAt: Date | string;
  };
}

export function PRDCard({ projectId, prd }: PRDCardProps) {
  const formattedDate = prd.createdAt
    ? formatDistanceToNow(new Date(prd.createdAt), { addSuffix: true })
    : "";

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="absolute right-0 top-0 h-32 w-32 -mr-10 -mt-10 rounded-full bg-blue-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardContent className="space-y-5 p-6 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <h3 className="text-lg font-semibold text-white tracking-tight truncate group-hover:text-blue-400 transition-colors">
              {prd.title}
            </h3>

            {formattedDate && (
              <p className="text-xs text-zinc-400">
                Generated {formattedDate}
              </p>
            )}
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-400 group-hover:scale-105 transition-transform">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Brain className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-[11px] font-medium">Model</span>
            </div>
            <p className="mt-1 text-xs font-semibold text-white truncate">
              {prd.model ?? "Gemini Pro"}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-[11px] font-medium">Tokens</span>
            </div>
            <p className="mt-1 text-xs font-semibold text-white">
              {prd.tokens ? prd.tokens.toLocaleString() : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Clock3 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium">Time</span>
            </div>
            <p className="mt-1 text-xs font-semibold text-white">
              {prd.generationTime ? `${prd.generationTime}s` : "—"}
            </p>
          </div>
        </div>

        {/* Action button pointing to correct dynamic route */}
        <Button
          asChild
          className="w-full bg-white/10 hover:bg-white text-white hover:text-black font-medium border border-white/10 transition-all duration-200"
        >
          <Link href={`/projects/${projectId}/prd/${prd.id}`}>
            <span>View Complete PRD</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
