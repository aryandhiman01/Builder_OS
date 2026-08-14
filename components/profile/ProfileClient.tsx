"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  Shield,
  Key,
  FolderKanban,
  CheckCircle2,
  Brain,
  Sparkles,
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  Lock,
  Camera,
  Check,
  Zap,
  Activity,
  Layers,
} from "lucide-react";
import Logo from "@/components/shared/Logo";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
  hasPassword: boolean;
  authProviders: string[];
}

interface UserStatsData {
  projectsCount: number;
  tasksCount: number;
  completedTasksCount: number;
  aiConversationsCount: number;
  researchesCount: number;
  prdsCount: number;
  roadmapsCount: number;
  totalAiRuns: number;
}

export default function ProfileClient() {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit profile form state
  const [nameInput, setNameInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security password change form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Active Tab: "profile" | "security" | "stats"
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "stats">("profile");

  // Fetch live real-time profile & stats from backend
  const fetchProfile = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await fetch("/api/user/profile", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load profile");

      const data = await res.json();
      setUser(data.user);
      setStats(data.stats);
      setNameInput(data.user.name || "");
      setImageInput(data.user.image || "");

      try {
        sessionStorage.setItem("builderos_profile_cache", JSON.stringify(data));
      } catch {
        // ignore
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      toast.error("Failed to load live profile data");
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let hasCache = false;
    try {
      const cached = sessionStorage.getItem("builderos_profile_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.user) {
          setUser(parsed.user);
          setStats(parsed.stats);
          setNameInput(parsed.user.name || "");
          setImageInput(parsed.user.image || "");
          setLoading(false);
          hasCache = true;
        }
      }
    } catch {
      // ignore
    }

    fetchProfile(hasCache);
  }, [fetchProfile]);

  // Member Since date formatting
  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "Recently";
    return new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }, [user?.createdAt]);

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    try {
      setIsSavingProfile(true);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput.trim(),
          image: imageInput.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setUser((prev) => (prev ? { ...prev, name: data.user.name, image: data.user.image } : null));
      try {
        if (updateSession) {
          await updateSession({ name: data.user.name, image: data.user.image });
        }
      } catch {
        // ignore
      }
      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* Exact Landing Page Floating Pill Navbar Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-2 sm:top-3 inset-x-0 z-50 px-3 sm:px-6 w-full max-w-full box-border"
      >
        <div className="mx-auto max-w-5xl rounded-full border border-white/[0.1] bg-[#0a0a0c]/90 backdrop-blur-xl px-3.5 sm:px-6 py-2 sm:py-2.5 shadow-2xl shadow-black/80 flex items-center justify-between">
          {/* Left: Dashboard Link + Logo & Profile Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 hover:border-white/25 active:scale-95 shrink-0"
            >
              <ArrowLeft size={13} className="text-orange-400 shrink-0" />
              <span>Dashboard</span>
            </Link>

            <div className="flex items-center gap-3 border-l border-white/10 pl-3">
              <Logo />
              <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-[#8a8a93] tracking-wide" style={{ fontFamily: "var(--font-sora)" }}>
                / Profile
              </span>
            </div>
          </div>

          {/* Right: Live Sync Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-xs font-mono font-medium text-orange-400">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              Live Sync
            </span>
          </div>
        </div>
      </motion.header>

      {/* Main Content Container — Balanced max-w-5xl (Not too wide) */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-20 sm:pt-24 pb-12 space-y-6 sm:space-y-8">
        {loading && !user ? (
          <div className="space-y-6">
            <div className="h-44 rounded-3xl border border-white/10 bg-[#09090c]/90 p-8 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 rounded-2xl border border-white/10 bg-[#09090c]/90 animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* User Profile Banner Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-[#09090c]/95
              p-6 sm:p-8
              backdrop-blur-2xl
              shadow-2xl
              "
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Large Avatar */}
                  <div className="relative group shrink-0">
                    <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/15 bg-gradient-to-br from-zinc-800 to-zinc-950 text-3xl font-extrabold text-white shadow-xl">
                      {imageInput ? (
                        <Image
                          src={imageInput}
                          alt={user?.name || "User"}
                          width={112}
                          height={112}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span style={{ fontFamily: "var(--font-sora)" }}>
                          {(user?.name || "B").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* User Info & Badges */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1
                        className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
                        style={{ fontFamily: "var(--font-sora)" }}
                      >
                        {user?.name || "Builder"}
                      </h1>
                      <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-0.5 text-xs font-mono font-semibold text-orange-400">
                        Active Builder
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#8a8a93] flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} className="text-orange-400" />
                        <span>{user?.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        <span>Joined {memberSince}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Header Action Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="
                    btn-shimmer
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-white
                    px-5
                    py-2.5
                    text-xs
                    font-semibold
                    text-black
                    shadow-lg
                    shadow-white/10
                    transition-all
                    hover:bg-zinc-100
                    active:scale-95
                    disabled:opacity-50
                    "
                  >
                    {isSavingProfile ? (
                      <Loader2 size={14} className="animate-spin text-black" />
                    ) : (
                      <Save size={14} />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Live Realtime Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              <div className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-5 backdrop-blur-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between text-[#8a8a93]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Projects</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                    <FolderKanban size={18} />
                  </div>
                </div>
                <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                  {stats?.projectsCount ?? 0}
                </h2>
                <p className="text-xs text-[#8a8a93]">Active product workspaces</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-5 backdrop-blur-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between text-[#8a8a93]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Tasks</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 size={18} />
                  </div>
                </div>
                <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                  {stats?.completedTasksCount ?? 0} <span className="text-sm font-normal text-[#8a8a93]">/ {stats?.tasksCount ?? 0}</span>
                </h2>
                <p className="text-xs text-[#8a8a93]">Completed product tasks</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-5 backdrop-blur-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between text-[#8a8a93]">
                  <span className="text-xs font-semibold uppercase tracking-wider">AI Artifacts</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    <Brain size={18} />
                  </div>
                </div>
                <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                  {stats?.totalAiRuns ?? 0}
                </h2>
                <p className="text-xs text-[#8a8a93]">PRDs, roadmaps & research</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#09090c]/90 p-5 backdrop-blur-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between text-[#8a8a93]">
                  <span className="text-xs font-semibold uppercase tracking-wider">AI Chats</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
                    <Sparkles size={18} />
                  </div>
                </div>
                <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                  {stats?.aiConversationsCount ?? 0}
                </h2>
                <p className="text-xs text-[#8a8a93]">Saved conversations</p>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`pb-3 px-4 text-xs font-bold transition-all relative ${
                  activeTab === "profile" ? "text-white" : "text-[#8a8a93] hover:text-white"
                }`}
              >
                Profile Details
                {activeTab === "profile" && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`pb-3 px-4 text-xs font-bold transition-all relative ${
                  activeTab === "security" ? "text-white" : "text-[#8a8a93] hover:text-white"
                }`}
              >
                Security & Password
                {activeTab === "security" && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("stats")}
                className={`pb-3 px-4 text-xs font-bold transition-all relative ${
                  activeTab === "stats" ? "text-white" : "text-[#8a8a93] hover:text-white"
                }`}
              >
                Workspace Activity
                {activeTab === "stats" && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full" />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="space-y-6">
              {/* TAB 1: PROFILE DETAILS */}
              {activeTab === "profile" && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSaveProfile}
                  className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                      Personal Information
                    </h3>
                    <p className="mt-1 text-xs text-[#8a8a93]">
                      Update your account details and profile picture URL.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Enter your full name"
                        className="
                        w-full
                        rounded-xl
                        border
                        border-white/15
                        bg-black/60
                        px-4
                        py-3
                        text-xs sm:text-sm
                        text-white
                        placeholder-[#8a8a93]
                        outline-none
                        transition-all
                        focus:border-orange-500/60
                        focus:ring-2
                        focus:ring-orange-500/20
                        "
                      />
                    </div>

                    {/* Email Address (Read-only) */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs sm:text-sm text-zinc-400">
                        <Mail size={15} className="text-zinc-500" />
                        <span>{user?.email}</span>
                        <span className="ml-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Avatar Image URL */}
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                        Avatar Image URL
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="url"
                          value={imageInput}
                          onChange={(e) => setImageInput(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          className="
                          w-full
                          rounded-xl
                          border
                          border-white/15
                          bg-black/60
                          px-4
                          py-3
                          text-xs sm:text-sm
                          text-white
                          placeholder-[#8a8a93]
                          outline-none
                          transition-all
                          focus:border-orange-500/60
                          focus:ring-2
                          focus:ring-orange-500/20
                          "
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="
                      btn-shimmer
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-white
                      px-6
                      py-2.5
                      text-xs
                      font-semibold
                      text-black
                      shadow-lg
                      shadow-white/10
                      transition-all
                      hover:bg-zinc-100
                      active:scale-95
                      disabled:opacity-50
                      "
                    >
                      {isSavingProfile ? (
                        <Loader2 size={15} className="animate-spin text-black" />
                      ) : (
                        <Save size={15} />
                      )}
                      <span>Save Profile</span>
                    </button>
                  </div>
                </motion.form>
              )}

              {/* TAB 2: SECURITY & PASSWORD */}
              {activeTab === "security" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                      Account Security
                    </h3>
                    <p className="mt-1 text-xs text-[#8a8a93]">
                      Manage your password and authentication methods.
                    </p>
                  </div>

                  {/* Auth Provider Badge */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                        <Shield size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Authentication Status</p>
                        <p className="text-[11px] text-[#8a8a93]">
                          {user?.authProviders.length
                            ? `Connected via OAuth (${user.authProviders.join(", ")})`
                            : "Standard Password Account"}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono text-emerald-400">
                      Protected
                    </span>
                  </div>

                  {/* Change Password Form */}
                  {user?.hasPassword ? (
                    <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="
                          w-full
                          rounded-xl
                          border
                          border-white/15
                          bg-black/60
                          px-4
                          py-3
                          text-xs sm:text-sm
                          text-white
                          placeholder-[#8a8a93]
                          outline-none
                          transition-all
                          focus:border-orange-500/60
                          focus:ring-2
                          focus:ring-orange-500/20
                          "
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="
                            w-full
                            rounded-xl
                            border
                            border-white/15
                            bg-black/60
                            px-4
                            py-3
                            text-xs sm:text-sm
                            text-white
                            placeholder-[#8a8a93]
                            outline-none
                            transition-all
                            focus:border-orange-500/60
                            focus:ring-2
                            focus:ring-orange-500/20
                            "
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="
                            w-full
                            rounded-xl
                            border
                            border-white/15
                            bg-black/60
                            px-4
                            py-3
                            text-xs sm:text-sm
                            text-white
                            placeholder-[#8a8a93]
                            outline-none
                            transition-all
                            focus:border-orange-500/60
                            focus:ring-2
                            focus:ring-orange-500/20
                            "
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="
                          btn-shimmer
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-white
                          px-6
                          py-2.5
                          text-xs
                          font-semibold
                          text-black
                          shadow-lg
                          shadow-white/10
                          transition-all
                          hover:bg-zinc-100
                          active:scale-95
                          disabled:opacity-50
                          "
                        >
                          {isChangingPassword ? (
                            <Loader2 size={15} className="animate-spin text-black" />
                          ) : (
                            <Key size={15} />
                          )}
                          <span>Update Password</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center">
                      <Lock size={24} className="mx-auto text-[#8a8a93] mb-2" />
                      <p className="text-xs text-white font-bold">Social Login Account</p>
                      <p className="mt-1 text-xs text-[#8a8a93] max-w-md mx-auto">
                        You signed in using a third-party provider (Google/GitHub). Password management is handled securely via your provider.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: WORKSPACE ACTIVITY */}
              {activeTab === "stats" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                      Live Workspace Activity Breakdown
                    </h3>
                    <p className="mt-1 text-xs text-[#8a8a93]">
                      Real-time usage analytics directly synced with PostgreSQL database.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
                      <span className="text-[11px] font-mono text-amber-400">RESEARCH & PRDs</span>
                      <p className="text-2xl font-bold text-white">{stats?.prdsCount ?? 0} PRDs</p>
                      <p className="text-xs text-[#8a8a93]">{stats?.researchesCount ?? 0} Deep research runs</p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
                      <span className="text-[11px] font-mono text-orange-400">PRODUCT ROADMAPS</span>
                      <p className="text-2xl font-bold text-white">{stats?.roadmapsCount ?? 0} Roadmaps</p>
                      <p className="text-xs text-[#8a8a93]">Sprint milestones created</p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
                      <span className="text-[11px] font-mono text-emerald-400">TASKS EXECUTION</span>
                      <p className="text-2xl font-bold text-white">{stats?.completedTasksCount ?? 0} Completed</p>
                      <p className="text-xs text-[#8a8a93]">Out of {stats?.tasksCount ?? 0} total tasks</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
