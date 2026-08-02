"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Users,
  UserPlus,
  Clock,
  Crown,
  Trash2,
  Loader2,
  X,
  Mail,
} from "lucide-react";

import InviteMemberModal from "./InviteMemberModal";

interface Member {
  id: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface Invitation {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

interface MembersPanelProps {
  projectId: string;
  ownerName: string | null;
  ownerEmail: string;
  ownerImage: string | null;
}

function Avatar({
  name,
  email,
  image,
}: {
  name: string | null;
  email: string;
  image: string | null;
}) {
  const initials = (name ?? email)
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? email}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white">
      {initials}
    </div>
  );
}

export default function MembersPanel({
  projectId,
  ownerName,
  ownerEmail,
  ownerImage,
}: MembersPanelProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/members`);
      if (!res.ok) return;
      const data = await res.json();
      setMembers(data.members ?? []);
      setInvitations(data.invitations ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleRemoveMember = async (memberId: string) => {
    setRemovingId(memberId);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/members/${memberId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
      }
    } finally {
      setRemovingId(null);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    setCancelingId(invitationId);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/invitations/${invitationId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setInvitations((prev) => prev.filter((i) => i.id !== invitationId));
      }
    } finally {
      setCancelingId(null);
    }
  };

  const totalCount = 1 + members.length; // owner + members

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
            <Users size={16} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Team Members</h3>
            <p className="text-xs text-zinc-500">
              {totalCount} {totalCount === 1 ? "member" : "members"}
              {invitations.length > 0 && ` · ${invitations.length} pending`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-indigo-500
            to-purple-600
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:opacity-90
          "
        >
          <UserPlus size={15} />
          Invite Member
        </button>
      </div>

      <div className="divide-y divide-white/6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
          </div>
        ) : (
          <>
            {/* Owner row */}
            <div className="flex items-center gap-4 px-6 py-4">
              <Avatar
                name={ownerName}
                email={ownerEmail}
                image={ownerImage}
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {ownerName ?? ownerEmail}
                </p>
                <p className="truncate text-xs text-zinc-500">{ownerEmail}</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                <Crown size={11} />
                Owner
              </span>
            </div>

            {/* Member rows */}
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <Avatar
                  name={member.user.name}
                  email={member.user.email}
                  image={member.user.image}
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {member.user.name ?? member.user.email}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {member.user.email}
                  </p>
                </div>
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                  Member
                </span>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={removingId === member.id}
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 text-zinc-600 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  title="Remove member"
                >
                  {removingId === member.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>
              </div>
            ))}

            {/* Pending invitations */}
            {invitations.length > 0 && (
              <>
                <div className="px-6 py-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
                    Pending Invitations
                  </p>
                </div>

                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
                      <Mail size={14} className="text-zinc-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-300">
                        {inv.email}
                      </p>
                      <p className="text-xs text-zinc-600">
                        Invited{" "}
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full border border-amber-500/15 bg-amber-500/8 px-3 py-1 text-xs font-medium text-amber-500/80">
                      <Clock size={10} />
                      Pending
                    </span>

                    <button
                      onClick={() => handleCancelInvitation(inv.id)}
                      disabled={cancelingId === inv.id}
                      className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 text-zinc-600 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                      title="Cancel invitation"
                    >
                      {cancelingId === inv.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <X size={13} />
                      )}
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* Empty state */}
            {members.length === 0 && invitations.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/4">
                  <Users size={20} className="text-zinc-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">
                    No team members yet
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Invite teammates to collaborate on this project.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteMemberModal
          projectId={projectId}
          onClose={() => setShowInviteModal(false)}
          onInvited={fetchMembers}
        />
      )}
    </div>
  );
}
