import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ projectId: string; invitationId: string }>;
}

// DELETE — cancel a pending invitation (owner only)
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, invitationId } = await params;

    // Verify requester is the owner
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 });
    }

    const invitation = await prisma.projectInvitation.findFirst({
      where: { id: invitationId, projectId, status: "PENDING" },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    await prisma.projectInvitation.update({
      where: { id: invitationId },
      data: { status: "EXPIRED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[INVITATION DELETE]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
