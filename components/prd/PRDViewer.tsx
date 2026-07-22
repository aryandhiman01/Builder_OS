"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

    // Export PDF via Browser Print dialog with custom print container
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
            {/* Top Action & Navigation Bar (Hidden during print) */}
            <div className="print:hidden flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <Button
                        asChild
                        variant="ghost"
                        className="mb-1 -ml-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl text-xs"
                    >
                        <Link href={`/projects/${projectId}/prd`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to PRDs List
                        </Link>
                    </Button>

                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                        {prd.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-0.5 text-purple-400 font-medium">
                            <Sparkles className="h-3 w-3" />
                            {prd.model ?? "Gemini Pro"}
                        </span>

                        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-zinc-300">
                            <BookOpen className="h-3 w-3 text-blue-400" />
                            {metrics.words.toLocaleString()} words
                        </span>

                        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-zinc-300">
                            <Clock className="h-3 w-3 text-emerald-400" />
                            ~{metrics.readTimeMinutes} min read
                        </span>

                        {prd.tokens && (
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-zinc-300">
                                {prd.tokens.toLocaleString()} tokens
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions Button Bar */}
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        onClick={() => setEditOpen(true)}
                        variant="outline"
                        className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl text-xs font-medium"
                    >
                        <Pencil className="mr-2 h-3.5 w-3.5 text-blue-400" />
                        Edit PRD
                    </Button>

                    <Button
                        onClick={handlePrintPDF}
                        variant="outline"
                        className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl text-xs font-medium"
                    >
                        <FileDown className="mr-2 h-3.5 w-3.5 text-emerald-400" />
                        Download PDF
                    </Button>

                    <Button
                        onClick={downloadMarkdown}
                        variant="outline"
                        className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl text-xs font-medium"
                    >
                        <Download className="mr-2 h-3.5 w-3.5 text-purple-400" />
                        Export .MD
                    </Button>

                    <Button
                        onClick={copyMarkdown}
                        variant="outline"
                        className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl text-xs font-medium"
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
                        className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-medium"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Main Grid: Table of Contents Sidebar + Markdown Document View */}
            <div className="grid gap-8 lg:grid-cols-4">
                {/* Table of Contents Sidebar (Hidden on print) */}
                {metrics.headings.length > 0 && (
                    <div className="print:hidden lg:col-span-1">
                        <div className="sticky top-28 rounded-2xl border border-white/10 bg-[#0a0a0c]/80 p-5 backdrop-blur-xl space-y-4">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-bold uppercase tracking-wider text-white">
                                <ListOrdered className="h-4 w-4 text-blue-400" />
                                <span>Table of Contents</span>
                            </div>

                            <nav className="max-h-[70vh] overflow-y-auto space-y-1.5 pr-1 text-xs">
                                {metrics.headings.map((h, index) => (
                                    <a
                                        key={index}
                                        href={`#${h.id}`}
                                        className={`block rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/10 hover:text-white ${h.level === 1
                                                ? "font-semibold text-white bg-white/5"
                                                : h.level === 2
                                                    ? "pl-4 text-zinc-300"
                                                    : "pl-6 text-zinc-400"
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
                    className={`${metrics.headings.length > 0 ? "lg:col-span-3" : "lg:col-span-4"
                        } space-y-6`}
                >
                    <Card className="print:border-none print:shadow-none print:bg-white print:text-black p-8 sm:p-14 border-white/10 bg-[#0a0a0c]/90 backdrop-blur-2xl shadow-2xl rounded-3xl">
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
              print:prose-p:text-zinc-800
              prose-p:leading-relaxed
              prose-p:text-sm
              prose-strong:text-white
              print:prose-strong:text-black
              prose-code:rounded-lg
              prose-code:bg-white/10
              print:prose-code:bg-zinc-100
              prose-code:px-2
              prose-code:py-1
              prose-code:text-blue-300
              print:prose-code:text-blue-700
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
              prose-blockquote:border-blue-500
              prose-blockquote:bg-blue-500/5
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