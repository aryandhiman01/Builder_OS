"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateRoadmapModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateRoadmapModal({
  open,
  onClose,
}: CreateRoadmapModalProps) {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a roadmap title.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          type: "STANDALONE",
          projectId: null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create roadmap");

      toast.success("Roadmap created successfully!");
      setTitle("");
      setDescription("");
      onClose();
      router.push(`/roadmaps/${data.roadmap.id}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#09090c] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3
              className="text-lg font-bold text-white flex items-center gap-2"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              <Plus size={18} className="text-orange-400" />
              New Standalone Roadmap
            </h3>
            <p className="text-xs text-[#8a8a93]">
              Create a new standalone roadmap manually.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8a8a93] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#8a8a93]">
              Roadmap Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Backend Developer Master Roadmap"
              autoFocus
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#09090c] px-3.5 py-2.5 text-xs text-white placeholder-[#8a8a93] focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8a8a93]">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the roadmap goals and milestones..."
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#09090c] p-3 text-xs text-white placeholder-[#8a8a93] focus:border-orange-500 focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-[#8a8a93] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-100 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Create Roadmap</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


