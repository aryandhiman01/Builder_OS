"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2, Save, Pencil, Eye } from "lucide-react";
import { toast } from "sonner";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EditPRDModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  prd: {
    id: string;
    title: string;
    content: string;
  };
  onSuccess?: (updatedPrd: { title: string; content: string }) => void;
}

export function EditPRDModal({
  open,
  onOpenChange,
  projectId,
  prd,
  onSuccess,
}: EditPRDModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState(prd.title);
  const [content, setContent] = useState(prd.content);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    setTitle(prd.title);
    setContent(prd.content);
  }, [prd, open]);

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }

    if (!content.trim()) {
      toast.error("Content cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/projects/${projectId}/prd/${prd.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update PRD.");
      }

      toast.success("PRD updated successfully!");
      onOpenChange(false);

      if (onSuccess) {
        onSuccess({ title: title.trim(), content });
      }

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save changes."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col border-white/10 bg-[#0a0a0c] text-white backdrop-blur-2xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Pencil className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  Edit PRD Document
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-400">
                  Update document specifications, title, or sections manually.
                </DialogDescription>
              </div>
            </div>

            {/* Edit / Preview Toggle */}
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "edit"
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "preview"
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {/* Title Field */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              PRD Document Title
            </Label>
            <Input
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="e.g. JurisSync AI - Product Requirements Document"
              className="bg-white/[0.03] border-white/10 text-white focus:border-blue-500 focus:ring-0 rounded-xl"
            />
          </div>

          {/* Content Area */}
          {activeTab === "edit" ? (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Markdown Content
              </Label>
              <textarea
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                rows={18}
                className="w-full font-mono text-xs leading-relaxed bg-white/[0.02] border border-white/10 text-zinc-200 focus:border-blue-500 focus:outline-none rounded-xl resize-none p-4"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 max-h-[450px] overflow-y-auto">
              <article className="prose prose-invert max-w-none text-xs prose-headings:font-bold prose-headings:text-white prose-p:text-zinc-300 prose-pre:bg-zinc-950">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </article>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-white/10 pt-4 gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-500 font-semibold rounded-xl shadow-lg shadow-blue-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
