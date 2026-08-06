"use client";

import PageShell from "@/components/shared/PageShell";
import { motion } from "framer-motion";
import { Search, BrainCircuit, FileText, Map, GitBranch, ClipboardList, Layers, ChevronRight, BookOpen, Terminal } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const categories = [
    {
      icon: BrainCircuit,
      title: "AI Research Engine",
      desc: "Learn how to prompt the research engine to extract TAM/SAM, user personas, and competitor matrices.",
      articles: ["Getting Started with Market Research", "Exporting SWOT Analysis to PDF", "Custom ICP Prompt Configuration"],
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: FileText,
      title: "PRD Generator",
      desc: "Generate developer-ready Product Requirement Documents with scope, acceptance criteria, and edge cases.",
      articles: ["Auto PRD Decomposition", "Linking User Stories to Jira/GitHub", "Custom Spec Formatting"],
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Map,
      title: "Roadmap Builder",
      desc: "Set up milestone timelines, phase breakdowns, and sprint velocity trackers.",
      articles: ["Creating Milestones & Releases", "Tracking Dependency Loops", "Exporting Timeline Views"],
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: GitBranch,
      title: "Architecture Diagrams",
      desc: "Generate production-ready Mermaid.js topology diagrams for databases, microservices, and APIs.",
      articles: ["Mermaid.js Code Export", "Microservice Mapping Guide", "Database Schema Auto-Generation"],
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <PageShell
      badge="Knowledge Base"
      title="BuilderOS"
      highlightTitle="Documentation"
      description="Guides, tutorials, and module references to help you master the Product OS platform."
      breadcrumbs={[{ label: "Resources" }, { label: "Documentation" }]}
    >
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto mb-16">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search documentation, guides, or API endpoints..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 pr-4 text-sm text-white placeholder-zinc-500 backdrop-blur-xl focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
          />
          <span className="absolute right-4 font-mono text-xs text-zinc-500 border border-white/10 px-2 py-0.5 rounded bg-white/[0.04]">
            ⌘K
          </span>
        </div>
      </div>

      {/* Docs Modules Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-white/[0.18] transition-all"
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${cat.bg} mb-4`}>
                <Icon className={`h-5 w-5 ${cat.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-sora)" }}>
                {cat.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#8a8a93] leading-relaxed mb-6">
                {cat.desc}
              </p>

              <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                {cat.articles.map((art, j) => (
                  <div key={j} className="flex items-center justify-between text-xs text-white/80 hover:text-orange-400 transition-colors py-1 cursor-pointer group">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-zinc-600 group-hover:text-orange-400 transition-colors" /> {art}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </PageShell>
  );
}
