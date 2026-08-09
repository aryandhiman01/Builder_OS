"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Loader2,
  Save,
  Eye,
  PencilLine,
  Map as MapIcon,
  AlertCircle,
  BookOpen,
} from "lucide-react";

import { toast } from "sonner";

interface Roadmap {
  id: string;
  title: string;
  content: string;
}

interface EditRoadmapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  roadmap: Roadmap;
  onSuccess?: (roadmap: Roadmap) => void;
}

export default function EditRoadmapModal({
  open,
  onOpenChange,
  projectId,
  roadmap,
  onSuccess,
}: EditRoadmapModalProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(roadmap.title);
      setContent(roadmap.content);
    }
  }, [open, roadmap]);

  const hasChanges = useMemo(() => {
    return title !== roadmap.title || content !== roadmap.content;
  }, [title, content, roadmap]);

  const wordCount = useMemo(() => {
    const text = content.trim();
    return text ? text.split(/\s+/).length : 0;
  }, [content]);

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Roadmap title is required.");
      return;
    }

    if (!content.trim()) {
      toast.error("Roadmap content cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/projects/${projectId}/roadmap/${roadmap.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update roadmap.");
      }

      toast.success("Roadmap updated successfully.");

      onSuccess?.(data.roadmap);
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update roadmap."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next && loading) return;
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-[85vh] w-[95vw] flex-col overflow-hidden border-white/15 bg-[#09090c] p-0 text-white backdrop-blur-2xl sm:max-w-4xl rounded-3xl gap-0 shadow-2xl">
        {/* Header (fixed) */}
        <DialogHeader className="shrink-0 space-y-0 border-b border-white/10 px-6 sm:px-8 py-5 sm:py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
              <MapIcon className="h-5 w-5" />
            </div>

            <div className="space-y-1 text-left">
              <DialogTitle className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
                Edit Execution Roadmap
              </DialogTitle>

              <DialogDescription className="text-xs text-[#8a8a93]">
                Update roadmap title and markdown content manually.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body (scrollable) */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 sm:px-8 py-5 sm:py-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-[#8a8a93]">
              Roadmap Title
            </Label>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Roadmap title..."
              className="h-11 rounded-xl border border-white/15 bg-black/60 px-4 text-xs sm:text-sm text-white placeholder-[#8a8a93] outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>

          <Tabs defaultValue="editor" className="flex w-full flex-col">
            <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-white/10 bg-[#09090c]/90 p-1.5 backdrop-blur-xl sm:w-64">
                <TabsTrigger
                  value="editor"
                  className="rounded-xl py-1.5 text-xs font-bold text-[#8a8a93] data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md"
                >
                  <PencilLine className="mr-2 h-3.5 w-3.5" />
                  Editor
                </TabsTrigger>

                <TabsTrigger
                  value="preview"
                  className="rounded-xl py-1.5 text-xs font-bold text-[#8a8a93] data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md"
                >
                  <Eye className="mr-2 h-3.5 w-3.5" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-white">
                <BookOpen className="h-3 w-3 text-sky-400" />
                {wordCount.toLocaleString()} words
              </span>
            </div>

            <TabsContent value="editor" className="mt-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your roadmap in Markdown..."
                className="min-h-[380px] w-full resize-none rounded-2xl border border-white/15 bg-black/60 p-4 font-mono text-xs leading-relaxed text-zinc-200 placeholder-[#8a8a93] outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="prose prose-invert prose-sm min-h-[380px] max-h-[450px] max-w-none overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02] p-6 prose-headings:font-bold prose-headings:text-white prose-p:text-zinc-300 prose-strong:text-white prose-code:text-sky-300 prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-orange-500 prose-blockquote:text-zinc-300">
                {content.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#8a8a93]">
                    Nothing to preview.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer (fixed) */}
        <DialogFooter className="shrink-0 flex-col-reverse gap-3 border-t border-white/10 bg-[#09090c] px-6 sm:px-8 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex h-4 items-center gap-1.5 text-xs text-[#8a8a93]">
            {hasChanges && (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                <span>You have unsaved changes</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-semibold text-[#8a8a93] hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={loading || !hasChanges}
              onClick={handleSave}
              className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs font-bold text-black shadow-lg hover:bg-zinc-100 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 text-orange-500" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
