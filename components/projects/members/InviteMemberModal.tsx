"use client";

import { useState } from "react";
import { X, Mail, Loader2, CheckCircle2, Send } from "lucide-react";

interface InviteMemberModalProps {
  projectId: string;
  onClose: () => void;
  onInvited: () => void;
}

export default function InviteMemberModal({
  projectId,
  onClose,
  onInvited,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      setSuccess(true);
      onInvited();

      // Auto-close after 2s
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4">
        <div className="rounded-2xl border border-white/10 bg-[#111113] shadow-2xl overflow-hidden">
          {/* Top gradient strip */}
          <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Invite Team Member</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  They&apos;ll receive an email with an invitation link.
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:border-white/20 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            {success ? (
              /* Success state */
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Invitation sent!</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    An email has been sent to{" "}
                    <span className="text-zinc-200">{email}</span>
                  </p>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="teammate@example.com"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        py-3
                        pl-10
                        pr-4
                        text-sm
                        text-white
                        outline-none
                        transition
                        placeholder:text-zinc-600
                        focus:border-white/20
                      "
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="mt-2 text-xs text-red-400">{error}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="
                      flex-1
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      py-2.5
                      text-sm
                      font-medium
                      text-zinc-400
                      transition
                      hover:bg-white/[0.06]
                      hover:text-white
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      flex
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-gradient-to-r
                      from-indigo-500
                      to-purple-600
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:opacity-90
                      disabled:opacity-50
                    "
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Send Invite
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
