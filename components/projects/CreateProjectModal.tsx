"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus, Loader2, Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  "Saas",
  "AI Product",
  "Web App",
  "E-commerce",
  "Mobile App",
  "Internal Tool",
  "Portfolio",
  "Other",
];

const colors = [
  "#FF6B35",
  "#38BDF8",
  "#8B5CF6",
  "#34D399",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
];

export default function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Saas");
  const [color, setColor] = useState(colors[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          color,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create project");
        return;
      }

      router.refresh();

      setTitle("");
      setDescription("");
      setCategory("Saas");
      setColor(colors[0]);

      onClose();
      router.push(`/projects/${data.project.id}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          {/* Overlay click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && onClose()}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#09090c] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!loading) onClose();
              }}
              disabled={loading}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-zinc-400 hover:border-white/40 hover:bg-white/20 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              title="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="relative mb-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                <FolderPlus size={22} />
              </div>
              <h2
                className="text-xl sm:text-2xl font-extrabold text-white tracking-tight"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                Create New Project
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Start building your next amazing product with BuilderOS.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative space-y-4 sm:space-y-5">
              {/* Project Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Project Name <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Food Delivery Platform"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition duration-200 focus:border-white/25 focus:bg-white/[0.05]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project vision..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition duration-200 focus:border-white/25 focus:bg-white/[0.05]"
                />
              </div>

              {/* Category & Color Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-white/10 bg-[#121216] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25 cursor-pointer"
                    >
                      {categories.map((item) => (
                        <option key={item} value={item} className="bg-[#121216] text-white">
                          {item}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Theme Color
                  </label>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {colors.map((item) => {
                      const isSelected = color === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setColor(item)}
                          style={{ backgroundColor: item }}
                          className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 ${
                            isSelected
                              ? "ring-2 ring-white ring-offset-2 ring-offset-[#09090c] scale-105"
                              : "opacity-80 hover:opacity-100"
                          }`}
                          title={`Select ${item}`}
                        >
                          {isSelected && (
                            <Check
                              size={14}
                              className={item === "#FFFFFF" ? "text-black" : "text-white"}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400 font-medium"
                >
                  {error}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => !loading && onClose()}
                  disabled={loading}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-2.5 text-xs sm:text-sm font-extrabold text-black transition hover:bg-zinc-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-black" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FolderPlus size={16} className="text-black" />
                      Create Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}