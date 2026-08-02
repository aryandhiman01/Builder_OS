import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import ProjectsClient from "@/components/projects/ProjectsClient";

const projectInclude = {
  tasks: true,
  researches: true,
  prds: true,
  roadmaps: true,
  architectures: true,
  members: { select: { id: true } },
} as const;

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Owned projects
  const ownedProjects = await prisma.project.findMany({
    where: {
      user: { email: session.user.email },
    },
    include: projectInclude,
    orderBy: { updatedAt: "desc" },
  });

  // Shared projects (member, not owner)
  const sharedMemberships = await prisma.projectMember.findMany({
    where: {
      user: { email: session.user.email },
    },
    include: {
      project: {
        include: projectInclude,
      },
    },
  });

  const ownedProjectIds = new Set(ownedProjects.map((p) => p.id));

  const sharedProjects = sharedMemberships
    .map((m) => m.project)
    .filter((p) => !ownedProjectIds.has(p.id));

  const allProjects = [
    ...ownedProjects.map((p) => ({ ...p, isShared: false })),
    ...sharedProjects.map((p) => ({ ...p, isShared: true })),
  ];

  return <ProjectsClient projects={allProjects} />;
}