"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseAuth as supabase } from "@/lib/supabase-browser-ssr";
import { isAdminEmail } from "@/lib/actions/check-admin-email";

type Mode = "login" | "signup";

export default function AccountPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email ?? null);
        setFullName((data.user.user_metadata?.full_name as string) ?? null);
      }
      setCheckingSession(false);
    });
  }, []);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (await isAdminEmail(email.trim())) {
      setError("This email cannot be used to create a customer account.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.user) {
      setUserEmail(data.user.email ?? null);
      setFullName(name.trim());
      router.refresh();
    }
  }

  async function handleLogIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (await isAdminEmail(email.trim())) {
      setError("Invalid email or password.");
      return;
    }

    setLoading(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signInError) {
      setError("Invalid email or password.");
      return;
    }
    if (data.user) {
      setUserEmail(data.user.email ?? null);
      setFullName((data.user.user_metadata?.full_name as string) ?? null);
      router.refresh();
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUserEmail(null);
    setFullName(null);
    router.refresh();
  }

  if (checkingSession) {
    return null;
  }

  if (userEmail) {
    return (
      <section className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-sky-bg">
          <img src="/icon-account.png" alt="" className="h-6 w-6 object-contain" />
        </div>
        <h1 className="mb-2 font-display text-2xl font-medium text-ink">
          Welcome back{fullName ? `, ${fullName}` : ""}
        </h1>
        <p className="mb-8 text-sm text-gray-500">{userEmail}</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/shop" className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white hover:bg-sky">
            Continue shopping
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-gray-300 px-7 py-3.5 text-sm font-semibold text-ink hover:border-sky hover:text-sky"
          >
            Sign out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sky-bg">
          <img src="/icon-account.png" alt="" className="h-6 w-6 object-contain" />
        </div>
        <h1 className="mb-2 font-display text-2xl font-medium text-ink">
          {mode === "login" ? "Sign in" : "Create an account"}
        </h1>
        <p className="text-sm text-gray-500">
          {mode === "login"
            ? "Sign in to view your account."
            : "Create an account to track your order history."}
        </p>
      </div>

      <div className="mb-6 flex rounded-full border border-gray-200 p-1">
        <button
          onClick={() => {
            setMode("login");
            setError("");
          }}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            mode === "login" ? "bg-ink text-white" : "text-gray-500"
          }`}
        >
          Sign in
        </button>
        <button
          onClick={() => {
            setMode("signup");
            setError("");
          }}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            mode === "signup" ? "bg-ink text-white" : "text-gray-500"
          }`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={mode === "login" ? handleLogIn : handleSignUp} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Full name
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Jordan Rivera" />
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="jordan@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
          />
        </div>
        {mode === "signup" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-error/30 bg-error/10 p-3">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-full py-3.5 text-sm font-semibold transition-colors ${
            loading ? "cursor-not-allowed bg-gray-200 text-gray-400" : "bg-ink text-white hover:bg-sky"
          }`}
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </section>
  );
}
