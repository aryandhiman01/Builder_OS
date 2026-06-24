import Navbar from "@/components/landing/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Navbar />

      <main
        className="
        min-h-screen
        bg-[#050505]
        px-10
        pt-40
        text-white
        "
      >
        <h1 className="text-4xl font-bold">
          Welcome {session.user?.name}
        </h1>
      </main>
    </>
  );
}