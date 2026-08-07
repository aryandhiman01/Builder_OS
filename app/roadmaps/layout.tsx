import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const metadata = {
  title: "Roadmaps — BuilderOS",
  description: "Strategic planning engine. Define vision, organize milestones, and convert planning into execution.",
};

interface RoadmapsLayoutProps {
  children: ReactNode;
}

export default async function RoadmapsLayout({ children }: RoadmapsLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
