"use client";

import { useState } from "react";

const FEEDBACK_TO = "nic@ligi.app, jeff@ligi.app";

export function FeedbackForm({ slug }: { slug?: string }) {
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
          slug: slug || undefined,
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
    <section className="mt-8 border-t border-gray-200 pt-8">
      <h2 className="text-lg font-medium text-gray-900">Send feedback</h2>
      <p className="mt-1 text-sm text-gray-600">Feedback is sent to {FEEDBACK_TO}.</p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700">
            Message <span className="text-gray-500">(required)</span>
          </label>
          <textarea
            id="feedback-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status === "sending"}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100"
            placeholder="Quick feedback, suggestions, or what you found useful..."
          />
        </div>
        <div>
          <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-700">
            Your email <span className="text-gray-500">(optional, for reply)</span>
          </label>
          <input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "sending"}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100"
            placeholder="you@example.com"
          />
        </div>
        {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}
        {status === "sent" && (
          <p className="text-sm text-green-700">Thanks — your feedback was sent.</p>
        )}
        <button
          type="submit"
          disabled={status === "sending" || !message.trim()}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
        >
          {status === "sending" ? "Sending…" : "Send feedback"}
        </button>
      </form>
    </section>
  );
}
