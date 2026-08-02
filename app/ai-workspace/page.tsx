import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import AIWorkspace from "@/components/ai-workspace/AIWorkspace";

export default async function AIWorkspacePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background">
      <AIWorkspace />
    </main>
  );
}