"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ArrowRight,
  LogIn,
  UserPlus,
} from "lucide-react";

interface InvitationData {
  invitation: {
    id: string;
    email: string;
    status: string;
    expiresAt: string;
    project: {
      id: string;
      title: string;
      description: string | null;
    };
    invitedBy: {
      name: string | null;
      email: string;
      image: string | null;
    };
  };
}

type PageState =
  | "loading"
  | "valid"
  | "accepting"
  | "accepted"
  | "already_accepted"
  | "expired"
  | "not_found"
  | "wrong_email"
  | "error";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();

  const token = searchParams.get("token");

  const [pageState, setPageState] = useState<PageState>("loading");
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");

  const fetchInvitation = useCallback(async () => {
    if (!token) {
      setPageState("not_found");
      return;
    }

    try {
      const res = await fetch(`/api/invitations/${token}`);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 410 && data.projectId) {
          setProjectId(data.projectId);
          setPageState("already_accepted");
        } else if (res.status === 410) {
          setPageState("expired");
        } else {
          setPageState("not_found");
        }
        return;
      }

      setInvitationData(data);
      setPageState("valid");
    } catch {
      setPageState("error");
    }
  }, [token]);

  useEffect(() => {
    fetchInvitation();
  }, [fetchInvitation]);

  // Auto-accept if user is logged in and invitation is valid
  const handleAccept = useCallback(async () => {
    if (!token || !session) return;

    setPageState("accepting");

    try {
      const res = await fetch(`/api/invitations/${token}`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setErrorMessage(data.error);
          setPageState("wrong_email");
        } else {
          setErrorMessage(data.error ?? "Something went wrong.");
          setPageState("error");
        }
        return;
      }

      setProjectId(data.projectId);
      setPageState("accepted");

      // Redirect to project after 2.5s
      setTimeout(() => {
        router.push(`/projects/${data.projectId}`);
      }, 2500);
    } catch {
      setPageState("error");
    }
  }, [token, session, router]);

  // When auth is loaded and page is in valid state → auto-accept
  useEffect(() => {
    if (pageState === "valid" && authStatus === "authenticated") {
      handleAccept();
    }
  }, [pageState, authStatus, handleAccept]);

  const inviterName =
    invitationData?.invitation.invitedBy.name ??
    invitationData?.invitation.invitedBy.email ??
    "Someone";

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">

          {/* Header strip */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="p-8">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <span className="text-sm font-bold text-white">B</span>
              </div>
              <span className="text-sm font-semibold text-white">Builder OS</span>
            </div>

            {/* ─── LOADING STATE ─────────────────────────── */}
            {(pageState === "loading" || pageState === "accepting") && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
                <p className="text-zinc-400">
                  {pageState === "loading"
                    ? "Loading your invitation..."
                    : "Accepting invitation..."}
                </p>
              </div>
            )}

            {/* ─── VALID + UNAUTHENTICATED ───────────────── */}
            {pageState === "valid" && authStatus !== "authenticated" && (
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                  <Users className="h-6 w-6 text-indigo-400" />
                </div>

                <h1 className="mb-2 text-2xl font-bold text-white">
                  You&apos;re invited!
                </h1>

                <p className="mb-6 text-sm text-zinc-400 leading-relaxed">
                  <span className="text-white font-medium">{inviterName}</span> has
                  invited you to collaborate on
                </p>

                <div className="mb-8 rounded-xl border border-white/8 bg-white/4 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
                    Project
                  </p>
                  <p className="text-xl font-bold text-white">
                    {invitationData?.invitation.project.title}
                  </p>
                  {invitationData?.invitation.project.description && (
                    <p className="mt-1 text-sm text-zinc-400">
                      {invitationData.invitation.project.description}
                    </p>
                  )}
                </div>

                <p className="mb-4 text-xs text-zinc-500">
                  This invite was sent to{" "}
                  <span className="text-zinc-300">
                    {invitationData?.invitation.email}
                  </span>
                </p>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(`/invite/accept?token=${token}`)}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                  >
                    <LogIn size={16} />
                    Sign in to accept
                  </Link>

                  <Link
                    href={`/signup?invite=${token}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/[0.06]"
                  >
                    <UserPlus size={16} />
                    Create new account
                  </Link>
                </div>
              </div>
            )}

            {/* ─── ACCEPTED ─────────────────────────────── */}
            {pageState === "accepted" && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
                  <CheckCircle2 className="h-7 w-7 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Welcome to the team! 🎉</h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    You&apos;ve joined the project. Redirecting you now...
                  </p>
                </div>
                <Link
                  href={`/projects/${projectId}`}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Go to Project <ArrowRight size={15} />
                </Link>
              </div>
            )}

            {/* ─── ALREADY ACCEPTED ─────────────────────── */}
            {pageState === "already_accepted" && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                  <CheckCircle2 className="h-7 w-7 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Already accepted</h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    This invitation has already been used.
                  </p>
                </div>
                {projectId && (
                  <Link
                    href={`/projects/${projectId}`}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
                  >
                    Go to Project <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            )}

            {/* ─── EXPIRED ──────────────────────────────── */}
            {pageState === "expired" && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
                  <Clock className="h-7 w-7 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Invitation expired</h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    This invitation link has expired. Ask the project owner to send a new one.
                  </p>
                </div>
              </div>
            )}

            {/* ─── NOT FOUND ────────────────────────────── */}
            {pageState === "not_found" && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                  <XCircle className="h-7 w-7 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Invalid invitation</h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    This invitation link is invalid or doesn&apos;t exist.
                  </p>
                </div>
              </div>
            )}

            {/* ─── WRONG EMAIL ──────────────────────────── */}
            {pageState === "wrong_email" && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
                  <XCircle className="h-7 w-7 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Wrong account</h2>
                  <p className="mt-2 text-sm text-zinc-400">{errorMessage}</p>
                </div>
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.06]"
                >
                  Sign in with different account
                </Link>
              </div>
            )}

            {/* ─── ERROR ────────────────────────────────── */}
            {pageState === "error" && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                  <XCircle className="h-7 w-7 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Something went wrong</h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    {errorMessage || "Please try again or contact the project owner."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
