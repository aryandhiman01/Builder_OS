"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    value: "10,000+",
    label: "Products Built",
    desc: "Teams have shipped real products using BuilderOS from day one.",
  },
  {
    value: "98%",
    label: "Satisfaction Rate",
    desc: "Our builders rate their experience exceptional across the board.",
  },
  {
    value: "10×",
    label: "Faster Planning",
    desc: "Go from idea to full PRD in minutes, not days.",
  },
  {
    value: "50+",
    label: "AI Features",
    desc: "Every stage of the product lifecycle, intelligently automated.",
  },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-20">
      {/* Top + bottom hairlines */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="hairline-x absolute inset-x-0 top-0" />
        <div className="hairline-x absolute inset-x-0 bottom-0" />
      </div>

      <div className="mx-auto max-w-7xl px-6" ref={ref}>
        <div className="relative grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`relative px-8 py-10 ${i < stats.length - 1 ? "border-r border-white/[0.07]" : ""} ${i < 2 ? "border-b border-white/[0.07] lg:border-b-0" : ""}`}
            >
              {/* Big number */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className="text-5xl font-bold text-white md:text-6xl"
                style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.04em" }}
              >
                {stat.value}
              </motion.div>

              {/* Label */}
              <div className="mt-2 text-base font-semibold text-white/90">
                {stat.label}
              </div>

              {/* Description */}
              <p className="mt-2 text-sm leading-relaxed text-[#8a8a93]">
                {stat.desc}
              </p>

              {/* Accent dot top-left */}
              {i === 0 && (
                <div className="absolute left-4 top-4 h-1.5 w-1.5 rounded-full bg-orange-400/60" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
