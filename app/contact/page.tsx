"use client";

import { useState } from "react";
import PageShell from "@/components/shared/PageShell";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { FaDiscord, FaGithub } from "react-icons/fa6";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.message.trim()) {
      setError("Please enter your message.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message.");
      }

      setSuccess(data.message || "Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactOptions = [
    {
      icon: Mail,
      title: "Email Direct",
      desc: "For general support, billing, or enterprise inquiries.",
      value: "aryandhiman2605@gmail.com",
      action: "mailto:aryandhiman2605@gmail.com",
      color: "bg-white/[0.02] border-white/[0.08] text-orange-400",
    },
    {
      icon: Clock,
      title: "Response SLA",
      desc: "Our global engineering team responds rapidly.",
      value: "< 24 Hours Guaranteed",
      color: "bg-white/[0.02] border-white/[0.08] text-purple-400",
    },
    {
      icon: Building2,
      title: "Enterprise Sales",
      desc: "Custom deployment, SLA guarantees & dedicated support.",
      value: "aryandhiman2605@gmail.com",
      action: "mailto:aryandhiman2605@gmail.com",
      color: "bg-white/[0.02] border-white/[0.08] text-sky-400",
    },
  ];

  return (
    <PageShell
      badge="Get In Touch"
      title="How can we help"
      highlightTitle="your workflow?"
      description="Have questions about BuilderOS, feature requests, enterprise setups, or technical support? Send us a message and our team will get back to you promptly."
      breadcrumbs={[{ label: "Company" }, { label: "Contact Us" }]}
    >
      <div className="grid lg:grid-cols-12 gap-12 mb-16 items-start">
        {/* Left Column: Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                  Send a Direct Message
                </h2>
                <p className="text-xs text-[#8a8a93]">Fill out the details below to reach our team.</p>
              </div>
            </div>

            {/* Error Notification Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 flex items-start gap-3"
              >
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div>{error}</div>
              </motion.div>
            )}

            {/* Success Notification Banner */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center"
              >
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Message Delivered!</h3>
                <p className="text-xs sm:text-sm text-zinc-300 mb-6 leading-relaxed">
                  {success}
                </p>
                <button
                  onClick={() => setSuccess(null)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-black font-semibold px-5 py-2.5 text-xs hover:bg-zinc-200 transition-all"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Your Name <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Work Email <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-2">
                    Subject Topic <span className="text-orange-400">*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Enterprise & Sales">Enterprise & Sales</option>
                    <option value="Feature Request">Feature Request / Feedback</option>
                    <option value="Partnership">Partnerships & Integrations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-2">
                    Your Message <span className="text-orange-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us how we can help your team..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-black shadow-lg hover:bg-zinc-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Submit Message <Send className="h-4 w-4 text-black" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Right Column: Info Cards & Community Hubs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Info Cards */}
          <div className="space-y-4">
            {contactOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl border bg-gradient-to-r p-5 backdrop-blur-xl ${opt.color}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-white/10 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{opt.title}</h3>
                      <p className="text-xs text-[#8a8a93] mt-0.5 mb-2 leading-relaxed">{opt.desc}</p>
                      {opt.action ? (
                        <a
                          href={opt.action}
                          className="text-xs font-mono font-bold text-white underline underline-offset-4 hover:text-orange-400 transition-colors"
                        >
                          {opt.value}
                        </a>
                      ) : (
                        <span className="text-xs font-mono font-bold text-white">{opt.value}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Community Quick Join */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Join Live Developer Hubs</h3>
            </div>
            <p className="text-xs text-[#8a8a93] leading-relaxed mb-5">
              Prefer instant live chat or open GitHub discussions? Join our global community channels.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                href="/community"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all"
              >
                <FaDiscord className="h-4 w-4" /> Discord Server
              </Link>
              <Link
                href="/community"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all"
              >
                <FaGithub className="h-4 w-4" /> GitHub Discussions
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}
