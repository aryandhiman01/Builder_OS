import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Server-side RAM cache
const analyticsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 0; // Live real-time calculations from PostgreSQL

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check server RAM cache (served in 0ms without hitting DB)
    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";
    const cached = analyticsCache.get(user.id);
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data);
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      include: {
        tasks: true,
        researches: { select: { id: true, createdAt: true, tokens: true, generationTime: true } },
        prds: { select: { id: true, createdAt: true, tokens: true, generationTime: true } },
        roadmaps: { select: { id: true, createdAt: true, tokens: true, generationTime: true } },
        architectures: { select: { id: true, createdAt: true, tokens: true, generationTime: true } },
        documents: { select: { id: true, createdAt: true, tokens: true, generationTime: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    const projectIds = projects.map((p) => p.id);

    const aiConversations = await prisma.aIConversation.findMany({
      where: { userId: user.id },
      select: { id: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "asc" },
    });

    const totalProjects = projects.length;
    const allTasks = projects.flatMap((p) => p.tasks);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.status === "completed" || t.status === "done").length;
    const totalResearches = projects.reduce((s, p) => s + p.researches.length, 0);
    const totalPrds = projects.reduce((s, p) => s + p.prds.length, 0);
    const totalRoadmaps = projects.reduce((s, p) => s + p.roadmaps.length, 0);
    const totalArchitectures = projects.reduce((s, p) => s + p.architectures.length, 0);
    const totalDocuments = projects.reduce((s, p) => s + p.documents.length, 0);
    const totalAiConversations = aiConversations.length;
    const totalAiRequests = totalResearches + totalPrds + totalRoadmaps + totalArchitectures + totalDocuments + totalAiConversations;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const allAIItems = projects.flatMap((p) => [
      ...p.researches, ...p.prds, ...p.roadmaps, ...p.architectures, ...p.documents,
    ]);
    const totalTokensUsed = allAIItems.reduce((s, a) => s + (a.tokens || 0), 0);
    const avgGenTime = allAIItems.length > 0
      ? Math.round(allAIItems.reduce((s, a) => s + (a.generationTime || 0), 0) / allAIItems.length)
      : 0;

    // Monthly calculations - last 12 months (Both Cumulative & Specific Monthly Additions)
    const now = new Date();
    const cumulativeGrowth = [];
    const monthlyAdditions = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

      // 1. Cumulative totals up to monthEnd
      const cumProjects = projects.filter((p) => new Date(p.createdAt) <= monthEnd).length;
      const cumTasks = allTasks.filter((t) => new Date(t.createdAt) <= monthEnd).length;
      let cumAI = 0;
      projects.forEach((p) => {
        const allAI = [...p.researches, ...p.prds, ...p.roadmaps, ...p.architectures, ...p.documents];
        cumAI += allAI.filter((a) => new Date(a.createdAt) <= monthEnd).length;
      });
      cumulativeGrowth.push({ month: label, projects: cumProjects, tasks: cumTasks, aiRequests: cumAI });

      // 2. Specific new additions created in this exact month
      const newProjects = projects.filter((p) => { const c = new Date(p.createdAt); return c >= d && c <= monthEnd; }).length;
      const newTasks = allTasks.filter((t) => { const c = new Date(t.createdAt); return c >= d && c <= monthEnd; }).length;
      let newAI = 0;
      projects.forEach((p) => {
        const allAI = [...p.researches, ...p.prds, ...p.roadmaps, ...p.architectures, ...p.documents];
        newAI += allAI.filter((a) => { const ac = new Date(a.createdAt); return ac >= d && ac <= monthEnd; }).length;
      });
      monthlyAdditions.push({ month: label, projects: newProjects, tasks: newTasks, aiRequests: newAI });
    }

    // Task distributions
    const tasksByStatus: Record<string, number> = {};
    allTasks.forEach((t) => { const s = t.status || "todo"; tasksByStatus[s] = (tasksByStatus[s] || 0) + 1; });
    const taskStatusData = Object.entries(tasksByStatus).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1), count,
    }));

    const tasksByPriority: Record<string, number> = {};
    allTasks.forEach((t) => { const p = t.priority || "medium"; tasksByPriority[p] = (tasksByPriority[p] || 0) + 1; });
    const taskPriorityData = Object.entries(tasksByPriority).map(([priority, count]) => ({
      priority: priority.charAt(0).toUpperCase() + priority.slice(1), count,
    }));

    const aiBreakdown = [
      { type: "Research", count: totalResearches, color: "#8B5CF6" },
      { type: "PRD", count: totalPrds, color: "#FF6B35" },
      { type: "Roadmap", count: totalRoadmaps, color: "#38BDF8" },
      { type: "Architecture", count: totalArchitectures, color: "#34D399" },
      { type: "Document", count: totalDocuments, color: "#F59E0B" },
      { type: "AI Chat", count: totalAiConversations, color: "#EC4899" },
    ];

    const projectsByCategory: Record<string, number> = {};
    projects.forEach((p) => { const cat = p.category || "Other"; projectsByCategory[cat] = (projectsByCategory[cat] || 0) + 1; });
    const projectCategoryData = Object.entries(projectsByCategory).map(([category, count]) => ({ category, count }));

    const projectProgressData = projects.slice(0, 8).map((p) => {
      const projTasks = p.tasks.length;
      const projDone = p.tasks.filter((t) => t.status === "completed" || t.status === "done").length;
      const aiMilestones = (p.researches.length > 0 ? 1 : 0) + (p.prds.length > 0 ? 1 : 0) + (p.roadmaps.length > 0 ? 1 : 0) + (p.architectures.length > 0 ? 1 : 0);
      let progress = projTasks > 0 ? Math.round((projDone / projTasks) * 70 + (aiMilestones / 4) * 30) : Math.round((aiMilestones / 4) * 100);
      return { project: p.title.length > 18 ? p.title.slice(0, 18) + "..." : p.title, progress };
    });

    // Daily activity last 14 days
    const dailyActivity = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      let dayActions = 0;
      dayActions += projects.filter((p) => { const c = new Date(p.createdAt); return c >= d && c <= dayEnd; }).length;
      dayActions += allTasks.filter((t) => { const u = new Date(t.updatedAt); return u >= d && u <= dayEnd; }).length;
      projects.forEach((p) => {
        const allAI = [...p.researches, ...p.prds, ...p.roadmaps, ...p.architectures, ...p.documents];
        dayActions += allAI.filter((a) => { const ac = new Date(a.createdAt); return ac >= d && ac <= dayEnd; }).length;
      });
      dayActions += aiConversations.filter((c) => { const uc = new Date(c.updatedAt); return uc >= d && uc <= dayEnd; }).length;

      dailyActivity.push({
        day: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        actions: dayActions,
      });
    }

    // Weekly task completion last 8 weeks
    const weeklyTaskData = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i * 7 - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekCompleted = allTasks.filter((t) => {
        if (t.status !== "completed" && t.status !== "done") return false;
        const u = new Date(t.updatedAt);
        return u >= weekStart && u <= weekEnd;
      }).length;

      const weekCreated = allTasks.filter((t) => {
        const c = new Date(t.createdAt);
        return c >= weekStart && c <= weekEnd;
      }).length;

      weeklyTaskData.push({ week: `W${8 - i}`, completed: weekCompleted, created: weekCreated });
    }

    // Suppress unused variable warning
    void projectIds;

    const payload = {
      fetchedAt: new Date().toISOString(),
      kpis: {
        totalProjects, totalTasks, completedTasks,
        pendingTasks: totalTasks - completedTasks,
        taskCompletionRate, totalAiRequests, totalAiConversations,
        totalTokensUsed, avgGenTime, totalResearches, totalPrds,
        totalRoadmaps, totalArchitectures, totalDocuments,
      },
      charts: {
        monthlyGrowth: cumulativeGrowth,
        monthlyAdditions: monthlyAdditions,
        taskStatusDistribution: taskStatusData,
        taskPriorityDistribution: taskPriorityData,
        aiBreakdown,
        projectCategoryData,
        projectProgressData,
        dailyActivity,
        weeklyTaskCompletion: weeklyTaskData,
      },
    };

    analyticsCache.set(user.id, { data: payload, timestamp: Date.now() });

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
