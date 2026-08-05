import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/tasks/today
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const tasks = await prisma.task.findMany({
      where: {
        project: {
          OR: [
            { user: { email: session.user.email } },
            { members: { some: { user: { email: session.user.email } } } },
          ],
        },
        dueDate: { gte: todayStart, lt: todayEnd },
      },
      include: {
        project: { select: { id: true, title: true, color: true } },
      },
      orderBy: [{ priority: "desc" }, { order: "asc" }],
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("[TASKS_TODAY]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
