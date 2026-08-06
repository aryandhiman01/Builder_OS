"use client";

import PageShell from "@/components/shared/PageShell";
import {
  ShieldCheck,
  Lock,
  Database,
  FileText,
  CheckCircle2,
  Download,
  Mail,
  UserCheck,
  Server,
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const highlights = [
    { title: "No AI Training on Your Data", desc: "Your PRDs, prompts, and architecture code are never used to train public LLMs." },
    { title: "Isolated Memory Execution", desc: "Context tokens are processed in volatile memory and purged immediately post-request." },
    { title: "Full Ownership & Control", desc: "You own 100% of generated documents and can request complete account data deletion anytime." },
  ];

  return (
    <PageShell
      badge="Legal & Trust"
      title="Privacy"
      highlightTitle="Policy"
      description="Last updated: August 6, 2026. Learn how BuilderOS collects, protects, and handles your data with enterprise-grade isolation."
      breadcrumbs={[{ label: "Legal" }, { label: "Privacy Policy" }]}
    >
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3" style={{ fontFamily: "var(--font-sora)" }}>
              <div className="h-9 w-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              1. Overview & Data Commitment
            </h2>
            <p className="text-sm text-[#9a9a9f] leading-relaxed mb-4">
              BuilderOS ("we", "our", or "us") is dedicated to protecting your privacy and workspace confidentiality. This Privacy Policy details the types of personal and project information we collect, how it is processed, and the strict security measures we enforce across our Next.js & PostgreSQL infrastructure.
            </p>
            <p className="text-sm text-[#9a9a9f] leading-relaxed">
              By accessing or using BuilderOS, you agree to the transparent collection and processing of information as described in this agreement.
            </p>
          </section>

          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3" style={{ fontFamily: "var(--font-sora)" }}>
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Database className="h-5 w-5" />
              </div>
              2. Information We Collect
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.01]">
                <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-orange-400" /> Account Information
                </h3>
                <p className="text-xs sm:text-sm text-[#9a9a9f] leading-relaxed">
                  Email address, full name, profile image, and OAuth provider tokens (Google, GitHub, or NextAuth credential sessions).
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.01]">
                <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-400" /> Workspace & AI Project Assets
                </h3>
                <p className="text-xs sm:text-sm text-[#9a9a9f] leading-relaxed">
                  Feature prompts, AI-generated PRDs, technical roadmaps, task boards, and Mermaid.js architecture topologies created within your projects.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.01]">
                <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                  <Server className="h-4 w-4 text-sky-400" /> Telemetry & System Diagnostics
                </h3>
                <p className="text-xs sm:text-sm text-[#9a9a9f] leading-relaxed">
                  API request latency, device user agent, IP address, error logs, and session state performance counters.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-purple-500/5 to-black p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3" style={{ fontFamily: "var(--font-sora)" }}>
              <div className="h-9 w-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              3. AI Model Data Isolation Guarantee
            </h2>
            <div className="p-4 rounded-2xl bg-black/40 border border-orange-500/20 mb-4">
              <p className="text-sm font-semibold text-orange-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                Zero Public Training Guarantee
              </p>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
                We strictly guarantee that your proprietary ideas, PRDs, code blocks, and system architecture specs are <strong>NEVER used to train, fine-tune, or evaluate public foundation models</strong>.
              </p>
            </div>
            <p className="text-xs sm:text-sm text-[#9a9a9f] leading-relaxed">
              All LLM prompt requests are dispatched via encrypted API tunnels to isolated enterprise endpoints where tokens exist in RAM only for the duration of inference.
            </p>
          </section>

          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3" style={{ fontFamily: "var(--font-sora)" }}>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              4. Data Subject Rights & Contact
            </h2>
            <p className="text-xs sm:text-sm text-[#9a9a9f] leading-relaxed mb-4">
              You retain complete ownership over your account data. Under GDPR, CCPA, and global data privacy standards, you have the right to inspect, export, or permanently delete your account and all associated workspace records at any time.
            </p>
            <p className="text-xs sm:text-sm text-[#9a9a9f] leading-relaxed">
              To submit a privacy inquiry or request account erasure, reach out directly to our privacy officer at{" "}
              <a href="mailto:aryandhiman2605@gmail.com" className="text-orange-400 hover:underline font-medium">
                aryandhiman2605@gmail.com
              </a>.
            </p>
          </section>
        </div>

        {/* Sidebar Summary & Highlights Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lock className="h-4 w-4 text-orange-400" /> Key Privacy Highlights
            </h3>
            <div className="space-y-4">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{h.title}</h4>
                    <p className="text-[11px] text-[#8a8a93] mt-0.5 leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact Card */}
          <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 text-center">
            <Mail className="h-8 w-8 text-orange-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Have Privacy Questions?</h3>
            <p className="text-xs text-[#8a8a93] mb-4 leading-relaxed">
              Our team responds to all privacy inquiries within 24 hours.
            </p>
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition-all"
            >
              Contact Privacy Team
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
