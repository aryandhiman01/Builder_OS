"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "10,000+", label: "Products Built", suffix: "" },
  { value: "98", label: "Satisfaction Rate", suffix: "%" },
  { value: "10x", label: "Faster Planning", suffix: "" },
  { value: "50+", label: "AI Features", suffix: "" },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6" ref={ref}>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className="text-5xl font-bold text-white md:text-6xl"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {stat.value}
                <span className="text-zinc-500">{stat.suffix}</span>
              </div>
              <div className="mt-2 text-sm text-zinc-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
