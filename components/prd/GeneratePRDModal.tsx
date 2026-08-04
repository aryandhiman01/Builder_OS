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

import { Loader2, Sparkles, Brain, FileText, Zap } from "lucide-react";
import { toast } from "sonner";

export interface ResearchOption {
  id: string;
  title: string;
  prompt?: string;
}

interface GeneratePRDModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  researchId?: string;
  researches?: ResearchOption[];
}

export function GeneratePRDModal({
  open,
  onOpenChange,
  projectId,
  researchId: initialResearchId,
  researches = [],
}: GeneratePRDModalProps) {
  const router = useRouter();

  const [selectedResearchId, setSelectedResearchId] = useState(
    initialResearchId || (researches[0]?.id ?? "")
  );
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync selected research ID when modal opens or initialResearchId changes
  useEffect(() => {
    if (initialResearchId) {
      setSelectedResearchId(initialResearchId);
    } else if (researches.length > 0) {
      setSelectedResearchId(researches[0].id);
    }
  }, [initialResearchId, researches, open]);

  // Set default title based on selected research
  useEffect(() => {
    const matched = researches.find((r) => r.id === selectedResearchId);
    if (matched) {
      setTitle(`${matched.title} - PRD`);
    } else if (!title) {
      setTitle("Product Requirements Document");
    }
  }, [selectedResearchId, researches]);

  async function handleGenerate() {
    if (!title.trim()) {
      toast.error("Please enter a PRD title.");
      return;
    }

    if (!selectedResearchId) {
      toast.error("Please select a research item.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/projects/${projectId}/prd/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          researchId: selectedResearchId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate PRD.");
      }

      toast.success("PRD generated successfully!");
      onOpenChange(false);

      if (data?.prd?.id) {
        router.push(`/projects/${projectId}/prd/${data.prd.id}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate PRD."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-white/15 bg-[#09090c] text-white backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <DialogHeader>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400 mb-2">
            <Sparkles className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
            Generate AI PRD
          </DialogTitle>
          <DialogDescription className="text-[#8a8a93] text-xs leading-relaxed">
            Transform market research into a comprehensive, developer-ready Product Requirements Document using AI.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {/* Research Selector */}
          {researches.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93] flex items-center gap-2">
                <Brain className="h-3.5 w-3.5 text-sky-400" />
                Select Source Research
              </Label>
              <select
                value={selectedResearchId}
                onChange={(e) => setSelectedResearchId(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
              >
                {researches.map((res) => (
                  <option
                    key={res.id}
                    value={res.id}
                    className="bg-[#09090c] text-white"
                  >
                    {res.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93] flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-orange-400" />
              PRD Document Title
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI CRM - Full PRD Specification"
              className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3.5 text-xs sm:text-sm text-white placeholder-[#8a8a93] outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
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
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span>Generate PRD Spec</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}