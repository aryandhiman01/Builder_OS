import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    researchId: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {

  try {

    const session =
      await getServerSession(authOptions);

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

    const { researchId } =
      await params;

    const research =
      await prisma.research.findFirst({

        where: {

          id: researchId,

          project: {

            user: {
              email:
                session.user.email,
            },

          },

        },

      });

    if (!research) {

      return NextResponse.json(
        {
          message:
            "Research not found.",
        },
        {
          status: 404,
        }
      );

    }

    const body =
      await request.json();

    const {
      title,
      prompt,
      content,
    } = body;

        if (
      !title ||
      !prompt ||
      !content
    ) {

      return NextResponse.json(
        {
          message:
            "Title, prompt and content are required.",
        },
        {
          status: 400,
        }
      );

    }

    if (title.trim().length < 3) {

      return NextResponse.json(
        {
          message:
            "Title must contain at least 3 characters.",
        },
        {
          status: 400,
        }
      );

    }

    if (prompt.trim().length < 10) {

      return NextResponse.json(
        {
          message:
            "Prompt must contain at least 10 characters.",
        },
        {
          status: 400,
        }
      );

    }

    const updatedResearch =
      await prisma.research.update({

        where: {
          id: research.id,
        },

        data: {

          title: title.trim(),

          prompt: prompt.trim(),

          content: content.trim(),

        },

      });

    return NextResponse.json(
      updatedResearch
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to update research.",
      },
      {
        status: 500,
      }
    );

  }

}


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

    const { researchId } = await params;

    const research = await prisma.research.findFirst({

        where: {

          id: researchId,

          project: {

            user: {

              email:
                session.user.email,

            },

          },

        },

      });

          if (!research) {

      return NextResponse.json(
        {
          message:
            "Research not found.",
        },
        {
          status: 404,
        }
      );

    }

    await prisma.research.delete({

      where: {
        id: research.id,
      },

    });

    return NextResponse.json(
      {
        message:
          "Research deleted successfully.",
      }
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to delete research.",
      },
      {
        status: 500,
      }
    );

  }

}