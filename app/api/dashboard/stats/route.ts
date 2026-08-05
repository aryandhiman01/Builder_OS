import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Short 2s in-memory server cache per user to eliminate DB waterfall on rapid re-renders
const dashboardCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 2_000;

function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(date));
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check server memory cache for 0ms responses on rapid navigation
    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";
    const cached = dashboardCache.get(user.id);
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data);
    }

    // Single-pass parallel query execution to prevent DB waterfalls
    const [projects, aiConversationCountRaw] = await Promise.all([
      prisma.project.findMany({
        where: { userId: user.id },
        include: {
          tasks: { select: { id: true, title: true, status: true, updatedAt: true } },
          researches: { select: { id: true, title: true, createdAt: true } },
          prds: { select: { id: true, title: true, createdAt: true } },
          roadmaps: { select: { id: true, title: true, createdAt: true } },
          architectures: { select: { id: true, title: true, createdAt: true } },
          documents: { select: { id: true, title: true, createdAt: true } },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.$queryRaw<Array<{ count: bigint | number }>>`
        SELECT COUNT(*)::int as count FROM "AIConversation" WHERE "userId" = ${user.id}
      `,
    ]);

    const projectsCount = projects.length;
    const aiConversationsCount = Number(aiConversationCountRaw[0]?.count || 0);

    let totalTasksCount = 0;
    let completedTasksCount = 0;
    let totalProjectsProgressSum = 0;
    let totalResearchesCount = 0;
    let totalPrdsCount = 0;
    let totalRoadmapsCount = 0;
    let totalArchitecturesCount = 0;
    let totalDocumentsCount = 0;

    type ActivityItem = {
      id: string;
      title: string;
      description: string;
      time: string;
      timestamp: number;
      iconType: "FolderKanban" | "Brain" | "CheckCircle2" | "Sparkles" | "FileText" | "LayoutTemplate";
    };

    const activities: ActivityItem[] = [];

    const allMappedProjects = projects.map((p) => {
      const projTotalTasks = p.tasks.length;
      const projCompletedTasks = p.tasks.filter(
        (t) => t.status === "completed" || t.status === "done"
      ).length;

      totalTasksCount += projTotalTasks;
      completedTasksCount += projCompletedTasks;
      totalResearchesCount += p.researches.length;
      totalPrdsCount += p.prds.length;
      totalRoadmapsCount += p.roadmaps.length;
      totalArchitecturesCount += p.architectures.length;
      totalDocumentsCount += p.documents.length;

      const hasResearch = p.researches.length > 0;
      const hasPRD = p.prds.length > 0;
      const hasRoadmap = p.roadmaps.length > 0;
      const hasArchitecture = p.architectures.length > 0;
      const aiMilestones =
        (hasResearch ? 1 : 0) +
        (hasPRD ? 1 : 0) +
        (hasRoadmap ? 1 : 0) +
        (hasArchitecture ? 1 : 0);

      let progress = 0;
      if (projTotalTasks > 0) {
        const taskRatio = projCompletedTasks / projTotalTasks;
        const aiRatio = aiMilestones / 4;
        progress = Math.round(aiRatio * 30 + taskRatio * 70);
      } else {
        progress = Math.round((aiMilestones / 4) * 100);
      }

      totalProjectsProgressSum += progress;

      let validStatus: "Planning" | "Building" | "Completed" = "Planning";
      if (progress === 100) {
        validStatus = "Completed";
      } else if (progress > 0 || projTotalTasks > 0) {
        validStatus = "Building";
      }

      // Collect project activities
      activities.push({
        id: `proj-${p.id}`,
        title: "Created a new project",
        description: p.title,
        time: getRelativeTimeString(p.updatedAt),
        timestamp: new Date(p.updatedAt).getTime(),
        iconType: "FolderKanban",
      });

      // Collect research activities
      p.researches.forEach((r) => {
        activities.push({
          id: `res-${r.id}`,
          title: "Generated AI Research",
          description: `${r.title} (${p.title})`,
          time: getRelativeTimeString(r.createdAt),
          timestamp: new Date(r.createdAt).getTime(),
          iconType: "Sparkles",
        });
      });

      // Collect PRD activities
      p.prds.forEach((prd) => {
        activities.push({
          id: `prd-${prd.id}`,
          title: "Generated PRD",
          description: `${prd.title} (${p.title})`,
          time: getRelativeTimeString(prd.createdAt),
          timestamp: new Date(prd.createdAt).getTime(),
          iconType: "FileText",
        });
      });

      // Collect Roadmap activities
      p.roadmaps.forEach((rm) => {
        activities.push({
          id: `rm-${rm.id}`,
          title: "Generated Product Roadmap",
          description: `${rm.title} (${p.title})`,
          time: getRelativeTimeString(rm.createdAt),
          timestamp: new Date(rm.createdAt).getTime(),
          iconType: "LayoutTemplate",
        });
      });

      // Collect Architecture activities
      p.architectures.forEach((arch) => {
        activities.push({
          id: `arch-${arch.id}`,
          title: "Generated System Architecture",
          description: `${arch.title} (${p.title})`,
          time: getRelativeTimeString(arch.createdAt),
          timestamp: new Date(arch.createdAt).getTime(),
          iconType: "Brain",
        });
      });

      // Collect Task activities
      p.tasks.forEach((t) => {
        activities.push({
          id: `task-${t.id}`,
          title: t.status === "completed" || t.status === "done" ? "Completed a task" : "Updated a task",
          description: `${t.title} (${p.title})`,
          time: getRelativeTimeString(t.updatedAt),
          timestamp: new Date(t.updatedAt).getTime(),
          iconType: "CheckCircle2",
        });
      });

      return {
        id: p.id,
        title: p.title,
        description: p.description || "No description provided.",
        status: validStatus,
        progress,
        updatedAt: getRelativeTimeString(p.updatedAt),
        members: 1,
        color: p.color || "#38bdf8",
      };
    });

    const remainingTasksCount = totalTasksCount - completedTasksCount;
    const completionPercentage =
      projectsCount > 0
        ? Math.round(totalProjectsProgressSum / projectsCount)
        : 0;

    const aiRequestsCount =
      totalResearchesCount +
      totalPrdsCount +
      totalRoadmapsCount +
      totalArchitecturesCount +
      totalDocumentsCount +
      aiConversationsCount;

    activities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivities = activities.slice(0, 6);
    const recentProjects = allMappedProjects.slice(0, 4);

    const payload = {
      user: {
        name: user.name,
        email: user.email,
      },
      stats: {
        projectsCount,
        tasksCount: remainingTasksCount,
        totalTasksCount,
        aiRequestsCount,
        completionPercentage,
      },
      recentProjects,
      recentActivities,
    };

    // Save to short 2s memory cache
    dashboardCache.set(user.id, { data: payload, timestamp: Date.now() });

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching dashboard stats" },
      { status: 500 }
    );
  }
}
