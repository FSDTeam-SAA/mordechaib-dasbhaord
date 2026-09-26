"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPassword } from "@/lib/auth-api";
import AuthHeading from "../../_components/AuthHeading";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data, submittedEmail) => {
      sessionStorage.removeItem("admin-recovery-reset-token");
      sessionStorage.setItem("admin-recovery-email", submittedEmail);
      toast.success(data.message || "Verification code sent.");
      router.push("/verify-email");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!mutation.isPending) mutation.mutate(email.trim());
  }
  return <div className="auth-form-wrap"><AuthHeading title="Forgot Password?">If you need help resetting your password, we can help by sending you a link to reset it.</AuthHeading>
    <form className="auth-form" onSubmit={handleSubmit}><div className="auth-field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} required/></div><button className="auth-submit" disabled={mutation.isPending}>{mutation.isPending ? "Sending…" : "Continue"}</button></form>
  </div>;
}
