"use client";

import PageShell from "@/components/shared/PageShell";
import {
  FileCheck,
  ShieldAlert,
  Scale,
  CreditCard,
  CheckCircle2,
  Lock,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const termHighlights = [
    { title: "100% IP Ownership", desc: "You own all PRDs, specifications, diagrams, and codebase architecture generated on BuilderOS." },
    { title: "Transparent Billing", desc: "No hidden charges. Upgrade, downgrade, or cancel your plan anytime with a single click." },
    { title: "99.9% Uptime Commitment", desc: "Enterprise infrastructure designed for high availability and continuous AI workflow access." },
  ];

  return (
    <PageShell
      badge="Legal & Terms"
      title="Terms of"
      highlightTitle="Service"
      description="Last updated: August 6, 2026. Please review the binding terms governing your access and use of the BuilderOS platform."
      breadcrumbs={[{ label: "Legal" }, { label: "Terms of Service" }]}
    >
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3" style={{ fontFamily: "var(--font-sora)" }}>
              <div className="h-9 w-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <FileCheck className="h-5 w-5" />
              </div>
              1. Agreement & Acceptance of Terms
            </h2>
            <p className="text-sm text-[#9a9a9f] leading-relaxed mb-4">
              By registering an account, initiating an AI conversation, or accessing any service on BuilderOS, you enter into a legally binding agreement with BuilderOS Inc.
            </p>
            <p className="text-sm text-[#9a9a9f] leading-relaxed">
              If you are accepting these terms on behalf of a company, startup, or enterprise entity, you represent and warrant that you hold full legal authority to bind that organization to this agreement.
            </p>
          </section>

          <section className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-purple-500/5 to-black p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3" style={{ fontFamily: "var(--font-sora)" }}>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Scale className="h-5 w-5" />
              </div>
              2. Intellectual Property & AI Output Ownership
            </h2>
            <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 mb-4">
              <p className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                100% User Content Ownership
              </p>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
                You retain complete, exclusive, and unencumbered intellectual property rights over all PRD documents, feature specifications, architecture diagrams, and prompt outputs generated under your account.
              </p>
            </div>
            <p className="text-xs sm:text-sm text-[#9a9a9f] leading-relaxed">
              BuilderOS claims zero commercial ownership, copyright, or licensing rights over user-generated content created through platform usage.
            </p>
          </section>

          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3" style={{ fontFamily: "var(--font-sora)" }}>
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              3. Subscription Plans, Billing & Cancellation
            </h2>
            <p className="text-xs sm:text-sm text-[#9a9a9f] leading-relaxed mb-4">
              Paid tier subscriptions are billed on a recurring monthly or annual billing cycle starting from your subscription activation date.
            </p>
            <p className="text-xs sm:text-sm text-[#9a9a9f] leading-relaxed">
              You may cancel, upgrade, or downgrade your active subscription plan at any time directly through your Account Settings. Upon cancellation, your subscription remains active until the end of the current paid billing period.
            </p>
          </section>

          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3" style={{ fontFamily: "var(--font-sora)" }}>
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              4. Service Level & Limitation of Liability
            </h2>
            <p className="text-xs sm:text-sm text-[#9a9a9f] leading-relaxed mb-4">
              BuilderOS services are delivered on an "as is" and "as available" basis. While we strive to maintain uninterrupted 99.9% uptime across our AI engines, BuilderOS shall not be held liable for indirect, punitive, or consequential damages resulting from network delays or third-party LLM model API downtime.
            </p>
            <p className="text-xs sm:text-sm text-[#9a9a9f] leading-relaxed">
              For enterprise SLA commitments and custom uptime guarantees, please reach out to our dedicated Enterprise Sales team.
            </p>
          </section>
        </div>

        {/* Sidebar Summary & Support Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-400" /> Key Terms Summary
            </h3>
            <div className="space-y-4">
              {termHighlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                  <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{h.title}</h4>
                    <p className="text-[11px] text-[#8a8a93] mt-0.5 leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support Card */}
          <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 text-center">
            <HelpCircle className="h-8 w-8 text-sky-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Questions About Our Terms?</h3>
            <p className="text-xs text-[#8a8a93] mb-4 leading-relaxed">
              Need clarification on custom enterprise contracts or usage terms?
            </p>
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
