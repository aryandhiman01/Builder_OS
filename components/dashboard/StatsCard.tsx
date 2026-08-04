"use client";

import { LucideIcon, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: string;
  trendColor?: "orange" | "amber" | "emerald" | "blue" | "green" | "yellow" | "red" | "violet";
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendColor = "orange",
}: StatsCardProps) {
  // Theme styling mapping matching Landing Page badge system
  const themeConfig = {
    orange: {
      borderHover: "hover:border-orange-500/40",
      glowBg: "bg-orange-500/10",
      iconBg: "border-orange-500/20 bg-orange-500/10 text-orange-400",
      badge: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    },
    amber: {
      borderHover: "hover:border-amber-500/40",
      glowBg: "bg-amber-500/10",
      iconBg: "border-amber-500/20 bg-amber-500/10 text-amber-400",
      badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    green: {
      borderHover: "hover:border-emerald-500/40",
      glowBg: "bg-emerald-500/10",
      iconBg: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    emerald: {
      borderHover: "hover:border-emerald-500/40",
      glowBg: "bg-emerald-500/10",
      iconBg: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    blue: {
      borderHover: "hover:border-sky-500/40",
      glowBg: "bg-sky-500/10",
      iconBg: "border-sky-500/20 bg-sky-500/10 text-sky-400",
      badge: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    },
    violet: {
      borderHover: "hover:border-orange-500/40",
      glowBg: "bg-orange-500/10",
      iconBg: "border-orange-500/20 bg-orange-500/10 text-orange-400",
      badge: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    },
    yellow: {
      borderHover: "hover:border-amber-500/40",
      glowBg: "bg-amber-500/10",
      iconBg: "border-amber-500/20 bg-amber-500/10 text-amber-400",
      badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    red: {
      borderHover: "hover:border-rose-500/40",
      glowBg: "bg-rose-500/10",
      iconBg: "border-rose-500/20 bg-rose-500/10 text-rose-400",
      badge: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    },
  };

  const theme = themeConfig[trendColor] || themeConfig.green;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" as const }}
      className={`
      group
      relative
      overflow-hidden
      rounded-2xl
      border
      border-white/10
      bg-[#09090c]/90
      p-6
      backdrop-blur-2xl
      shadow-xl
      transition-all
      duration-300
      ${theme.borderHover}
      hover:bg-[#0c0c10]
      `}
    >
      {/* Top Header & Value */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
            {title}
          </span>
          <h2
            className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            {value}
          </h2>
        </div>

        {/* Icon Badge */}
        <div
          className={`
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          shadow-inner
          transition-transform
          duration-300
          group-hover:scale-110
          ${theme.iconBg}
          `}
        >
          <Icon size={20} />
        </div>
      </div>

      {/* Bottom Description & Trend */}
      <div className="mt-6 flex items-center justify-between pt-3 border-t border-white/[0.06]">
        <p className="text-xs text-[#8a8a93]">
          {description}
        </p>

        {trend && (
          <div
            className={`
            flex
            items-center
            gap-1.5
            rounded-full
            px-2.5
            py-0.5
            text-[11px]
            font-mono
            font-medium
            ${theme.badge}
            `}
          >
            <TrendingUp size={12} />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}