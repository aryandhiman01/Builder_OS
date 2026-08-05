import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import GlobalTasksClient from "@/components/global-tasks/GlobalTasksClient";

export default async function TasksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const name = session.user?.name ?? "Builder";

  return <GlobalTasksClient userName={name} />;
}
