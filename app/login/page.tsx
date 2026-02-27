"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const invited = searchParams.get("invited") === "true";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    urlError ? "error" : "idle"
  );
  const [message, setMessage] = useState(urlError ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("success");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-ds-text sm:text-3xl">Log in</h1>
          <p className="mt-2 text-sm text-ds-text-muted">
            Enter your email and we&apos;ll send you a magic link.
          </p>
        </div>

        {invited && (
          <div className="ds-feedback-in rounded-ds border border-ds-success/30 bg-ds-success-muted/50 px-4 py-3 text-sm text-ds-success">
            Invite accepted! Log in to start collaborating.
          </div>
        )}

        <div className="rounded-ds-lg border border-ds-border bg-ds-surface p-6 shadow-ds transition-shadow duration-ds ease-ds">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="w-full rounded-ds border border-ds-border bg-ds-surface px-3.5 py-2.5 text-ds-text placeholder-ds-text-subtle transition-[border-color,box-shadow] duration-ds-fast ease-ds focus:border-ds-accent focus:outline-none focus:ring-2 focus:ring-ds-accent/20 disabled:bg-ds-surface-hover disabled:text-ds-text-subtle"
              />
            </div>

            {status === "error" && message && (
              <p
                role="alert"
                className="ds-feedback-in rounded-ds-sm bg-ds-error-muted/50 px-3 py-2 text-sm text-ds-error"
              >
                {message}
              </p>
            )}

            {status === "success" ? (
              <p className="ds-feedback-in rounded-ds-sm bg-ds-success-muted/50 px-3 py-2 text-sm text-ds-success">
                Check your email for a link to log in.
              </p>
            ) : (
              <button
                type="submit"
                disabled={status === "loading" || !email.trim()}
                className="w-full rounded-ds bg-ds-accent px-4 py-2.5 text-sm font-medium text-ds-text-inverse shadow-ds-sm transition-[color,box-shadow,transform] duration-ds ease-ds hover:bg-ds-accent-hover hover:shadow-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {status === "loading" ? "Sending…" : "Send magic link"}
              </button>
            )}
          </form>
        </div>

        <p className="text-center">
          <Link
            href="/"
            className="rounded-ds-sm text-sm font-medium text-ds-text-muted transition-colors duration-ds ease-ds hover:text-ds-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
