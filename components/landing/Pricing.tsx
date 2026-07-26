"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    desc: "Perfect for solo builders getting started.",
    features: [
      "3 active projects",
      "AI Research (5/mo)",
      "PRD Generator",
      "Basic Roadmap",
      "Task Board",
      "Community support",
    ],
    cta: "Start for Free",
    href: "/signup",
    popular: false,
    gradient: "from-white/[0.02] to-white/[0.01]",
    border: "border-white/10",
    ctaClass: "bg-white/[0.06] text-white hover:bg-white/10 border border-white/10",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For serious builders and small teams.",
    features: [
      "Unlimited projects",
      "Unlimited AI Research",
      "Advanced PRD Generation",
      "Full Roadmap Builder",
      "Architecture Diagrams",
      "Task & Sprint Management",
      "PDF Export",
      "Priority support",
    ],
    cta: "Get Started",
    href: "/signup",
    popular: true,
    gradient: "from-violet-600/20 to-blue-600/10",
    border: "border-violet-500/40",
    ctaClass: "bg-white text-black hover:bg-zinc-100",
  },
  {
    name: "Team",
    price: "$79",
    period: "/month",
    desc: "For growing product teams.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team workspace",
      "Role-based access",
      "Analytics dashboard",
      "Slack integration",
      "Dedicated support",
      "Custom branding",
    ],
    cta: "Contact Sales",
    href: "/signup",
    popular: false,
    gradient: "from-white/[0.02] to-white/[0.01]",
    border: "border-white/10",
    ctaClass: "bg-white/[0.06] text-white hover:bg-white/10 border border-white/10",
  },
];

export default function Pricing() {
  const sectionRef = useRef(null);
  const titleInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="relative py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div ref={sectionRef} className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-zinc-400"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Simple pricing
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-2xl text-5xl font-bold text-white md:text-6xl"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Invest in your{" "}
            <span className="bg-gradient-to-r from-zinc-300 to-zinc-600 bg-clip-text text-transparent">
              product velocity
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-md text-lg text-zinc-400"
          >
            Start free. Upgrade when you're ready. No hidden fees, no surprises.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
              whileHover={{ y: -8 }}
              className={`relative overflow-hidden rounded-3xl border ${plan.border} bg-gradient-to-br ${plan.gradient} p-8 backdrop-blur-sm transition-all duration-300 ${
                plan.popular ? "shadow-2xl shadow-violet-500/10" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-300 border border-violet-500/30">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-zinc-400">{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                    {plan.price}
                  </span>
                  <span className="mb-2 text-zinc-500">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-zinc-500">{plan.desc}</p>
              </div>

              <Link href={plan.href} className="block">
                <Button
                  className={`w-full rounded-xl py-3 text-sm font-medium transition-all duration-300 ${plan.ctaClass}`}
                >
                  {plan.cta}
                </Button>
              </Link>

              <div className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5">
                      <Check className="h-3 w-3 text-zinc-300" />
                    </div>
                    <span className="text-sm text-zinc-400">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.popular && (
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-violet-600/5 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
