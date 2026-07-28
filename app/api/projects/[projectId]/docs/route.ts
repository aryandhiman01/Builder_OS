import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(
  request: NextRequest,
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
      select: {
        id: true,
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

    const documents = await prisma.document.findMany({
      where: {
        projectId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(
      {
        documents,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error?.message ??
          "Failed to fetch documents.",
      },
      {
        status: 500,
      }
    );
  }
}