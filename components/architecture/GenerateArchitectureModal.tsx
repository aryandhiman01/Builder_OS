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
  Cpu,
  Blocks,
  Map,
} from "lucide-react";

import { toast } from "sonner";

export interface RoadmapOption {
  id: string;
  title: string;
}

interface GenerateArchitectureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;

  roadmapId?: string;

  roadmaps?: RoadmapOption[];
}

export default function GenerateArchitectureModal({
  open,
  onOpenChange,
  projectId,
  roadmapId: initialRoadmapId,
  roadmaps = [],
}: GenerateArchitectureModalProps) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [selectedRoadmapId, setSelectedRoadmapId] = useState(
    initialRoadmapId || (roadmaps[0]?.id ?? "")
  );

  const [title, setTitle] = useState("");

  useEffect(() => {

    if (initialRoadmapId) {
      setSelectedRoadmapId(initialRoadmapId);
    } else if (roadmaps.length > 0) {
      setSelectedRoadmapId(roadmaps[0].id);
    }

  }, [initialRoadmapId, roadmaps, open]);

  useEffect(() => {

    const matched = roadmaps.find(
      (roadmap) => roadmap.id === selectedRoadmapId
    );

    if (matched) {
      setTitle(`${matched.title} - Architecture`);
    } else {
      setTitle("System Architecture");
    }

  }, [selectedRoadmapId, roadmaps]);

  async function handleGenerate() {

    if (!title.trim()) {
      toast.error("Please enter an architecture title.");
      return;
    }

    if (!selectedRoadmapId) {
      toast.error("Please select a roadmap.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `/api/projects/${projectId}/architecture/generate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),
            roadmapId: selectedRoadmapId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate architecture."
        );
      }

      toast.success("Architecture generated successfully!");

      onOpenChange(false);

      if (data?.architecture?.id) {

        router.push(
          `/projects/${projectId}/architecture/${data.architecture.id}`
        );

      } else {

        router.refresh();

      }

    } catch (error) {

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate architecture."
      );

    } finally {

      setLoading(false);

    }

  }

    return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg border-white/10 bg-[#0a0a0c] text-white backdrop-blur-2xl">
        <DialogHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
            <Blocks className="h-6 w-6" />
          </div>

          <DialogTitle className="text-2xl font-bold">
            Generate AI Architecture
          </DialogTitle>

          <DialogDescription className="text-zinc-400">
            Transform your roadmap into a complete software architecture with
            system design, database schema, APIs, deployment strategy,
            scalability and infrastructure recommendations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {roadmaps.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400">
                <Map className="h-3.5 w-3.5 text-indigo-400" />
                Source Roadmap
              </Label>

              <select
                value={selectedRoadmapId}
                onChange={(e) =>
                  setSelectedRoadmapId(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              >
                {roadmaps.map((roadmap) => (
                  <option
                    key={roadmap.id}
                    value={roadmap.id}
                    className="bg-[#0a0a0c]"
                  >
                    {roadmap.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400">
              <Blocks className="h-3.5 w-3.5 text-cyan-400" />
              Architecture Title
            </Label>

            <Input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="BuilderOS System Architecture"
              className="rounded-xl border-white/10 bg-white/[0.05] text-white"
            />
          </div>
        </div>

        <DialogFooter className="pt-3">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="border-white/10 bg-white/5 text-white"
          >
            Cancel
          </Button>

          <Button
            disabled={
              loading || !selectedRoadmapId
            }
            onClick={handleGenerate}
            className="bg-white text-black hover:bg-zinc-200"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Cpu className="mr-2 h-4 w-4" />
                Generate Architecture
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}