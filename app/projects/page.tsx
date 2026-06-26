import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import ProjectsClient from "@/components/projects/ProjectsClient";

export default async function ProjectsPage() {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <ProjectsClient />
  );
}