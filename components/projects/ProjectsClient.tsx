"use client";

import { useState } from "react";

import {
  Search,
  Plus,
  FolderKanban,
  CheckCircle2,
} from "lucide-react";

import ProjectCard from "@/components/dashboard/ProjectCard";
import CreateProjectModal from "./CreateProjectModal";

export default function ProjectsClient() {
  const [open, setOpen] = useState(false);

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
              Manage and organize all your product ideas in one place.
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

        {/* Search & Filters */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}

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

            <button
              className="
              rounded-full
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-black
              "
            >
              All
            </button>

            <button
              className="
              rounded-full
              border
              border-white/10
              px-4
              py-2
              text-sm
              text-zinc-400
              transition
              hover:bg-white/[0.03]
              "
            >
              Active
            </button>

            <button
              className="
              rounded-full
              border
              border-white/10
              px-4
              py-2
              text-sm
              text-zinc-400
              transition
              hover:bg-white/[0.03]
              "
            >
              Completed
            </button>

            <button
              className="
              rounded-full
              border
              border-white/10
              px-4
              py-2
              text-sm
              text-zinc-400
              transition
              hover:bg-white/[0.03]
              "
            >
              Archived
            </button>

          </div>

        </div>

        {/* Project Grid */}

        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

          <ProjectCard
            id="builderos"
            title="BuilderOS"
            description="The operating system for product builders. Research, plan and build products with AI."
            status="Building"
            progress={72}
            updatedAt="2 hours ago"
            members={3}
          />

          <ProjectCard
            id="food-delivery"
            title="Food Delivery Platform"
            description="AI-powered food delivery application with customer, restaurant and rider dashboards."
            status="Planning"
            progress={24}
            updatedAt="Today"
            members={2}
          />

          <ProjectCard
            id="crm"
            title="CRM Platform"
            description="Modern CRM system with automation and analytics."
            status="Completed"
            progress={100}
            updatedAt="Yesterday"
            members={5}
          />
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
                3
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
                  1
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Modal */}

      <CreateProjectModal
        open={open}
        onClose={() => setOpen(false)}
      />

    </>
  );
}