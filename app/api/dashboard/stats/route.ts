import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Short 3s in-memory server cache per user to eliminate DB pool exhaustion on rapid re-renders
const dashboardCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 3_000;

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

    // Check server memory cache for 0ms responses on rapid navigation (guard against connection pool exhaustion)
    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";
    const cached = dashboardCache.get(user.id);
    const timeSinceCache = cached ? Date.now() - cached.timestamp : Infinity;

    // Return cached data if less than 3s old OR if rapid re-fetch within 1s
    if (cached && (!forceRefresh ? timeSinceCache < CACHE_TTL_MS : timeSinceCache < 1_000)) {
      return NextResponse.json(cached.data);
    }

    // Optimized sequential query execution to prevent DB connection pool exhaustion (P2024)
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { userId: user.id },
          { members: { some: { userId: user.id } } },
        ],
      },
      include: {
        tasks: { select: { id: true, title: true, description: true, tags: true, status: true, updatedAt: true }, take: 15 },
        researches: { select: { id: true, title: true, createdAt: true }, take: 10, orderBy: { createdAt: "desc" } },
        prds: { select: { id: true, title: true, createdAt: true }, take: 10, orderBy: { createdAt: "desc" } },
        roadmaps: { select: { id: true, title: true, createdAt: true }, take: 10, orderBy: { createdAt: "desc" } },
        architectures: { select: { id: true, title: true, createdAt: true }, take: 10, orderBy: { createdAt: "desc" } },
        documents: { select: { id: true, title: true, createdAt: true }, take: 10, orderBy: { createdAt: "desc" } },
      },
      orderBy: { updatedAt: "desc" },
      take: 15,
    });

    const aiConversations = await prisma.aIConversation.findMany({
      where: { userId: user.id },
      select: { id: true, title: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });


    const projectsCount = projects.length;
    const aiConversationsCount = aiConversations.length;

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
      category: "ai" | "project" | "task";
      iconType: "FolderKanban" | "Brain" | "CheckCircle2" | "Sparkles" | "FileText" | "LayoutTemplate";
    };

    const activities: ActivityItem[] = [];

    // Collect AI Conversations
    aiConversations.forEach((conv) => {
      activities.push({
        id: `conv-${conv.id}`,
        title: "AI Chat Session",
        description: conv.title || "Interactive AI workspace session",
        time: getRelativeTimeString(conv.updatedAt),
        timestamp: new Date(conv.updatedAt).getTime(),
        category: "ai",
        iconType: "Brain",
      });
    });

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

      // Collect project activities (Use createdAt for project creation timestamp)
      activities.push({
        id: `proj-${p.id}`,
        title: "Created a new project",
        description: p.title,
        time: getRelativeTimeString(p.createdAt),
        timestamp: new Date(p.createdAt).getTime(),
        category: "project",
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
          category: "ai",
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
          category: "ai",
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
          category: "ai",
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
          category: "ai",
          iconType: "Brain",
        });
      });

      // Collect Document activities
      p.documents.forEach((doc) => {
        activities.push({
          id: `doc-${doc.id}`,
          title: "Generated AI Document",
          description: `${doc.title} (${p.title})`,
          time: getRelativeTimeString(doc.createdAt),
          timestamp: new Date(doc.createdAt).getTime(),
          category: "ai",
          iconType: "FileText",
        });
      });

      // Collect Task activities
      p.tasks.forEach((t) => {
        const isAIGenerated = t.tags?.includes("AI") || t.description?.toLowerCase().includes("ai");
        activities.push({
          id: `task-${t.id}`,
          title: isAIGenerated
            ? "AI Generated Task"
            : t.status === "completed" || t.status === "done"
            ? "Completed a task"
            : "Updated a task",
          description: `${t.title} (${p.title})`,
          time: getRelativeTimeString(t.updatedAt),
          timestamp: new Date(t.updatedAt).getTime(),
          category: isAIGenerated ? "ai" : "task",
          iconType: isAIGenerated ? "Sparkles" : "CheckCircle2",
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

    const userRoadmaps = await prisma.roadmap.findMany({
      where: {
        OR: [
          { userId: user.id },
          { project: { userId: user.id } },
          { project: { members: { some: { userId: user.id } } } },
        ],
      },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        progress: true,
        projectId: true,
        updatedAt: true,
        milestones: {
          select: {
            steps: { select: { completed: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 4,
    });

    const recentRoadmaps = userRoadmaps.map((rm) => {
      let tSteps = 0;
      let cSteps = 0;
      rm.milestones.forEach((m) => {
        tSteps += m.steps.length;
        cSteps += m.steps.filter((s) => s.completed).length;
      });
      const progress = tSteps > 0 ? Math.round((cSteps / tSteps) * 100) : rm.progress;

      return {
        id: rm.id,
        title: rm.title,
        type: rm.type === "STANDALONE" && !rm.projectId ? "STANDALONE" : "PROJECT",
        status: rm.status,
        progress,
        projectId: rm.projectId,
        updatedAt: getRelativeTimeString(rm.updatedAt),
      };
    });

    activities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivities = activities.slice(0, 50);

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
      recentRoadmaps,
      recentActivities,
    };

    // Save to short 3s memory cache
    dashboardCache.set(user.id, { data: payload, timestamp: Date.now() });

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Dashboard stats error:", error);

    // Fallback to cached payload on connection pool timeout or database pressure
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true },
        });
        if (user) {
          const cached = dashboardCache.get(user.id);
          if (cached?.data) {
            return NextResponse.json(cached.data);
          }
        }
      }
    } catch {
      // ignore fallback error
    }

    return NextResponse.json(
      { error: "Internal server error fetching dashboard stats" },
      { status: 500 }
    );
  }
}

