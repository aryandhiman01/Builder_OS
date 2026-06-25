"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Logo from "@/components/shared/Logo";

export default function ChangePasswordForm() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setSuccess(
        "Password updated successfully."
      );

      setTimeout(() => {
        router.push("/settings");
      }, 2000);

    } catch (error) {
      console.error(error);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">

        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Change Password
          </h1>

          <p className="mt-2 text-zinc-500">
            Update your account password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
          />

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-semibold text-black"
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </button>

        </form>

      </div>

    </main>
  );
}