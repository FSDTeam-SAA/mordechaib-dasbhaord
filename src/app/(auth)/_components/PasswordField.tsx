"use client";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

export default function PasswordField({ id, label, value, onChange, autoComplete = "new-password", minLength = 8 }: { id: string; label: string; value: string; onChange: (value: string) => void; autoComplete?: string; minLength?: number }) {
  const [visible, setVisible] = useState(false);
  return <div className="auth-field"><label htmlFor={id}>{label}</label><div className="auth-password"><LockKeyhole size={17} className="auth-lock"/>
    <input id={id} name={id} type={visible ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)} placeholder="Min. 8 characters" autoComplete={autoComplete} required minLength={minLength}/>
    <button type="button" onClick={() => setVisible(!visible)} aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`} aria-pressed={visible}>{visible ? <EyeOff size={17}/> : <Eye size={17}/>}</button>
  </div></div>;
}
