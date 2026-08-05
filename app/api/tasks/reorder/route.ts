import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/tasks/reorder — Global kanban reorder
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tasks } = body as { tasks: { id: string; status: string; order: number }[] };

    if (!Array.isArray(tasks)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Batch update all tasks
    await Promise.all(
      tasks.map((t) =>
        prisma.task.updateMany({
          where: {
            id: t.id,
            project: {
              OR: [
                { user: { email: session.user.email! } },
                { members: { some: { user: { email: session.user.email! } } } },
              ],
            },
          },
          data: { status: t.status, order: t.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TASKS_REORDER]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
