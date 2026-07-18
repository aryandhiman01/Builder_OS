"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  async function deleteResearch() {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/research/${research.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete research.");
      }

      router.push(`/projects/${projectId}/research`);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function exportMarkdown() {
    const blob = new Blob(
      [research.content],
      {
        type: "text/markdown",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${research.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const menuItems = [
    {
      label: "Edit Research",
      icon: <Pencil size={16} />,
      onClick: () => setEditOpen(true),
    },
    {
      label: "Export Markdown",
      icon: <FileDown size={16} />,
      onClick: exportMarkdown,
    },
    {
      label: "Delete Research",
      icon: <Trash2 size={16} />,
      danger: true,
      onClick: () => setDeleteOpen(true),
    },
  ];

  const createdDate = new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
    }
  ).format(new Date(research.createdAt));

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${projectId}/research`}
            className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-white/10
            bg-white/[0.03]
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-white/[0.06]
            "
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <div className="flex items-center gap-3">

            {mounted ? (
              <PDFDownloadLink
                key={research.updatedAt ? new Date(research.updatedAt).getTime() : Date.now()}
                document={
                  <ResearchPDF
                    research={research}
                  />
                }
                fileName={`BuilderOS-${research.title}.pdf`}
              >
                {({ loading }) => (
                  <button
                    className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-white/[0.06]
                    "
                  >
                    <FileText size={16} />
                    {loading ? "Preparing..." : "PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            ) : (
              <button
                className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                px-4
                py-2
                text-sm
                font-medium
                text-zinc-500
                cursor-not-allowed
                "
                disabled
              >
                <FileText size={16} />
                PDF
              </button>
            )}

            <button
              onClick={copyContent}
              className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-white/10
            bg-white/[0.03]
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-white/[0.06]
            "
            >

              {copied ? (
                <>
                  <Check size={16} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}

            </button>

            <ActionMenu
              items={menuItems}
            />

          </div>
        </div>

        {/* Research Header */}
        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-8
          "
        >
          <div
            className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-blue-500/20
            bg-blue-500/10
            px-3
            py-1
            text-xs
            font-medium
            text-blue-400
            "
          >
            <Brain size={14} />
            {research.model ?? "BuilderOS AI"}
          </div>

          <h1
            className="
            mt-6
            text-4xl
            font-bold
            tracking-tight
            text-white
            "
          >
            {research.title}
          </h1>

          <p
            className="
            mt-5
            text-lg
            leading-8
            text-zinc-400
            "
          >
            {research.prompt}
          </p>

          {/* Metadata */}
          <div
            className="
            mt-8
            flex
            flex-wrap
            items-center
            gap-6
            border-t
            border-white/10
            pt-6
            text-sm
            text-zinc-500
            "
          >
            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              <span>{createdDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 size={16} />
              <span>{research.generationTime ?? 0}s</span>
            </div>

            <div
              className="
              rounded-full
              border
              border-white/10
              bg-white/[0.03]
              px-3
              py-1
              text-xs
              font-medium
              text-zinc-300
              "
            >
              {research.tokens ?? 0} Tokens
            </div>
          </div>
        </div>

        {/* Document */}
        <article
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-10
          "
        >
          {research.content ? (
            <div
              className="
              whitespace-pre-wrap
              text-[15px]
              leading-8
              text-zinc-300
              "
            >
              <MarkdownRenderer content={research.content} />
            </div>
          ) : (
            <div
              className="
              flex
              flex-col
              items-center
              justify-center
              py-20
              text-center
              "
            >
              <Brain size={54} className="mb-6 text-zinc-700" />
              <h2
                className="
                text-2xl
                font-semibold
                text-white
                "
              >
                No Research Content
              </h2>
              <p
                className="
                mt-3
                max-w-xl
                text-zinc-500
                "
              >
                This research doesn't contain any generated content yet.
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
        title="Delete Research"
        description="Are you sure you want to delete this research?"
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
        danger
      />
    </>
  );
}