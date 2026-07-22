import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { PRDViewer } from "@/components/prd/PRDViewer";

interface PageProps {
  params: Promise<{
    projectId: string;
    prdId: string;
  }>;
}

export default async function PRDPage({
  params,
}: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { projectId, prdId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      user: {
        email: session.user.email,
      },
    },
  });

  if (!project) {
    redirect("/projects");
  }

  const prd = await prisma.pRD.findFirst({
    where: {
      id: prdId,
      projectId,
    },
  });

  if (!prd) {
    redirect(`/projects/${projectId}/prd`);
  }

  return (
    <div className="container mx-auto py-8">
      <PRDViewer
        projectId={projectId}
        prd={prd}
      />
    </div>
  );
}