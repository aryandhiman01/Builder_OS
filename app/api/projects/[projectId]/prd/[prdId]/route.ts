import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    projectId: string;
    prdId: string;
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
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { projectId, prdId } = await params;

    const prd = await prisma.pRD.findFirst({
      where: {
        id: prdId,
        projectId,
        project: {
          user: {
            email: session.user.email,
          },
        },
      },
      include: {
        research: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!prd) {
      return NextResponse.json(
        {
          message: "PRD not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(prd);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch PRD.",
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
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { projectId, prdId } = await params;

    const body = await request.json();

    const { title, prompt, content } = body;

    const existingPRD = await prisma.pRD.findFirst({
      where: {
        id: prdId,
        projectId,
        project: {
          user: {
            email: session.user.email,
          },
        },
      },
    });

    if (!existingPRD) {
      return NextResponse.json(
        {
          message: "PRD not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedPRD = await prisma.pRD.update({
      where: {
        id: prdId,
      },
      data: {
        ...(title && { title: title.trim() }),
        ...(prompt && { prompt: prompt.trim() }),
        ...(content && { content }),
      },
    });

    return NextResponse.json({
      message: "PRD updated successfully.",
      prd: updatedPRD,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update PRD.",
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
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { projectId, prdId } = await params;

    const existingPRD = await prisma.pRD.findFirst({
      where: {
        id: prdId,
        projectId,
        project: {
          user: {
            email: session.user.email,
          },
        },
      },
    });

    if (!existingPRD) {
      return NextResponse.json(
        {
          message: "PRD not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.pRD.delete({
      where: {
        id: prdId,
      },
    });

    return NextResponse.json({
      message: "PRD deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete PRD.",
      },
      {
        status: 500,
      }
    );
  }
}