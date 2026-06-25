import { getServerSession } from "next-auth";;
import { authOptions } from "@/lib/auth";;
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

import Image from "next/image";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if(!session) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email!,
      },
      include: {
        accounts: true,
      },
});

    return (
    <main className="mx-auto max-w-5xl px-6 py-10">

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-2 text-zinc-500">
          Manage your BuilderOS account.
        </p>
      </div>

      <div className="space-y-6">

        {/* PROFILE */}

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          "
        >
          <h2 className="mb-6 text-xl font-semibold text-white">
            Profile Information
          </h2>

          <div className="flex items-center gap-5">

            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="User"
                width={70}
                height={70}
                className="rounded-full"
              />
            ) : (
              <div
                className="
                flex
                h-[70px]
                w-[70px]
                items-center
                justify-center
                rounded-full
                bg-white
                text-xl
                font-bold
                text-black
                "
              >
                {session.user?.name?.charAt(0)}
              </div>
            )}

            <div>
              <p className="text-lg font-semibold text-white">
                {session.user?.name}
              </p>

              <p className="text-zinc-500">
                {session.user?.email}
              </p>
            </div>

          </div>
        </div>

        {/* SECURITY */}

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          "
        >
          <h2 className="mb-6 text-xl font-semibold text-white">
            Security
          </h2>

          <div className="space-y-4">

            <Link
              href="/change-password"
              className="
              block
              rounded-2xl
              border
              border-white/10
              p-4
              transition
              hover:bg-white/[0.03]
              "
            >
              <p className="font-medium text-white">
                Change Password
              </p>

              <p className="text-sm text-zinc-500">
                Update your account password.
              </p>
            </Link>

            <Link
              href="/forgot-password"
              className="
              block
              rounded-2xl
              border
              border-white/10
              p-4
              transition
              hover:bg-white/[0.03]
              "
            >
              <p className="font-medium text-white">
                Reset Password
              </p>

              <p className="text-sm text-zinc-500">
                Request a password reset email.
              </p>
            </Link>

          </div>  
        </div>

        {/* ACCOUNT */}

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          "
        >
          <h2 className="mb-6 text-xl font-semibold text-white">
            Account
          </h2>

          <div className="space-y-3">

            <div>
              <p className="text-sm text-zinc-500">
                Plan
              </p>

              <p className="text-white">
                Free
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Authentication
              </p>

              <p className="text-white">
                NextAuth.js
              </p>
            </div>

          </div>
        </div>

      </div>

    </main>
  );
}

