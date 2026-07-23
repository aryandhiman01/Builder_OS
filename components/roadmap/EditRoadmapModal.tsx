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
  Map,
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
      <DialogContent className="flex h-[85vh] w-[95vw] flex-col overflow-hidden border-white/10 bg-[#0a0a0c]/95 p-0 text-white backdrop-blur-2xl sm:max-w-4xl rounded-3xl gap-0">
        {/* Header (fixed) */}
        <DialogHeader className="shrink-0 space-y-0 border-b border-white/10 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Map className="h-6 w-6" />
            </div>

            <div className="space-y-1 text-left">
              <DialogTitle className="text-2xl font-bold tracking-tight text-white">
                Edit Roadmap
              </DialogTitle>

              <DialogDescription className="text-sm text-zinc-400">
                Update your roadmap title and markdown content.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body (scrollable) */}
        <div className="flex-1 space-y-5 overflow-y-auto px-8 py-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Roadmap Title
            </Label>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Roadmap title..."
              className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus-visible:border-emerald-500/40 focus-visible:ring-0"
            />
          </div>

          <Tabs defaultValue="editor" className="flex w-full flex-col">
            <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-md sm:w-64">
                <TabsTrigger
                  value="editor"
                  className="rounded-xl py-1.5 text-xs font-semibold text-zinc-400 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md"
                >
                  <PencilLine className="mr-2 h-3.5 w-3.5" />
                  Editor
                </TabsTrigger>

                <TabsTrigger
                  value="preview"
                  className="rounded-xl py-1.5 text-xs font-semibold text-zinc-400 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md"
                >
                  <Eye className="mr-2 h-3.5 w-3.5" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-400">
                <BookOpen className="h-3 w-3 text-purple-400" />
                {wordCount.toLocaleString()} words
              </span>
            </div>

            <TabsContent value="editor" className="mt-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your roadmap in Markdown..."
                className="min-h-[420px] w-full resize-none rounded-2xl border-white/10 bg-white/5 font-mono text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-500 focus-visible:border-emerald-500/40 focus-visible:ring-0"
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="prose prose-invert prose-sm h-[420px] max-w-none overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.03] p-6 prose-headings:font-bold prose-headings:text-white prose-p:text-zinc-300 prose-strong:text-white prose-code:text-emerald-300 prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-emerald-500 prose-blockquote:text-zinc-300">
                {content.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                    Nothing to preview.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer (fixed) */}
        <DialogFooter className="shrink-0 flex-col-reverse gap-3 border-t border-white/10 bg-[#0a0a0c] px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex h-4 items-center gap-1.5 text-xs text-zinc-500">
            {hasChanges && (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                <span>You have unsaved changes</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={loading || !hasChanges}
              onClick={handleSave}
              className="rounded-xl bg-emerald-500 font-semibold text-black hover:bg-emerald-400 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Roadmap
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
