"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-44">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-20 lg:grid-cols-2">

          <div>

            <h1 className="max-w-3xl text-6xl font-bold leading-tight tracking-tight text-white md:text-7xl">

              Build products

              <span className="block text-zinc-500">
                without wasting time.
              </span>

            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">

              Research.
              Plan.
              Build.
              Ship.

              <br />
              <br />

              Everything you need to transform an idea
              into a successful product.

            </p>

            <div className="mt-10 flex gap-4">

              <Button
                size="lg"
                className="
                rounded-xl
                bg-white
                text-black
                hover:bg-zinc-200
                "
                onClick={() => signIn()}
              >
                Start Building

                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="
                border-white/10
                bg-white/[0.03]
                text-white
                backdrop-blur-xl
                "
              >
                Watch Demo
              </Button>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
              <p className="mb-3 text-zinc-500">AI Agent</p>

              <h3 className="text-2xl font-semibold text-white">
                Smart
              </h3>

              <p className="mt-3 text-zinc-500">
                Product intelligence powered by AI.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
              <p className="mb-3 text-zinc-500">Speed</p>

              <h3 className="text-2xl font-semibold text-white">
                Fast
              </h3>

              <p className="mt-3 text-zinc-500">
                Generate PRDs in seconds.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
              <p className="mb-3 text-zinc-500">Architecture</p>

              <h3 className="text-2xl font-semibold text-white">
                Reliable
              </h3>

              <p className="mt-3 text-zinc-500">
                Production-ready system design.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
              <p className="mb-3 text-zinc-500">Planning</p>

              <h3 className="text-2xl font-semibold text-white">
                Organized
              </h3>

              <p className="mt-3 text-zinc-500">
                Tasks, sprints and roadmaps.
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}