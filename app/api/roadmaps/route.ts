import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/roadmaps - Get all roadmaps for the logged in user
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

    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get("type"); // STANDALONE | PROJECT
    const statusFilter = searchParams.get("status"); // PLANNING | COMPLETED | ARCHIVED
    const search = searchParams.get("search");

    const userCondition = {
      OR: [
        { userId: user.id },
        { project: { userId: user.id } },
        { project: { members: { some: { userId: user.id } } } },
      ],
    };

    const conditions: any[] = [userCondition];

    if (typeFilter === "PROJECT") {
      conditions.push({
        OR: [{ type: "PROJECT" }, { projectId: { not: null } }],
      });
    } else if (typeFilter === "STANDALONE") {
      conditions.push({
        type: "STANDALONE",
        projectId: null,
      });
    }

    if (statusFilter && statusFilter !== "ALL") {
      conditions.push({ status: statusFilter });
    }

    if (search) {
      conditions.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    const roadmaps = await prisma.roadmap.findMany({
      where: { AND: conditions },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            color: true,
          },
        },
        milestones: {
          select: {
            id: true,
            title: true,
            steps: {
              select: {
                id: true,
                completed: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Format metrics per roadmap
    const formattedRoadmaps = roadmaps.map((rm) => {
      let milestoneCount = rm.milestones.length;
      let totalSteps = 0;
      let completedSteps = 0;

      if (milestoneCount > 0) {
        rm.milestones.forEach((m) => {
          totalSteps += m.steps.length;
          completedSteps += m.steps.filter((s) => s.completed).length;
        });
      } else if (rm.content) {
        const phaseMatches = rm.content.match(/(Phase|Sprint|Milestone)\s+\d+[:\s—–-]/gi);
        if (phaseMatches && phaseMatches.length > 0) {
          milestoneCount = new Set(phaseMatches.map((s) => s.trim().toLowerCase())).size;
        } else {
          const sectionHeadings = rm.content.match(/^##\s+.+/gm);
          milestoneCount = sectionHeadings ? Math.max(1, sectionHeadings.length) : 1;
        }
      }

      const calculatedProgress =
        totalSteps > 0
          ? Math.round((completedSteps / totalSteps) * 100)
          : rm.progress;

      let duration = rm.estimatedDuration;
      if (!duration && rm.content) {
        const durationMatch = rm.content.match(/(Duration|Timeline|Estimated Duration):\s*([^\n]+)/i);
        if (durationMatch && durationMatch[2]) {
          duration = durationMatch[2].replace(/[\*\_\`]/g, "").trim();
        }
      }

      const displayType = rm.type === "STANDALONE" && !rm.projectId ? "STANDALONE" : "PROJECT";
      const displayDescription = rm.description || rm.prompt || null;

      return {
        id: rm.id,
        title: rm.title,
        description: displayDescription,
        type: displayType,
        status: rm.status,
        progress: calculatedProgress,
        estimatedDuration: duration,
        createdAt: rm.createdAt,
        updatedAt: rm.updatedAt,
        projectId: rm.projectId,
        projectTitle: rm.project?.title ?? null,
        projectColor: rm.project?.color ?? null,
        milestonesCount: Math.max(1, milestoneCount),
        stepsCount: totalSteps,
        completedStepsCount: completedSteps,
      };
    });

    return NextResponse.json({ roadmaps: formattedRoadmaps });
  } catch (error) {
    console.error("[GET_ROADMAPS]", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmaps" },
      { status: 500 }
    );
  }
}

// POST /api/roadmaps - Create a manual roadmap
export async function POST(req: Request) {
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

    const { title, description, type, projectId, milestones } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Roadmap title is required." },
        { status: 400 }
      );
    }

    const roadmapType = type === "PROJECT" && projectId ? "PROJECT" : "STANDALONE";

    const roadmap = await prisma.roadmap.create({
      data: {
        title,
        description: description || null,
        type: roadmapType,
        userId: user.id,
        projectId: roadmapType === "PROJECT" ? projectId : null,
        status: "PLANNING",
        progress: 0,
        milestones: milestones
          ? {
              create: milestones.map((m: any, mIdx: number) => ({
                title: m.title,
                description: m.description || null,
                order: mIdx,
                steps: m.steps
                  ? {
                      create: m.steps.map((s: any, sIdx: number) => ({
                        title: typeof s === "string" ? s : s.title,
                        description: typeof s === "object" ? s.description : null,
                        estimatedHours: typeof s === "object" ? s.estimatedHours : 2,
                        order: sIdx,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        milestones: {
          include: {
            steps: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, roadmap }, { status: 201 });
  } catch (error) {
    console.error("[POST_ROADMAP]", error);
    return NextResponse.json(
      { error: "Failed to create roadmap" },
      { status: 500 }
    );
  }
}
