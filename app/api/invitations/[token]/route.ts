import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ token: string }>;
}

// GET — look up invitation by token
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { token } = await params;

    const invitation = await prisma.projectInvitation.findUnique({
      where: { token },
      include: {
        project: { select: { id: true, title: true, description: true } },
        invitedBy: { select: { name: true, email: true, image: true } },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "This invitation has already been accepted", projectId: invitation.projectId },
        { status: 410 }
      );
    }

    if (invitation.status === "EXPIRED" || new Date() > invitation.expiresAt) {
      // Mark expired if not already
      if (invitation.status !== "EXPIRED") {
        await prisma.projectInvitation.update({
          where: { token },
          data: { status: "EXPIRED" },
        });
      }
      return NextResponse.json({ error: "This invitation has expired" }, { status: 410 });
    }

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error("[INVITATION GET]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// POST — accept invitation
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;

    const invitation = await prisma.projectInvitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.status === "ACCEPTED") {
      return NextResponse.json(
        { success: true, projectId: invitation.projectId, alreadyAccepted: true }
      );
    }

    if (invitation.status === "EXPIRED" || new Date() > invitation.expiresAt) {
      return NextResponse.json({ error: "This invitation has expired" }, { status: 410 });
    }

    // Check if the logged-in user's email matches the invited email
    if (session.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return NextResponse.json(
        {
          error: `This invitation was sent to ${invitation.email}. Please sign in with that email address.`,
        },
        { status: 403 }
      );
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findFirst({
      where: { projectId: invitation.projectId, userId: session.user.id },
    });

    if (!existingMember) {
      // Create membership + mark invitation accepted in a transaction
      await prisma.$transaction([
        prisma.projectMember.create({
          data: {
            projectId: invitation.projectId,
            userId: session.user.id,
            role: "MEMBER",
          },
        }),
        prisma.projectInvitation.update({
          where: { token },
          data: { status: "ACCEPTED" },
        }),
      ]);
    }

    return NextResponse.json({ success: true, projectId: invitation.projectId });
  } catch (error) {
    console.error("[INVITATION POST]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
