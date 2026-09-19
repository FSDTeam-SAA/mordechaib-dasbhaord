"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import AuthHeading from "../../_components/AuthHeading";
import PasswordField from "../../_components/PasswordField";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!result || result.error || !result.ok)
        throw new Error(
          result?.error || "Unable to sign in. Please try again.",
        );
      toast.success("Signed in successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="auth-form-wrap">
      <AuthHeading title="Welcome back, Super Admin" back={false}>
        Sign in to access the administrative dashboard
      </AuthHeading>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          minLength={1}
        />
        <div className="auth-options">
          <label className="auth-remember">
            <input type="checkbox" name="rememberMe" />
            Remember me
          </label>
          <Link href="/forgot-password">Forgot Password?</Link>
        </div>
        <button className="auth-submit" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign in to Admin Panel"}
        </button>
      </form>
    </div>
  );
}
