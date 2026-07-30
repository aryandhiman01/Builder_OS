import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  href?: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  onClick,
}: QuickActionCardProps) {
  const cardContent = (
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
      hover:-translate-y-1
      hover:border-white/20
      hover:bg-white/[0.05]
      cursor-pointer
      "
    >
      {/* Glow */}
      <div
        className="
        absolute
        -right-8
        -top-8
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

      {/* Icon */}
      <div
        className="
        mb-6
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-2xl
        border
        border-white/10
        bg-white/[0.05]
        transition
        group-hover:scale-105
        "
      >
        <Icon size={26} className="text-white" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white">{title}</h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>

      {/* Footer */}
      <div
        className="
        mt-6
        flex
        items-center
        gap-2
        text-sm
        font-medium
        text-white
        "
      >
        Open
        <ArrowRight
          size={16}
          className="
          transition
          duration-300
          group-hover:translate-x-1
          "
        />
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{cardContent}</div>;
  }

  return <Link href={href || "#"}>{cardContent}</Link>;
}