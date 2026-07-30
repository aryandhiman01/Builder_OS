import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{
    projectId: string;
  }>;
};

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

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user: { email: session.user.email },
      },
      include: {
        tasks: {
          orderBy: { updatedAt: "desc" },
        },
        researches: {
          orderBy: { createdAt: "desc" },
        },
        prds: {
          orderBy: { createdAt: "desc" },
        },
        roadmaps: {
          orderBy: { createdAt: "desc" },
        },
        architectures: {
          orderBy: { createdAt: "desc" },
        },
        documents: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 1. AI Asset Status & Token Analytics
    const researchesCount = project.researches.length;
    const prdsCount = project.prds.length;
    const roadmapsCount = project.roadmaps.length;
    const architecturesCount = project.architectures.length;
    const documentsCount = project.documents.length;

    const sumTokens = (items: { tokens?: number | null }[]) =>
      items.reduce((acc, curr) => acc + (curr.tokens || 0), 0);

    const sumGenTime = (items: { generationTime?: number | null }[]) =>
      items.reduce((acc, curr) => acc + (curr.generationTime || 0), 0);

    const resTokens = sumTokens(project.researches);
    const prdTokens = sumTokens(project.prds);
    const rmTokens = sumTokens(project.roadmaps);
    const archTokens = sumTokens(project.architectures);
    const docTokens = sumTokens(project.documents);

    const totalTokens = resTokens + prdTokens + rmTokens + archTokens + docTokens;
    const totalGenTime =
      sumGenTime(project.researches) +
      sumGenTime(project.prds) +
      sumGenTime(project.roadmaps) +
      sumGenTime(project.architectures) +
      sumGenTime(project.documents);

    const hasResearch = researchesCount > 0;
    const hasPRD = prdsCount > 0;
    const hasRoadmap = roadmapsCount > 0;
    const hasArchitecture = architecturesCount > 0;

    const aiMilestonesCompleted =
      (hasResearch ? 1 : 0) +
      (hasPRD ? 1 : 0) +
      (hasRoadmap ? 1 : 0) +
      (hasArchitecture ? 1 : 0);

    // 2. Tasks Status Breakdown
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(
      (t) => t.status === "completed" || t.status === "done"
    ).length;
    const inProgressTasks = project.tasks.filter(
      (t) => t.status === "in_progress" || t.status === "building"
    ).length;
    const todoTasks = totalTasks - completedTasks - inProgressTasks;

    const highPriorityCount = project.tasks.filter(t => t.priority === "high").length;
    const mediumPriorityCount = project.tasks.filter(t => t.priority === "medium").length;
    const lowPriorityCount = project.tasks.filter(t => t.priority === "low").length;

    // 3. Progress Calculation
    let progress = 0;
    const taskProgressPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    if (totalTasks > 0) {
      const taskRatio = completedTasks / totalTasks;
      const aiRatio = aiMilestonesCompleted / 4;
      progress = Math.round(aiRatio * 30 + taskRatio * 70);
    } else {
      progress = Math.round((aiMilestonesCompleted / 4) * 100);
    }

    let calculatedStatus: "Planning" | "Building" | "Completed" = "Planning";
    if (progress === 100) {
      calculatedStatus = "Completed";
    } else if (progress > 0 || totalTasks > 0) {
      calculatedStatus = "Building";
    }

    // Update project status in DB if calculated status changed
    if (project.status !== calculatedStatus) {
      await prisma.project.update({
        where: { id: project.id },
        data: { status: calculatedStatus },
      });
    }

    // 4. Graph Datasets
    const milestoneAnalytics = [
      { name: "Research", completion: hasResearch ? 100 : 0 },
      { name: "PRD", completion: hasPRD ? 100 : 0 },
      { name: "Roadmap", completion: hasRoadmap ? 100 : 0 },
      { name: "Architecture", completion: hasArchitecture ? 100 : 0 },
      { name: "Tasks Execution", completion: taskProgressPercentage },
    ];

    const taskStatusChart = [
      { name: "Completed", value: completedTasks, color: "#22C55E" },
      { name: "In Progress", value: inProgressTasks, color: "#38BDF8" },
      { name: "To Do", value: Math.max(0, todoTasks), color: "#F59E0B" },
    ];

    const aiDistributionChart = [
      { name: "Research", count: researchesCount, tokens: resTokens },
      { name: "PRD", count: prdsCount, tokens: prdTokens },
      { name: "Roadmap", count: roadmapsCount, tokens: rmTokens },
      { name: "Architecture", count: architecturesCount, tokens: archTokens },
      { name: "Docs", count: documentsCount, tokens: docTokens },
    ];

    // 5. Recent Activity Feed
    type ActivityItem = {
      id: string;
      title: string;
      description: string;
      time: string;
      timestamp: number;
      type: "project" | "research" | "prd" | "roadmap" | "architecture" | "task";
    };

    const activities: ActivityItem[] = [];

    activities.push({
      id: `proj-created-${project.id}`,
      title: "Project Workspace Created",
      description: `Created "${project.title}" workspace`,
      time: getRelativeTimeString(project.createdAt),
      timestamp: new Date(project.createdAt).getTime(),
      type: "project",
    });

    project.researches.forEach((r) => {
      activities.push({
        id: `res-${r.id}`,
        title: "AI Research Generated",
        description: r.title,
        time: getRelativeTimeString(r.createdAt),
        timestamp: new Date(r.createdAt).getTime(),
        type: "research",
      });
    });

    project.prds.forEach((prd) => {
      activities.push({
        id: `prd-${prd.id}`,
        title: "PRD Generated",
        description: prd.title,
        time: getRelativeTimeString(prd.createdAt),
        timestamp: new Date(prd.createdAt).getTime(),
        type: "prd",
      });
    });

    project.roadmaps.forEach((rm) => {
      activities.push({
        id: `rm-${rm.id}`,
        title: "Roadmap Generated",
        description: rm.title,
        time: getRelativeTimeString(rm.createdAt),
        timestamp: new Date(rm.createdAt).getTime(),
        type: "roadmap",
      });
    });

    project.architectures.forEach((arch) => {
      activities.push({
        id: `arch-${arch.id}`,
        title: "Architecture Generated",
        description: arch.title,
        time: getRelativeTimeString(arch.createdAt),
        timestamp: new Date(arch.createdAt).getTime(),
        type: "architecture",
      });
    });

    project.tasks.slice(0, 10).forEach((t) => {
      activities.push({
        id: `task-${t.id}`,
        title: t.status === "completed" || t.status === "done" ? "Task Completed" : "Task Created/Updated",
        description: t.title,
        time: getRelativeTimeString(t.updatedAt),
        timestamp: new Date(t.updatedAt).getTime(),
        iconType: "CheckCircle2",
        type: "task",
      } as any);
    });

    activities.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        status: calculatedStatus,
        category: project.category,
        color: project.color,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      progress,
      taskStats: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        todo: Math.max(0, todoTasks),
        remaining: totalTasks - completedTasks,
        highPriority: highPriorityCount,
        mediumPriority: mediumPriorityCount,
        lowPriority: lowPriorityCount,
      },
      aiStatus: {
        research: {
          generated: hasResearch,
          count: researchesCount,
          latestId: project.researches[0]?.id,
        },
        prd: {
          generated: hasPRD,
          count: prdsCount,
          latestId: project.prds[0]?.id,
        },
        roadmap: {
          generated: hasRoadmap,
          count: roadmapsCount,
          latestId: project.roadmaps[0]?.id,
        },
        architecture: {
          generated: hasArchitecture,
          count: architecturesCount,
          latestId: project.architectures[0]?.id,
        },
        documentsCount,
        milestonesCompleted: aiMilestonesCompleted,
        totalTokens,
        totalGenTime,
      },
      analytics: {
        milestoneAnalytics,
        taskStatusChart,
        aiDistributionChart,
      },
      recentActivity: activities.slice(0, 10),
    });
  } catch (error) {
    console.error("Error fetching project overview:", error);
    return NextResponse.json(
      { error: "Internal server error fetching project overview" },
      { status: 500 }
    );
  }
}
