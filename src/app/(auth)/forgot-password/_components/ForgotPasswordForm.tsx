"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthHeading from "../../_components/AuthHeading";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // UI flow only: connect the recovery API before sending verification codes.
    sessionStorage.setItem("admin-recovery-email", email);
    router.push("/verify-email");
  }
  return <div className="auth-form-wrap"><AuthHeading title="Forgot Password?">If you need help resetting your password, we can help by sending you a link to reset it.</AuthHeading>
    <form className="auth-form" onSubmit={handleSubmit}><div className="auth-field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} required/></div><button className="auth-submit">Continue</button></form>
  </div>;
}
