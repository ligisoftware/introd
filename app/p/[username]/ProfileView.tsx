"use client";

import type { User, Experience } from "@/types";
import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  orEmpty,
  inputClass,
  labelClass,
  btnPrimary,
  btnSecondary,
} from "@/app/components/form-classes";

type EditingField = "name" | "username" | "bio" | "links" | "avatar" | "experience" | null;

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Extract the storage path from a founder-avatars public URL. */
function storagePathFromUrl(url: string): string | null {
  const marker = "/founder-avatars/";
  const idx = url.indexOf(marker);
  if (idx < 0) return null;
  let path = url.substring(idx + marker.length);
  const q = path.indexOf("?");
  if (q >= 0) path = path.substring(0, q);
  return path || null;
}

function getFileExt(file: File): string {
  const extFromType =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/jpeg"
          ? "jpg"
          : undefined;
  return (
    extFromType ??
    (file.name.includes(".") ? (file.name.split(".").pop() ?? "jpg") : "jpg")
  );
}

function formatExpDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatMemberSince(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Compute the gap duration between two consecutive experience entries.
 * Entries are assumed most-recent-first: gap = thisEntry.startDate - nextEntry.endDate.
 */
function computeGap(current: Experience, next: Experience): string | null {
  if (!current.startDate) return null;
  if (next.current || !next.endDate) return null;

  const a = new Date(current.startDate + "T00:00:00");
  const b = new Date(next.endDate + "T00:00:00");
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;

  let months = (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth());
  if (months <= 1) return null; // no meaningful gap

  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years > 0 && rem > 0) return `${years}yr ${rem}mo`;
  if (years > 0) return `${years}yr`;
  return `${rem}mo`;
}

function isValidUrl(s: string | null | undefined): boolean {
  if (!s || !s.trim()) return false;
  try {
    new URL(s.trim());
    return true;
  } catch {
    return false;
  }
}

function EditActions({
  saving,
  onSave,
  onCancel,
}: {
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onSave} disabled={saving} className={btnPrimary}>
        {saving ? "Saving\u2026" : "Save"}
      </button>
      <button type="button" onClick={onCancel} disabled={saving} className={btnSecondary}>
        Cancel
      </button>
    </div>
  );
}

/* Owner-only edit trigger — appears on section hover */
function EditTrigger({
  onClick,
  label,
  isOwner,
}: {
  onClick: () => void;
  label: string;
  isOwner: boolean;
}) {
  if (!isOwner) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer shrink-0 rounded-full p-1.5 text-ds-text-subtle opacity-0 transition-all duration-ds-fast ease-ds group-hover/section:opacity-100 hover:text-ds-text"
      title={label}
    >
      <PencilIcon className="h-3.5 w-3.5" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Experience inline editor                                           */
/* ------------------------------------------------------------------ */

const compactInput =
  "w-full bg-transparent text-ds-text placeholder-ds-text-subtle/60 outline-none transition-colors duration-ds-fast";

function ExperienceEditForm({
  experience,
  saving,
  onSave,
  onCancel,
}: {
  experience: Experience[];
  saving: boolean;
  onSave: (exp: Experience[]) => void;
  onCancel: () => void;
}) {
  const [entries, setEntries] = useState<Experience[]>(
    experience.length > 0 ? experience : [{ company: "", title: "", current: true }]
  );
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoTargetIdx = useRef(0);

  function updateEntry(idx: number, patch: Partial<Experience>) {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  }

  function addEntry() {
    setEntries((prev) => [...prev, { company: "", title: "", current: false }]);
  }

  function removeEntry(idx: number) {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
  }

  function triggerLogoUpload(idx: number) {
    logoTargetIdx.current = idx;
    logoInputRef.current?.click();
  }

  async function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 4 * 1024 * 1024) return;

    setUploadingLogo(true);
    try {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;

      const ext = getFileExt(file);
      const path = `${authUser.id}/company-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("founder-avatars")
        .upload(path, file, { upsert: true });
      if (error) return;

      const { data } = supabase.storage.from("founder-avatars").getPublicUrl(path);
      if (data?.publicUrl) {
        updateEntry(logoTargetIdx.current, { logoUrl: data.publicUrl });
      }
    } finally {
      setUploadingLogo(false);
    }
  }

  const busy = saving || uploadingLogo;

  return (
    <div className="space-y-3">
      <input
        ref={logoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleLogoFile}
      />

      {entries.map((exp, idx) => (
        <div key={idx} className="group/entry relative">
          <div className="flex gap-3">
            {/* Logo / upload slot */}
            <div className="flex flex-col items-center">
              {exp.logoUrl ? (
                <div className="group/logo relative">
                  <button
                    type="button"
                    onClick={() => triggerLogoUpload(idx)}
                    disabled={busy}
                    className="cursor-pointer h-10 w-10 shrink-0 overflow-hidden rounded-ds-sm border border-ds-border bg-ds-bg transition-opacity duration-ds-fast hover:opacity-80"
                    title="Change logo"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={exp.logoUrl}
                      alt={exp.company || "Company logo"}
                      className="h-full w-full object-cover"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateEntry(idx, { logoUrl: undefined })}
                    disabled={busy}
                    className="cursor-pointer absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ds-surface text-[10px] text-ds-text-subtle shadow-ds-sm opacity-0 transition-opacity duration-ds-fast group-hover/logo:opacity-100 hover:text-ds-error"
                    title="Remove logo"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerLogoUpload(idx)}
                  disabled={busy}
                  className="cursor-pointer flex h-10 w-10 shrink-0 items-center justify-center rounded-ds-sm border border-dashed border-ds-border text-ds-text-subtle transition-colors duration-ds-fast hover:border-ds-accent hover:text-ds-accent"
                  title="Add company logo"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                </button>
              )}
              {idx < entries.length - 1 && <div className="mt-1 w-px flex-1 bg-ds-border" />}
            </div>

            <div className="min-w-0 flex-1 pb-5">
              {/* Title */}
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateEntry(idx, { title: e.target.value })}
                disabled={busy}
                placeholder="Role title"
                className={`${compactInput} font-medium leading-snug`}
                autoFocus={idx === entries.length - 1}
              />
              {/* Company */}
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateEntry(idx, { company: e.target.value })}
                disabled={busy}
                placeholder="Company"
                className={`${compactInput} mt-0.5 text-sm text-ds-text-muted`}
              />
              {/* Date row */}
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-ds-text-subtle">
                <input
                  type="date"
                  value={orEmpty(exp.startDate)}
                  onChange={(e) => updateEntry(idx, { startDate: e.target.value || null })}
                  disabled={busy}
                  className="cursor-pointer bg-transparent text-xs text-ds-text-subtle outline-none"
                />
                <span>{"\u2013"}</span>
                {exp.current ? (
                  <span className="font-medium text-ds-accent">Present</span>
                ) : (
                  <input
                    type="date"
                    value={orEmpty(exp.endDate)}
                    onChange={(e) => updateEntry(idx, { endDate: e.target.value || null })}
                    disabled={busy}
                    className="cursor-pointer bg-transparent text-xs text-ds-text-subtle outline-none"
                  />
                )}
                <span className="text-ds-border">{"\u00B7"}</span>
                <label className="flex cursor-pointer select-none items-center gap-1">
                  <input
                    type="checkbox"
                    checked={!!exp.current}
                    onChange={(e) =>
                      updateEntry(idx, {
                        current: e.target.checked,
                        endDate: e.target.checked ? null : exp.endDate,
                      })
                    }
                    disabled={busy}
                    className="peer sr-only"
                  />
                  <span className="inline-flex h-4 w-7 items-center rounded-full bg-ds-border transition-colors duration-150 peer-checked:bg-ds-accent">
                    <span className="inline-block h-3 w-3 translate-x-0.5 rounded-full bg-white transition-transform duration-150 peer-checked:translate-x-3" />
                  </span>
                  <span className="text-ds-text-subtle">Current</span>
                </label>
              </div>

              {/* Remove */}
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEntry(idx)}
                  className="cursor-pointer mt-1.5 text-xs text-ds-text-subtle opacity-0 transition-all duration-150 group-hover/entry:opacity-100 hover:text-ds-error"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4 pl-[52px]">
        <button
          type="button"
          onClick={addEntry}
          disabled={busy}
          className="cursor-pointer flex items-center gap-1 text-sm font-medium text-ds-accent transition-colors duration-150 hover:text-ds-accent-hover"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Add role
        </button>
      </div>

      <div className="pl-[52px] pt-2">
        <EditActions
          saving={busy}
          onSave={() => {
            const filtered = entries.filter((e) => e.company.trim() || e.title.trim());
            onSave(filtered);
          }}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

export function ProfileView({ user, isOwner }: { user: User; isOwner: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState<EditingField>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [name, setName] = useState(orEmpty(user.name));
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(orEmpty(user.bio));
  const [linkedinUrl, setLinkedinUrl] = useState(orEmpty(user.linkedinUrl));
  const [twitterUrl, setTwitterUrl] = useState(orEmpty(user.twitterUrl));
  const [avatarUrl, setAvatarUrl] = useState(orEmpty(user.avatarUrl));

  const fileInputRef = useRef<HTMLInputElement>(null);

  function showFeedback(type: "success" | "error", message: string) {
    setFeedback({ type, message });
    if (type === "success") setTimeout(() => setFeedback(null), 3000);
  }

  async function saveField(payload: Record<string, unknown>) {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : data.details
              ? "Please check the fields and try again."
              : "Something went wrong.";
        showFeedback("error", msg);
        return false;
      }
      showFeedback("success", "Saved.");
      if (typeof payload.username === "string" && payload.username !== user.username) {
        router.replace(`/p/${payload.username}`);
      } else {
        router.refresh();
      }
      return true;
    } catch {
      showFeedback("error", "Something went wrong.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveName() {
    const ok = await saveField({ name: name.trim() || undefined });
    if (ok) setEditing(null);
  }

  async function handleSaveUsername() {
    const ok = await saveField({ username: username.trim() });
    if (ok) setEditing(null);
  }

  async function handleSaveBio() {
    const ok = await saveField({ bio: bio.trim() || undefined });
    if (ok) setEditing(null);
  }

  async function handleSaveLinks() {
    const ok = await saveField({
      linkedinUrl: linkedinUrl.trim() || undefined,
      twitterUrl: twitterUrl.trim() || undefined,
    });
    if (ok) setEditing(null);
  }

  const deleteOrphanedLogos = useCallback(
    async (newEntries: Experience[]) => {
      const oldLogos = (user.experience ?? [])
        .map((e) => e.logoUrl)
        .filter((u): u is string => !!u);
      if (oldLogos.length === 0) return;

      const keptLogos = new Set(newEntries.map((e) => e.logoUrl).filter(Boolean));
      const removed = oldLogos.filter((url) => !keptLogos.has(url));
      if (removed.length === 0) return;

      const paths = removed.map(storagePathFromUrl).filter((p): p is string => !!p);
      if (paths.length === 0) return;

      const supabase = createClient();
      await supabase.storage.from("founder-avatars").remove(paths);
    },
    [user.experience]
  );

  async function handleSaveExperience(entries: Experience[]) {
    const ok = await saveField({ experience: entries.length > 0 ? entries : null });
    if (ok) {
      await deleteOrphanedLogos(entries);
      setEditing(null);
    }
  }

  function handleCancelEdit() {
    setEditing(null);
    setFeedback(null);
    setName(orEmpty(user.name));
    setUsername(user.username);
    setBio(orEmpty(user.bio));
    setLinkedinUrl(orEmpty(user.linkedinUrl));
    setTwitterUrl(orEmpty(user.twitterUrl));
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showFeedback("error", "Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showFeedback("error", "Image must be 8 MB or smaller.");
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const supabase = createClient();
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !authUser) {
        showFeedback("error", "You need to be signed in to upload an avatar.");
        setSaving(false);
        return;
      }
      const ext = getFileExt(file);
      const path = `${authUser.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("founder-avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) {
        showFeedback("error", "Upload failed. Please try again.");
        setSaving(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("founder-avatars")
        .getPublicUrl(path);
      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) {
        showFeedback("error", "Could not get public URL for avatar.");
        setSaving(false);
        return;
      }
      const ok = await saveField({ avatarUrl: publicUrl });
      if (ok) setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
    } catch {
      showFeedback("error", "Something went wrong while uploading.");
    } finally {
      setSaving(false);
      e.target.value = "";
    }
  }

  async function handleAvatarRemove() {
    const ok = await saveField({ avatarUrl: "" });
    if (ok) setAvatarUrl("");
  }

  const displayName = name || user.email;
  const hasLinks = isValidUrl(user.linkedinUrl) || isValidUrl(user.twitterUrl);
  const experience: Experience[] = user.experience ?? [];
  const hasExperience = experience.length > 0;

  return (
    <div className="flex flex-col gap-12">
      {/* ================================================================ */}
      {/*  Identity — horizontal hero                                      */}
      {/* ================================================================ */}
      <div className="ds-stagger-1 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-ds-accent text-xl font-semibold text-ds-text-inverse sm:h-[88px] sm:w-[88px]">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={`${displayName}'s avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          {isOwner && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="cursor-pointer absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-ds-border bg-ds-surface text-ds-text-subtle shadow-ds-sm transition-colors duration-ds-fast hover:bg-ds-surface-hover hover:text-ds-text"
                title="Change photo"
              >
                <PencilIcon className="h-2.5 w-2.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={handleAvatarChange}
              />
            </>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          {/* Name */}
          {editing === "name" ? (
            <div className="space-y-3">
              <div>
                <label htmlFor="edit-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                  placeholder="Your name"
                  className={inputClass}
                  autoFocus
                />
              </div>
              <EditActions saving={saving} onSave={handleSaveName} onCancel={handleCancelEdit} />
            </div>
          ) : (
            <div className="group/section flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-ds-text sm:text-4xl">
                {displayName}
              </h1>
              <EditTrigger
                onClick={() => setEditing("name")}
                label="Edit name"
                isOwner={isOwner}
              />
            </div>
          )}

          {/* Username */}
          {editing === "username" ? (
            <div className="mt-2 space-y-3">
              <div>
                <label htmlFor="edit-username" className={labelClass}>
                  Username
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-ds-text-subtle">introd.com/p/</span>
                  <input
                    id="edit-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={saving}
                    placeholder="your_username"
                    className={inputClass}
                    autoFocus
                  />
                </div>
                <p className="mt-1 text-xs text-ds-text-subtle">
                  Letters, numbers, and underscores. 3-30 characters.
                </p>
              </div>
              <EditActions
                saving={saving}
                onSave={handleSaveUsername}
                onCancel={handleCancelEdit}
              />
            </div>
          ) : (
            <div className="group/section mt-1 flex items-center gap-2">
              <p className="text-sm text-ds-text-muted">@{user.username}</p>
              <EditTrigger
                onClick={() => setEditing("username")}
                label="Edit username"
                isOwner={isOwner}
              />
            </div>
          )}

          {/* Social links + meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {isValidUrl(user.linkedinUrl) && (
              <a
                href={user.linkedinUrl!.trim()}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="text-[#0A66C2] transition-opacity duration-ds ease-ds-out hover:opacity-80"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="4" fill="currentColor" />
                  <path
                    fill="white"
                    d="M7.077 19.452H4.027V9h3.05v10.452zM5.552 7.633a1.762 1.762 0 1 1 0-3.523 1.762 1.762 0 0 1 0 3.523zM19.447 19.452h-3.054v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h2.914v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v5.286z"
                  />
                </svg>
              </a>
            )}
            {isValidUrl(user.twitterUrl) && (
              <a
                href={user.twitterUrl!.trim()}
                target="_blank"
                rel="noopener noreferrer"
                title="X (Twitter)"
                className="text-ds-text transition-opacity duration-ds ease-ds-out hover:opacity-70"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {editing !== "links" && hasLinks && (
              <EditTrigger
                onClick={() => setEditing("links")}
                label="Edit links"
                isOwner={isOwner}
              />
            )}
            {editing !== "links" && !hasLinks && isOwner && (
              <button
                type="button"
                onClick={() => setEditing("links")}
                className="cursor-pointer text-sm text-ds-text-subtle transition-colors duration-ds-fast hover:text-ds-accent"
              >
                + Add links
              </button>
            )}
            {user.createdAt && (
              <>
                {(hasLinks || isOwner) && (
                  <span className="text-ds-border">{"\u00B7"}</span>
                )}
                <p className="text-xs text-ds-text-subtle">
                  Joined {formatMemberSince(user.createdAt)}
                </p>
              </>
            )}
          </div>

          {/* Remove photo — tucked under meta row */}
          {isOwner && avatarUrl && (
            <button
              type="button"
              onClick={handleAvatarRemove}
              disabled={saving}
              className="cursor-pointer mt-2 text-xs text-ds-text-subtle underline underline-offset-2 transition-colors duration-ds-fast hover:text-ds-text-muted"
            >
              Remove photo
            </button>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/*  Bio — editorial left border                                     */}
      {/* ================================================================ */}
      {(user.bio || isOwner) && (
        <div className="ds-stagger-2 w-full">
          <div className="mb-4 flex items-center gap-2 group/section">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
              About
            </h2>
            {editing !== "bio" && (
              <EditTrigger
                onClick={() => setEditing("bio")}
                label="Edit bio"
                isOwner={isOwner}
              />
            )}
          </div>

          {editing === "bio" ? (
            <div className="space-y-3">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={saving}
                placeholder="A few words about yourself..."
                rows={4}
                maxLength={500}
                className={inputClass + " resize-none"}
                autoFocus
              />
              <div className="flex items-center justify-between">
                <EditActions saving={saving} onSave={handleSaveBio} onCancel={handleCancelEdit} />
                <span className="text-xs tabular-nums text-ds-text-subtle">{bio.length}/500</span>
              </div>
            </div>
          ) : user.bio ? (
            <div className="border-l-2 border-ds-text pl-5">
              <p className="whitespace-pre-wrap text-[15px] leading-[1.8] text-ds-text">
                {user.bio}
              </p>
            </div>
          ) : isOwner ? (
            <button
              type="button"
              onClick={() => setEditing("bio")}
              className="cursor-pointer w-full rounded-ds border border-dashed border-ds-border px-4 py-5 text-left text-sm text-ds-text-subtle transition-colors duration-ds-fast hover:border-ds-accent hover:text-ds-accent"
            >
              Write a short bio
            </button>
          ) : null}
        </div>
      )}

      {/* ================================================================ */}
      {/*  Experience — editorial left-border entries                       */}
      {/* ================================================================ */}
      {(hasExperience || isOwner) && (
        <div className="ds-stagger-3 w-full">
          <div className="mb-4 flex items-center gap-2 group/section">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
              Experience
            </h2>
            {editing !== "experience" && (
              <EditTrigger
                onClick={() => setEditing("experience")}
                label="Edit experience"
                isOwner={isOwner}
              />
            )}
          </div>

          {editing === "experience" ? (
            <ExperienceEditForm
              experience={experience}
              saving={saving}
              onSave={handleSaveExperience}
              onCancel={handleCancelEdit}
            />
          ) : hasExperience ? (
            <div>
              {experience.map((exp, idx) => {
                const start = exp.startDate ? formatExpDate(exp.startDate) : null;
                const end = exp.current
                  ? "Present"
                  : exp.endDate
                    ? formatExpDate(exp.endDate)
                    : null;
                const dateRange = [start, end].filter(Boolean).join(" \u2013 ");
                const hasLogo = !!exp.logoUrl;
                const isLast = idx === experience.length - 1;
                const gap = !isLast ? computeGap(exp, experience[idx + 1]) : null;

                return (
                  <div key={idx} className="flex gap-4">
                    {/* Timeline marker: logo or dot */}
                    <div className="flex flex-col items-center">
                      {hasLogo ? (
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-ds-sm border border-ds-border bg-ds-bg">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={exp.logoUrl!}
                            alt={`${exp.company} logo`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center">
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              exp.current
                                ? "bg-ds-accent"
                                : "border-2 border-ds-border-strong bg-ds-bg"
                            }`}
                          />
                        </div>
                      )}
                      {!isLast &&
                        (gap ? (
                          <div className="flex flex-1 flex-col items-center py-1">
                            <div className="w-px flex-1 bg-ds-border" />
                            <span className="my-2 text-[10px] leading-none text-ds-text-subtle">
                              {gap}
                            </span>
                            <div className="w-px flex-1 bg-ds-border" />
                          </div>
                        ) : (
                          <div className="w-px flex-1 bg-ds-border" style={{ marginTop: 4 }} />
                        ))}
                    </div>

                    {/* Content */}
                    <div className={`min-w-0 ${gap ? "pb-10" : "pb-6"}`}>
                      <p className="font-medium leading-snug text-ds-text">{exp.title}</p>
                      <p className="text-sm text-ds-text-muted">{exp.company}</p>
                      {dateRange && (
                        <p className="mt-0.5 text-xs text-ds-text-subtle">{dateRange}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : isOwner ? (
            <button
              type="button"
              onClick={() => setEditing("experience")}
              className="cursor-pointer w-full rounded-ds border border-dashed border-ds-border px-4 py-5 text-left text-sm text-ds-text-subtle transition-colors duration-ds-fast hover:border-ds-accent hover:text-ds-accent"
            >
              Add your experience
            </button>
          ) : null}
        </div>
      )}

      {/* ================================================================ */}
      {/*  Links editor (inline, only when editing)                        */}
      {/* ================================================================ */}
      {editing === "links" && (
        <div className="ds-stagger-4 w-full space-y-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
            Links
          </h2>
          <div>
            <label htmlFor="edit-linkedin" className={labelClass}>
              LinkedIn
            </label>
            <input
              id="edit-linkedin"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              disabled={saving}
              placeholder="https://linkedin.com/in/..."
              className={inputClass}
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="edit-twitter" className={labelClass}>
              Twitter / X
            </label>
            <input
              id="edit-twitter"
              type="url"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              disabled={saving}
              placeholder="https://x.com/..."
              className={inputClass}
            />
          </div>
          <EditActions saving={saving} onSave={handleSaveLinks} onCancel={handleCancelEdit} />
        </div>
      )}

      {/* Feedback toast */}
      {feedback && (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={`ds-feedback-in fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-ds border px-4 py-2.5 text-sm shadow-ds-md ${
            feedback.type === "success"
              ? "border-ds-success/30 bg-ds-surface text-ds-success"
              : "border-ds-error/30 bg-ds-surface text-ds-error"
          }`}
        >
          {feedback.message}
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="cursor-pointer ml-3 text-ds-text-subtle hover:text-ds-text"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
