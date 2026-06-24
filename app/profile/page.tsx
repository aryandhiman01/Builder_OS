import Navbar from "@/components/landing/Navbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] pt-36 pb-10">

        <div className="mx-auto max-w-5xl px-6">

          {/* HEADER */}

          <div
            className="
            rounded-3xl
            border
            border-white/10
            bg-white/[0.03]
            p-8
            backdrop-blur-xl
            "
          >

            <div className="flex flex-col gap-8 md:flex-row md:items-center">

              {/* Avatar */}

              <div
                className="
                relative
                flex
                h-32
                w-32
                items-center
                justify-center
                overflow-hidden
                rounded-full
                border
                border-white/10
                bg-white
                text-4xl
                font-bold
                text-black
                "
              >

                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  session.user?.name?.charAt(0)
                )}

              </div>

              {/* Info */}

              <div>

                <h1 className="text-4xl font-bold text-white">
                  {session.user?.name}
                </h1>

                <p className="mt-2 text-zinc-400">
                  {session.user?.email}
                </p>

                <div className="mt-4 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
                  Active Builder
                </div>

              </div>

            </div>

          </div>

          {/* STATS */}

          <div className="mt-8 grid gap-6 md:grid-cols-3">

            <div
              className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              p-6
              "
            >
              <p className="text-zinc-500">
                Projects
              </p>

              <h2 className="mt-3 text-4xl font-bold text-white">
                0
              </h2>
            </div>

            <div
              className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              p-6
              "
            >
              <p className="text-zinc-500">
                Ideas
              </p>

              <h2 className="mt-3 text-4xl font-bold text-white">
                0
              </h2>
            </div>

            <div
              className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              p-6
              "
            >
              <p className="text-zinc-500">
                Tasks
              </p>

              <h2 className="mt-3 text-4xl font-bold text-white">
                0
              </h2>
            </div>

          </div>

          {/* ACCOUNT INFO */}

          <div
            className="
            mt-8
            rounded-3xl
            border
            border-white/10
            bg-white/[0.03]
            p-8
            "
          >

            <h2 className="mb-8 text-2xl font-semibold text-white">
              Account Information
            </h2>

            <div className="space-y-6">

              <div>

                <p className="text-sm text-zinc-500">
                  Full Name
                </p>

                <p className="mt-1 text-white">
                  {session.user?.name}
                </p>

              </div>

              <div>

                <p className="text-sm text-zinc-500">
                  Email Address
                </p>

                <p className="mt-1 text-white">
                  {session.user?.email}
                </p>

              </div>

              <div>

                <p className="text-sm text-zinc-500">
                  Authentication Method
                </p>

                <p className="mt-1 text-white">
                  Google / GitHub / Credentials
                </p>

              </div>

            </div>

          </div>

        </div>

      </main>
    </>
  );
}