"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    value: "10+",
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
  const inView = useInView(ref, { once: true, margin: "0px" });

  return (
    <section className="relative py-16 sm:py-20">
      {/* Top + bottom hairlines */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="hairline-x absolute inset-x-0 top-0" />
        <div className="hairline-x absolute inset-x-0 bottom-0" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6" ref={ref}>
        <div className="relative grid grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.01] transform-gpu">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`relative px-4 sm:px-8 py-8 sm:py-10 ${
                i % 2 === 0 ? "border-r border-white/[0.07]" : ""
              } ${
                i < 3 ? "lg:border-r lg:border-white/[0.07]" : "lg:border-r-0"
              } ${
                i < 2 ? "border-b border-white/[0.07] lg:border-b-0" : ""
              }`}
            >
              {/* Big number */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className="text-4xl sm:text-5xl font-extrabold text-white lg:text-6xl"
                style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.04em" }}
              >
                {stat.value}
              </motion.div>

              {/* Label */}
              <div className="mt-2 text-sm sm:text-base font-bold text-white/90">
                {stat.label}
              </div>

              {/* Description */}
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#8a8a93]">
                {stat.desc}
              </p>

              {/* Accent dot top-left */}
              {i === 0 && (
                <div className="absolute left-3 top-3 h-1.5 w-1.5 rounded-full bg-orange-400/80 animate-pulse" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
