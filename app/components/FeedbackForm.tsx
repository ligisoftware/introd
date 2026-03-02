"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-ds border border-ds-border bg-ds-surface px-3.5 py-2.5 text-ds-text placeholder-ds-text-subtle transition-[border-color,box-shadow] duration-ds-fast ease-ds focus:border-ds-accent focus:outline-none focus:ring-2 focus:ring-ds-accent/20 disabled:bg-ds-surface-hover disabled:text-ds-text-subtle";
const labelClass = "block text-sm font-medium text-ds-text-muted";

export function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("sent");
      setMessage("");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <div>
      <p className="text-sm text-ds-text-muted">Your feedback goes to the Introd team.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="feedback-message" className={labelClass}>
            Message <span className="text-ds-text-subtle">(required)</span>
          </label>
          <textarea
            id="feedback-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status === "sending"}
            className={`${inputClass} min-h-[100px] resize-y`}
            placeholder="Quick feedback, suggestions, or what you found useful..."
            data-testid="feedback-form-message"
          />
        </div>
        <div>
          <label htmlFor="feedback-email" className={labelClass}>
            Your email <span className="text-ds-text-subtle">(optional, for reply)</span>
          </label>
          <input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "sending"}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        {status === "error" && (
          <p
            role="alert"
            className="ds-feedback-in rounded-ds-sm bg-ds-error-muted/50 px-3 py-2 text-sm text-ds-error"
          >
            {errorMessage}
          </p>
        )}
        {status === "sent" && (
          <p className="ds-feedback-in rounded-ds-sm bg-ds-success-muted/50 px-3 py-2 text-sm text-ds-success">
            Thanks — your feedback was sent.
          </p>
        )}
        <button
          type="submit"
          disabled={status === "sending" || !message.trim()}
          className="rounded-ds bg-ds-accent px-4 py-2.5 text-sm font-medium text-ds-text-inverse shadow-ds-sm transition-[color,box-shadow,transform] duration-ds ease-ds hover:bg-ds-accent-hover hover:shadow-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          data-testid="feedback-form-submit"
        >
          {status === "sending" ? "Sending…" : "Send feedback"}
        </button>
      </form>
    </div>
  );
}
