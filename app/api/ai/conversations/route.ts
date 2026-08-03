import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — list the current user's AI Workspace conversation history
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const conversations = await prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`
      SELECT c.id, c.title, c."createdAt", c."updatedAt"
      FROM "AIConversation" c
      INNER JOIN "User" u ON c."userId" = u.id
      WHERE u.email = ${session.user.email}
      ORDER BY c."updatedAt" DESC
      LIMIT 100
    `;

    return NextResponse.json(
      {
        message: "Success",
        conversations,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message: error?.message ?? "Failed to load conversations.",
      },
      {
        status: 500,
      }
    );
  }
}
