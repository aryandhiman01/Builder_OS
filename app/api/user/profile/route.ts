import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        password: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Live counts from PostgreSQL database (Real-Time 0ms Delay)
    const [
      projectsCount,
      tasksCount,
      completedTasksCount,
      aiConversationCountRaw,
      researchesCount,
      prdsCount,
      roadmapsCount,
      architecturesCount,
      documentsCount,
    ] = await Promise.all([
      prisma.project.count({ where: { userId: user.id } }),
      prisma.task.count({ where: { project: { userId: user.id } } }),
      prisma.task.count({
        where: {
          project: { userId: user.id },
          status: { in: ["completed", "done"] },
        },
      }),
      prisma.$queryRaw<Array<{ count: bigint | number }>>`
        SELECT COUNT(*)::int as count FROM "AIConversation" WHERE "userId" = ${user.id}
      `,
      prisma.research.count({ where: { project: { userId: user.id } } }),
      prisma.pRD.count({ where: { project: { userId: user.id } } }),
      prisma.roadmap.count({
        where: {
          OR: [
            { userId: user.id },
            { project: { userId: user.id } },
            { project: { members: { some: { userId: user.id } } } },
          ],
        },
      }),
      prisma.architecture.count({ where: { project: { userId: user.id } } }),
      prisma.document.count({ where: { project: { userId: user.id } } }),
    ]);

    const aiConversationsCount = Number(aiConversationCountRaw[0]?.count || 0);
    const hasPassword = Boolean(user.password);
    const authProviders = user.accounts.map((a) => a.provider);

    // Total AI Runs includes all AI Conversations (Chats), Researches, PRDs, Roadmaps, Architectures & Documents
    const totalAiRuns =
      aiConversationsCount +
      researchesCount +
      prdsCount +
      roadmapsCount +
      architecturesCount +
      documentsCount;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name ?? "",
        email: user.email,
        image: user.image ?? "",
        createdAt: user.createdAt,
        hasPassword,
        authProviders,
      },
      stats: {
        projectsCount,
        tasksCount,
        completedTasksCount,
        aiConversationsCount,
        researchesCount,
        prdsCount,
        roadmapsCount,
        architecturesCount,
        documentsCount,
        totalAiRuns,
      },
    });
  } catch (error) {
    console.error("GET /api/user/profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
