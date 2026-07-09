import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { projectId } = await params;

    // Check project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user: {
          email: session.user.email,
        },
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          error: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    const body = await req.json();
    const { tasks } = body; // Array of { id: string, status: string, order: number }

    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        {
          error: "Invalid payload: tasks must be an array",
        },
        {
          status: 400,
        }
      );
    }

    // Update status and order for each task in a database transaction
    await prisma.$transaction(
      tasks.map((taskItem) =>
        prisma.task.update({
          where: {
            id: taskItem.id,
            projectId: projectId, // Security constraint to ensure task belongs to the project
          },
          data: {
            status: taskItem.status,
            order: taskItem.order,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("[REORDER_TASKS]", error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
