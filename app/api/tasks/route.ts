import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/tasks — All tasks for current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const priority = searchParams.get("priority");
    const status = searchParams.get("status");

    const tasks = await prisma.task.findMany({
      where: {
        project: {
          OR: [
            { user: { email: session.user.email } },
            { members: { some: { user: { email: session.user.email } } } },
          ],
        },
        ...(projectId ? { projectId } : {}),
        ...(priority ? { priority } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        project: {
          select: { id: true, title: true, color: true },
        },
      },
      orderBy: [{ dueDate: "asc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("[GET_TASKS]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/tasks — Create task (projectId required)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, priority, status, dueDate, estimatedHours, tags, subtasks, projectId } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!projectId) {
      return NextResponse.json({ error: "Project is required" }, { status: 400 });
    }

    // Verify user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { user: { email: session.user.email } },
          { members: { some: { user: { email: session.user.email } } } },
        ],
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get current max order for this project
    const maxOrderTask = await prisma.task.findFirst({
      where: { projectId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description || null,
        priority: priority || "medium",
        status: status || "todo",
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        tags: tags ? JSON.stringify(tags) : null,
        subtasks: subtasks ? JSON.stringify(subtasks) : null,
        order: (maxOrderTask?.order ?? -1) + 1,
        projectId,
      },
      include: {
        project: {
          select: { id: true, title: true, color: true },
        },
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("[CREATE_TASK]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
