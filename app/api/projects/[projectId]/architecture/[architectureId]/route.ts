import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    projectId: string;
    architectureId: string;
  }>;
}

// GET
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

    const { projectId, architectureId } = await params;

    const architecture = await prisma.architecture.findFirst({
      where: {
        id: architectureId,
        projectId,
        project: {
          user: {
            email: session.user.email,
          },
        },
      },
      include: {
        roadmap: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!architecture) {
      return NextResponse.json(
        {
          message: "Architecture not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        architecture,
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
          "Failed to fetch architecture.",
      },
      {
        status: 500,
      }
    );
  }
}

// PATCH
export async function PATCH(
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

    const { projectId, architectureId } = await params;

    const { title, content } = await request.json();

    const architecture = await prisma.architecture.findFirst({
      where: {
        id: architectureId,
        projectId,
        project: {
          user: {
            email: session.user.email,
          },
        },
      },
    });

    if (!architecture) {
      return NextResponse.json(
        {
          message: "Architecture not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updated = await prisma.architecture.update({
      where: {
        id: architectureId,
      },
      data: {
        title: title ?? architecture.title,
        content: content ?? architecture.content,
      },
    });

    return NextResponse.json(
      {
        message: "Architecture updated successfully.",
        architecture: updated,
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
          "Failed to update architecture.",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE
export async function DELETE(
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

    const { projectId, architectureId } = await params;

    const architecture = await prisma.architecture.findFirst({
      where: {
        id: architectureId,
        projectId,
        project: {
          user: {
            email: session.user.email,
          },
        },
      },
    });

    if (!architecture) {
      return NextResponse.json(
        {
          message: "Architecture not found.",
        },
        {
          status: 404,
        }
      );
    }

    const deletedArchitecture =
      await prisma.architecture.delete({
        where: {
          id: architectureId,
        },
      });

    return NextResponse.json(
      {
        message: "Architecture deleted successfully.",
        architecture: deletedArchitecture,
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
          "Failed to delete architecture.",
      },
      {
        status: 500,
      }
    );
  }
}