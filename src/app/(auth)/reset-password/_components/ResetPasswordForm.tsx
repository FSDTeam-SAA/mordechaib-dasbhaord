"use client";
import { useState, type FormEvent } from "react";
import AuthHeading from "../../_components/AuthHeading";
import PasswordField from "../../_components/PasswordField";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirmation) { setMessage("Passwords do not match."); return; }
    setMessage("Password reset is not connected yet. Please contact your administrator.");
  }
  return <div className="auth-form-wrap auth-form-narrow"><AuthHeading title="Reset Password?">Please enter a new password for your account. Use a strong password to keep your account secure.</AuthHeading>
    <form className="auth-form" onSubmit={submit}><PasswordField id="newPassword" label="New Password" value={password} onChange={setPassword}/><PasswordField id="confirmPassword" label="Confirm Password" value={confirmation} onChange={setConfirmation}/>
      {message && <p role="status" className="auth-message">{message}</p>}<button className="auth-submit">Change Password</button>
    </form></div>;
}
