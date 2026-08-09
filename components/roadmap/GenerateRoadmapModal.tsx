"use client";

import { useEffect, useState } from "react";
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

import {
  Loader2,
  Compass,
  Milestone,
  FileText,
  Map as MapIcon,
} from "lucide-react";

import { toast } from "sonner";

export interface PRDOption {
  id: string;
  title: string;
}

interface GenerateRoadmapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  prdId?: string;
  prds?: PRDOption[];
}

export default function GenerateRoadmapModal({
  open,
  onOpenChange,
  projectId,
  prdId: initialPrdId,
  prds = [],
}: GenerateRoadmapModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [selectedPrdId, setSelectedPrdId] = useState(
    initialPrdId || (prds[0]?.id ?? "")
  );

  const [title, setTitle] = useState("");

  useEffect(() => {
    if (initialPrdId) {
      setSelectedPrdId(initialPrdId);
    } else if (prds.length > 0) {
      setSelectedPrdId(prds[0].id);
    }
  }, [initialPrdId, prds, open]);

  useEffect(() => {
    const matched = prds.find((prd) => prd.id === selectedPrdId);
    if (matched) {
      setTitle(`${matched.title} - Roadmap`);
    } else if (!title) {
      setTitle("Product Execution Roadmap");
    }
  }, [selectedPrdId, prds]);

  async function handleGenerate() {
    if (!title.trim()) {
      toast.error("Please enter a roadmap title.");
      return;
    }

    if (!selectedPrdId) {
      toast.error("Please select a PRD document.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/projects/${projectId}/roadmap/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            prdId: selectedPrdId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate roadmap.");
      }

      toast.success("Roadmap generated successfully!");
      onOpenChange(false);

      if (data?.roadmap?.id) {
        router.push(`/projects/${projectId}/roadmap/${data.roadmap.id}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate roadmap."
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
            <Milestone className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-sora)" }}>
            Generate AI Roadmap
          </DialogTitle>
          <DialogDescription className="text-[#8a8a93] text-xs leading-relaxed">
            Transform your Product Requirements Document into a detailed execution roadmap with milestones and sprint planning using AI.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {/* PRD Selector */}
          {prds.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93] flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-sky-400" />
                Select Source PRD
              </Label>
              <select
                value={selectedPrdId}
                onChange={(e) => setSelectedPrdId(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
              >
                {prds.map((prd) => (
                  <option
                    key={prd.id}
                    value={prd.id}
                    className="bg-[#09090c] text-white"
                  >
                    {prd.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93] flex items-center gap-2">
              <MapIcon className="h-3.5 w-3.5 text-orange-400" />
              Roadmap Document Title
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. BuilderOS Product Roadmap"
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
            disabled={loading || !selectedPrdId}
            className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs font-bold text-black shadow-lg hover:bg-zinc-100 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                <span>Generating Roadmap...</span>
              </>
            ) : (
              <>
                <Compass className="h-4 w-4 text-orange-500" />
                <span>Generate Roadmap</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}