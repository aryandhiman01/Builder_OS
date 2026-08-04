"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  Sliders,
  Bell,
  Key,
  Database,
  ArrowLeft,
  Save,
  Loader2,
  Cpu,
  LayoutGrid,
  Zap,
  Globe,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  ShieldAlert,
  Shield,
  Lock,
  Mail,
  KeyRound,
  ExternalLink,
} from "lucide-react";

interface UserSettingsData {
  aiModel: string;
  defaultView: string;
  autoSavePrd: boolean;
  pollingInterval: string;
  emailNotifications: boolean;
  aiTaskAlerts: boolean;
  securityAlerts: boolean;
  customOpenAiKey: string;
  customGeminiKey: string;
  webhookUrl: string;
}

interface UserInfoData {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
  hasPassword?: boolean;
  authProviders: string[];
}

export default function SettingsClient() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfoData | null>(null);
  const [settings, setSettings] = useState<UserSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Active Tab: "general" | "security" | "notifications" | "api" | "danger"
  const [activeTab, setActiveTab] = useState<"general" | "security" | "notifications" | "api" | "danger">("general");

  // API Key Visibility Toggles
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenAiKey, setShowOpenAiKey] = useState(false);

  // Password Management States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);

  // Handle Change Password Submit
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
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
      if (!res.ok) throw new Error(data.error || "Failed to update password");

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

  // Handle Send Reset Password Email
  const handleSendResetEmail = async () => {
    if (!user?.email) return;
    try {
      setIsSendingResetEmail(true);
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset link");

      toast.success(`Password reset email sent to ${user.email}! Check your inbox.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error sending reset email");
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  // Fetch Settings & User Info from backend API
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to load workspace settings");

      const data = await res.json();
      setUser(data.user);
      setSettings(data.settings);
    } catch (err) {
      console.error("Settings fetch error:", err);
      toast.error("Failed to load live settings data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Handle Save Settings
  const handleSaveSettings = async (partialSettings?: Partial<UserSettingsData>) => {
    if (!settings) return;
    const payload = partialSettings ? { ...settings, ...partialSettings } : settings;

    try {
      setSaving(true);
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      setSettings(data.settings);
      toast.success("Workspace settings saved & synchronized!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  // Handle Export Data Download
  const handleExportData = () => {
    toast.info("Preparing workspace JSON backup download...");
    window.location.href = "/api/settings/export";
  };

  // Handle Clear Local Cache
  const handleClearCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Local app cache cleared successfully");
      window.location.reload();
    } catch {
      toast.error("Failed to clear local cache");
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#09090c]/90 px-4 sm:px-8 py-3.5 backdrop-blur-2xl shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="
              btn-shimmer
              flex
              cursor-pointer
              items-center
              gap-2
              rounded-full
              border
              border-white/15
              bg-white/[0.05]
              px-4
              py-2
              text-xs
              font-semibold
              text-white
              shadow-md
              transition-all
              hover:bg-white/10
              hover:border-white/25
              active:scale-95
              "
            >
              <ArrowLeft size={14} className="text-orange-400 shrink-0" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-3">
              <SettingsIcon size={16} className="text-orange-400" />
              <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                Workspace Preferences
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSaveSettings()}
              disabled={saving || !settings}
              className="
              btn-shimmer
              flex
              items-center
              gap-2
              rounded-full
              bg-white
              px-5
              py-2
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
              {saving ? (
                <Loader2 size={14} className="animate-spin text-black" />
              ) : (
                <Save size={14} />
              )}
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 sm:px-8 py-8 space-y-8">
        {loading && !settings ? (
          <div className="space-y-6">
            <div className="h-28 rounded-3xl border border-white/10 bg-[#09090c]/90 p-8 animate-pulse" />
            <div className="h-96 rounded-3xl border border-white/10 bg-[#09090c]/90 p-8 animate-pulse" />
          </div>
        ) : (
          <>
            {/* Header User Banner Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-white/10 bg-[#09090c]/95 p-6 backdrop-blur-2xl shadow-xl flex items-center justify-between flex-wrap gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-zinc-800 to-zinc-950 text-xl font-bold text-white">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{(user?.name || "B").charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div>
                  <h1 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                    {user?.name || "Builder"}&apos;s Workspace
                  </h1>
                  <p className="text-xs text-[#8a8a93]">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-mono font-medium text-orange-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                  PostgreSQL Persistence Active
                </span>
              </div>
            </motion.div>

            {/* Category Navigation Tabs */}
            <div className="flex border-b border-white/10 gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold transition-all relative ${activeTab === "general" ? "text-white" : "text-[#8a8a93] hover:text-white"
                  }`}
              >
                <Sliders size={14} className={activeTab === "general" ? "text-orange-400" : ""} />
                <span>General Workspace</span>
                {activeTab === "general" && (
                  <motion.div layoutId="tab-nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold transition-all relative ${activeTab === "security" ? "text-white" : "text-[#8a8a93] hover:text-white"
                  }`}
              >
                <Lock size={14} className={activeTab === "security" ? "text-orange-400" : ""} />
                <span>Security & Passwords</span>
                {activeTab === "security" && (
                  <motion.div layoutId="tab-nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold transition-all relative ${activeTab === "notifications" ? "text-white" : "text-[#8a8a93] hover:text-white"
                  }`}
              >
                <Bell size={14} className={activeTab === "notifications" ? "text-orange-400" : ""} />
                <span>Notifications</span>
                {activeTab === "notifications" && (
                  <motion.div layoutId="tab-nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("api")}
                className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold transition-all relative ${activeTab === "api" ? "text-white" : "text-[#8a8a93] hover:text-white"
                  }`}
              >
                <Key size={14} className={activeTab === "api" ? "text-orange-400" : ""} />
                <span>API Keys & Integrations</span>
                {activeTab === "api" && (
                  <motion.div layoutId="tab-nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("danger")}
                className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold transition-all relative ${activeTab === "danger" ? "text-white" : "text-[#8a8a93] hover:text-white"
                  }`}
              >
                <Database size={14} className={activeTab === "danger" ? "text-rose-400" : ""} />
                <span>Data & Danger Zone</span>
                {activeTab === "danger" && (
                  <motion.div layoutId="tab-nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-400 rounded-full" />
                )}
              </button>
            </div>

            {/* TAB 1: GENERAL WORKSPACE PREFERENCES */}
            {activeTab === "general" && settings && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-8"
              >
                <div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                    AI Copilot & View Defaults
                  </h3>
                  <p className="mt-1 text-xs text-[#8a8a93]">
                    Configure default AI model, layout preferences, and auto-save options.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Default AI Model Selection */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                      <Cpu size={14} className="text-orange-400" />
                      <span>Default AI Copilot Engine</span>
                    </label>
                    <select
                      value={settings.aiModel}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettings((prev) => (prev ? { ...prev, aiModel: val } : null));
                        handleSaveSettings({ aiModel: val });
                      }}
                      className="
                      w-full
                      rounded-xl
                      border
                      border-white/15
                      bg-black/80
                      px-4
                      py-3
                      text-xs sm:text-sm
                      text-white
                      outline-none
                      transition-all
                      focus:border-orange-500/60
                      cursor-pointer
                      "
                    >
                      <option value="gemini-3.6-flash">Google Gemini 3.6 Flash (Fast & High Intelligence)</option>
                      <option value="gpt-4o">OpenAI GPT-4o (Advanced Reasoning)</option>
                      <option value="claude-3.5-sonnet">Anthropic Claude 3.5 Sonnet (System Architecture)</option>
                    </select>
                  </div>

                  {/* Default Project View */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                      <LayoutGrid size={14} className="text-orange-400" />
                      <span>Default Project View</span>
                    </label>
                    <select
                      value={settings.defaultView}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettings((prev) => (prev ? { ...prev, defaultView: val } : null));
                        handleSaveSettings({ defaultView: val });
                      }}
                      className="
                      w-full
                      rounded-xl
                      border
                      border-white/15
                      bg-black/80
                      px-4
                      py-3
                      text-xs sm:text-sm
                      text-white
                      outline-none
                      transition-all
                      focus:border-orange-500/60
                      cursor-pointer
                      "
                    >
                      <option value="grid">Grid Card View</option>
                      <option value="kanban">Kanban Board View</option>
                      <option value="list">Detailed Table View</option>
                    </select>
                  </div>

                  {/* Realtime Dashboard Polling Interval */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                      <Zap size={14} className="text-orange-400" />
                      <span>Live Dashboard Sync Rate</span>
                    </label>
                    <select
                      value={settings.pollingInterval}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettings((prev) => (prev ? { ...prev, pollingInterval: val } : null));
                        handleSaveSettings({ pollingInterval: val });
                      }}
                      className="
                      w-full
                      rounded-xl
                      border
                      border-white/15
                      bg-black/80
                      px-4
                      py-3
                      text-xs sm:text-sm
                      text-white
                      outline-none
                      transition-all
                      focus:border-orange-500/60
                      cursor-pointer
                      "
                    >
                      <option value="3s">Realtime (Every 3 seconds)</option>
                      <option value="5s">Standard (Every 5 seconds)</option>
                      <option value="10s">Relaxed (Every 10 seconds)</option>
                    </select>
                  </div>

                  {/* Auto-Save PRD Toggle Switch */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                      PRD Auto-Persistence
                    </label>
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                      <span className="text-xs text-white font-medium">Auto-save generated PRDs to DB</span>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !settings.autoSavePrd;
                          setSettings((prev) => (prev ? { ...prev, autoSavePrd: val } : null));
                          handleSaveSettings({ autoSavePrd: val });
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.autoSavePrd ? "bg-orange-500" : "bg-zinc-700"
                          }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.autoSavePrd ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: SECURITY & PASSWORDS */}
            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Change Password Card */}
                <div className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Lock size={18} className="text-orange-400" />
                      <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                        Change Password
                      </h3>
                    </div>
                    <p className="mt-1 text-xs text-[#8a8a93]">
                      Update your account password directly within workspace settings.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-5 max-w-xl">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                        Current Password
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 pr-12 text-xs sm:text-sm text-white placeholder-[#8a8a93] outline-none focus:border-orange-500/60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 p-1 text-zinc-400 hover:text-white"
                        >
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                          New Password
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 pr-12 text-xs sm:text-sm text-white placeholder-[#8a8a93] outline-none focus:border-orange-500/60"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 p-1 text-zinc-400 hover:text-white"
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                          Confirm New Password
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat new password"
                            className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 pr-12 text-xs sm:text-sm text-white placeholder-[#8a8a93] outline-none focus:border-orange-500/60"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 p-1 text-zinc-400 hover:text-white"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="btn-shimmer flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs font-semibold text-black shadow-lg shadow-white/10 transition-all hover:bg-zinc-100 active:scale-95 disabled:opacity-50"
                    >
                      {isChangingPassword ? <Loader2 size={15} className="animate-spin text-black" /> : <Save size={15} />}
                      <span>Update Password</span>
                    </button>
                  </form>
                </div>

                {/* Reset Password & Password Recovery Card */}
                <div className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <KeyRound size={18} className="text-orange-400" />
                      <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                        Reset Password & Link Recovery
                      </h3>
                    </div>
                    <p className="mt-1 text-xs text-[#8a8a93]">
                      Forgotten your password or need a secure reset link sent to your registered email?
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-white">Send Password Reset Email</p>
                      <p className="text-[11px] text-[#8a8a93] mt-0.5">
                        We will send a 1-hour secure password reset link to <span className="text-orange-400 font-mono">{user?.email}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendResetEmail}
                      disabled={isSendingResetEmail}
                      className="btn-shimmer shrink-0 flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 text-xs font-semibold text-orange-400 hover:bg-orange-500/20 active:scale-95 transition disabled:opacity-50"
                    >
                      {isSendingResetEmail ? <Loader2 size={14} className="animate-spin text-orange-400" /> : <Mail size={14} />}
                      <span>Send Reset Link</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: NOTIFICATIONS */}
            {activeTab === "notifications" && settings && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                    Notification Preferences
                  </h3>
                  <p className="mt-1 text-xs text-[#8a8a93]">
                    Manage email alerts, AI task completion notifications, and security alerts.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div>
                      <p className="text-xs font-bold text-white">Email Product Notifications</p>
                      <p className="text-[11px] text-[#8a8a93]">Receive summary reports on project milestone completions.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const val = !settings.emailNotifications;
                        setSettings((prev) => (prev ? { ...prev, emailNotifications: val } : null));
                        handleSaveSettings({ emailNotifications: val });
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${settings.emailNotifications ? "bg-orange-500" : "bg-zinc-700"
                        }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${settings.emailNotifications ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div>
                      <p className="text-xs font-bold text-white">AI Copilot Task Alerts</p>
                      <p className="text-[11px] text-[#8a8a93]">Get notified when AI background research or code generation finishes.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const val = !settings.aiTaskAlerts;
                        setSettings((prev) => (prev ? { ...prev, aiTaskAlerts: val } : null));
                        handleSaveSettings({ aiTaskAlerts: val });
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${settings.aiTaskAlerts ? "bg-orange-500" : "bg-zinc-700"
                        }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${settings.aiTaskAlerts ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div>
                      <p className="text-xs font-bold text-white">Security & Login Alerts</p>
                      <p className="text-[11px] text-[#8a8a93]">Receive immediate notifications on new login devices or password changes.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const val = !settings.securityAlerts;
                        setSettings((prev) => (prev ? { ...prev, securityAlerts: val } : null));
                        handleSaveSettings({ securityAlerts: val });
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${settings.securityAlerts ? "bg-orange-500" : "bg-zinc-700"
                        }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${settings.securityAlerts ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: API KEYS & INTEGRATIONS */}
            {activeTab === "api" && settings && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                    Custom API Keys & Webhooks
                  </h3>
                  <p className="mt-1 text-xs text-[#8a8a93]">
                    Optionally use your own custom API keys for higher rate limits.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Gemini API Key */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                      Custom Gemini API Key
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showGeminiKey ? "text" : "password"}
                        value={settings.customGeminiKey}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettings((prev) => (prev ? { ...prev, customGeminiKey: val } : null));
                        }}
                        placeholder="AIzaSy..."
                        className="
                        w-full
                        rounded-xl
                        border
                        border-white/15
                        bg-black/60
                        px-4
                        py-3
                        pr-12
                        text-xs sm:text-sm
                        text-white
                        placeholder-[#8a8a93]
                        outline-none
                        focus:border-orange-500/60
                        "
                      />
                      <button
                        type="button"
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                        className="absolute right-3 p-1 text-zinc-400 hover:text-white"
                      >
                        {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* OpenAI API Key */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                      Custom OpenAI API Key
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showOpenAiKey ? "text" : "password"}
                        value={settings.customOpenAiKey}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettings((prev) => (prev ? { ...prev, customOpenAiKey: val } : null));
                        }}
                        placeholder="sk-proj-..."
                        className="
                        w-full
                        rounded-xl
                        border
                        border-white/15
                        bg-black/60
                        px-4
                        py-3
                        pr-12
                        text-xs sm:text-sm
                        text-white
                        placeholder-[#8a8a93]
                        outline-none
                        focus:border-orange-500/60
                        "
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                        className="absolute right-3 p-1 text-zinc-400 hover:text-white"
                      >
                        {showOpenAiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Webhook Endpoint URL */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
                      Webhook Notification URL
                    </label>
                    <input
                      type="url"
                      value={settings.webhookUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettings((prev) => (prev ? { ...prev, webhookUrl: val } : null));
                      }}
                      placeholder="https://your-server.com/api/webhooks/builder-os"
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
                      focus:border-orange-500/60
                      "
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                  <button
                    onClick={() => handleSaveSettings()}
                    disabled={saving}
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
                    "
                  >
                    {saving ? <Loader2 size={15} className="animate-spin text-black" /> : <Save size={15} />}
                    <span>Save Integration Keys</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 4: DATA BACKUP & DANGER ZONE */}
            {activeTab === "danger" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Data Export & Cache Card */}
                <div className="rounded-3xl border border-white/10 bg-[#09090c]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                      Data Backup & Local Maintenance
                    </h3>
                    <p className="mt-1 text-xs text-[#8a8a93]">
                      Download full workspace JSON backups or reset local browser state.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={handleExportData}
                      className="
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      p-4
                      text-left
                      transition-all
                      hover:bg-white/[0.08]
                      hover:border-orange-500/30
                      cursor-pointer
                      "
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                          <Download size={15} className="text-orange-400" />
                          <span>Export Complete Workspace (JSON)</span>
                        </div>
                        <p className="mt-1 text-[11px] text-[#8a8a93]">
                          Includes all projects, tasks, PRDs, roadmaps, research & AI chats.
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={handleClearCache}
                      className="
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      p-4
                      text-left
                      transition-all
                      hover:bg-white/[0.08]
                      hover:border-amber-500/30
                      cursor-pointer
                      "
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                          <RefreshCw size={15} className="text-amber-400" />
                          <span>Clear Local Browser Cache</span>
                        </div>
                        <p className="mt-1 text-[11px] text-[#8a8a93]">
                          Clears local storage state and forces fresh database fetch.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Danger Zone Card */}
                <div className="rounded-3xl border border-rose-500/20 bg-rose-500/[0.03] p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-4">
                  <div className="flex items-center gap-3 text-rose-400">
                    <ShieldAlert size={20} />
                    <h3 className="text-lg font-bold text-rose-400" style={{ fontFamily: "var(--font-sora)" }}>
                      Danger Zone
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 max-w-xl">
                    Deleting your BuilderOS workspace account will permanently delete all your projects, tasks, generated PRDs, roadmaps, and AI conversation history. This action cannot be undone.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (confirm("Are you absolutely sure you want to delete your BuilderOS account? All data will be permanently wiped.")) {
                          toast.error("Account deletion requested. Contacting server...");
                        }
                      }}
                      className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-rose-500/40
                      bg-rose-500/10
                      px-5
                      py-2.5
                      text-xs
                      font-semibold
                      text-rose-300
                      transition-all
                      hover:bg-rose-500/20
                      active:scale-95
                      cursor-pointer
                      "
                    >
                      <Trash2 size={15} />
                      <span>Delete Workspace Account</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
