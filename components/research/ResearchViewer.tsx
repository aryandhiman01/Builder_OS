"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

import {
  ArrowLeft,
  Brain,
  CalendarDays,
  Clock3,
  Copy,
  Check,
  Pencil,
  Trash2,
  FileDown,
  FileText,
  Sparkles,
  Zap,
  Layers,
} from "lucide-react";

import ActionMenu from "@/components/ui/ActionMenu";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EditResearchModal from "./EditResearchModal";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";

import { PDFDownloadLink } from "@react-pdf/renderer";
import ResearchPDF from "@/components/pdf/ResearchPDF";

interface ResearchViewerProps {
  projectId: string;
  research: {
    id: string;
    title: string;
    prompt: string;
    content: string;
    model: string | null;
    tokens: number | null;
    generationTime: number | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export default function ResearchViewer({
  projectId,
  research,
}: ResearchViewerProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function copyContent() {
    await navigator.clipboard.writeText(research.content);
    setCopied(true);
    toast.success("Research content copied to clipboard!");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  async function deleteResearch() {
    try {
      setLoading(true);
      const response = await fetch(`/api/research/${research.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete research.");
      }

      toast.success("Research deleted successfully");
      router.push(`/projects/${projectId}/research`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete research");
    } finally {
      setLoading(false);
    }
  }

  function exportMarkdown() {
    const blob = new Blob([research.content], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${research.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported Markdown file!");
  }

  const menuItems = [
    {
      label: "Edit Research Brief",
      icon: <Pencil size={15} />,
      onClick: () => setEditOpen(true),
    },
    {
      label: "Export Markdown",
      icon: <FileDown size={15} />,
      onClick: exportMarkdown,
    },
    {
      label: "Delete Research",
      icon: <Trash2 size={15} />,
      danger: true,
      onClick: () => setDeleteOpen(true),
    },
  ];

  const createdDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(research.createdAt));

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            href={`/projects/${projectId}/research`}
            className="
            btn-shimmer
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-white/15
            bg-white/[0.05]
            px-4
            py-2
            text-xs
            font-semibold
            text-white
            shadow-md
            transition-all
            hover:bg-white/10
            active:scale-95
            "
          >
            <ArrowLeft size={14} className="text-orange-400" />
            <span>Back to Research</span>
          </Link>

          <div className="flex items-center gap-2.5 flex-wrap">
            {mounted ? (
              <PDFDownloadLink
                key={research.updatedAt ? new Date(research.updatedAt).getTime() : Date.now()}
                document={<ResearchPDF research={research} />}
                fileName={`BuilderOS-${research.title}.pdf`}
              >
                {({ loading }) => (
                  <button
                    className="
                    btn-shimmer
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-white/15
                    bg-white/[0.05]
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white
                    shadow-md
                    transition-all
                    hover:bg-white/10
                    active:scale-95
                    "
                  >
                    <FileText size={14} className="text-rose-400" />
                    <span>{loading ? "Preparing..." : "Export PDF"}</span>
                  </button>
                )}
              </PDFDownloadLink>
            ) : (
              <button
                className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-white/10
                bg-white/[0.03]
                px-4
                py-2
                text-xs
                font-bold
                text-zinc-500
                cursor-not-allowed
                "
                disabled
              >
                <FileText size={14} />
                <span>PDF</span>
              </button>
            )}

            <button
              onClick={copyContent}
              className="
              btn-shimmer
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-white/15
              bg-white/[0.05]
              px-4
              py-2
              text-xs
              font-bold
              text-white
              shadow-md
              transition-all
              hover:bg-white/10
              active:scale-95
              "
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-sky-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <ActionMenu items={menuItems} />
          </div>
        </div>

        {/* Landing Page & Dashboard Mockup Card Header */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
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
          p-6
          sm:p-8
          space-y-6
          "
        >
          {/* Top Window Dots Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1 shadow-inner">
              <Layers className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs font-semibold text-white/90">
                BuilderOS — AI Research Brief Document
              </span>
            </div>

            <div className="hidden sm:block w-16" />
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-sky-400">
              <Brain size={14} />
              <span>{research.model ?? "Google Gemini 3.6 Flash"}</span>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              {research.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#9a9a9f] leading-relaxed">
              {research.prompt}
            </p>
          </div>

          {/* Metadata Footer Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#8a8a93]">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-sky-400" />
              <span>Created {createdDate}</span>
            </div>

            {research.generationTime && (
              <div className="flex items-center gap-1.5">
                <Clock3 size={14} className="text-yellow-400" />
                <span>Gen Time: {research.generationTime}s</span>
              </div>
            )}

            {research.tokens && (
              <div className="flex items-center gap-1.5 font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-0.5 rounded-full">
                <Zap size={12} />
                <span>{research.tokens} Tokens</span>
              </div>
            )}
          </div>
        </motion.section>

        {/* Document Content Container */}
        <article className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-10 backdrop-blur-2xl shadow-xl">
          {research.content ? (
            <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-zinc-200">
              <MarkdownRenderer content={research.content} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Brain size={48} className="mb-4 text-zinc-700" />
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                No Research Content
              </h3>
              <p className="mt-2 text-xs text-[#8a8a93]">
                This research brief does not contain any generated content yet.
              </p>
            </div>
          )}
        </article>
      </div>

      <EditResearchModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        research={{
          id: research.id,
          title: research.title,
          prompt: research.prompt,
          content: research.content,
        }}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteResearch}
        title="Delete Research Brief"
        description="Are you sure you want to delete this research brief? This action cannot be undone."
        confirmText="Delete Research"
        cancelText="Cancel"
        loading={loading}
        danger
      />
    </>
  );
}