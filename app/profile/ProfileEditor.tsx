"use client";

import type { User } from "@/types";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  orEmpty,
  inputClass,
  labelClass,
  sectionTitle,
  btnPrimary,
  btnSecondary,
} from "@/app/components/form-classes";

export function ProfileEditor({ initialUser }: { initialUser: User }) {
  const [name, setName] = useState(orEmpty(initialUser.name));
  const [avatarUrl, setAvatarUrl] = useState(orEmpty(initialUser.avatarUrl));
  const [userLinkedinUrl, setUserLinkedinUrl] = useState(orEmpty(initialUser.linkedinUrl));
  const [userTwitterUrl, setUserTwitterUrl] = useState(orEmpty(initialUser.twitterUrl));

  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const [avatarStatus, setAvatarStatus] = useState<"idle" | "uploading" | "removing" | "error">(
    "idle"
  );
  const [avatarMessage, setAvatarMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");

    const payload = {
      user: {
        name: name.trim() || undefined,
        linkedinUrl: userLinkedinUrl.trim() || undefined,
        twitterUrl: userTwitterUrl.trim() || undefined,
      },
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

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarMessage("");

    if (!file.type.startsWith("image/")) {
      setAvatarStatus("error");
      setAvatarMessage("Please choose an image file.");
      return;
    }

    const maxBytes = 8 * 1024 * 1024; // 8MB
    if (file.size > maxBytes) {
      setAvatarStatus("error");
      setAvatarMessage("Image must be 8MB or smaller.");
      return;
    }

    setAvatarStatus("uploading");

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setAvatarStatus("error");
        setAvatarMessage("You need to be signed in to upload an avatar.");
        return;
      }

      const extFromType =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : file.type === "image/jpeg"
              ? "jpg"
              : undefined;
      const ext =
        extFromType ?? (file.name.includes(".") ? (file.name.split(".").pop() ?? "jpg") : "jpg");

      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("founder-avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        console.error("Avatar upload error", uploadError);
        setAvatarStatus("error");
        setAvatarMessage("Upload failed. Please try again.");
        return;
      }

      const { data: publicUrlData } = supabase.storage.from("founder-avatars").getPublicUrl(path);
      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        setAvatarStatus("error");
        setAvatarMessage("Could not get public URL for avatar.");
        return;
      }

      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { avatarUrl: publicUrl } }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setAvatarStatus("error");
        setAvatarMessage(
          typeof data.error === "string"
            ? data.error
            : data.details
              ? "Please check the fields and try again."
              : "Something went wrong."
        );
        return;
      }

      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
      setAvatarStatus("idle");
      setAvatarMessage("");
    } catch (err) {
      console.error("Avatar upload unexpected error", err);
      setAvatarStatus("error");
      setAvatarMessage("Something went wrong while uploading.");
    } finally {
      e.target.value = "";
    }
  }

  async function handleAvatarRemove() {
    if (!avatarUrl) return;

    setAvatarStatus("removing");
    setAvatarMessage("");

    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { avatarUrl: "" } }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setAvatarStatus("error");
        setAvatarMessage(
          typeof data.error === "string"
            ? data.error
            : data.details
              ? "Please check the fields and try again."
              : "Something went wrong."
        );
        return;
      }

      setAvatarUrl("");
      setAvatarStatus("idle");
    } catch (err) {
      console.error("Avatar remove unexpected error", err);
      setAvatarStatus("error");
      setAvatarMessage("Something went wrong while removing your avatar.");
    }
  }

  const isSaving =
    status === "saving" || avatarStatus === "uploading" || avatarStatus === "removing";

  return (
    <form onSubmit={handleSubmit} className="max-w-container-md space-y-10 sm:space-y-12">
      <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-shadow duration-ds ease-ds sm:p-6">
        <h2 className={sectionTitle}>Profile</h2>
        <p className="mt-1.5 text-sm text-ds-text-muted">
          Your account info — this stays the same across all your intros.
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-ds-accent text-lg font-medium text-ds-text-inverse">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={name ? `${name}'s avatar` : "Your avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                (name || initialUser.email).charAt(0).toUpperCase()
              )}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <label>
                  <span className={btnSecondary}>
                    {avatarStatus === "uploading" ? "Uploading\u2026" : "Upload photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={handleAvatarChange}
                    disabled={isSaving}
                  />
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleAvatarRemove}
                    disabled={isSaving}
                    className="text-xs font-medium text-ds-text-subtle underline underline-offset-2"
                  >
                    {avatarStatus === "removing" ? "Removing\u2026" : "Remove"}
                  </button>
                )}
              </div>
              <p className="text-xs text-ds-text-subtle">PNG, JPG, or WebP up to 8MB.</p>
              {avatarStatus === "error" && avatarMessage && (
                <p role="alert" className="ds-feedback-in text-xs text-ds-error">
                  {avatarMessage}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name or handle"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="userLinkedinUrl" className={labelClass}>
              LinkedIn
            </label>
            <input
              id="userLinkedinUrl"
              type="url"
              placeholder="https://linkedin.com/in/..."
              value={userLinkedinUrl}
              onChange={(e) => setUserLinkedinUrl(e.target.value)}
              disabled={isSaving}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="userTwitterUrl" className={labelClass}>
              Twitter / X
            </label>
            <input
              id="userTwitterUrl"
              type="url"
              placeholder="https://x.com/..."
              value={userTwitterUrl}
              onChange={(e) => setUserTwitterUrl(e.target.value)}
              disabled={isSaving}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Submit and feedback */}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={isSaving} className={btnPrimary}>
          {status === "saving" ? "Saving\u2026" : "Save profile"}
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
