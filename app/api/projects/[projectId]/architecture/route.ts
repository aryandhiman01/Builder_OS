import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
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

    const { projectId } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          message: "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    const architectures = await prisma.architecture.findMany({
      where: {
        projectId,
      },
      include: {
        roadmap: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      architectures,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error?.message ??
          "Failed to fetch architectures.",
      },
      {
        status: 500,
      }
    );
  }
}