"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, FolderKanban } from "lucide-react";

import ProjectCard from "@/components/dashboard/ProjectCard";
import CreateProjectModal from "./CreateProjectModal";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  category: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  isShared: boolean;

  tasks: {
    id: string;
    status: string;
  }[];
  researches?: { id: string }[];
  prds?: { id: string }[];
  roadmaps?: { id: string }[];
  architectures?: { id: string }[];
  members?: { id: string }[];
}

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ? true : project.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  return (
    <>
      <div className="relative min-h-full space-y-5 max-w-full">
        {/* Top Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <FolderKanban size={18} />
              </div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight"
                style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.03em" }}
              >
                Projects
              </h1>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-[#8a8a93] max-w-xl">
              Manage and organize all your product ideas, specs, roadmaps, and execution tasks in one place.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="
            btn-shimmer
            inline-flex
            cursor-pointer
            items-center
            justify-center
            gap-2
            rounded-full
            bg-white
            px-5
            py-2.5
            text-xs
            font-semibold
            text-black
            shadow-lg
            shadow-white/10
            transition-all
            hover:bg-zinc-100
            active:scale-95
            w-fit
            "
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>New Project</span>
          </button>
        </motion.div>

        {/* Search & Filter Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-white/[0.08] bg-[#09090c]/80 backdrop-blur-xl p-4 shadow-xl shadow-black/40"
        >
          {/* Search Input */}
          <div className="flex w-full lg:max-w-md items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 shadow-inner transition-all focus-within:border-orange-500/50 focus-within:bg-black/60">
            <Search size={15} className="shrink-0 text-[#8a8a93]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#8a8a93]"
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Planning", "Building", "Completed"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`
                rounded-full
                px-4
                py-1.5
                text-xs
                font-semibold
                transition-all
                duration-200
                cursor-pointer
                ${
                  filter === item
                    ? "bg-white text-black shadow-lg shadow-white/10"
                    : "border border-white/10 bg-white/[0.04] text-[#8a8a93] hover:bg-white/[0.08] hover:text-white"
                }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full rounded-3xl border border-dashed border-white/10 bg-[#09090c]/50 p-12 text-center backdrop-blur-xl"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 text-[#8a8a93]">
                <FolderKanban size={28} />
              </div>
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                No Projects Found
              </h2>
              <p className="mt-2 text-xs text-[#8a8a93]">
                Create your first project to start organizing with BuilderOS.
              </p>
              <button
                onClick={() => setOpen(true)}
                className="btn-shimmer mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black shadow-lg hover:bg-zinc-100 transition-all"
              >
                <Plus size={14} />
                <span>Create Project</span>
              </button>
            </motion.div>
          ) : (
            filteredProjects.map((project, idx) => {
              const totalTasks = project.tasks.length;
              const completedTasks = project.tasks.filter(
                (task) => task.status === "completed" || task.status === "done"
              ).length;

              const hasResearch = (project.researches?.length ?? 0) > 0;
              const hasPRD = (project.prds?.length ?? 0) > 0;
              const hasRoadmap = (project.roadmaps?.length ?? 0) > 0;
              const hasArchitecture = (project.architectures?.length ?? 0) > 0;

              const aiMilestones =
                (hasResearch ? 1 : 0) +
                (hasPRD ? 1 : 0) +
                (hasRoadmap ? 1 : 0) +
                (hasArchitecture ? 1 : 0);

              let progress = 0;
              if (totalTasks > 0) {
                const taskRatio = completedTasks / totalTasks;
                const aiRatio = aiMilestones / 4;
                progress = Math.round(aiRatio * 30 + taskRatio * 70);
              } else {
                progress = Math.round((aiMilestones / 4) * 100);
              }

              let validStatus: "Planning" | "Building" | "Completed" = "Planning";
              if (progress === 100) {
                validStatus = "Completed";
              } else if (progress > 0 || totalTasks > 0) {
                validStatus = "Building";
              }

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.15 + idx * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <ProjectCard
                    id={project.id}
                    title={project.title}
                    description={
                      project.description ?? "No description added yet."
                    }
                    status={validStatus}
                    progress={progress}
                    updatedAt={new Date(
                      project.updatedAt
                    ).toLocaleDateString()}
                    members={1 + (project.members?.length ?? 0)}
                    color={project.color}
                    isShared={project.isShared}
                  />
                </motion.div>
              );
            })
          )}
        </section>
      </div>

      <CreateProjectModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}