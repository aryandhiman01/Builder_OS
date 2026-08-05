import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/tasks/stats
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

    const baseWhere = {
      project: {
        OR: [
          { user: { email: session.user.email } },
          { members: { some: { user: { email: session.user.email } } } },
        ],
      },
    };

    const [totalToday, inProgress, completed, overdue, activeTasks] = await Promise.all([
      // Today's / Active tasks (created today, due today, or in-progress)
      prisma.task.count({
        where: {
          ...baseWhere,
          status: { not: "completed" },
          OR: [
            { dueDate: { gte: todayStart, lt: todayEnd } },
            { createdAt: { gte: todayStart, lt: todayEnd } },
            { status: "in-progress" },
          ],
        },
      }),
      // In Progress count
      prisma.task.count({
        where: { ...baseWhere, status: "in-progress" },
      }),
      // Completed count
      prisma.task.count({
        where: { ...baseWhere, status: "completed" },
      }),
      // Overdue count (due before today & not completed)
      prisma.task.count({
        where: {
          ...baseWhere,
          dueDate: { lt: todayStart },
          status: { not: "completed" },
        },
      }),
      // Active incomplete tasks for focus hours sum
      prisma.task.findMany({
        where: {
          ...baseWhere,
          status: { not: "completed" },
        },
        select: { estimatedHours: true },
      }),
    ]);

    const totalFocusHours = activeTasks
      .filter((t) => t.estimatedHours)
      .reduce((sum, t) => sum + (t.estimatedHours ?? 0), 0);

    const highPriorityToday = await prisma.task.count({
      where: {
        ...baseWhere,
        status: { not: "completed" },
        priority: "high",
        OR: [
          { dueDate: { gte: todayStart, lt: todayEnd } },
          { createdAt: { gte: todayStart, lt: todayEnd } },
        ],
      },
    });

    return NextResponse.json({
      today: totalToday,
      inProgress,
      completed,
      overdue,
      highPriorityToday,
      totalFocusHours: Math.round(totalFocusHours * 10) / 10,
    });
  } catch (error) {
    console.error("[TASK_STATS]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
