import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import ProjectInvitationEmail from "@/components/emails/ProjectInvitationEmail";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

// GET — list members + pending invitations (owner only)
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    // Verify requester is the owner
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
      select: { id: true, title: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 });
    }

    const [members, invitations] = await Promise.all([
      prisma.projectMember.findMany({
        where: { projectId },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { joinedAt: "asc" },
      }),
      prisma.projectInvitation.findMany({
        where: { projectId, status: "PENDING" },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ members, invitations });
  } catch (error) {
    console.error("[MEMBERS GET]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// POST — invite a member by email (owner only)
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify requester is the owner
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 });
    }

    // Can't invite yourself
    if (normalizedEmail === session.user.email?.toLowerCase()) {
      return NextResponse.json({ error: "You can't invite yourself" }, { status: 400 });
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        user: { email: normalizedEmail },
      },
    });

    if (existingMember) {
      return NextResponse.json({ error: "This person is already a member" }, { status: 409 });
    }

    // Check if pending invite already exists
    const existingInvite = await prisma.projectInvitation.findFirst({
      where: { projectId, email: normalizedEmail, status: "PENDING" },
    });

    if (existingInvite) {
      return NextResponse.json({ error: "An invitation has already been sent to this email" }, { status: 409 });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create invitation record
    const invitation = await prisma.projectInvitation.create({
      data: {
        projectId,
        email: normalizedEmail,
        token,
        status: "PENDING",
        invitedById: session.user.id,
        expiresAt,
      },
    });

    // Send invitation email
    const inviteUrl = `${process.env.NEXTAUTH_URL}/invite/accept?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: "Builder OS <onboarding@resend.dev>",
      to: normalizedEmail,
      subject: `You're invited to join "${project.title}" on Builder OS`,
      react: ProjectInvitationEmail({
        inviterName: project.user.name ?? project.user.email ?? "Someone",
        projectName: project.title,
        inviteUrl,
      }),
    });

    console.log("========== RESEND ==========");
    console.log("Data:", data);
    console.log("Error:", error);
    console.log("============================");

    return NextResponse.json({ success: true, invitation });
  } catch (error) {
    console.error("[MEMBERS POST]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
