"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPassword, verifyCode } from "@/lib/auth-api";
import AuthHeading from "../../_components/AuthHeading";

export default function VerifyEmailForm() {
  const [email, setEmail] = useState("your email address");
  const [digits, setDigits] = useState(Array<string>(6).fill(""));
  const [message, setMessage] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("admin-recovery-email");
    if (!savedEmail) { router.replace("/forgot-password"); return; }
    setEmail(savedEmail);
  }, [router]);
  const otpMutation = useMutation({
    mutationFn: async (otp: string) => {
      const savedEmail = sessionStorage.getItem("admin-recovery-email");
      if (!savedEmail) throw new Error("Please request a new verification code.");
      const data = await verifyCode(savedEmail, otp);
      const resetToken = data.data?.resetToken ?? data.resetToken;
      if (typeof resetToken !== "string" || !resetToken) throw new Error("Reset token was missing. Please request a new code.");
      sessionStorage.setItem("admin-recovery-reset-token", resetToken);
      return data;
    },
    onSuccess: data => { toast.success(data.message || "Email verified successfully."); router.replace("/reset-password"); },
    onError: (error: Error) => { setMessage(error.message); toast.error(error.message); },
  });
  const resendMutation = useMutation({
    mutationFn: async () => {
      const savedEmail = sessionStorage.getItem("admin-recovery-email");
      if (!savedEmail) throw new Error("Please enter your email again.");
      return forgotPassword(savedEmail);
    },
    onSuccess: data => {
      sessionStorage.removeItem("admin-recovery-reset-token");
      setDigits(Array<string>(6).fill(""));
      setMessage("");
      toast.success(data.message || "A new verification code was sent.");
      refs.current[0]?.focus();
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const isPending = otpMutation.isPending || resendMutation.isPending;
  function submit(event: FormEvent) {
    event.preventDefault();
    if (isPending) return;
    if (digits.some(digit => !digit)) { setMessage("Please enter all six digits."); return; }
    setMessage("");
    otpMutation.mutate(digits.join(""));
  }
  return <div className="auth-form-wrap auth-form-narrow"><AuthHeading title="Verify your email">we sent a 6-digit code to <strong>{email}</strong></AuthHeading>
    <form className="auth-form" onSubmit={submit}><div className="auth-otp">{digits.map((digit, index) => <input key={index} ref={node => { refs.current[index] = node; }} aria-label={`Code digit ${index + 1}`} value={digit} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} pattern="[0-9]" maxLength={1} required
      onChange={event => { const value = event.target.value; if (!/^\d?$/.test(value)) return; setDigits(previous => previous.map((d, i) => i === index ? value : d)); if (value) refs.current[Math.min(index + 1, 5)]?.focus(); }}
      onKeyDown={event => { if (event.key === "Backspace" && !digit) refs.current[Math.max(index - 1, 0)]?.focus(); if (event.key === "ArrowLeft") refs.current[Math.max(index - 1, 0)]?.focus(); if (event.key === "ArrowRight") refs.current[Math.min(index + 1, 5)]?.focus(); }}
      onPaste={event => { event.preventDefault(); const code = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6); if (!code) return; setDigits(Array.from({ length: 6 }, (_, i) => code[i] || "")); refs.current[Math.min(code.length, 5)]?.focus(); }}/>)}</div>
      <div className="auth-resend">Didn’t receive it ? <button type="button" disabled={isPending} onClick={() => resendMutation.mutate()}>{resendMutation.isPending ? "Sending…" : "Resend code"}</button></div>
      {message && <p className="auth-message" role="status">{message}</p>}<button className="auth-submit" disabled={isPending}>{otpMutation.isPending ? "Verifying…" : "Verify email"}</button>
    </form></div>;
}
