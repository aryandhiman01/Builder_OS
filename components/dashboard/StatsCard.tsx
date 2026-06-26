import { LucideIcon, TrendingUp } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;

    trend?: string;

    trendColor?:
    | "green"
    | "blue"
    | "yellow"
    | "red";
}

export default function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    trendColor = "green",
}: StatsCardProps) {
    const trendStyles = {
    green:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",

    blue:
      "bg-sky-500/10 text-sky-400 border border-sky-500/20",

    yellow:
      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",

    red:
      "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-white/[0.03]
      p-6
      transition-all
      duration-300
      hover:border-white/20
      hover:bg-white/[0.05]
      "
    >
      {/* Glow */}

      <div
        className="
        absolute
        -right-10
        -top-10
        h-28
        w-28
        rounded-full
        bg-white/5
        blur-3xl
        transition
        duration-500
        group-hover:bg-white/10
        "
      />

      {/* Top */}

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-zinc-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
            {value}
          </h2>

        </div>

        <div
          className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          bg-white/[0.05]
          "
        >
          <Icon
            size={22}
            className="text-white"
          />
        </div>

      </div>

      {/* Bottom */}

      <div className="mt-8 flex items-center justify-between">

        <p className="text-sm text-zinc-500">
          {description}
        </p>

        {trend && (
          <div
            className={`
            flex
            items-center
            gap-1
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            ${trendStyles[trendColor]}
            `}
          >
            <TrendingUp size={13} />

            {trend}
          </div>
        )}

      </div>

    </div>
  );
}