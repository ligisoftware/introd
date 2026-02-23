"use client";

import type { User, Intro, FundingRound } from "@/types";
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

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

export function ProfileEditor({
  initialUser,
  initialIntro,
}: {
  initialUser: User;
  initialIntro: Intro;
}) {
  // User fields
  const [name, setName] = useState(orEmpty(initialUser.name));
  const [avatarUrl, setAvatarUrl] = useState(orEmpty(initialUser.avatarUrl));
  const [userLinkedinUrl, setUserLinkedinUrl] = useState(orEmpty(initialUser.linkedinUrl));
  const [userTwitterUrl, setUserTwitterUrl] = useState(orEmpty(initialUser.twitterUrl));

  // Intro fields
  const [logoUrl, setLogoUrl] = useState(orEmpty(initialIntro.logoUrl));
  const [role, setRole] = useState(orEmpty(initialIntro.role));
  const [introText, setIntroText] = useState(orEmpty(initialIntro.introText));
  const [startupName, setStartupName] = useState(orEmpty(initialIntro.startupName));
  const [startupOneLiner, setStartupOneLiner] = useState(orEmpty(initialIntro.startupOneLiner));
  const [websiteUrl, setWebsiteUrl] = useState(orEmpty(initialIntro.websiteUrl));
  const [linkedinUrl, setLinkedinUrl] = useState(orEmpty(initialIntro.linkedinUrl));
  const [twitterUrl, setTwitterUrl] = useState(orEmpty(initialIntro.twitterUrl));
  const [foundedDate, setFoundedDate] = useState(orEmpty(initialIntro.foundedDate));
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>(
    initialIntro.fundingRounds ?? []
  );

  const [dragState, setDragState] = useState<{
    fromIdx: number;
    currentIdx: number;
    offsetY: number;
    offsetX: number;
    pointerY: number;
    pointerX: number;
    cardWidth: number;
    cardHeight: number;
  } | null>(null);
  const fundingCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fundingListRef = useRef<HTMLDivElement>(null);
  const swapCooldown = useRef(0);

  // Refs so document-level listeners always see fresh values without re-registering
  const fundingRoundsRef = useRef(fundingRounds);
  fundingRoundsRef.current = fundingRounds;
  const dragStateRef = useRef(dragState);
  dragStateRef.current = dragState;
  const isDragging = dragState !== null;

  function handlePointerDown(e: React.PointerEvent, idx: number) {
    if (e.button !== 0) return;
    const card = fundingCardRefs.current[idx];
    if (!card) return;

    e.preventDefault();
    const rect = card.getBoundingClientRect();

    setDragState({
      fromIdx: idx,
      currentIdx: idx,
      offsetY: e.clientY - rect.top,
      offsetX: e.clientX - rect.left,
      pointerY: e.clientY,
      pointerX: e.clientX,
      cardWidth: rect.width,
      cardHeight: rect.height,
    });
  }

  useEffect(() => {
    if (!isDragging) return;

    const preventSelect = (e: Event) => e.preventDefault();
    document.addEventListener("selectstart", preventSelect);

    function onPointerMove(e: PointerEvent) {
      e.preventDefault();
      const ds = dragStateRef.current;
      if (!ds) return;

      const { fromIdx } = ds;
      const listEl = fundingListRef.current;
      let newCurrentIdx: number | null = null;

      if (listEl) {
        const listRect = listEl.getBoundingClientRect();
        const insideList =
          e.clientX >= listRect.left &&
          e.clientX <= listRect.right &&
          e.clientY >= listRect.top &&
          e.clientY <= listRect.bottom;

        if (insideList && Date.now() > swapCooldown.current) {
          const rounds = fundingRoundsRef.current;
          const cards = fundingCardRefs.current;

          // Check the card directly above and below the placeholder
          // in the current visual order, and swap if pointer enters 15%
          let targetIdx = ds.currentIdx;

          // Build reduced list (without dragged item) to find neighbors
          const withoutDragged = rounds.map((_, i) => i).filter((i) => i !== fromIdx);

          // Card visually just below the placeholder: swap down if pointer enters 15% from its top
          if (ds.currentIdx < withoutDragged.length) {
            const belowIdx = withoutDragged[ds.currentIdx];
            const el = cards[belowIdx];
            if (el) {
              const rect = el.getBoundingClientRect();
              if (e.clientY >= rect.top + rect.height * 0.15) {
                targetIdx = ds.currentIdx + 1;
              }
            }
          }

          // Card visually just above the placeholder: swap up if pointer enters 15% from its bottom
          if (ds.currentIdx > 0 && targetIdx === ds.currentIdx) {
            const aboveIdx = withoutDragged[ds.currentIdx - 1];
            const el = cards[aboveIdx];
            if (el) {
              const rect = el.getBoundingClientRect();
              if (e.clientY <= rect.bottom - rect.height * 0.15) {
                targetIdx = ds.currentIdx - 1;
              }
            }
          }

          if (targetIdx !== ds.currentIdx) {
            swapCooldown.current = Date.now() + 150;
          }
          newCurrentIdx = Math.max(0, Math.min(rounds.length - 1, targetIdx));
        } else if (
          !insideList &&
          Date.now() > swapCooldown.current &&
          e.clientX >= listRect.left &&
          e.clientX <= listRect.right
        ) {
          // Pointer is in the center content column but above/below the list
          const rounds = fundingRoundsRef.current;
          const lastIdx = rounds.length - 1;
          if (e.clientY < listRect.top && ds.currentIdx !== 0) {
            newCurrentIdx = 0;
            swapCooldown.current = Date.now() + 150;
          } else if (e.clientY > listRect.bottom && ds.currentIdx !== lastIdx) {
            newCurrentIdx = lastIdx;
            swapCooldown.current = Date.now() + 150;
          }
        }
      }

      setDragState((prev) =>
        prev
          ? {
              ...prev,
              pointerY: e.clientY,
              pointerX: e.clientX,
              ...(newCurrentIdx !== null ? { currentIdx: newCurrentIdx } : {}),
            }
          : null
      );
    }

    function onPointerUp() {
      const ds = dragStateRef.current;
      if (ds && ds.fromIdx !== ds.currentIdx) {
        setFundingRounds((arr) => {
          const next = [...arr];
          const [moved] = next.splice(ds.fromIdx, 1);
          next.splice(ds.currentIdx, 0, moved);
          return next;
        });
      }
      setDragState(null);
    }

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);

    return () => {
      document.removeEventListener("selectstart", preventSelect);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging]);

  /** Build the visually-ordered list for rendering. */
  function getDragReorderedIndices(): number[] {
    const indices = fundingRounds.map((_, i) => i);
    if (!dragState || dragState.fromIdx === dragState.currentIdx) return indices;
    const { fromIdx, currentIdx } = dragState;
    indices.splice(fromIdx, 1);
    indices.splice(currentIdx, 0, fromIdx);
    return indices;
  }

  // FLIP animation: only animate when currentIdx changes during an active drag
  const prevCurrentIdx = useRef<number | null>(null);
  const cardPositions = useRef<Map<number, number>>(new Map());

  // Capture positions before render when a swap is about to happen
  const shouldFlip = useRef(false);
  const currentIdx = dragState?.currentIdx ?? null;

  if (isDragging && prevCurrentIdx.current !== null && currentIdx !== prevCurrentIdx.current) {
    // Snapshot positions right before React re-renders the new order
    const snap = new Map<number, number>();
    fundingCardRefs.current.forEach((el, idx) => {
      if (el && (!dragState || idx !== dragState.fromIdx)) {
        snap.set(idx, el.getBoundingClientRect().top);
      }
    });
    cardPositions.current = snap;
    shouldFlip.current = true;
  }
  prevCurrentIdx.current = currentIdx;

  useLayoutEffect(() => {
    if (!shouldFlip.current) return;
    shouldFlip.current = false;

    const prev = cardPositions.current;

    fundingCardRefs.current.forEach((el, idx) => {
      if (!el || (dragState && idx === dragState.fromIdx)) return;
      const newTop = el.getBoundingClientRect().top;
      const prevTop = prev.get(idx);
      if (prevTop === undefined) return;
      const delta = prevTop - newTop;
      if (Math.abs(delta) < 1) return;

      el.style.transition = "none";
      el.style.transform = `translateY(${delta}px)`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = "transform 200ms ease";
          el.style.transform = "";
        });
      });
    });
  });

  const introTextRef = useRef<HTMLTextAreaElement>(null);
  const autoResizeIntroText = useCallback(() => {
    const el = introTextRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    autoResizeIntroText();
  }, [introText, autoResizeIntroText]);

  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const [avatarStatus, setAvatarStatus] = useState<"idle" | "uploading" | "removing" | "error">(
    "idle"
  );
  const [avatarMessage, setAvatarMessage] = useState("");

  const [logoStatus, setLogoStatus] = useState<"idle" | "uploading" | "removing" | "error">("idle");
  const [logoMessage, setLogoMessage] = useState("");

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "creating" | "copied" | "error">("idle");
  const [shareError, setShareError] = useState("");

  useEffect(() => {
    if (initialIntro.shareSlug && typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/p/${initialIntro.shareSlug}`);
    }
  }, [initialIntro.shareSlug]);

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
      intro: {
        logoUrl: logoUrl.trim() || undefined,
        role: role.trim() || undefined,
        introText: introText.trim() || undefined,
        startupName: startupName.trim() || undefined,
        startupOneLiner: startupOneLiner.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        twitterUrl: twitterUrl.trim() || undefined,
        foundedDate: foundedDate.trim() || undefined,
        fundingRounds: fundingRounds.filter((r) => r.roundName.trim()),
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

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoMessage("");

    if (!file.type.startsWith("image/")) {
      setLogoStatus("error");
      setLogoMessage("Please choose an image file.");
      return;
    }

    const maxBytes = 8 * 1024 * 1024;
    if (file.size > maxBytes) {
      setLogoStatus("error");
      setLogoMessage("Image must be 8MB or smaller.");
      return;
    }

    setLogoStatus("uploading");

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLogoStatus("error");
        setLogoMessage("You need to be signed in to upload a logo.");
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

      const path = `${user.id}/logo.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("intro-avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        console.error("Logo upload error", uploadError);
        setLogoStatus("error");
        setLogoMessage("Upload failed. Please try again.");
        return;
      }

      const { data: publicUrlData } = supabase.storage.from("intro-avatars").getPublicUrl(path);
      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        setLogoStatus("error");
        setLogoMessage("Could not get public URL for logo.");
        return;
      }

      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intro: { logoUrl: publicUrl } }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLogoStatus("error");
        setLogoMessage(
          typeof data.error === "string" ? data.error : "Something went wrong."
        );
        return;
      }

      setLogoUrl(`${publicUrl}?t=${Date.now()}`);
      setLogoStatus("idle");
      setLogoMessage("");
    } catch (err) {
      console.error("Logo upload unexpected error", err);
      setLogoStatus("error");
      setLogoMessage("Something went wrong while uploading.");
    } finally {
      e.target.value = "";
    }
  }

  async function handleLogoRemove() {
    if (!logoUrl) return;

    setLogoStatus("removing");
    setLogoMessage("");

    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intro: { logoUrl: "" } }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLogoStatus("error");
        setLogoMessage(
          typeof data.error === "string" ? data.error : "Something went wrong."
        );
        return;
      }

      setLogoUrl("");
      setLogoStatus("idle");
    } catch (err) {
      console.error("Logo remove unexpected error", err);
      setLogoStatus("error");
      setLogoMessage("Something went wrong while removing the logo.");
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

  const isSaving =
    status === "saving" || avatarStatus === "uploading" || avatarStatus === "removing" || logoStatus === "uploading" || logoStatus === "removing";

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">
      {/* ── Left column: form ── */}
      <form onSubmit={handleSubmit} className="min-w-0 flex-1 space-y-10 sm:space-y-12">
        {/* ── Profile ── */}
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
                      {avatarStatus === "uploading" ? "Uploading…" : "Upload photo"}
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
                      {avatarStatus === "removing" ? "Removing…" : "Remove"}
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

        {/* ── Your Intro ── */}
        <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-shadow duration-ds ease-ds sm:p-6">
          <h2 className={sectionTitle}>Your Intro</h2>
          <p className="mt-1.5 text-sm text-ds-text-muted">
            The details that appear on your shareable intro page.
          </p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-ds-border bg-ds-surface-hover text-xs font-medium text-ds-text-subtle">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt="Company logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex flex-col items-center leading-tight">
                    <span>No</span>
                    <span>logo</span>
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <label>
                    <span className={btnSecondary}>
                      {logoStatus === "uploading" ? "Uploading\u2026" : "Upload logo"}
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={handleLogoChange}
                      disabled={isSaving}
                    />
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={handleLogoRemove}
                      disabled={isSaving}
                      className="text-xs font-medium text-ds-text-subtle underline underline-offset-2"
                    >
                      {logoStatus === "removing" ? "Removing\u2026" : "Remove"}
                    </button>
                  )}
                </div>
                <p className="text-xs text-ds-text-subtle">Company logo — PNG, JPG, or WebP up to 8MB.</p>
                {logoStatus === "error" && logoMessage && (
                  <p role="alert" className="ds-feedback-in text-xs text-ds-error">
                    {logoMessage}
                  </p>
                )}
              </div>
            </div>

            <hr className="border-ds-border" />

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
                disabled={isSaving}
                className={inputClass}
              />
            </div>

            <hr className="border-ds-border" />

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
                disabled={isSaving}
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
                disabled={isSaving}
                className={inputClass}
                maxLength={300}
              />
              <p className="mt-1.5 text-xs text-ds-text-subtle">{startupOneLiner.length}/300</p>
            </div>
            <div>
              <label htmlFor="foundedDate" className={labelClass}>
                Founded
              </label>
              <input
                id="foundedDate"
                type="date"
                value={foundedDate}
                onChange={(e) => setFoundedDate(e.target.value)}
                disabled={isSaving}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="introText" className={labelClass}>
                Intro
              </label>
              <textarea
                ref={introTextRef}
                id="introText"
                rows={4}
                placeholder="A short intro about you and what you're building."
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                disabled={isSaving}
                className={`${inputClass} min-h-[100px] resize-y overflow-hidden`}
              />
              <p className="mt-1.5 text-xs text-ds-text-subtle">
                {introText.trim() ? introText.trim().split(/\s+/).length : 0}/500
              </p>
            </div>

            <hr className="border-ds-border" />

            <div>
              <div className="flex items-center justify-between">
                <span className={labelClass}>Funding</span>
                {fundingRounds.length < 20 && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFundingRounds((prev) => [
                          ...prev,
                          { type: "round", roundName: "", amount: "", date: "" },
                        ])
                      }
                      disabled={isSaving}
                      className="text-xs font-medium text-ds-accent underline underline-offset-2"
                    >
                      + Round
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFundingRounds((prev) => [
                          ...prev,
                          { type: "safe", roundName: "", amount: "", date: "" },
                        ])
                      }
                      disabled={isSaving}
                      className="text-xs font-medium text-ds-accent underline underline-offset-2"
                    >
                      + SAFE
                    </button>
                  </div>
                )}
              </div>
              {fundingRounds.length === 0 && (
                <p className="mt-1.5 text-xs text-ds-text-subtle">
                  No funding rounds or SAFEs added yet.
                </p>
              )}
              <div
                ref={fundingListRef}
                className="mt-2 space-y-3"
              >
                {getDragReorderedIndices().map((idx) => {
                  const round = fundingRounds[idx];
                  const isSafe = round.type === "safe";
                  const isDragged = dragState !== null && idx === dragState.fromIdx;

                  if (isDragged) {
                    return (
                      <div
                        key={idx}
                        style={{ height: dragState.cardHeight }}
                        className="rounded-ds border-2 border-dashed border-ds-accent/40 bg-ds-accent/5"
                      />
                    );
                  }

                  return (
                    <div
                      key={idx}
                      ref={(el) => { fundingCardRefs.current[idx] = el; }}
                      className="rounded-ds border border-ds-border bg-ds-surface-hover p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            onPointerDown={(e) => handlePointerDown(e, idx)}
                            className="cursor-grab touch-none select-none text-ds-text-subtle active:cursor-grabbing"
                            title="Drag to reorder"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" />
                            </svg>
                          </span>
                          <span className="text-xs font-medium text-ds-text-muted">
                            {isSafe ? "SAFE" : "Round"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFundingRounds((prev) => prev.filter((_, i) => i !== idx))
                          }
                          disabled={isSaving}
                          className="text-xs font-medium text-ds-text-subtle underline underline-offset-2"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder={isSafe ? "e.g. Investor name or note" : "e.g. Pre-seed, Seed, Series A"}
                        value={round.roundName}
                        onChange={(e) =>
                          setFundingRounds((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, roundName: e.target.value } : r
                            )
                          )
                        }
                        disabled={isSaving}
                        className={inputClass}
                        maxLength={100}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Amount (e.g. $2M)"
                          value={orEmpty(round.amount)}
                          onChange={(e) =>
                            setFundingRounds((prev) =>
                              prev.map((r, i) =>
                                i === idx ? { ...r, amount: e.target.value } : r
                              )
                            )
                          }
                          disabled={isSaving}
                          className={inputClass}
                          maxLength={50}
                        />
                        <input
                          type="date"
                          value={orEmpty(round.date)}
                          onChange={(e) =>
                            setFundingRounds((prev) =>
                              prev.map((r, i) =>
                                i === idx ? { ...r, date: e.target.value } : r
                              )
                            )
                          }
                          disabled={isSaving}
                          className={inputClass}
                        />
                      </div>
                      {isSafe ? (
                        <input
                          type="text"
                          placeholder="Valuation cap (e.g. $10M)"
                          value={orEmpty(round.valuationCap)}
                          onChange={(e) =>
                            setFundingRounds((prev) =>
                              prev.map((r, i) =>
                                i === idx ? { ...r, valuationCap: e.target.value } : r
                              )
                            )
                          }
                          disabled={isSaving}
                          className={inputClass}
                          maxLength={50}
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder="Post-money valuation (e.g. $10M)"
                          value={orEmpty(round.postValuation)}
                          onChange={(e) =>
                            setFundingRounds((prev) =>
                              prev.map((r, i) =>
                                i === idx ? { ...r, postValuation: e.target.value } : r
                              )
                            )
                          }
                          disabled={isSaving}
                          className={inputClass}
                          maxLength={50}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {dragState && (() => {
                const round = fundingRounds[dragState.fromIdx];
                const isSafe = round.type === "safe";
                return (
                  <div
                    style={{
                      position: "fixed",
                      top: dragState.pointerY - dragState.offsetY,
                      left: dragState.pointerX - dragState.offsetX,
                      width: dragState.cardWidth,
                      zIndex: 50,
                      pointerEvents: "none",
                    }}
                    className="rounded-ds border border-ds-accent bg-ds-surface p-3 space-y-2 shadow-ds-md opacity-90"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-ds-text-subtle">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" />
                        </svg>
                      </span>
                      <span className="text-xs font-medium text-ds-text-muted">
                        {isSafe ? "SAFE" : "Round"}
                      </span>
                    </div>
                    {round.roundName && (
                      <p className="text-sm text-ds-text truncate">{round.roundName}</p>
                    )}
                    {(round.amount || (isSafe ? round.valuationCap : round.postValuation)) && (
                      <p className="text-xs text-ds-text-muted truncate">
                        {[round.amount, isSafe ? round.valuationCap && `${round.valuationCap} cap` : round.postValuation && `${round.postValuation} post`].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>

            <hr className="border-ds-border" />

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
                disabled={isSaving}
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
                disabled={isSaving}
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
                disabled={isSaving}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Submit and feedback */}
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isSaving} className={btnPrimary}>
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

      {/* ── Right column: share (sticky) ── */}
      <aside className="w-full lg:sticky lg:top-[4.5rem] lg:w-80 lg:shrink-0">
        <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-shadow duration-ds ease-ds sm:p-6">
          <h2 className={sectionTitle}>Share your page</h2>
          <p className="mt-2 text-sm text-ds-text-muted">
            Create a link to share your intro with others. The link is unlisted—only people you
            share it with can view it.
          </p>
          <div className="mt-4 flex flex-col gap-3">
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
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="min-w-0 w-full rounded-ds border border-ds-border bg-ds-surface-hover pl-3.5 pr-10 py-2.5 text-sm text-ds-text-muted transition-[border-color] duration-ds-fast ease-ds"
                    aria-label="Share link"
                  />
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="absolute inset-y-0 right-0 flex items-center px-2.5 text-ds-text-subtle transition-colors duration-ds-fast ease-ds hover:text-ds-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring"
                    aria-label={shareStatus === "copied" ? "Copied" : "Copy link"}
                  >
                    <span key={shareStatus} className={shareStatus === "copied" ? "ds-pop" : ""}>
                      {shareStatus === "copied" ? (
                        <svg className="h-4 w-4 text-ds-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </span>
                  </button>
                </div>
                <details className="group">
                  <summary className="cursor-pointer text-xs font-medium text-ds-text-subtle hover:text-ds-text-muted transition-colors duration-ds-fast ease-ds select-none">
                    Regenerate link
                  </summary>
                  <div className="mt-2 rounded-ds border border-ds-border bg-ds-surface-hover p-3">
                    <p className="text-xs text-ds-text-muted">
                      This creates a new link and <strong className="font-semibold text-ds-text">permanently breaks the old one</strong>. Anyone with the previous link will no longer be able to view your intro.
                    </p>
                    <button
                      type="button"
                      onClick={handleRegenerateShareLink}
                      disabled={shareStatus === "creating"}
                      className="mt-2 rounded-ds-sm border border-ds-border bg-ds-surface px-3 py-1.5 text-xs font-medium text-ds-text transition-[color,box-shadow] duration-ds ease-ds hover:bg-ds-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {shareStatus === "creating" ? "Regenerating…" : "I understand, regenerate"}
                    </button>
                  </div>
                </details>
              </>
            )}
            {shareStatus === "error" && shareError && (
              <p role="alert" className="ds-feedback-in text-sm text-ds-error">
                {shareError}
              </p>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}
