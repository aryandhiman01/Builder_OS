"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Layers,
  Loader2,
} from "lucide-react";

import Logo from "@/components/shared/Logo";
import SocialAuthButtons from "./SocialAuthButtons";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (urlError === "OAuthAccountNotLinked") {
      setError("An account with this email already exists. We have linked your login method!");
    } else if (urlError) {
      setError("Authentication failed. Please try again.");
    }
  }, [urlError]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#060606] px-4 py-12 text-white overflow-hidden">
      {/* Background Grid Noise & Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hairline-x absolute inset-x-0 top-0 opacity-50" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-orange-500/10 blur-[130px]" />
      </div>

      {/* Main Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          mockup-card
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-[#09090c]/95
          backdrop-blur-2xl
          shadow-2xl
        "
      >
        {/* Top Window Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-0.5 shadow-inner">
            <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-[11px] font-semibold text-white/90">
              BuilderOS Auth · Secure SSL
            </span>
          </div>

          <div className="w-12" />
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8">
          {/* Header & Logo */}
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              <Logo />
            </div>

            <h1
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Welcome Back
            </h1>

            <p className="mt-1.5 text-xs text-[#8a8a93]">
              Continue building products with your AI copilot.
            </p>
          </div>

          {/* Social Auth */}
          <SocialAuthButtons />

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] font-mono uppercase text-[#8a8a93]">
              or continue with email
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-300">
              <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="pointer-events-none absolute left-3.5 text-[#8a8a93]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/60
                    py-2.5
                    pl-10
                    pr-4
                    text-xs
                    text-white
                    placeholder:text-[#8a8a93]
                    outline-none
                    transition-all
                    duration-200
                    focus:border-orange-500/60
                    focus:bg-black/80
                    focus:ring-2
                    focus:ring-orange-500/20
                  "
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold text-[#8a8a93]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock size={16} className="pointer-events-none absolute left-3.5 text-[#8a8a93]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/60
                    py-2.5
                    pl-10
                    pr-10
                    text-xs
                    text-white
                    placeholder:text-[#8a8a93]
                    outline-none
                    transition-all
                    duration-200
                    focus:border-orange-500/60
                    focus:bg-black/80
                    focus:ring-2
                    focus:ring-orange-500/20
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#8a8a93] hover:text-white transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                btn-shimmer
                mt-2
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-white
                py-3
                text-xs
                font-bold
                text-black
                shadow-lg
                shadow-white/10
                transition-all
                duration-200
                hover:bg-zinc-100
                active:scale-95
                disabled:opacity-50
              "
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-xs text-[#8a8a93]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-white hover:text-orange-400 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}