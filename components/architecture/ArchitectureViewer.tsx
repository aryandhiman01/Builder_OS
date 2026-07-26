"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  Blocks,
  BookOpen,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import EditArchitectureModal from "./EditArchitectureModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import MermaidDiagram from "./MermaidDiagram";

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

  const [architecture, setArchitecture] =
    useState(initialArchitecture);

  const [copied, setCopied] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const metrics = useMemo(() => {

    const text = architecture.content || "";

    const words = text.trim()
      ? text.trim().split(/\s+/).length
      : 0;

    const readTimeMinutes = Math.max(
      1,
      Math.ceil(words / 200)
    );

    const headings = (
      text.match(/^#{1,3}\s+.+/gm) || []
    ).map((heading) => {

      const level =
        heading.match(/^#+/)?.[0].length || 1;

      const title = heading
        .replace(/^#+\s+/, "")
        .trim();

      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

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

  async function copyMarkdown() {

    await navigator.clipboard.writeText(
      architecture.content
    );

    setCopied(true);

    toast.success("Copied markdown content!");

    setTimeout(() => {
      setCopied(false);
    }, 2000);

  }

  function downloadMarkdown() {

    const blob = new Blob(
      [architecture.content],
      {
        type: "text/markdown;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${architecture.title.replace(
        /[^a-z0-9]/gi,
        "_"
      )}.md`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success("Downloaded .md document");

  }

  function handlePrintPDF() {
    window.print();
  }

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
        throw new Error(
          "Failed to delete architecture."
        );
      }

      toast.success(
        "Architecture deleted successfully"
      );

      router.push(
        `/projects/${projectId}/architecture`
      );

      router.refresh();

    } catch (error) {

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete architecture"
      );

    } finally {

      setDeleting(false);

    }

  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-24">

              {/* Top Action & Navigation Bar (Hidden during print) */}
      <div className="print:hidden flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">

        <div className="space-y-2">

          <Button
            asChild
            variant="ghost"
            className="mb-1 -ml-3 rounded-xl text-xs text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <Link href={`/projects/${projectId}/architecture`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Architectures List
            </Link>
          </Button>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {architecture.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-400">

            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-0.5 font-medium text-cyan-400">
              <Blocks className="h-3 w-3" />
              {architecture.model ?? "Gemini Pro"}
            </span>

            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-zinc-300">
              <BookOpen className="h-3 w-3 text-purple-400" />
              {metrics.words.toLocaleString()} words
            </span>

            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-zinc-300">
              <Clock className="h-3 w-3 text-emerald-400" />
              ~{metrics.readTimeMinutes} min read
            </span>

            {architecture.tokens && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-zinc-300">
                {architecture.tokens.toLocaleString()} tokens
              </span>
            )}

            {architecture.generationTime && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-zinc-300">
                {architecture.generationTime}s to generate
              </span>
            )}

          </div>

        </div>

        {/* Action Buttons */}

        <div className="flex flex-wrap items-center gap-2">

          <Button
            onClick={() => setEditOpen(true)}
            variant="outline"
            className="rounded-xl border-white/10 bg-white/5 text-xs font-medium text-white hover:bg-white/10"
          >
            <Pencil className="mr-2 h-3.5 w-3.5 text-cyan-400" />
            Edit Architecture
          </Button>

          <Button
            onClick={handlePrintPDF}
            variant="outline"
            className="rounded-xl border-white/10 bg-white/5 text-xs font-medium text-white hover:bg-white/10"
          >
            <FileDown className="mr-2 h-3.5 w-3.5 text-emerald-400" />
            Download PDF
          </Button>

          <Button
            onClick={downloadMarkdown}
            variant="outline"
            className="rounded-xl border-white/10 bg-white/5 text-xs font-medium text-white hover:bg-white/10"
          >
            <Download className="mr-2 h-3.5 w-3.5 text-purple-400" />
            Export .MD
          </Button>

          <Button
            onClick={copyMarkdown}
            variant="outline"
            className="rounded-xl border-white/10 bg-white/5 text-xs font-medium text-white hover:bg-white/10"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-3.5 w-3.5 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>

          <Button
            onClick={() => setDeleteOpen(true)}
            variant="outline"
            className="rounded-xl border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>

        </div>

      </div>

      {/* Linked Roadmap Banner */}

      {architecture.roadmap && (

        <div className="print:hidden flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

          <div>

            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-400">
              <Sparkles className="h-3 w-3" />
              Linked Roadmap
            </span>

            <h3 className="text-lg font-semibold text-white">
              {architecture.roadmap.title}
            </h3>

            <p className="mt-1 text-sm text-zinc-400">
              This architecture was generated from an existing roadmap.
            </p>

          </div>

          <Button
            asChild
            className="rounded-xl bg-white font-semibold text-black hover:bg-zinc-200"
          >
            <Link
              href={`/projects/${projectId}/roadmap/${architecture.roadmap.id}`}
            >
              View Roadmap
            </Link>
          </Button>

        </div>

      )}

      {/* Main Grid */}

      <div className="grid gap-8 lg:grid-cols-4">

                {/* Table of Contents Sidebar */}
        {metrics.headings.length > 0 && (
          <div className="print:hidden lg:col-span-1">
            <div className="sticky top-28 space-y-4 rounded-2xl border border-white/10 bg-[#0a0a0c]/80 p-5 backdrop-blur-xl">

              <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-bold uppercase tracking-wider text-white">
                <ListOrdered className="h-4 w-4 text-cyan-400" />
                <span>Table of Contents</span>
              </div>

              <nav className="max-h-[70vh] space-y-1.5 overflow-y-auto pr-1 text-xs">
                {metrics.headings.map((heading, index) => (
                  <a
                    key={index}
                    href={`#${heading.id}`}
                    className={`block rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/10 hover:text-white ${
                      heading.level === 1
                        ? "bg-white/5 font-semibold text-white"
                        : heading.level === 2
                        ? "pl-4 text-zinc-300"
                        : "pl-6 text-zinc-400"
                    }`}
                  >
                    {heading.title}
                  </a>
                ))}
              </nav>

            </div>
          </div>
        )}

        {/* Markdown Viewer */}

        <div
          className={`${
            metrics.headings.length > 0
              ? "lg:col-span-3"
              : "lg:col-span-4"
          } space-y-6`}
        >

          <Card className="rounded-3xl border border-white/10 bg-[#0a0a0c]/90 p-8 shadow-2xl backdrop-blur-2xl print:border-none print:bg-white print:text-black print:shadow-none sm:p-14">

            <div className="mb-8 hidden border-b border-zinc-200 pb-6 print:block">
              <h1 className="text-3xl font-bold text-black">
                {architecture.title}
              </h1>

              <p className="mt-2 text-xs text-zinc-600">
                Generated via BuilderOS AI •{" "}
                {new Date().toLocaleDateString()}
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

                prose-h1:text-3xl
                prose-h1:border-b
                prose-h1:border-white/10
                prose-h1:pb-3
                prose-h1:mt-6

                prose-h2:text-2xl
                prose-h2:border-b
                prose-h2:border-white/10
                prose-h2:pb-2
                prose-h2:mt-10

                prose-h3:text-xl
                prose-h3:mt-6

                prose-p:text-zinc-300
                prose-p:text-sm
                prose-p:leading-relaxed
                print:prose-p:text-zinc-800

                prose-strong:text-white
                print:prose-strong:text-black

                prose-code:bg-white/10
                prose-code:px-2
                prose-code:py-1
                prose-code:rounded-lg
                prose-code:text-cyan-300
                prose-code:before:content-none
                prose-code:after:content-none
                print:prose-code:bg-zinc-100
                print:prose-code:text-cyan-700

                prose-pre:bg-zinc-950/90
                prose-pre:border
                prose-pre:border-white/10
                prose-pre:rounded-2xl
                prose-pre:p-5
                prose-pre:text-xs
                print:prose-pre:bg-zinc-50
                print:prose-pre:border-zinc-200

                prose-li:text-zinc-300
                prose-li:my-1.5
                print:prose-li:text-zinc-800

                prose-table:w-full
                prose-table:border-collapse
                prose-table:my-6

                prose-th:border
                prose-th:border-white/10
                prose-th:bg-white/[0.04]
                prose-th:p-3.5
                prose-th:text-left
                prose-th:text-xs
                prose-th:font-semibold
                prose-th:text-white

                print:prose-th:border-zinc-300
                print:prose-th:bg-zinc-100
                print:prose-th:text-black

                prose-td:border
                prose-td:border-white/10
                prose-td:p-3.5
                prose-td:text-xs
                prose-td:text-zinc-300

                print:prose-td:border-zinc-200
                print:prose-td:text-zinc-800

                prose-blockquote:border-l-4
                prose-blockquote:border-cyan-500
                prose-blockquote:bg-cyan-500/5
                prose-blockquote:rounded-r-xl
                prose-blockquote:px-5
                prose-blockquote:py-2
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

                    if (["mermaid", "flowchart", "sequenceDiagram", "classDiagram", "erDiagram", "gantt", "journey", "gitGraph", "pie"].includes(lang.toLowerCase())) {
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
                    const id = text
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-");

                    return (
                      <h1 id={id} {...props}>
                        {children}
                      </h1>
                    );
                  },

                  h2: ({ children, ...props }) => {
                    const text = String(children);
                    const id = text
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-");

                    return (
                      <h2 id={id} {...props}>
                        {children}
                      </h2>
                    );
                  },

                  h3: ({ children, ...props }) => {
                    const text = String(children);
                    const id = text
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-");

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
        onSuccess={(updated: {
          title: string;
          content: string;
        }) => {
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