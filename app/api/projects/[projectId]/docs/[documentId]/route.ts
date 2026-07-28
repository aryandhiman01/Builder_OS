import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    projectId: string;
    documentId: string;
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
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId, documentId } = await params;

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        projectId,
        project: {
          user: {
            email: session.user.email,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        {
          message: "Document not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        document,
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
          "Failed to fetch document.",
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
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId, documentId } = await params;

    const body = await request.json();

    const {
      title,
      content,
      type,
    } = body;

    const existingDocument =
      await prisma.document.findFirst({
        where: {
          id: documentId,
          projectId,
          project: {
            user: {
              email: session.user.email,
            },
          },
        },
      });

    if (!existingDocument) {
      return NextResponse.json(
        {
          message: "Document not found.",
        },
        {
          status: 404,
        }
      );
    }

    const document =
      await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          title,
          content,
          type,
        },
      });

    return NextResponse.json(
      {
        message:
          "Document updated successfully.",
        document,
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
          "Failed to update document.",
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
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId, documentId } =
      await params;

    const existingDocument =
      await prisma.document.findFirst({
        where: {
          id: documentId,
          projectId,
          project: {
            user: {
              email: session.user.email,
            },
          },
        },
      });

    if (!existingDocument) {
      return NextResponse.json(
        {
          message: "Document not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.document.delete({
      where: {
        id: documentId,
      },
    });

    return NextResponse.json(
      {
        message:
          "Document deleted successfully.",
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
          "Failed to delete document.",
      },
      {
        status: 500,
      }
    );
  }
}