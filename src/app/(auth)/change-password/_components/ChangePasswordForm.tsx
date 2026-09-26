"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePassword } from "@/lib/auth-api";
import AuthHeading from "../../_components/AuthHeading";
import PasswordField from "../../_components/PasswordField";

export default function ChangePasswordForm() {
  const { data: session, status } = useSession();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const mutation = useMutation({
    mutationFn: async (body: { oldPassword: string; newPassword: string }) => {
      if (!session?.accessToken) throw new Error("Please sign in again.");
      return changePassword(body, session.accessToken);
    },
    onSuccess: async data => {
      toast.success(data.message || "Password changed. Please sign in again.");
      await signOut({ callbackUrl: "/signin" });
    },
    onError: (error: Error) => { setMessage(error.message); toast.error(error.message); },
  });
  function submit(event: FormEvent) {
    event.preventDefault();
    if (mutation.isPending) return;
    if (newPassword !== confirmation) { setMessage("Passwords do not match."); return; }
    if (oldPassword === newPassword) { setMessage("Choose a different new password."); return; }
    setMessage("");
    mutation.mutate({ oldPassword, newPassword });
  }
  return <div className="auth-form-wrap auth-form-narrow">
    <Link href="/" className="auth-back"><ArrowLeft size={17} />Back to dashboard</Link>
    <AuthHeading title="Change Password" back={false}>Enter your current password and choose a new password for your account.</AuthHeading>
    <form className="auth-form" onSubmit={submit}>
      <PasswordField id="oldPassword" label="Current Password" value={oldPassword} onChange={setOldPassword} autoComplete="current-password" minLength={1} />
      <PasswordField id="newPassword" label="New Password" value={newPassword} onChange={setNewPassword} />
      <PasswordField id="confirmPassword" label="Confirm Password" value={confirmation} onChange={setConfirmation} />
      {message && <p role="alert" className="auth-message">{message}</p>}
      <button className="auth-submit" disabled={mutation.isPending || status !== "authenticated"}>{mutation.isPending ? "Changing…" : "Change Password"}</button>
    </form>
  </div>;
}
