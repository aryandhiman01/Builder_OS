import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Fetch User Projects with Tasks
    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      include: {
        tasks: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const projectsCount = projects.length;

    // 2. Compute Tasks & Completion Metrics
    let totalTasksCount = 0;
    let completedTasksCount = 0;

    projects.forEach((proj) => {
      totalTasksCount += proj.tasks.length;
      completedTasksCount += proj.tasks.filter(
        (t) => t.status === "completed" || t.status === "done"
      ).length;
    });

    const remainingTasksCount = totalTasksCount - completedTasksCount;
    const completionPercentage =
      totalTasksCount > 0
        ? Math.round((completedTasksCount / totalTasksCount) * 100)
        : 0;

    // 3. Compute AI Requests Count
    const projectIds = projects.map((p) => p.id);

    const [
      researchesCount,
      prdsCount,
      roadmapsCount,
      architecturesCount,
      documentsCount,
    ] = await Promise.all([
      prisma.research.count({ where: { projectId: { in: projectIds } } }),
      prisma.pRD.count({ where: { projectId: { in: projectIds } } }),
      prisma.roadmap.count({ where: { projectId: { in: projectIds } } }),
      prisma.architecture.count({ where: { projectId: { in: projectIds } } }),
      prisma.document.count({ where: { projectId: { in: projectIds } } }),
    ]);

    const aiRequestsCount =
      researchesCount +
      prdsCount +
      roadmapsCount +
      architecturesCount +
      documentsCount;

    // 4. Map Recent Projects (Top 4)
    const recentProjects = projects.slice(0, 4).map((p) => {
      const projTotalTasks = p.tasks.length;
      const projCompletedTasks = p.tasks.filter(
        (t) => t.status === "completed" || t.status === "done"
      ).length;
      const progress =
        projTotalTasks > 0
          ? Math.round((projCompletedTasks / projTotalTasks) * 100)
          : 0;

      let validStatus: "Planning" | "Building" | "Completed" = "Planning";
      if (p.status === "Building" || p.status === "Completed") {
        validStatus = p.status;
      } else if (progress === 100 && projTotalTasks > 0) {
        validStatus = "Completed";
      } else if (progress > 0) {
        validStatus = "Building";
      }

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

    // 5. Gather Recent Activities
    const [recentProjectsRaw, recentResearches, recentPrds, recentRoadmaps, recentArchitectures, recentTasks] =
      await Promise.all([
        prisma.project.findMany({
          where: { userId: user.id },
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, title: true, createdAt: true },
        }),
        prisma.research.findMany({
          where: { projectId: { in: projectIds } },
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, title: true, createdAt: true, project: { select: { title: true } } },
        }),
        prisma.pRD.findMany({
          where: { projectId: { in: projectIds } },
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, title: true, createdAt: true, project: { select: { title: true } } },
        }),
        prisma.roadmap.findMany({
          where: { projectId: { in: projectIds } },
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, title: true, createdAt: true, project: { select: { title: true } } },
        }),
        prisma.architecture.findMany({
          where: { projectId: { in: projectIds } },
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, title: true, createdAt: true, project: { select: { title: true } } },
        }),
        prisma.task.findMany({
          where: { projectId: { in: projectIds } },
          take: 5,
          orderBy: { updatedAt: "desc" },
          select: { id: true, title: true, status: true, updatedAt: true, project: { select: { title: true } } },
        }),
      ]);

    type ActivityItem = {
      id: string;
      title: string;
      description: string;
      time: string;
      timestamp: number;
      iconType: "FolderKanban" | "Brain" | "CheckCircle2" | "Sparkles" | "FileText" | "LayoutTemplate";
    };

    const activities: ActivityItem[] = [];

    recentProjectsRaw.forEach((p: { id: string; title: string; createdAt: Date }) => {
      activities.push({
        id: `proj-${p.id}`,
        title: "Created a new project",
        description: p.title,
        time: getRelativeTimeString(p.createdAt),
        timestamp: new Date(p.createdAt).getTime(),
        iconType: "FolderKanban",
      });
    });

    recentResearches.forEach((r: { id: string; title: string; createdAt: Date; project: { title: string } }) => {
      activities.push({
        id: `res-${r.id}`,
        title: "Generated AI Research",
        description: `${r.title} (${r.project.title})`,
        time: getRelativeTimeString(r.createdAt),
        timestamp: new Date(r.createdAt).getTime(),
        iconType: "Sparkles",
      });
    });

    recentPrds.forEach((prd: { id: string; title: string; createdAt: Date; project: { title: string } }) => {
      activities.push({
        id: `prd-${prd.id}`,
        title: "Generated PRD",
        description: `${prd.title} (${prd.project.title})`,
        time: getRelativeTimeString(prd.createdAt),
        timestamp: new Date(prd.createdAt).getTime(),
        iconType: "FileText",
      });
    });

    recentRoadmaps.forEach((rm: { id: string; title: string; createdAt: Date; project: { title: string } }) => {
      activities.push({
        id: `rm-${rm.id}`,
        title: "Generated Product Roadmap",
        description: `${rm.title} (${rm.project.title})`,
        time: getRelativeTimeString(rm.createdAt),
        timestamp: new Date(rm.createdAt).getTime(),
        iconType: "LayoutTemplate",
      });
    });

    recentArchitectures.forEach((arch: { id: string; title: string; createdAt: Date; project: { title: string } }) => {
      activities.push({
        id: `arch-${arch.id}`,
        title: "Generated System Architecture",
        description: `${arch.title} (${arch.project.title})`,
        time: getRelativeTimeString(arch.createdAt),
        timestamp: new Date(arch.createdAt).getTime(),
        iconType: "Brain",
      });
    });

    recentTasks.forEach((t: { id: string; title: string; status: string; updatedAt: Date; project: { title: string } }) => {
      activities.push({
        id: `task-${t.id}`,
        title: t.status === "completed" || t.status === "done" ? "Completed a task" : "Updated a task",
        description: `${t.title} (${t.project.title})`,
        time: getRelativeTimeString(t.updatedAt),
        timestamp: new Date(t.updatedAt).getTime(),
        iconType: "CheckCircle2",
      });
    });

    activities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivities = activities.slice(0, 6);

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching dashboard stats" },
      { status: 500 }
    );
  }
}
