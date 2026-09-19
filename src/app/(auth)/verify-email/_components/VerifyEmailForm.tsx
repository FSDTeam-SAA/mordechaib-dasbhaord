"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthHeading from "../../_components/AuthHeading";

export default function VerifyEmailForm() {
  const [email, setEmail] = useState("your email address");
  const [digits, setDigits] = useState(Array<string>(6).fill(""));
  const [message, setMessage] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  useEffect(() => { setEmail(sessionStorage.getItem("admin-recovery-email") || "your email address"); }, []);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (digits.some(digit => !digit)) { setMessage("Please enter all six digits."); return; }
    // Navigate through the design preview; server verification must be added with the recovery API.
    router.push("/reset-password");
  }
  return <div className="auth-form-wrap auth-form-narrow"><AuthHeading title="Verify your email">we sent a 6-digit code to <strong>{email}</strong></AuthHeading>
    <form className="auth-form" onSubmit={submit}><div className="auth-otp">{digits.map((digit, index) => <input key={index} ref={node => { refs.current[index] = node; }} aria-label={`Code digit ${index + 1}`} value={digit} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} pattern="[0-9]" maxLength={1} required
      onChange={event => { const value = event.target.value; if (!/^\d?$/.test(value)) return; setDigits(previous => previous.map((d, i) => i === index ? value : d)); if (value) refs.current[Math.min(index + 1, 5)]?.focus(); }}
      onKeyDown={event => { if (event.key === "Backspace" && !digit) refs.current[Math.max(index - 1, 0)]?.focus(); if (event.key === "ArrowLeft") refs.current[Math.max(index - 1, 0)]?.focus(); if (event.key === "ArrowRight") refs.current[Math.min(index + 1, 5)]?.focus(); }}
      onPaste={event => { event.preventDefault(); const code = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6); if (!code) return; setDigits(Array.from({ length: 6 }, (_, i) => code[i] || "")); refs.current[Math.min(code.length, 5)]?.focus(); }}/>)}</div>
      <div className="auth-resend">Didn’t receive it ? <button type="button" onClick={() => setMessage("Code delivery is not connected yet. Please contact your administrator.")}>Resend code</button></div>
      {message && <p className="auth-message" role="status">{message}</p>}<button className="auth-submit">Verify email</button>
    </form></div>;
}
