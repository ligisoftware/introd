"use client";

import type { Founder } from "@/types";
import { useState, useEffect } from "react";

type ProfilePayload = {
  displayName?: string;
  role?: string;
  bio?: string;
  startupName?: string;
  startupOneLiner?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
};

function orEmpty(s: string | null | undefined): string {
  return s ?? "";
}

const inputClass =
  "w-full rounded-ds border border-ds-border bg-ds-surface px-3.5 py-2.5 text-ds-text placeholder-ds-text-subtle transition-[border-color,box-shadow] duration-ds-fast ease-ds focus:border-ds-accent focus:outline-none focus:ring-2 focus:ring-ds-accent/20 disabled:bg-ds-surface-hover disabled:text-ds-text-subtle";
const labelClass = "block text-sm font-medium text-ds-text-muted";
const sectionTitle = "text-sm font-semibold uppercase tracking-wider text-ds-text-subtle";
const btnPrimary =
  "rounded-ds bg-ds-accent px-4 py-2.5 text-sm font-medium text-ds-text-inverse shadow-ds-sm transition-[color,box-shadow,transform] duration-ds ease-ds hover:bg-ds-accent-hover hover:shadow-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
const btnSecondary =
  "rounded-ds border border-ds-border bg-ds-surface px-4 py-2.5 text-sm font-medium text-ds-text transition-[color,box-shadow,transform] duration-ds ease-ds hover:bg-ds-surface-hover hover:shadow-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

export function ProfileEditor({ initialFounder }: { initialFounder: Founder }) {
  const [displayName, setDisplayName] = useState(orEmpty(initialFounder.displayName));
  const [role, setRole] = useState(orEmpty(initialFounder.role));
  const [bio, setBio] = useState(orEmpty(initialFounder.bio));
  const [startupName, setStartupName] = useState(orEmpty(initialFounder.startupName));
  const [startupOneLiner, setStartupOneLiner] = useState(orEmpty(initialFounder.startupOneLiner));
  const [websiteUrl, setWebsiteUrl] = useState(orEmpty(initialFounder.websiteUrl));
  const [linkedinUrl, setLinkedinUrl] = useState(orEmpty(initialFounder.linkedinUrl));
  const [twitterUrl, setTwitterUrl] = useState(orEmpty(initialFounder.twitterUrl));

  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "creating" | "copied" | "error">("idle");
  const [shareError, setShareError] = useState("");

  useEffect(() => {
    if (initialFounder.shareSlug && typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/p/${initialFounder.shareSlug}`);
    }
  }, [initialFounder.shareSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");

    const payload: ProfilePayload = {
      displayName: displayName.trim() || undefined,
      role: role.trim() || undefined,
      bio: bio.trim() || undefined,
      startupName: startupName.trim() || undefined,
      startupOneLiner: startupOneLiner.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      twitterUrl: twitterUrl.trim() || undefined,
    };

    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(
          typeof data.error === "string"
            ? data.error
            : data.details
              ? "Please check the fields and try again."
              : "Something went wrong."
        );
        return;
      }

      setStatus("success");
      setMessage("Profile saved.");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setMessage("Something went wrong.");
    }
  }

  async function handleCreateShareLink() {
    setShareStatus("creating");
    setShareError("");
    try {
      const res = await fetch("/api/me/share", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setShareStatus("error");
        setShareError(typeof data.error === "string" ? data.error : "Could not create link.");
        return;
      }
      if (data.url) setShareUrl(data.url);
      setShareStatus("idle");
    } catch {
      setShareStatus("error");
      setShareError("Something went wrong.");
    }
  }

  async function handleRegenerateShareLink() {
    setShareStatus("creating");
    setShareError("");
    try {
      const res = await fetch("/api/me/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regenerate: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setShareStatus("error");
        setShareError(typeof data.error === "string" ? data.error : "Could not regenerate link.");
        return;
      }
      if (data.url) setShareUrl(data.url);
      setShareStatus("idle");
    } catch {
      setShareStatus("error");
      setShareError("Something went wrong.");
    }
  }

  async function handleCopyShareLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    } catch {
      setShareStatus("error");
      setShareError("Copy failed.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 sm:space-y-12">
      {/* About you */}
      <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-shadow duration-ds ease-ds sm:p-6">
        <h2 className={sectionTitle}>About you</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="displayName" className={labelClass}>
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              placeholder="Your name or handle"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={status === "saving"}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="role" className={labelClass}>
              Role
            </label>
            <input
              id="role"
              type="text"
              placeholder="e.g. CEO, Co-founder"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={status === "saving"}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="bio" className={labelClass}>
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              placeholder="A short bio about you and what you're building."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={status === "saving"}
              className={`${inputClass} min-h-[100px] resize-y`}
              maxLength={1000}
            />
            <p className="mt-1.5 text-xs text-ds-text-subtle">{bio.length}/1000</p>
          </div>
        </div>
      </section>

      {/* Startup */}
      <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-shadow duration-ds ease-ds sm:p-6">
        <h2 className={sectionTitle}>Startup</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="startupName" className={labelClass}>
              Company name
            </label>
            <input
              id="startupName"
              type="text"
              placeholder="Your startup name"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              disabled={status === "saving"}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="startupOneLiner" className={labelClass}>
              One-liner
            </label>
            <input
              id="startupOneLiner"
              type="text"
              placeholder="Short tagline for your company"
              value={startupOneLiner}
              onChange={(e) => setStartupOneLiner(e.target.value)}
              disabled={status === "saving"}
              className={inputClass}
              maxLength={300}
            />
            <p className="mt-1.5 text-xs text-ds-text-subtle">{startupOneLiner.length}/300</p>
          </div>
        </div>
      </section>

      {/* Share your page */}
      <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-shadow duration-ds ease-ds sm:p-6">
        <h2 className={sectionTitle}>Share your page</h2>
        <p className="mt-2 text-sm text-ds-text-muted">
          Create a link to share your profile with others. The link is unlisted—only people you
          share it with can view it.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {!shareUrl ? (
            <button
              type="button"
              onClick={handleCreateShareLink}
              disabled={shareStatus === "creating"}
              className={btnPrimary}
            >
              {shareStatus === "creating" ? "Creating…" : "Create share link"}
            </button>
          ) : (
            <>
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="min-w-0 flex-1 rounded-ds border border-ds-border bg-ds-surface-hover px-3.5 py-2.5 text-sm text-ds-text-muted transition-[border-color] duration-ds-fast ease-ds"
                aria-label="Share link"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  disabled={shareStatus === "copied"}
                  className={btnSecondary}
                >
                  <span
                    key={shareStatus}
                    className={shareStatus === "copied" ? "ds-pop inline-block" : ""}
                  >
                    {shareStatus === "copied" ? "Copied!" : "Copy link"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleRegenerateShareLink}
                  disabled={shareStatus === "creating"}
                  className={btnSecondary}
                >
                  {shareStatus === "creating" ? "Regenerating…" : "Regenerate link"}
                </button>
              </div>
            </>
          )}
          {shareUrl && (
            <p className="w-full text-xs text-ds-text-subtle">
              Regenerating creates a new link; the previous link will stop working.
            </p>
          )}
          {shareStatus === "error" && shareError && (
            <p role="alert" className="ds-feedback-in w-full text-sm text-ds-error">
              {shareError}
            </p>
          )}
        </div>
      </section>

      {/* Links */}
      <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-shadow duration-ds ease-ds sm:p-6">
        <h2 className={sectionTitle}>Links</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="websiteUrl" className={labelClass}>
              Website
            </label>
            <input
              id="websiteUrl"
              type="url"
              placeholder="https://..."
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              disabled={status === "saving"}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="linkedinUrl" className={labelClass}>
              LinkedIn
            </label>
            <input
              id="linkedinUrl"
              type="url"
              placeholder="https://linkedin.com/in/..."
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              disabled={status === "saving"}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="twitterUrl" className={labelClass}>
              Twitter / X
            </label>
            <input
              id="twitterUrl"
              type="url"
              placeholder="https://x.com/..."
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              disabled={status === "saving"}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Submit and feedback */}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={status === "saving"} className={btnPrimary}>
          {status === "saving" ? "Saving…" : "Save profile"}
        </button>
        {status === "success" && message && (
          <p role="status" className="ds-feedback-in text-sm text-ds-success">
            {message}
          </p>
        )}
        {status === "error" && message && (
          <p role="alert" className="ds-feedback-in text-sm text-ds-error">
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
