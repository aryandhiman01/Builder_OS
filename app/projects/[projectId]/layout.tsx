import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import ProjectWorkspaceHeader from "@/components/projects/ProjectWorkspaceHeader";
import ProjectNavigation from "@/components/projects/ProjectNavigation";

interface ProjectLayoutProps {
  children: ReactNode;

  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { projectId } = await params;

  // Allow access if user is owner OR an accepted member
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { userId: session.user.id },
        { members: { some: { userId: session.user.id } } },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      color: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      members: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const isOwner = project.userId === session.user.id;
  const membersCount = (project.members?.length || 0) + 1;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <ProjectWorkspaceHeader project={{ ...project, membersCount }} isOwner={isOwner} />

      <ProjectNavigation projectId={project.id} isOwner={isOwner} />

      <section className="mx-auto max-w-7xl px-8 py-8">
        {children}
      </section>
    </main>
  );
}