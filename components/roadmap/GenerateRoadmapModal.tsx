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
  Sparkles,
  FileText,
  Map,
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

    const matched = prds.find(
      (prd) => prd.id === selectedPrdId
    );

    if (matched) {
      setTitle(`${matched.title} - Roadmap`);
    } else {
      setTitle("Product Roadmap");
    }

  }, [selectedPrdId, prds]);

  async function handleGenerate() {

    if (!title.trim()) {
      toast.error("Please enter a roadmap title.");
      return;
    }

    if (!selectedPrdId) {
      toast.error("Please select a PRD.");
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
        throw new Error(
          data.message || "Failed to generate roadmap."
        );
      }

      toast.success("Roadmap generated successfully!");

      onOpenChange(false);

      if (data?.roadmap?.id) {

        router.push(
          `/projects/${projectId}/roadmap/${data.roadmap.id}`
        );

      } else {

        router.refresh();

      }

    } catch (error) {

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate roadmap."
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

          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">

            <Map className="h-6 w-6" />

          </div>

          <DialogTitle className="text-2xl font-bold">

            Generate AI Roadmap

          </DialogTitle>

          <DialogDescription className="text-zinc-400">

            Transform your PRD into a detailed execution roadmap with milestones,
            sprint planning and implementation phases.

          </DialogDescription>

        </DialogHeader>

        <div className="space-y-5">

          {prds.length > 0 && (

            <div className="space-y-2">

              <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400">

                <FileText className="h-3.5 w-3.5 text-blue-400" />

                Source PRD

              </Label>

              <select
                value={selectedPrdId}
                onChange={(e) =>
                  setSelectedPrdId(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >

                {prds.map((prd) => (

                  <option
                    key={prd.id}
                    value={prd.id}
                    className="bg-[#0a0a0c]"
                  >

                    {prd.title}

                  </option>

                ))}

              </select>

            </div>

          )}

          <div className="space-y-2">

            <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400">

              <Map className="h-3.5 w-3.5 text-emerald-400" />

              Roadmap Title

            </Label>

            <Input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="BuilderOS Roadmap"
              className="rounded-xl border-white/10 bg-white/[0.05] text-white"
            />

          </div>

        </div>

        <DialogFooter className="pt-3">

          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
            className="border-white/10 bg-white/5 text-white"
          >

            Cancel

          </Button>

          <Button
            disabled={
              loading || !selectedPrdId
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

                <Sparkles className="mr-2 h-4 w-4" />

                Generate Roadmap

              </>

            )}

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}