import Link from "next/link";

import {
  ArrowRight,
  Brain,
  FileText,
  LayoutTemplate,
  Rocket,
  Search,
} from "lucide-react";

export default function AIHeroCard() {
  const features = [
    {
      title: "Research Competitors",
      icon: Search,
    },
    {
      title: "Generate PRD",
      icon: FileText,
    },
    {
      title: "Product Roadmap",
      icon: LayoutTemplate,
    },
    {
      title: "Launch Strategy",
      icon: Rocket,
    },
  ];

  return (
    <section
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-gradient-to-br
      from-white/[0.04]
      to-white/[0.02]
      p-8
      "
    >
      {/* Background Glow */}

      <div
        className="
        absolute
        -right-24
        -top-24
        h-72
        w-72
        rounded-full
        bg-white/5
        blur-3xl
        "
      />

      <div className="relative">

        {/* Badge */}

        <div
          className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-white/[0.04]
          px-4
          py-2
          "
        >
          <Brain
            size={18}
            className="text-white"
          />

          <span className="text-sm text-zinc-300">
            AI Workspace
          </span>
        </div>

        {/* Heading */}

        <h2
          className="
          mt-6
          max-w-2xl
          text-4xl
          font-bold
          leading-tight
          text-white
          "
        >
          Build products faster with your
          AI Product Engineer.
        </h2>

        <p
          className="
          mt-4
          max-w-2xl
          text-base
          leading-7
          text-zinc-400
          "
        >
          Research competitors, generate PRDs,
          create roadmaps, define features,
          plan architecture and build products
          without switching between tools.
        </p>

        {/* Features */}

        <div
          className="
          mt-10
          grid
          gap-4
          sm:grid-cols-2
          "
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-4
                "
              >
                <div
                  className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/[0.05]
                  "
                >
                  <Icon
                    size={20}
                    className="text-white"
                  />
                </div>

                <span className="font-medium text-white">
                  {feature.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Button */}

        <div className="mt-10">

          <Link
            href="/ai"
            className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-white
            px-6
            py-3
            font-semibold
            text-black
            transition
            hover:bg-zinc-200
            "
          >
            Open AI Workspace

            <ArrowRight size={18} />

          </Link>

        </div>

      </div>

    </section>
  );
}