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

  // Share link: full URL for display/copy (set from initial slug or after creating)
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

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-500";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {/* About you */}
      <section>
        <h2 className="text-lg font-medium text-gray-900">About you</h2>
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
              className={inputClass}
              maxLength={1000}
            />
            <p className="mt-1 text-xs text-gray-500">{bio.length}/1000</p>
          </div>
        </div>
      </section>

      {/* Startup */}
      <section>
        <h2 className="text-lg font-medium text-gray-900">Startup</h2>
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
            <p className="mt-1 text-xs text-gray-500">{startupOneLiner.length}/300</p>
          </div>
        </div>
      </section>

      {/* Share your page */}
      <section>
        <h2 className="text-lg font-medium text-gray-900">Share your page</h2>
        <p className="mt-1 text-sm text-gray-600">
          Create a link to share your profile with others. The link is unlisted—only people you
          share it with can view it.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!shareUrl ? (
            <button
              type="button"
              onClick={handleCreateShareLink}
              disabled={shareStatus === "creating"}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {shareStatus === "creating" ? "Creating…" : "Create share link"}
            </button>
          ) : (
            <>
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                aria-label="Share link"
              />
              <button
                type="button"
                onClick={handleCopyShareLink}
                disabled={shareStatus === "copied"}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {shareStatus === "copied" ? "Copied!" : "Copy link"}
              </button>
            </>
          )}
          {shareStatus === "error" && shareError && (
            <p role="alert" className="w-full text-sm text-red-600">
              {shareError}
            </p>
          )}
        </div>
      </section>

      {/* Links */}
      <section>
        <h2 className="text-lg font-medium text-gray-900">Links</h2>
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
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "saving" ? "Saving…" : "Save profile"}
        </button>
        {status === "success" && message && (
          <p role="status" className="text-sm text-green-700">
            {message}
          </p>
        )}
        {status === "error" && message && (
          <p role="alert" className="text-sm text-red-600">
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
