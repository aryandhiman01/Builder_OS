import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{
    roadmapId: string;
  }>;
}

// GET /api/roadmaps/:id - Fetch single roadmap details with milestones & steps
export async function GET(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roadmapId } = await params;

    const roadmap = await prisma.roadmap.findFirst({
      where: {
        id: roadmapId,
        OR: [
          { user: { email: session.user.email } },
          { project: { user: { email: session.user.email } } },
          { project: { members: { some: { user: { email: session.user.email } } } } },
        ],
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            color: true,
          },
        },
        milestones: {
          orderBy: { order: "asc" },
          include: {
            steps: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Calculate progress
    let totalSteps = 0;
    let completedSteps = 0;
    roadmap.milestones.forEach((m) => {
      totalSteps += m.steps.length;
      completedSteps += m.steps.filter((s) => s.completed).length;
    });

    const progress =
      totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : roadmap.progress;

    return NextResponse.json({
      roadmap: {
        ...roadmap,
        progress,
        totalSteps,
        completedSteps,
      },
    });
  } catch (error) {
    console.error("[GET_ROADMAP_BY_ID]", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmap" },
      { status: 500 }
    );
  }
}

// PATCH /api/roadmaps/:id - Update roadmap metadata or step state
export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roadmapId } = await params;
    const body = await req.json();

    const existing = await prisma.roadmap.findFirst({
      where: {
        id: roadmapId,
        OR: [
          { user: { email: session.user.email } },
          { project: { user: { email: session.user.email } } },
          { project: { members: { some: { user: { email: session.user.email } } } } },
        ],
      },
      include: {
        milestones: {
          include: {
            steps: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Single step completion toggle action
    if (body.toggleStepId !== undefined) {
      await prisma.roadmapStep.update({
        where: { id: body.toggleStepId },
        data: { completed: Boolean(body.completed) },
      });

      // Recalculate progress across all steps
      const refreshedMilestones = await prisma.roadmapMilestone.findMany({
        where: { roadmapId },
        include: { steps: true },
      });

      let totalSteps = 0;
      let completedSteps = 0;
      refreshedMilestones.forEach((m) => {
        totalSteps += m.steps.length;
        completedSteps += m.steps.filter((s) => s.completed).length;
      });

      const newProgress =
        totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
      
      const newStatus =
        newProgress === 100
          ? "COMPLETED"
          : existing.status === "ARCHIVED"
          ? "ARCHIVED"
          : "PLANNING";

      const updatedRoadmap = await prisma.roadmap.update({
        where: { id: roadmapId },
        data: {
          progress: newProgress,
          status: newStatus,
        },
        include: {
          milestones: {
            orderBy: { order: "asc" },
            include: {
              steps: { orderBy: { order: "asc" } },
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        roadmap: updatedRoadmap,
        progress: newProgress,
      });
    }

    // Bulk/Metadata update
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.resources !== undefined)
      updateData.resources = typeof body.resources === "string" ? body.resources : JSON.stringify(body.resources);

    const updatedRoadmap = await prisma.roadmap.update({
      where: { id: roadmapId },
      data: updateData,
      include: {
        milestones: {
          orderBy: { order: "asc" },
          include: { steps: { orderBy: { order: "asc" } } },
        },
      },
    });

    return NextResponse.json({ success: true, roadmap: updatedRoadmap });
  } catch (error) {
    console.error("[PATCH_ROADMAP]", error);
    return NextResponse.json(
      { error: "Failed to update roadmap" },
      { status: 500 }
    );
  }
}

// DELETE /api/roadmaps/:id - Delete roadmap
export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roadmapId } = await params;

    const existing = await prisma.roadmap.findFirst({
      where: {
        id: roadmapId,
        OR: [
          { user: { email: session.user.email } },
          { project: { user: { email: session.user.email } } },
          { project: { members: { some: { user: { email: session.user.email } } } } },
        ],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    await prisma.roadmap.delete({
      where: { id: roadmapId },
    });

    return NextResponse.json({ success: true, message: "Roadmap deleted" });
  } catch (error) {
    console.error("[DELETE_ROADMAP]", error);
    return NextResponse.json(
      { error: "Failed to delete roadmap" },
      { status: 500 }
    );
  }
}
