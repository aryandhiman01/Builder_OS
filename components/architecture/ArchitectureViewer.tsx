"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  ArrowLeft,
  Copy,
  Check,
  Cpu,
  Workflow,
  Download,
  FileDown,
  Pencil,
  Trash2,
  ListOrdered,
  Clock,
  Blocks,
  BookOpen,
  Zap,
  Layers,
  Network,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import EditArchitectureModal from "./EditArchitectureModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import MermaidDiagram from "./MermaidDiagram";
import { normalizeArchitectureMermaid } from "@/lib/mermaid";

interface ArchitectureViewerProps {
  projectId: string;

  architecture: {
    id: string;
    title: string;
    content: string;

    model: string | null;
    tokens: number | null;
    generationTime: number | null;

    createdAt: Date | string;

    roadmap?: {
      id: string;
      title: string;
    } | null;
  };
}

export default function ArchitectureViewer({
  projectId,
  architecture: initialArchitecture,
}: ArchitectureViewerProps) {
  const router = useRouter();

  const [architecture, setArchitecture] = useState(initialArchitecture);
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Compute Document Metrics (word count, reading time, section count)
  const metrics = useMemo(() => {
    const text = architecture.content || "";

    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    const headings = (text.match(/^#{1,3}\s+.+/gm) || []).map((heading) => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const title = heading.replace(/^#+\s+/, "").trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      return {
        level,
        title,
        id,
      };
    });

    return {
      words,
      readTimeMinutes,
      headings,
    };
  }, [architecture.content]);

  // Copy Markdown to Clipboard
  async function copyMarkdown() {
    await navigator.clipboard.writeText(
      normalizeArchitectureMermaid(architecture.content)
    );
    setCopied(true);
    toast.success("Copied markdown content!");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  // Export Raw Markdown (.md)
  function downloadMarkdown() {
    const blob = new Blob(
      [normalizeArchitectureMermaid(architecture.content)],
      {
        type: "text/markdown;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${architecture.title.replace(/[^a-z0-9]/gi, "_")}.md`;

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

  // Delete Architecture
  async function handleDeleteArchitecture() {
    try {
      setDeleting(true);

      const response = await fetch(
        `/api/projects/${projectId}/architecture/${architecture.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete architecture.");
      }

      toast.success("Architecture deleted successfully");

      router.push(`/projects/${projectId}/architecture`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete architecture"
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
          href={`/projects/${projectId}/architecture`}
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
          <span>Back to Architectures</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setEditOpen(true)}
            className="btn-shimmer inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-white/10 active:scale-95"
          >
            <Pencil size={13} className="text-sky-400" />
            <span>Edit Architecture</span>
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
              BuilderOS — System Architecture Specification
            </span>
          </div>

          <div className="hidden sm:block w-16" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-sky-400">
            <Cpu size={14} />
            <span>{architecture.model ?? "Gemini 3.6 Flash"}</span>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            {architecture.title}
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

            {architecture.tokens && (
              <span className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 font-mono text-orange-400">
                <Zap size={12} />
                {architecture.tokens.toLocaleString()} Tokens
              </span>
            )}

            {architecture.generationTime && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-zinc-300">
                <Clock className="h-3.5 w-3.5 text-yellow-400" />
                {architecture.generationTime}s generation
              </span>
            )}
          </div>
        </div>
      </motion.section>

      {/* Linked Roadmap Banner */}
      {architecture.roadmap && (
        <div className="print:hidden flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 backdrop-blur-2xl shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-0.5 text-xs font-semibold text-sky-400 mb-1">
              <Workflow className="h-3 w-3" />
              <span>Linked Roadmap Source</span>
            </div>

            <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
              {architecture.roadmap.title}
            </h3>

            <p className="text-xs text-[#8a8a93]">
              This system architecture specification was derived from an existing project roadmap.
            </p>
          </div>

          <Button
            asChild
            className="btn-shimmer rounded-full bg-white px-5 py-2 text-xs font-bold text-black hover:bg-zinc-200"
          >
            <Link
              href={`/projects/${projectId}/roadmap/${architecture.roadmap.id}`}
            >
              <Network className="mr-2 h-4 w-4 text-orange-500" />
              View Source Roadmap
            </Link>
          </Button>
        </div>
      )}

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
                {metrics.headings.map((heading, index) => (
                  <a
                    key={index}
                    href={`#${heading.id}`}
                    className={`block rounded-xl px-3 py-2 transition-colors hover:bg-white/10 hover:text-white ${
                      heading.level === 1
                        ? "font-bold text-white bg-white/[0.04]"
                        : heading.level === 2
                        ? "pl-4 text-zinc-300"
                        : "pl-6 text-[#8a8a93]"
                    }`}
                  >
                    {heading.title}
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
              <h1 className="text-3xl font-bold text-black">
                {architecture.title}
              </h1>
              <p className="text-xs text-zinc-600 mt-2" suppressHydrationWarning>
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
                  // ── Mermaid / flowchart code blocks ──────────────────
                  code({ className, children, ...rest }) {
                    const lang = /language-(\w+)/.exec(className ?? "")?.[1] ?? "";
                    const code = String(children).replace(/\n$/, "");

                    if (
                      [
                        "mermaid",
                        "flowchart",
                        "sequencediagram",
                        "classdiagram",
                        "erdiagram",
                        "gantt",
                        "journey",
                        "gitgraph",
                        "pie",
                      ].includes(lang.toLowerCase())
                    ) {
                      return <MermaidDiagram chart={code} />;
                    }

                    // inline code
                    const isBlock = code.includes("\n");
                    if (!isBlock) {
                      return (
                        <code className={className} {...rest}>
                          {children}
                        </code>
                      );
                    }

                    return (
                      <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950/90 p-5 text-xs print:border-zinc-200 print:bg-zinc-50">
                        <code className={className} {...rest}>
                          {children}
                        </code>
                      </pre>
                    );
                  },

                  // ── Headings with anchor IDs ──────────────────────────
                  h1: ({ children, ...props }) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return (
                      <h1 id={id} {...props}>
                        {children}
                      </h1>
                    );
                  },

                  h2: ({ children, ...props }) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return (
                      <h2 id={id} {...props}>
                        {children}
                      </h2>
                    );
                  },

                  h3: ({ children, ...props }) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return (
                      <h3 id={id} {...props}>
                        {children}
                      </h3>
                    );
                  },
                }}
              >
                {architecture.content}
              </ReactMarkdown>
            </article>
          </Card>
        </div>
      </div>

      {/* Edit Architecture Modal */}
      <EditArchitectureModal
        open={editOpen}
        onOpenChange={setEditOpen}
        projectId={projectId}
        architecture={{
          id: architecture.id,
          title: architecture.title,
          content: architecture.content,
        }}
        onSuccess={(updated: { title: string; content: string }) => {
          setArchitecture((prev) => ({
            ...prev,
            title: updated.title,
            content: updated.content,
          }));

          router.refresh();
        }}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteArchitecture}
        title="Delete Architecture"
        description="Are you sure you want to delete this architecture? This document will be permanently removed."
        confirmText="Delete Architecture"
        cancelText="Cancel"
        loading={deleting}
        danger
      />
    </div>
  );
}
