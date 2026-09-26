"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPassword } from "@/lib/auth-api";
import AuthHeading from "../../_components/AuthHeading";
import PasswordField from "../../_components/PasswordField";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (!sessionStorage.getItem("admin-recovery-email") || !sessionStorage.getItem("admin-recovery-reset-token")) router.replace("/forgot-password");
  }, [router]);
  const mutation = useMutation({
    mutationFn: async (newPassword: string) => {
      const email = sessionStorage.getItem("admin-recovery-email");
      const resetToken = sessionStorage.getItem("admin-recovery-reset-token");
      if (!email || !resetToken) throw new Error("Please verify your email before resetting your password.");
      return resetPassword({ email, newPassword, resetToken });
    },
    onSuccess: data => {
      sessionStorage.removeItem("admin-recovery-email");
      sessionStorage.removeItem("admin-recovery-reset-token");
      toast.success(data.message || "Password reset successful.");
      router.replace("/signin");
    },
    onError: (error: Error) => { setMessage(error.message); toast.error(error.message); },
  });
  function submit(event: FormEvent) {
    event.preventDefault();
    if (mutation.isPending) return;
    if (password !== confirmation) { setMessage("Passwords do not match."); return; }
    setMessage("");
    mutation.mutate(password);
  }
  return <div className="auth-form-wrap auth-form-narrow"><AuthHeading title="Reset Password?">Please enter a new password for your account. Use a strong password to keep your account secure.</AuthHeading>
    <form className="auth-form" onSubmit={submit}><PasswordField id="newPassword" label="New Password" value={password} onChange={setPassword}/><PasswordField id="confirmPassword" label="Confirm Password" value={confirmation} onChange={setConfirmation}/>
      {message && <p role="status" className="auth-message">{message}</p>}<button className="auth-submit" disabled={mutation.isPending}>{mutation.isPending ? "Resetting…" : "Change Password"}</button>
    </form></div>;
}
