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

import { Loader2, Sparkles, Brain, FileText } from "lucide-react";
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

      const response = await fetch(`/api/projects/${projectId}/prd`, {
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

      if (data?.id) {
        router.push(`/projects/${projectId}/prd/${data.id}`);
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
      <DialogContent className="sm:max-w-lg border-white/10 bg-[#0a0a0c] text-white backdrop-blur-2xl">
        <DialogHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white">
            Generate AI PRD
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            Transform market research into a comprehensive, developer-ready Product Requirements Document using AI.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Research Selector */}
          {researches.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Brain className="h-3.5 w-3.5 text-purple-400" />
                Select Source Research
              </Label>
              <select
                value={selectedResearchId}
                onChange={(e) => setSelectedResearchId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                {researches.map((res) => (
                  <option
                    key={res.id}
                    value={res.id}
                    className="bg-[#0a0a0c] text-white"
                  >
                    {res.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* PRD Title Input */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-blue-400" />
              Document Title
            </Label>
            <Input
              placeholder="e.g. BuilderOS PRD"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/[0.05] border-white/10 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-0 rounded-xl"
            />
          </div>
        </div>

        <DialogFooter className="gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl"
          >
            Cancel
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={loading || !selectedResearchId}
            className="bg-white text-black hover:bg-zinc-200 font-semibold shadow-lg shadow-white/10 rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
                Generating PRD...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4 text-black" />
                Generate PRD Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}