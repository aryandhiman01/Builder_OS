import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { 
    FolderKanban,
    CalendarDays,
    Clock3,
    Sparkles,
    Target,
    CheckCircle2,
} from "lucide-react";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params}: ProjectPageProps) {
    const session = await getServerSession(authOptions);

    if(!session?.user?.email) {
        notFound();
    }

    const { projectId } = await params;
    const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          user: {
              email: session.user.email!,
          },
          },
  });

    if(!project) {
        notFound();
    }

    return (
    <div className="space-y-8">

      {/* Overview */}

      <section>

        <h2 className="text-3xl font-bold text-white">
          Overview
        </h2>

        <p className="mt-2 text-zinc-500">
          Everything related to your project at one place.
        </p>

      </section>

      {/* Stats */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          "
        >
          <div className="flex items-center justify-between">

            <FolderKanban
              className="text-white"
              size={22}
            />

            <span className="text-xs text-zinc-500">
              Project
            </span>

          </div>

          <h3 className="mt-6 text-xl font-semibold text-white">
            {project.title}
          </h3>

          <p className="mt-2 text-sm text-zinc-500">
            Active Workspace
          </p>

        </div>

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          "
        >
          <div className="flex items-center justify-between">

            <Target
              className="text-green-400"
              size={22}
            />

            <span className="text-xs text-zinc-500">
              Progress
            </span>

          </div>

          <h3 className="mt-6 text-3xl font-bold text-white">
            0%
          </h3>

          <p className="mt-2 text-sm text-zinc-500">
            Project Started
          </p>

        </div>

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          "
        >
          <div className="flex items-center justify-between">

            <CalendarDays
              className="text-blue-400"
              size={22}
            />

            <span className="text-xs text-zinc-500">
              Created
            </span>

          </div>

          <h3 className="mt-6 text-xl font-semibold text-white">
            {project.createdAt.toLocaleDateString()}
          </h3>

          <p className="mt-2 text-sm text-zinc-500">
            Workspace Created
          </p>

        </div>

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          "
        >
          <div className="flex items-center justify-between">

            <Clock3
              className="text-yellow-400"
              size={22}
            />

            <span className="text-xs text-zinc-500">
              Updated
            </span>

          </div>

          <h3 className="mt-6 text-xl font-semibold text-white">
            Just Now
          </h3>

          <p className="mt-2 text-sm text-zinc-500">
            Latest Activity
          </p>

        </div>

      </section>

      {/* Quick Actions */}

      <section>

        <h2 className="mb-6 text-xl font-semibold text-white">
          Quick Actions
        </h2>

        <div className="grid gap-6 lg:grid-cols-3">

          <div
            className="
            rounded-3xl
            border
            border-white/10
            bg-white/[0.03]
            p-6
            "
          >
            <Sparkles
              className="mb-4 text-white"
              size={24}
            />

            <h3 className="text-lg font-semibold text-white">
              AI Research
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Generate competitor analysis and
              market research using AI.
            </p>

          </div>

                    <div
            className="
            rounded-3xl
            border
            border-white/10
            bg-white/[0.03]
            p-6
            "
          >
            <CheckCircle2
              className="mb-4 text-green-400"
              size={24}
            />

            <h3 className="text-lg font-semibold text-white">
              Task Management
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Organize milestones, assign work and
              track project progress.
            </p>

          </div>

          <div
            className="
            rounded-3xl
            border
            border-white/10
            bg-white/[0.03]
            p-6
            "
          >
            <FolderKanban
              className="mb-4 text-blue-400"
              size={24}
            />

            <h3 className="text-lg font-semibold text-white">
              Documentation
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Keep all product documentation,
              architecture and technical notes in
              one place.
            </p>

          </div>

        </div>

      </section>

      {/* Project Information */}

      <section className="grid gap-6 lg:grid-cols-2">

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          "
        >
          <h2 className="mb-6 text-xl font-semibold text-white">
            Project Information
          </h2>

          <div className="space-y-5">

            <div>

              <p className="text-sm text-zinc-500">
                Project Name
              </p>

              <p className="mt-1 font-medium text-white">
                {project.title}
              </p>

            </div>

            <div>

              <p className="text-sm text-zinc-500">
                Description
              </p>

              <p className="mt-1 text-white">
                {project.description ||
                  "No description added yet."}
              </p>

            </div>

            <div>

              <p className="text-sm text-zinc-500">
                Status
              </p>

              <p className="mt-1 text-white">
                Planning
              </p>

            </div>

          </div>

        </div>

        {/* AI Status */}

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          "
        >
          <h2 className="mb-6 text-xl font-semibold text-white">
            AI Workspace
          </h2>

          <div
            className="
            rounded-2xl
            border
            border-blue-500/20
            bg-blue-500/10
            p-5
            "
          >
            <div className="flex items-center gap-3">

              <Sparkles className="text-blue-400" />

              <h3 className="font-semibold text-white">
                AI Assistant Ready
              </h3>

            </div>

            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Your workspace is ready.
              Generate research, PRD,
              roadmap, architecture and
              development tasks using AI.
            </p>

          </div>

        </div>

      </section>

      {/* Recent Activity */}

      <section
        className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.03]
        p-6
        "
      >
        <h2 className="mb-6 text-xl font-semibold text-white">
          Recent Activity
        </h2>

        <div className="space-y-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="font-medium text-white">
                Workspace Created
              </p>

              <p className="text-sm text-zinc-500">
                BuilderOS created your
                project successfully.
              </p>

            </div>

            <span className="text-sm text-zinc-500">
              Just Now
            </span>

          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-center justify-between">

            <div>

              <p className="font-medium text-white">
                Waiting for AI
              </p>

              <p className="text-sm text-zinc-500">
                Start AI Research to begin
                building your product.
              </p>

            </div>

            <span className="text-sm text-zinc-500">
              Pending
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}