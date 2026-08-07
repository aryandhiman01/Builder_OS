"use client";

import { X, ExternalLink, BookOpen, Video, GitBranch, GraduationCap, Sparkles, Loader2 } from "lucide-react";

export interface ResourceItem {
  title: string;
  url: string;
  type: "Docs" | "Video" | "GitHub" | "Course" | string;
  description?: string;
}

interface RoadmapResourcesModalProps {
  open: boolean;
  resources: ResourceItem[];
  loading: boolean;
  onClose: () => void;
  onRefreshResources?: () => void;
}

export default function RoadmapResourcesModal({
  open,
  resources,
  loading,
  onClose,
  onRefreshResources,
}: RoadmapResourcesModalProps) {
  if (!open) return null;

  function getIcon(type: string) {
    switch (type?.toLowerCase()) {
      case "video":
        return <Video size={16} className="text-red-400" />;
      case "github":
        return <GitBranch size={16} className="text-purple-400" />;
      case "course":
        return <GraduationCap size={16} className="text-emerald-400" />;
      default:
        return <BookOpen size={16} className="text-blue-400" />;
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-[#09090c] p-6 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <BookOpen size={18} />
            </div>
            <div>
              <h3
                className="text-base font-bold text-white"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                Curated Learning Resources
              </h3>
              <p className="text-xs text-[#8a8a93]">
                Hand-picked Docs, Video Tutorials, GitHub Repos & Courses.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8a8a93] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-6 space-y-3 pr-2 scrollbar-none">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 size={28} className="animate-spin text-emerald-400" />
              <p className="text-xs text-[#8a8a93]">
                AI is searching and curating best docs, videos & repositories...
              </p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-xs text-[#8a8a93]">No resources curated yet.</p>
              {onRefreshResources && (
                <button
                  onClick={onRefreshResources}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
                >
                  <Sparkles size={14} />
                  <span>Generate Resources with AI</span>
                </button>
              )}
            </div>
          ) : (
            resources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    {getIcon(res.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {res.title}
                      </h4>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-[#8a8a93]">
                        {res.type}
                      </span>
                    </div>
                    {res.description && (
                      <p className="mt-1 text-xs text-[#8a8a93] line-clamp-2">
                        {res.description}
                      </p>
                    )}
                  </div>
                </div>

                <ExternalLink size={16} className="text-[#8a8a93] group-hover:text-white shrink-0 mt-1" />
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-between shrink-0">
          {onRefreshResources && !loading && (
            <button
              onClick={onRefreshResources}
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:underline"
            >
              <Sparkles size={14} />
              <span>Regenerate with AI</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
