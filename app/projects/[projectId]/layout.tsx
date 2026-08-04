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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      members: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const isOwner = project.userId === session.user.id;

  // Consolidate owner and team members into a unique list
  const memberMap = new Map<string, { id: string; name?: string | null; email?: string | null; image?: string | null }>();
  if (project.user) {
    memberMap.set(project.user.id, {
      id: project.user.id,
      name: project.user.name,
      email: project.user.email,
      image: project.user.image,
    });
  }
  project.members?.forEach((m) => {
    if (m.user && !memberMap.has(m.user.id)) {
      memberMap.set(m.user.id, {
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        image: m.user.image,
      });
    }
  });
  const membersList = Array.from(memberMap.values());

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <ProjectWorkspaceHeader project={{ ...project, members: membersList, membersCount: membersList.length }} isOwner={isOwner} />

      <ProjectNavigation projectId={project.id} isOwner={isOwner} />

      <section className="mx-auto max-w-7xl px-8 py-8">
        {children}
      </section>
    </main>
  );
}
