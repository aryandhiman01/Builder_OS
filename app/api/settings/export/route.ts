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
      include: {
        projects: {
          include: {
            tasks: true,
            ideas: true,
            researches: true,
            prds: true,
            roadmaps: true,
            architectures: true,
            documents: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const aiConversations = await prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        messages: string;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`
      SELECT c.id, c.title, c.messages, c."createdAt", c."updatedAt"
      FROM "AIConversation" c
      WHERE c."userId" = ${user.id}
      ORDER BY c."updatedAt" DESC
    `;

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      projectsCount: user.projects.length,
      conversationsCount: aiConversations.length,
      projects: user.projects,
      aiConversations,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="builder_os_export_${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error("GET /api/settings/export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
