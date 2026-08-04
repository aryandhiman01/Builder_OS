"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

import {
  Loader2,
  Sparkles,
  FileText,
  Wand2,
} from "lucide-react";

import { toast } from "sonner";

interface GenerateCustomPRDModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function GenerateCustomPRDModal({
  open,
  onOpenChange,
  projectId,
}: GenerateCustomPRDModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");

  async function handleGenerate() {
    if (!title.trim()) {
      toast.error("Please enter a document title.");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter an AI prompt.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/projects/${projectId}/prd/custom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            prompt: prompt.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate PRD.");
      }

      toast.success("Custom PRD generated successfully!");
      onOpenChange(false);

      if (data?.prd?.id) {
        router.push(`/projects/${projectId}/prd/${data.prd.id}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate PRD."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl border-white/15 bg-[#09090c] text-white backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <DialogHeader>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400 mb-2">
            <Wand2 className="h-5 w-5" />
          </div>

          <DialogTitle className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
            Generate Custom PRD
          </DialogTitle>

          <DialogDescription className="text-[#8a8a93] text-xs leading-relaxed">
            Describe your product idea and let AI create a complete Product Requirements Document from scratch.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8a8a93]">
              <FileText className="h-3.5 w-3.5 text-sky-400" />
              Document Title
            </Label>

            <Input
              placeholder="e.g. Mobile App Product Requirements Specification"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3.5 text-xs sm:text-sm text-white placeholder-[#8a8a93] outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8a8a93]">
              <Sparkles className="h-3.5 w-3.5 text-orange-400" />
              AI Prompt / Product Description
            </Label>

            <Textarea
              rows={6}
              placeholder="Detailed description of features, tech stack requirements, user workflows, target audience, and constraints..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full resize-none rounded-xl border border-white/15 bg-black/60 px-4 py-3.5 text-xs sm:text-sm text-white placeholder-[#8a8a93] outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-semibold text-[#8a8a93] hover:bg-white/10 hover:text-white"
          >
            Cancel
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs font-bold text-black shadow-lg hover:bg-zinc-100 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                <span>Generating PRD...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 text-orange-500" />
                <span>Generate Custom PRD</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}