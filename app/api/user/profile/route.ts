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

    const projectUserFilter = {
      OR: [
        { userId: user.id },
        { members: { some: { userId: user.id } } },
      ],
    };

    // Live counts from PostgreSQL database (Real-Time 0ms Delay)
    const [
      projectsCount,
      tasksCount,
      completedTasksCount,
      aiConversationsCount,
      researchesCount,
      prdsCount,
      roadmapsCount,
      architecturesCount,
      documentsCount,
    ] = await Promise.all([
      prisma.project.count({ where: projectUserFilter }),
      prisma.task.count({ where: { project: projectUserFilter } }),
      prisma.task.count({
        where: {
          project: projectUserFilter,
          status: { in: ["completed", "done"] },
        },
      }),
      prisma.aIConversation.count({ where: { userId: user.id } }),
      prisma.research.count({ where: { project: projectUserFilter } }),
      prisma.pRD.count({ where: { project: projectUserFilter } }),
      prisma.roadmap.count({
        where: {
          OR: [
            { userId: user.id },
            { project: projectUserFilter },
          ],
        },
      }),
      prisma.architecture.count({ where: { project: projectUserFilter } }),
      prisma.document.count({ where: { project: projectUserFilter } }),
    ]);

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

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, image } = body;

    if (name !== undefined && typeof name === "string" && !name.trim()) {
      return NextResponse.json(
        { error: "Full name cannot be empty" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(image !== undefined ? { image: image ? image.trim() : null } : {}),
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
      message: "Profile updated successfully",
      user: {
        ...updatedUser,
        name: updatedUser.name ?? "",
        image: updatedUser.image ?? "",
      },
    });
  } catch (error) {
    console.error("PATCH /api/user/profile error:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}

export const PUT = PATCH;

