import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const aiConversationClient = (prisma as any).aIConversation;

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

    const conversations = await aiConversationClient.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },

      orderBy: {
        updatedAt: "desc",
      },

      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },

      take: 100,
    });

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
