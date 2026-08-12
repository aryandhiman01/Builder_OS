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
  Cpu,
  Blocks,
  Wand2,
} from "lucide-react";

import { toast } from "sonner";

interface GenerateCustomArchitectureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export default function GenerateCustomArchitectureModal({
  open,
  onOpenChange,
  projectId,
}: GenerateCustomArchitectureModalProps) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");

  const [prompt, setPrompt] = useState("");

  async function handleGenerate() {

    if (!title.trim()) {
      toast.error("Please enter an architecture title.");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter an AI prompt.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `/api/projects/${projectId}/architecture/custom`,
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
        throw new Error(
          data.message || "Failed to generate architecture."
        );
      }

      toast.success("Custom architecture generated successfully!");

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
      <DialogContent className="sm:max-w-2xl border-white/10 bg-[#0a0a0c] text-white backdrop-blur-2xl">

        <DialogHeader>

          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">

            <Blocks className="h-6 w-6" />

          </div>

          <DialogTitle className="text-2xl font-bold">
            Generate Custom Architecture
          </DialogTitle>

          <DialogDescription className="text-zinc-400">
            Describe your software system and let AI generate a complete
            architecture including system design, APIs, database schema,
            infrastructure and deployment strategy.
          </DialogDescription>

        </DialogHeader>

        <div className="space-y-5">

          <div className="space-y-2">

            <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400">

              <Blocks className="h-3.5 w-3.5 text-cyan-400" />

              Architecture Title

            </Label>

            <Input
              placeholder="BuilderOS System Architecture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-white/10 bg-white/[0.05] text-white"
            />

          </div>

          <div className="space-y-2">

            <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400">

              <Cpu className="h-3.5 w-3.5 text-amber-400" />

              AI Prompt

            </Label>

            <Textarea
              rows={10}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Example:

Design a scalable software architecture for BuilderOS.

Include:

- High Level Architecture
- System Components
- Database Schema
- API Design
- Authentication Flow
- Microservices (if needed)
- Deployment Architecture
- Scalability
- Security Considerations
- Tech Stack Recommendations

Return the architecture in professional markdown.`}
              className="resize-none rounded-xl border-white/10 bg-white/[0.05] text-white placeholder:text-zinc-500"
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
            disabled={loading}
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
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Architecture
              </>
            )}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}