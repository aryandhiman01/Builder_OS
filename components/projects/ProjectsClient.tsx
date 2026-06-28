"use client";

import { useMemo, useState } from "react";

import {
  Search,
  Plus,
  FolderKanban,
  CheckCircle2,
} from "lucide-react";

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
}

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({
  projects,
}: ProjectsClientProps) {

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const filteredProjects = useMemo(() => {

    return projects.filter((project) => {

      const matchesSearch =
        project.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All"
          ? true
          : project.status === filter;

      return matchesSearch && matchesFilter;

    });

  }, [projects, search, filter]);

  return (
    <>

      <div className="space-y-10">

        {/* Header */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-4xl font-bold tracking-tight text-white">
              Projects
            </h1>

            <p className="mt-2 text-zinc-500">
              Manage and organize all your
              product ideas in one place.
            </p>

          </div>

          <button
            onClick={() => setOpen(true)}
            className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-white
            px-5
            py-3
            font-semibold
            text-black
            transition
            hover:bg-zinc-200
            "
          >
            <Plus size={18} />

            New Project

          </button>

        </div>

        {/* Search */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div
            className="
            flex
            w-full
            max-w-md
            items-center
            gap-3
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            px-4
            py-3
            "
          >

            <Search
              size={18}
              className="text-zinc-500"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search projects..."
              className="
              w-full
              bg-transparent
              text-white
              outline-none
              placeholder:text-zinc-600
              "
            />

          </div>

          {/* Filters */}

          <div className="flex flex-wrap gap-3">

            {[
              "All",
              "Planning",
              "Building",
              "Completed",
            ].map((item) => (

              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`
                rounded-full
                px-4
                py-2
                text-sm
                font-medium
                transition

                ${
                  filter === item
                    ? "bg-white text-black"
                    : "border border-white/10 text-zinc-400 hover:bg-white/[0.03]"
                }
                `}
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        {/* Project Grid */}

        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

          {filteredProjects.length === 0 ? (

            <div
              className="
              col-span-full
              rounded-3xl
              border
              border-dashed
              border-white/10
              p-16
              text-center
              "
            >

              <FolderKanban
                size={52}
                className="mx-auto mb-5 text-zinc-600"
              />

              <h2 className="text-2xl font-semibold text-white">
                No Projects Found
              </h2>

              <p className="mt-3 text-zinc-500">
                Create your first project
                to start using BuilderOS.
              </p>

            </div>

          ) : (

            filteredProjects.map((project) => (

              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={
                  project.description ??
                  "No description added yet."
                }
                status={
                  project.status as
                    | "Planning"
                    | "Building"
                    | "Completed"
                }
                progress={0}
                updatedAt={new Date(
                  project.createdAt
                ).toLocaleDateString()}
                members={1}
              />

            ))

          )}

        </section>

                {/* Workspace Summary */}

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          "
        >

          <div className="flex items-center gap-3">

            <FolderKanban className="text-white" />

            <h2 className="text-lg font-semibold text-white">
              Workspace Summary
            </h2>

          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>

              <p className="text-sm text-zinc-500">
                Total Projects
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {projects.length}
              </p>

            </div>

            <div>

              <p className="text-sm text-zinc-500">
                Completed Projects
              </p>

              <div className="mt-2 flex items-center gap-2">

                <CheckCircle2
                  className="text-green-400"
                />

                <span className="text-3xl font-bold text-white">
                  {
                    projects.filter(
                      (project) =>
                        project.status === "Completed"
                    ).length
                  }
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Create Project Modal */}

      <CreateProjectModal
        open={open}
        onClose={() => setOpen(false)}
      />

    </>
  );
}