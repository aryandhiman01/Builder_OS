import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

// Get

export async function GET(
  req: Request,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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
      include: {
        ideas: true,
        tasks: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(project);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}

// Patch

export async function PATCH(
  req: Request,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId } = await params;

    const body = await req.json();

    const {
      title,
      description,
      category,
      color,
      status,
    } = body;

    const existingProject =
      await prisma.project.findFirst({
        where: {
          id: projectId,
          user: {
            email: session.user.email,
          },
        },
      });

    if (!existingProject) {
      return NextResponse.json(
        {
          error: "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    const project =
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          title,
          description,
          category,
          color,
          status,
        },
      });

    return NextResponse.json({
      success: true,
      project,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}

// Delete

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      projectId: string;
    }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { projectId } = await params;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          error: "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.$transaction([
      prisma.idea.deleteMany({
        where: {
          projectId,
        },
      }),

      prisma.task.deleteMany({
        where: {
          projectId,
        },
      }),

      prisma.project.delete({
        where: {
          id: projectId,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}