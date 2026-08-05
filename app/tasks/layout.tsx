import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const metadata = {
  title: "Tasks — BuilderOS",
  description: "Your developer command center. Manage all tasks across every project in one place.",
};

interface TasksLayoutProps {
  children: ReactNode;
}

export default async function TasksLayout({ children }: TasksLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
