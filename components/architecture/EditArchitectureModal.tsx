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

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Loader2,
  Save,
  Eye,
  PencilLine,
  Blocks,
  AlertCircle,
  BookOpen,
} from "lucide-react";

import { toast } from "sonner";

interface Architecture {
  id: string;
  title: string;
  content: string;
}

interface EditArchitectureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  architecture: Architecture;
  onSuccess?: (architecture: Architecture) => void;
}

export default function EditArchitectureModal({
  open,
  onOpenChange,
  projectId,
  architecture,
  onSuccess,
}: EditArchitectureModalProps) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(architecture.title);
      setContent(architecture.content);
    }
  }, [open, architecture]);

  const hasChanges = useMemo(() => {
    return (
      title !== architecture.title ||
      content !== architecture.content
    );
  }, [title, content, architecture]);

  const wordCount = useMemo(() => {
    const text = content.trim();
    return text ? text.split(/\s+/).length : 0;
  }, [content]);

  async function handleSave() {

    if (!title.trim()) {
      toast.error("Architecture title is required.");
      return;
    }

    if (!content.trim()) {
      toast.error("Architecture content cannot be empty.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `/api/projects/${projectId}/architecture/${architecture.id}`,
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
        throw new Error(
          data.message ||
            "Failed to update architecture."
        );
      }

      toast.success(
        "Architecture updated successfully."
      );

      onSuccess?.(data.architecture);

      router.refresh();

      onOpenChange(false);

    } catch (error) {

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update architecture."
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
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="flex h-[85vh] w-[95vw] flex-col overflow-hidden rounded-3xl border-white/10 bg-[#0a0a0c]/95 p-0 text-white backdrop-blur-2xl sm:max-w-4xl">

        <DialogHeader className="shrink-0 space-y-0 border-b border-white/10 px-8 py-6">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">

              <Blocks className="h-6 w-6" />

            </div>

            <div className="space-y-1 text-left">

              <DialogTitle className="text-2xl font-bold tracking-tight text-white">
                Edit Architecture
              </DialogTitle>

              <DialogDescription className="text-sm text-zinc-400">
                Update your architecture title and markdown content.
              </DialogDescription>

            </div>

          </div>

        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-8 py-6">

          <div className="space-y-2">

            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Architecture Title
            </Label>

            <Input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Architecture title..."
              className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus-visible:border-cyan-500/40 focus-visible:ring-0"
            />

          </div>

          <Tabs
            defaultValue="editor"
            className="flex w-full flex-col"
          >

            <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">

              <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 sm:w-64">

                <TabsTrigger
                  value="editor"
                  className="rounded-xl py-1.5 text-xs font-semibold text-zinc-400 data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  <PencilLine className="mr-2 h-3.5 w-3.5" />
                  Editor
                </TabsTrigger>

                <TabsTrigger
                  value="preview"
                  className="rounded-xl py-1.5 text-xs font-semibold text-zinc-400 data-[state=active]:bg-white data-[state=active]:text-black"
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
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="Write your architecture in Markdown..."
                className="min-h-[420px] resize-none rounded-2xl border-white/10 bg-white/5 font-mono text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-500 focus-visible:border-cyan-500/40 focus-visible:ring-0"
              />

            </TabsContent>

            <TabsContent value="preview" className="mt-4">

              <div className="prose prose-invert prose-sm h-[420px] max-w-none overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.03] p-6 prose-headings:font-bold prose-headings:text-white prose-p:text-zinc-300 prose-strong:text-white prose-code:text-cyan-300 prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-cyan-500 prose-blockquote:text-zinc-300">

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
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Cancel
            </Button>

            <Button
              disabled={loading || !hasChanges}
              onClick={handleSave}
              className="rounded-xl bg-cyan-500 font-semibold text-black hover:bg-cyan-400 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Architecture
                </>
              )}
            </Button>

          </div>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}