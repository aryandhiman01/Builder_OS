"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  Download,
  FileDown,
  Pencil,
  Trash2,
  ListOrdered,
  Clock,
  FileText,
  BookOpen,
  Zap,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

import { EditPRDModal } from "./EditPRDModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface PRDViewerProps {
  projectId: string;
  prd: {
    id: string;
    title: string;
    content: string;
    model: string | null;
    tokens: number | null;
    generationTime: number | null;
    createdAt: Date | string;
  };
}

export function PRDViewer({ projectId, prd: initialPrd }: PRDViewerProps) {
  const router = useRouter();

  const [prd, setPrd] = useState(initialPrd);
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Compute Document Metrics (word count, reading time, section count)
  const metrics = useMemo(() => {
    const text = prd.content || "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));
    const headings = (text.match(/^#{1,3}\s+.+/gm) || []).map((h) => {
      const level = h.match(/^#+/)?.[0].length || 1;
      const title = h.replace(/^#+\s+/, "").trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return { level, title, id };
    });

    return { words, readTimeMinutes, headings };
  }, [prd.content]);

  // Copy Markdown to Clipboard
  async function copyMarkdown() {
    await navigator.clipboard.writeText(prd.content);
    setCopied(true);
    toast.success("Copied markdown content!");
    setTimeout(() => setCopied(false), 2000);
  }

  // Export Raw Markdown (.md)
  function downloadMarkdown() {
    const blob = new Blob([prd.content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${prd.title.replace(/[^a-z0-9]/gi, "_")}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded .md document");
  }

  // Export PDF via Browser Print dialog
  function handlePrintPDF() {
    window.print();
  }

  // Delete PRD
  async function handleDeletePRD() {
    try {
      setDeleting(true);
      const response = await fetch(`/api/projects/${projectId}/prd/${prd.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete PRD.");
      }

      toast.success("PRD deleted successfully");
      router.push(`/projects/${projectId}/prd`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete PRD"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-24">
      {/* Navigation & Action Bar (Hidden during print) */}
      <div className="print:hidden flex items-center justify-between flex-wrap gap-4">
        <Link
          href={`/projects/${projectId}/prd`}
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
          <span>Back to PRDs</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setEditOpen(true)}
            className="btn-shimmer inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-white/10 active:scale-95"
          >
            <Pencil size={13} className="text-sky-400" />
            <span>Edit PRD</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="btn-shimmer inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-white/10 active:scale-95"
          >
            <FileDown size={13} className="text-emerald-400" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={downloadMarkdown}
            className="btn-shimmer inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-white/10 active:scale-95"
          >
            <Download size={13} className="text-purple-400" />
            <span>Export .MD</span>
          </button>

          <button
            onClick={copyMarkdown}
            className="btn-shimmer inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-white/10 active:scale-95"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-orange-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => setDeleteOpen(true)}
            className="inline-flex items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 transition hover:bg-rose-500/20"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Landing Page & Dashboard Mockup Card Header Banner */}
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
              BuilderOS — Product Requirement Specification
            </span>
          </div>

          <div className="hidden sm:block w-16" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-sky-400">
            <Sparkles size={14} />
            <span>{prd.model ?? "Gemini 3.6 Flash"}</span>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            {prd.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#8a8a93] pt-2">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-white">
              <BookOpen className="h-3.5 w-3.5 text-sky-400" />
              {metrics.words.toLocaleString()} Words
            </span>

            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-white">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              ~{metrics.readTimeMinutes} min read
            </span>

            {prd.tokens && (
              <span className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 font-mono text-orange-400">
                <Zap size={12} />
                {prd.tokens.toLocaleString()} Tokens
              </span>
            )}
          </div>
        </div>
      </motion.section>

      {/* Main Grid: Table of Contents Sidebar + Markdown Document View */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Table of Contents Sidebar */}
        {metrics.headings.length > 0 && (
          <div className="print:hidden lg:col-span-1">
            <div className="sticky top-28 rounded-3xl border border-white/10 bg-[#09090c]/90 p-5 backdrop-blur-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-bold uppercase tracking-wider text-white">
                <ListOrdered className="h-4 w-4 text-orange-400" />
                <span>Table of Contents</span>
              </div>

              <nav className="max-h-[70vh] overflow-y-auto space-y-1.5 pr-1 text-xs no-scrollbar">
                {metrics.headings.map((h, index) => (
                  <a
                    key={index}
                    href={`#${h.id}`}
                    className={`block rounded-xl px-3 py-2 transition-colors hover:bg-white/10 hover:text-white ${
                      h.level === 1
                        ? "font-bold text-white bg-white/[0.04]"
                        : h.level === 2
                        ? "pl-4 text-zinc-300"
                        : "pl-6 text-[#8a8a93]"
                    }`}
                  >
                    {h.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Document Printable View Container */}
        <div
          className={`${
            metrics.headings.length > 0 ? "lg:col-span-3" : "lg:col-span-4"
          } space-y-6`}
        >
          <Card className="print:border-none print:shadow-none print:bg-white print:text-black p-6 sm:p-12 border-white/10 bg-[#09090c]/90 backdrop-blur-2xl shadow-2xl rounded-3xl">
            {/* Header snippet for PDF export */}
            <div className="hidden print:block border-b border-zinc-200 pb-6 mb-8">
              <h1 className="text-3xl font-bold text-black">{prd.title}</h1>
              <p className="text-xs text-zinc-600 mt-2">
                Generated via BuilderOS AI • {new Date().toLocaleDateString()}
              </p>
            </div>

            <article
              className="
              prose
              prose-invert
              print:prose
              max-w-none
              prose-headings:font-bold
              prose-headings:tracking-tight
              prose-headings:text-white
              print:prose-headings:text-black
              prose-h1:text-2xl
              prose-h1:border-b
              prose-h1:border-white/10
              prose-h1:pb-3
              prose-h1:mt-6
              prose-h2:text-xl
              prose-h2:border-b
              prose-h2:border-white/10
              prose-h2:pb-2
              prose-h2:mt-8
              prose-h3:text-lg
              prose-h3:mt-6
              prose-p:text-zinc-300
              print:prose-p:text-zinc-800
              prose-p:leading-relaxed
              prose-p:text-xs
              sm:prose-p:text-sm
              prose-strong:text-white
              print:prose-strong:text-black
              prose-code:rounded-lg
              prose-code:bg-white/10
              print:prose-code:bg-zinc-100
              prose-code:px-2
              prose-code:py-1
              prose-code:text-sky-300
              print:prose-code:text-sky-700
              prose-code:before:content-none
              prose-code:after:content-none
              prose-pre:rounded-2xl
              prose-pre:border
              prose-pre:border-white/10
              print:prose-pre:border-zinc-200
              prose-pre:bg-zinc-950/90
              print:prose-pre:bg-zinc-50
              prose-pre:p-5
              prose-pre:text-xs
              prose-li:text-zinc-300
              print:prose-li:text-zinc-800
              prose-li:my-1.5
              prose-table:w-full
              prose-table:border-collapse
              prose-table:my-6
              prose-th:border
              prose-th:border-white/10
              print:prose-th:border-zinc-300
              prose-th:bg-white/[0.04]
              print:prose-th:bg-zinc-100
              prose-th:p-3.5
              prose-th:text-left
              prose-th:text-xs
              prose-th:font-semibold
              prose-th:text-white
              print:prose-th:text-black
              prose-td:border
              prose-td:border-white/10
              print:prose-td:border-zinc-200
              prose-td:p-3.5
              prose-td:text-xs
              prose-td:text-zinc-300
              print:prose-td:text-zinc-800
              prose-blockquote:border-l-4
              prose-blockquote:border-orange-500
              prose-blockquote:bg-orange-500/5
              prose-blockquote:py-2
              prose-blockquote:px-5
              prose-blockquote:rounded-r-xl
              prose-blockquote:not-italic
              "
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children, ...props }) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return <h1 id={id} {...props}>{children}</h1>;
                  },
                  h2: ({ children, ...props }) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return <h2 id={id} {...props}>{children}</h2>;
                  },
                  h3: ({ children, ...props }) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return <h3 id={id} {...props}>{children}</h3>;
                  },
                }}
              >
                {prd.content}
              </ReactMarkdown>
            </article>
          </Card>
        </div>
      </div>

      {/* Edit PRD Modal */}
      <EditPRDModal
        open={editOpen}
        onOpenChange={setEditOpen}
        projectId={projectId}
        prd={{
          id: prd.id,
          title: prd.title,
          content: prd.content,
        }}
        onSuccess={(updated) => {
          setPrd((prev) => ({
            ...prev,
            title: updated.title,
            content: updated.content,
          }));
        }}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeletePRD}
        title="Delete PRD Document"
        description="Are you sure you want to delete this PRD? This document will be permanently removed."
        confirmText="Delete Document"
        cancelText="Cancel"
        loading={deleting}
        danger
      />
    </div>
  );
}