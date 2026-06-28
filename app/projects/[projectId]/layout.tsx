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

  const project = await prisma.project.findFirst({
    where: {
        id: projectId,
        userId: session.user.id,
    },
    });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <ProjectWorkspaceHeader project={project} />

      <ProjectNavigation projectId={project.id} />

      <section className="mx-auto max-w-7xl px-8 py-8">
        {children}
      </section>
    </main>
  );
}