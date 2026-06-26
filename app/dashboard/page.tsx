import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import {
  FolderKanban,
  CheckCircle2,
  Brain,
  Target,
  FolderPlus,
  Map,
  CheckSquare
} from "lucide-react";

import { authOptions } from "@/lib/auth";

import StatsCard from "@/components/dashboard/StatsCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AIHeroCard from "@/components/dashboard/AIHeroCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const name = session.user?.name ?? "Builder";

  return (
    <div className="space-y-8">

      {/* Greeting */}

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back, {name}
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Your workspace is ready. Start building something great.
        </p>

      </div>

      <AIHeroCard />

      {/* Stats */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="Projects"
          value={12}
          description="Active projects"
          icon={FolderKanban}
          trend="+18%"
          trendColor="green"
        />

        <StatsCard
          title="Tasks"
          value={84}
          description="Tasks remaining"
          icon={CheckCircle2}
          trend="+9%"
          trendColor="blue"
        />

        <StatsCard
          title="AI Requests"
          value={431}
          description="This month"
          icon={Brain}
          trend="+27%"
          trendColor="yellow"
        />

        <StatsCard
          title="Completion"
          value="91%"
          description="Overall progress"
          icon={Target}
          trend="+5%"
          trendColor="green"
        />

      </section>

      {/* Quick Actions */}

      <section className="space-y-5">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Jump into your most-used BuilderOS features.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <QuickActionCard
            title="New Project"
            description="Create and organize a new product."
            href="/projects/new"
            icon={FolderPlus}
          />

          <QuickActionCard
            title="AI Workspace"
            description="Research, plan and build with AI."
            href="/ai"
            icon={Brain}
          />

          <QuickActionCard
            title="Tasks"
            description="Track your work and deadlines."
            href="/tasks"
            icon={CheckSquare}
          />

          <QuickActionCard
            title="Roadmaps"
            description="Generate a complete product roadmap."
            href="/roadmaps"
            icon={Map}
          />

        </div>

      </section>

      {/* Recent Projects */}

      <section className="space-y-5">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Recent Projects
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Continue working on your latest products.
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <ProjectCard
            id="food-delivery"
            title="Food Delivery Platform"
            description="AI-powered food delivery application with customer, restaurant and rider dashboards."
            status="Building"
            progress={72}
            updatedAt="2 hours ago"
            members={4}
          />

          <ProjectCard
            id="builderos"
            title="BuilderOS"
            description="The operating system for product builders. Research, plan and build products from one workspace."
            status="Planning"
            progress={18}
            updatedAt="Today"
            members={2}
          />

        </div>

      </section>

      {/* Recent Activity */}

      <section className="mt-8">
        <RecentActivity />
      </section>

    </div>
  );
}