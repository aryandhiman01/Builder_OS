import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import EditProjectForm from "@/components/projects/EditProjectForm";
import MembersPanel from "@/components/projects/members/MembersPanel";

interface ProjectSettingsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectSettingsPage({
  params,
}: ProjectSettingsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      user: {
        email: session.user.email,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      color: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">

      {/* Heading */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          Project Settings
        </h1>

        <p className="mt-2 text-zinc-500">
          Update your project details and manage team members.
        </p>

      </div>

      {/* Form */}

      <EditProjectForm
        project={project}
      />

      {/* Team Members */}

      <div className="space-y-4">

        <div>
          <h2 className="text-xl font-bold text-white">Team Members</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Invite teammates to collaborate. Members can access all project features except Settings.
          </p>
        </div>

        <MembersPanel
          projectId={project.id}
          ownerName={project.user.name}
          ownerEmail={project.user.email}
          ownerImage={project.user.image}
        />

      </div>

    </div>
  );
}