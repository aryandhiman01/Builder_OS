"use client";

import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionCardProps {
  title: string;
  description: string;
  href?: string;
  icon: LucideIcon;
  onClick?: () => void;
  shortcut?: string;
  color?: "indigo" | "violet" | "emerald" | "amber" | "blue";
}

export default function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  onClick,
  shortcut,
  color = "indigo",
}: QuickActionCardProps) {
  const colorStyles = {
    indigo: {
      glow: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
      borderHover: "group-hover:border-indigo-500/40",
      iconBg: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
      arrowText: "group-hover:text-indigo-400",
    },
    violet: {
      glow: "bg-violet-500/10 group-hover:bg-violet-500/20",
      borderHover: "group-hover:border-violet-500/40",
      iconBg: "border-violet-500/20 bg-violet-500/10 text-violet-400",
      arrowText: "group-hover:text-violet-400",
    },
    blue: {
      glow: "bg-blue-500/10 group-hover:bg-blue-500/20",
      borderHover: "group-hover:border-blue-500/40",
      iconBg: "border-blue-500/20 bg-blue-500/10 text-blue-400",
      arrowText: "group-hover:text-blue-400",
    },
    emerald: {
      glow: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
      borderHover: "group-hover:border-emerald-500/40",
      iconBg: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      arrowText: "group-hover:text-emerald-400",
    },
    amber: {
      glow: "bg-amber-500/10 group-hover:bg-amber-500/20",
      borderHover: "group-hover:border-amber-500/40",
      iconBg: "border-amber-500/20 bg-amber-500/10 text-amber-400",
      arrowText: "group-hover:text-amber-400",
    },
  };

  const style = colorStyles[color] || colorStyles.indigo;

  const cardInner = (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: "easeOut" as const }}
      className={`
      group
      relative
      flex
      h-full
      flex-col
      justify-between
      overflow-hidden
      rounded-2xl
      border
      border-white/10
      bg-[#09090c]/90
      p-6
      backdrop-blur-2xl
      transition-all
      duration-300
      ${style.borderHover}
      hover:bg-[#0c0c10]
      hover:shadow-2xl
      cursor-pointer
      `}
    >
      {/* Background Glow */}
      <div
        className={`
        pointer-events-none
        absolute
        -right-10
        -top-10
        h-32
        w-32
        rounded-full
        blur-3xl
        transition-all
        duration-500
        group-hover:scale-125
        ${style.glow}
        `}
      />

      <div>
        {/* Top Icon & Shortcut */}
        <div className="flex items-center justify-between mb-5">
          <div
            className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            border
            shadow-inner
            transition-transform
            duration-300
            group-hover:scale-110
            ${style.iconBg}
            `}
          >
            <Icon size={22} />
          </div>

          {shortcut && (
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-mono text-[#8a8a93] group-hover:border-white/20 group-hover:text-white">
              {shortcut}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3
          className="text-base font-bold text-white transition-colors"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          {title}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-[#8a8a93]">
          {description}
        </p>
      </div>

      {/* Footer Arrow CTA */}
      <div
        className={`
        mt-6
        flex
        items-center
        gap-1.5
        text-xs
        font-semibold
        text-[#8a8a93]
        transition-colors
        duration-300
        ${style.arrowText}
        `}
      >
        <span>Open Tool</span>
        <ArrowRight
          size={13}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>
    </motion.div>
  );

  if (onClick) {
    return <div onClick={onClick} className="h-full">{cardInner}</div>;
  }

  return (
    <Link href={href || "#"} className="h-full block">
      {cardInner}
    </Link>
  );
}