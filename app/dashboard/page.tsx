import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    const name = session.user?.name ?? "Builder";

    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">
                Welcome back, {name}
            </h1>
            <p className="text-sm text-zinc-500">
                Your workspace is ready. Start building something great.
            </p>
        </div>
    );
}