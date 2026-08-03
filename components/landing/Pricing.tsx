"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles, Zap, ArrowRight } from "lucide-react";
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
    accent: null,
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
    accent: "#FF6B35",
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
    accent: null,
  },
];

export default function Pricing() {
  const sectionRef = useRef(null);
  const titleInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="relative py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="hairline-x absolute inset-x-0 top-0" />
        <div className="glow-orange absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-25" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div ref={sectionRef} className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-sm text-[#8a8a93]"
          >
            <Zap className="h-3.5 w-3.5 text-orange-400" />
            Simple pricing
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-2xl text-5xl font-bold text-white md:text-6xl"
            style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.03em" }}
          >
            Invest in your{" "}
            <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
              product velocity
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-md text-lg text-[#8a8a93]"
          >
            Start free. Upgrade when you're ready. No hidden fees, no surprises.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300"
              style={{
                background: plan.popular ? "rgba(255,107,53,0.06)" : "rgba(255,255,255,0.025)",
                borderColor: plan.popular ? "rgba(255,107,53,0.35)" : "rgba(255,255,255,0.08)",
                boxShadow: plan.popular ? "0 0 40px rgba(255,107,53,0.08)" : "none",
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              )}

              <div className="p-7">
                {/* Plan name + price */}
                <div className="mb-7">
                  <p className="mb-2 text-sm font-semibold text-[#8a8a93] uppercase tracking-widest">{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span
                      className="text-5xl font-bold text-white"
                      style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.04em" }}
                    >
                      {plan.price}
                    </span>
                    <span className="mb-2 text-[#8a8a93]">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-[#8a8a93]">{plan.desc}</p>
                </div>

                {/* CTA */}
                <Link href={plan.href} className="block">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className={`w-full rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                        plan.popular
                          ? "bg-white text-black hover:bg-zinc-100"
                          : "border border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.09]"
                      }`}
                    >
                      {plan.cta}
                      {plan.popular && <ArrowRight className="ml-1.5 h-4 w-4" />}
                    </Button>
                  </motion.div>
                </Link>

                {/* Divider */}
                <div className="my-7 h-px bg-white/[0.06]" />

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: plan.popular ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.06)",
                        }}
                      >
                        <Check
                          className="h-3 w-3"
                          style={{ color: plan.popular ? "#FF6B35" : "#8a8a93" }}
                        />
                      </div>
                      <span className="text-sm text-[#8a8a93]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular glow overlay */}
              {plan.popular && (
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-600/5 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 text-center text-sm text-[#8a8a93]/60"
        >
          All plans include a 14-day free trial. No credit card required to start.
        </motion.p>
      </div>
    </section>
  );
}
