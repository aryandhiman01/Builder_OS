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

    // Live counts from PostgreSQL database
    const [
      projectsCount,
      tasksCount,
      completedTasksCount,
      aiConversationsCount,
      researchesCount,
      prdsCount,
      roadmapsCount,
    ] = await Promise.all([
      prisma.project.count({ where: { userId: user.id } }),
      prisma.task.count({ where: { project: { userId: user.id } } }),
      prisma.task.count({
        where: {
          project: { userId: user.id },
          status: { in: ["completed", "done"] },
        },
      }),
      prisma.aIConversation.count({ where: { userId: user.id } }),
      prisma.research.count({ where: { project: { userId: user.id } } }),
      prisma.pRD.count({ where: { project: { userId: user.id } } }),
      prisma.roadmap.count({ where: { project: { userId: user.id } } }),
    ]);

    const hasPassword = Boolean(user.password);
    const authProviders = user.accounts.map((a) => a.provider);

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
        totalAiRuns: aiConversationsCount + researchesCount + prdsCount + roadmapsCount,
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

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, image } = await req.json();

    if (typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required and cannot be empty" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name.trim(),
        image: typeof image === "string" ? image.trim() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("PATCH /api/user/profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
