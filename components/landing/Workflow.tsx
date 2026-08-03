"use client";

import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Search,
  FileText,
  Map,
  GitBranch,
  ClipboardList,
  Rocket,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Research Your Market",
    desc: "Describe your idea and let AI do the deep work. Competitor analysis, user personas, and market sizing — all generated in seconds.",
    accent: "#8B5CF6",
    accentBg: "rgba(139,92,246,0.1)",
    accentBorder: "rgba(139,92,246,0.25)",
  },
  {
    icon: FileText,
    number: "02",
    title: "Create Your PRD",
    desc: "Turn your research into a crystal-clear product requirements document. Define scope, goals, and user stories with AI assistance.",
    accent: "#3B82F6",
    accentBg: "rgba(59,130,246,0.1)",
    accentBorder: "rgba(59,130,246,0.25)",
  },
  {
    icon: Map,
    number: "03",
    title: "Plan Your Roadmap",
    desc: "Visualize your product journey with AI-generated milestones, timelines, and sprint breakdowns tailored to your team.",
    accent: "#10B981",
    accentBg: "rgba(16,185,129,0.1)",
    accentBorder: "rgba(16,185,129,0.25)",
  },
  {
    icon: GitBranch,
    number: "04",
    title: "Design Architecture",
    desc: "Get production-ready system architecture diagrams with component breakdowns, data flows, and technology recommendations.",
    accent: "#F59E0B",
    accentBg: "rgba(245,158,11,0.1)",
    accentBorder: "rgba(245,158,11,0.25)",
  },
  {
    icon: ClipboardList,
    number: "05",
    title: "Track Your Tasks",
    desc: "Manage development tasks with prioritization, assignments, and sprint tracking — all linked to your product goals.",
    accent: "#F43F5E",
    accentBg: "rgba(244,63,94,0.1)",
    accentBorder: "rgba(244,63,94,0.25)",
  },
  {
    icon: Rocket,
    number: "06",
    title: "Ship It",
    desc: "With everything documented, planned, and tracked — your team can focus on what matters: building and shipping great products.",
    accent: "#6366F1",
    accentBg: "rgba(99,102,241,0.1)",
    accentBorder: "rgba(99,102,241,0.25)",
  },
];

/* ------------------------------------------------------------------ */
/* Individual Step card on the right                                    */
/* ------------------------------------------------------------------ */
function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-30% 0px -50% 0px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.3, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 30 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex gap-5 pb-14 last:pb-0"
    >
      {/* Left: icon + line */}
      <div className="flex flex-col items-center">
        <motion.div
          animate={
            inView
              ? { scale: 1, borderColor: step.accentBorder, background: step.accentBg }
              : { scale: 0.9, borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }
          }
          transition={{ duration: 0.4 }}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
        >
          <Icon className="h-5 w-5" style={{ color: inView ? step.accent : "#8a8a93" }} />
          {inView && (
            <motion.div
              layoutId="stepGlow"
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(circle, ${step.accent}20 0%, transparent 70%)`,
                boxShadow: `0 0 20px ${step.accent}25`,
              }}
              transition={{ duration: 0.4 }}
            />
          )}
        </motion.div>

        {index < steps.length - 1 && (
          <div className="mt-2 w-px flex-1 overflow-hidden">
            <motion.div
              animate={inView ? { height: "100%" } : { height: "0%" }}
              initial={{ height: "0%" }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
              className="w-full"
              style={{ background: `linear-gradient(to bottom, ${step.accent}60, transparent)` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-1">
        <motion.div
          animate={{ color: inView ? step.accent : "#8a8a93" }}
          transition={{ duration: 0.3 }}
          className="mb-1 text-xs font-bold uppercase tracking-[0.15em]"
        >
          Step {step.number}
        </motion.div>
        <h3
          className="mb-2 text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          {step.title}
        </h3>
        <p className="text-sm leading-relaxed text-[#8a8a93]">{step.desc}</p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                        */
/* ------------------------------------------------------------------ */
export default function Workflow() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef(null);
  const titleInView = useInView(leftRef, { once: true, margin: "-100px" });

  // Track active step for the left panel
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveStep(i);
        },
        { threshold: 0.5, rootMargin: "-30% 0px -50% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const currentStep = steps[activeStep];

  return (
    <section id="workflow" ref={sectionRef} className="relative py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="hairline-x absolute inset-x-0 top-0" />
        <div className="glow-orange absolute right-0 top-1/4 h-[500px] w-[500px] opacity-30" />
        <div className="glow-violet absolute left-0 bottom-1/4 h-[400px] w-[400px] opacity-40" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">

          {/* LEFT: Sticky header + progress */}
          <div ref={leftRef} className="lg:sticky lg:top-28 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-sm text-[#8a8a93]"
            >
              How it works
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl font-bold text-white md:text-6xl"
              style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.03em" }}
            >
              From idea to{" "}
              <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                launch in 6 steps
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-lg text-[#8a8a93]"
            >
              BuilderOS guides you through every stage of the product development lifecycle — from raw idea to shipped feature.
            </motion.p>

            {/* Active step indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 rounded-2xl border p-5 transition-all duration-500"
              style={{
                borderColor: currentStep.accentBorder,
                background: currentStep.accentBg,
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: currentStep.accent }}
                >
                  Now viewing — Step {currentStep.number}
                </span>
              </div>
              <AnimatedStepTitle step={currentStep} />
            </motion.div>

            {/* Step progress dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={titleInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="mt-6 flex gap-2"
            >
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === activeStep ? 24 : 8,
                    background: i === activeStep ? s.accent : "rgba(255,255,255,0.15)",
                  }}
                  transition={{ duration: 0.4 }}
                  className="h-2 rounded-full"
                />
              ))}
            </motion.div>

            {/* Mini stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                <div className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>10×</div>
                <div className="mt-1 text-sm text-[#8a8a93]">Faster planning</div>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                <div className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>100%</div>
                <div className="mt-1 text-sm text-[#8a8a93]">AI-powered</div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Scrollable steps */}
          <div>
            {steps.map((step, i) => (
              <div key={step.title} ref={(el) => { stepRefs.current[i] = el; }}>
                <StepCard step={step} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Animated title transition in the active step card */
function AnimatedStepTitle({ step }: { step: (typeof steps)[0] }) {
  return (
    <AnimatePresence mode="wait">
      <motion.h3
        key={step.number}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="text-lg font-bold text-white"
        style={{ fontFamily: "var(--font-sora)" }}
      >
        {step.title}
      </motion.h3>
    </AnimatePresence>
  );
}


