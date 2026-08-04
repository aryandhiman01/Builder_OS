"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

import {
  FileText,
  Clock3,
  Brain,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

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
    <motion.div
      whileHover={{ y: -3 }}
      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-[#09090c]/90
      p-6
      backdrop-blur-2xl
      shadow-xl
      transition-all
      duration-300
      hover:border-orange-500/30
      hover:bg-[#0c0c10]
      flex
      flex-col
      justify-between
      "
    >
      {/* Background Glow */}
      <div
        className="
        absolute
        -right-10
        -top-10
        h-36
        w-36
        rounded-full
        bg-orange-500/10
        blur-3xl
        transition-all
        duration-500
        group-hover:bg-orange-500/20
        "
      />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-sky-400 mb-1">
              <FileText size={12} />
              <span>PRD Document</span>
            </div>

            <h3
              className="text-base font-bold text-white tracking-tight truncate group-hover:text-orange-400 transition-colors"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              {prd.title}
            </h3>

            {formattedDate && (
              <p className="text-[11px] text-[#8a8a93]">
                Generated {formattedDate}
              </p>
            )}
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] text-orange-400 group-hover:scale-105 transition-transform shadow-inner">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
            <div className="flex items-center gap-1 text-[#8a8a93]">
              <Brain className="h-3 w-3 text-sky-400" />
              <span className="text-[10px] font-bold uppercase">Model</span>
            </div>
            <p className="mt-1 text-[11px] font-bold text-white truncate font-mono">
              {prd.model ?? "Gemini 3.6"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
            <div className="flex items-center gap-1 text-[#8a8a93]">
              <Zap className="h-3 w-3 text-orange-400" />
              <span className="text-[10px] font-bold uppercase">Tokens</span>
            </div>
            <p className="mt-1 text-[11px] font-bold text-white font-mono">
              {prd.tokens ? prd.tokens.toLocaleString() : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
            <div className="flex items-center gap-1 text-[#8a8a93]">
              <Clock3 className="h-3 w-3 text-yellow-400" />
              <span className="text-[10px] font-bold uppercase">Time</span>
            </div>
            <p className="mt-1 text-[11px] font-bold text-white font-mono">
              {prd.generationTime ? `${prd.generationTime}s` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 mt-4 border-t border-white/10 relative z-10">
        <Link
          href={`/projects/${projectId}/prd/${prd.id}`}
          className="
          btn-shimmer
          flex
          w-full
          items-center
          justify-between
          rounded-xl
          border
          border-white/15
          bg-white/[0.05]
          px-4
          py-2.5
          text-xs
          font-bold
          text-white
          shadow-md
          transition-all
          hover:bg-white/10
          hover:border-white/25
          active:scale-95
          "
        >
          <span>View Complete PRD</span>
          <ArrowRight className="h-4 w-4 text-orange-400 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
