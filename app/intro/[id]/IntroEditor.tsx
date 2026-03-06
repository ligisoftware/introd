"use client";

import type { Intro, FundingRound, Collaborator } from "@/types";
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  orEmpty,
  inputClass,
  labelClass,
  sectionTitle,
  btnPrimary,
  btnSecondary,
} from "@/app/components/form-classes";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function IntroEditor({
  initialIntro,
  initialCollaborators = [],
  isOwner = true,
  ownerEmail,
  ownerName,
  ownerAvatarUrl,
}: {
  initialIntro: Intro;
  initialCollaborators?: Collaborator[];
  isOwner?: boolean;
  ownerEmail: string;
  ownerName?: string;
  ownerAvatarUrl?: string;
}) {
  const introId = initialIntro.id;

  const [logoUrl, setLogoUrl] = useState(orEmpty(initialIntro.logoUrl));
  const [title, setTitle] = useState(orEmpty(initialIntro.title));
  const [introText, setIntroText] = useState(orEmpty(initialIntro.introText));
  const [startupName, setStartupName] = useState(orEmpty(initialIntro.startupName));
  const [startupOneLiner, setStartupOneLiner] = useState(orEmpty(initialIntro.startupOneLiner));
  const [websiteUrl, setWebsiteUrl] = useState(orEmpty(initialIntro.websiteUrl));
  const [linkedinUrl, setLinkedinUrl] = useState(orEmpty(initialIntro.linkedinUrl));
  const [twitterUrl, setTwitterUrl] = useState(orEmpty(initialIntro.twitterUrl));
  const [ownerStartDate, setOwnerStartDate] = useState(orEmpty(initialIntro.ownerStartDate));
  const [ownerBio, setOwnerBio] = useState(orEmpty(initialIntro.ownerBio));
  const [showOwnerEmail, setShowOwnerEmail] = useState(initialIntro.showOwnerEmail ?? false);
  const [foundedDate, setFoundedDate] = useState(orEmpty(initialIntro.foundedDate));
  const [location, setLocation] = useState(orEmpty(initialIntro.location));
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>(
    initialIntro.fundingRounds ?? []
  );
  const [pitchDeck, setPitchDeck] = useState(initialIntro.pitchDeck ?? null);
  const [pitchDeckMode, setPitchDeckMode] = useState<"upload" | "link">(
    initialIntro.pitchDeck?.source === "external" ? "link" : "upload"
  );
  const [pitchDeckUrlInput, setPitchDeckUrlInput] = useState(initialIntro.pitchDeck?.url ?? "");

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

          let targetIdx = ds.currentIdx;

          const withoutDragged = rounds.map((_, i) => i).filter((i) => i !== fromIdx);

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

  function getDragReorderedIndices(): number[] {
    const indices = fundingRounds.map((_, i) => i);
    if (!dragState || dragState.fromIdx === dragState.currentIdx) return indices;
    const { fromIdx, currentIdx } = dragState;
    indices.splice(fromIdx, 1);
    indices.splice(currentIdx, 0, fromIdx);
    return indices;
  }

  // FLIP animation
  const prevCurrentIdx = useRef<number | null>(null);
  const cardPositions = useRef<Map<number, number>>(new Map());
  const shouldFlip = useRef(false);
  const currentIdx = dragState?.currentIdx ?? null;

  if (isDragging && prevCurrentIdx.current !== null && currentIdx !== prevCurrentIdx.current) {
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

  const [logoStatus, setLogoStatus] = useState<"idle" | "uploading" | "removing" | "error">("idle");
  const [logoMessage, setLogoMessage] = useState("");

  const [deckStatus, setDeckStatus] = useState<
    "idle" | "uploading" | "saving" | "removing" | "error"
  >("idle");
  const [deckMessage, setDeckMessage] = useState("");

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "creating" | "copied" | "error">("idle");
  const [shareError, setShareError] = useState("");

  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [inviteMessage, setInviteMessage] = useState("");
  const [removingCollaboratorId, setRemovingCollaboratorId] = useState<string | null>(null);
  const [removeCollaboratorError, setRemoveCollaboratorError] = useState("");

  useEffect(() => {
    if (initialIntro.shareSlug && typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/i/${initialIntro.shareSlug}`);
    }
  }, [initialIntro.shareSlug]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;

    setInviteStatus("sending");
    setInviteMessage("");

    try {
      const res = await fetch(`/api/intros/${introId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setInviteStatus("error");
        setInviteMessage(typeof data.error === "string" ? data.error : "Failed to send invite.");
        return;
      }

      if (data.collaborator) {
        setCollaborators((prev) => [...prev, data.collaborator]);
      }
      setInviteEmail("");
      setInviteStatus("success");
      setInviteMessage("Invite sent!");
      setTimeout(() => {
        setInviteStatus("idle");
        setInviteMessage("");
      }, 3000);
    } catch {
      setInviteStatus("error");
      setInviteMessage("Something went wrong.");
    }
  }

  async function handleCollaboratorFieldSave(
    collaboratorId: string,
    field: "title" | "startDate" | "bio" | "showEmail",
    value: string | boolean
  ) {
    try {
      await fetch(`/api/intros/${introId}/collaborators/${collaboratorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: field === "showEmail" ? value : value || undefined }),
      });
    } catch {
      // Silently fail — value persists in local state
    }
  }

  function handleRemoveCollaboratorClick(collaboratorId: string) {
    setRemoveCollaboratorError("");
    setRemovingCollaboratorId(collaboratorId);
  }

  function handleRemoveCollaboratorCancel() {
    setRemovingCollaboratorId(null);
    setRemoveCollaboratorError("");
  }

  async function handleRemoveCollaboratorConfirm(collaboratorId: string) {
    setRemoveCollaboratorError("");
    try {
      const res = await fetch(`/api/intros/${introId}/collaborators/${collaboratorId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setRemoveCollaboratorError(
          typeof data.error === "string" ? data.error : "Failed to remove collaborator."
        );
        return;
      }
      setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId));
      setRemovingCollaboratorId(null);
    } catch {
      setRemoveCollaboratorError("Something went wrong.");
      const refetch = await fetch(`/api/intros/${introId}/collaborators`);
      const data = await refetch.json().catch(() => ({}));
      if (data.collaborators) setCollaborators(data.collaborators);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");

    const payload = {
      logoUrl: logoUrl.trim() || undefined,
      title: title.trim() || undefined,
      showOwnerEmail,
      ownerStartDate: ownerStartDate.trim() || undefined,
      ownerBio: ownerBio.trim() || undefined,
      introText: introText.trim() || undefined,
      startupName: startupName.trim() || undefined,
      startupOneLiner: startupOneLiner.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      twitterUrl: twitterUrl.trim() || undefined,
      foundedDate: foundedDate.trim() || undefined,
      location: location.trim() || undefined,
      fundingRounds: fundingRounds.filter((r) => r.roundName.trim()),
    };

    try {
      const res = await fetch(`/api/intros/${introId}`, {
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
      setMessage("Intro saved.");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setMessage("Something went wrong.");
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

      const res = await fetch(`/api/intros/${introId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoUrl: publicUrl }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLogoStatus("error");
        setLogoMessage(typeof data.error === "string" ? data.error : "Something went wrong.");
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
      const res = await fetch(`/api/intros/${introId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoUrl: "" }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLogoStatus("error");
        setLogoMessage(typeof data.error === "string" ? data.error : "Something went wrong.");
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

  async function handlePitchDeckFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setDeckMessage("");

    const maxBytes = 20 * 1024 * 1024;
    if (file.size > maxBytes) {
      setDeckStatus("error");
      setDeckMessage("Pitch deck must be 20MB or smaller.");
      e.target.value = "";
      return;
    }

    if (file.type !== "application/pdf") {
      setDeckStatus("error");
      setDeckMessage("Please upload a PDF file.");
      e.target.value = "";
      return;
    }

    setDeckStatus("uploading");

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setDeckStatus("error");
        setDeckMessage("You need to be signed in to upload a deck.");
        return;
      }

      const safeName = file.name.replace(/\s+/g, "-");
      const path = `${user.id}/intros/${introId}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("intro-pitch-decks")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        console.error("Pitch deck upload error", uploadError);
        setDeckStatus("error");
        setDeckMessage("Upload failed. Please try again.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("intro-pitch-decks")
        .getPublicUrl(path);
      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        setDeckStatus("error");
        setDeckMessage("Could not get public URL for deck.");
        return;
      }

      setDeckStatus("saving");

      const res = await fetch(`/api/intros/${introId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pitchDeck: {
            source: "external",
            url: publicUrl,
            fileName: file.name,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setDeckStatus("error");
        setDeckMessage(typeof data.error === "string" ? data.error : "Something went wrong.");
        return;
      }

      const updatedIntro = (data as { intro?: Intro }).intro;
      setPitchDeck(updatedIntro?.pitchDeck ?? null);
      setPitchDeckMode("upload");
      setDeckStatus("idle");
      setDeckMessage("");
    } catch (err) {
      console.error("Pitch deck upload unexpected error", err);
      setDeckStatus("error");
      setDeckMessage("Something went wrong while uploading.");
    } finally {
      e.target.value = "";
    }
  }

  async function handlePitchDeckLinkSave(e: React.FormEvent) {
    e.preventDefault();
    const url = pitchDeckUrlInput.trim();
    if (!url) {
      setDeckStatus("error");
      setDeckMessage("Please enter a deck URL.");
      return;
    }

    setDeckStatus("saving");
    setDeckMessage("");

    try {
      const res = await fetch(`/api/intros/${introId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pitchDeck: {
            source: "external",
            url,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setDeckStatus("error");
        setDeckMessage(
          typeof data.error === "string"
            ? data.error
            : data.details
              ? "Please check the deck URL and try again."
              : "Something went wrong."
        );
        return;
      }

      const updatedIntro = (data as { intro?: Intro }).intro;
      setPitchDeck(updatedIntro?.pitchDeck ?? null);
      setDeckStatus("idle");
      setDeckMessage("Deck link saved.");
      setTimeout(() => setDeckMessage(""), 3000);
    } catch (err) {
      console.error("Pitch deck link save unexpected error", err);
      setDeckStatus("error");
      setDeckMessage("Something went wrong while saving the deck link.");
    }
  }

  async function handlePitchDeckRemove() {
    if (!pitchDeck) return;

    setDeckStatus("removing");
    setDeckMessage("");

    try {
      const res = await fetch(`/api/intros/${introId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchDeck: null }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setDeckStatus("error");
        setDeckMessage(typeof data.error === "string" ? data.error : "Something went wrong.");
        return;
      }

      setPitchDeck(null);
      setDeckStatus("idle");
      setDeckMessage("");
    } catch (err) {
      console.error("Pitch deck remove unexpected error", err);
      setDeckStatus("error");
      setDeckMessage("Something went wrong while removing the deck.");
    }
  }

  async function handleCreateShareLink() {
    setShareStatus("creating");
    setShareError("");
    try {
      const res = await fetch(`/api/intros/${introId}/share`, { method: "POST" });
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

  const isSaving =
    status === "saving" ||
    logoStatus === "uploading" ||
    logoStatus === "removing" ||
    deckStatus === "uploading" ||
    deckStatus === "saving" ||
    deckStatus === "removing";

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">
      {/* -- Left column: form -- */}
      <form onSubmit={handleSubmit} className="min-w-0 flex-1 space-y-10 sm:space-y-12">
        <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-shadow duration-ds ease-ds sm:p-6">
          <h2 className={sectionTitle}>Your Intro</h2>
          <p className="mt-1.5 text-sm text-ds-text-muted">
            The details that appear on your shareable intro page.
          </p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-ds-lg border border-ds-border bg-ds-surface-hover text-xs font-medium text-ds-text-subtle">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Company logo" className="h-full w-full object-cover" />
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
                <p className="text-xs text-ds-text-subtle">
                  Company logo — PNG, JPG, or WebP up to 8MB.
                </p>
                {logoStatus === "error" && logoMessage && (
                  <p role="alert" className="ds-feedback-in text-xs text-ds-error">
                    {logoMessage}
                  </p>
                )}
              </div>
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
              <label htmlFor="location" className={labelClass}>
                Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isSaving}
                className={inputClass}
                maxLength={100}
              />
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
              <div ref={fundingListRef} className="mt-2 space-y-3">
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
                      ref={(el) => {
                        fundingCardRefs.current[idx] = el;
                      }}
                      className="rounded-ds border border-ds-border bg-ds-surface-hover p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            onPointerDown={(e) => handlePointerDown(e, idx)}
                            className="cursor-grab touch-none select-none text-ds-text-subtle active:cursor-grabbing"
                            title="Drag to reorder"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01"
                              />
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
                        placeholder={
                          isSafe ? "e.g. Investor name or note" : "e.g. Pre-seed, Seed, Series A"
                        }
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
                              prev.map((r, i) => (i === idx ? { ...r, amount: e.target.value } : r))
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
                              prev.map((r, i) => (i === idx ? { ...r, date: e.target.value } : r))
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
              {dragState &&
                (() => {
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
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01"
                            />
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
                          {[
                            round.amount,
                            isSafe
                              ? round.valuationCap && `${round.valuationCap} cap`
                              : round.postValuation && `${round.postValuation} post`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
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

        {/* Attachments section */}
        <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-shadow duration-ds ease-ds sm:p-6">
          <h2 className={sectionTitle}>Attachments</h2>
          <p className="mt-1.5 text-sm text-ds-text-muted">
            Add your pitch deck so viewers can go deeper from your intro link.
          </p>

          <div className="mt-4 space-y-4">
            <div className="inline-flex rounded-ds bg-ds-surface-hover p-0.5 text-xs font-medium">
              <button
                type="button"
                className={`px-3 py-1 rounded-ds ${
                  pitchDeckMode === "upload"
                    ? "bg-ds-surface text-ds-text"
                    : "text-ds-text-subtle"
                }`}
                onClick={() => setPitchDeckMode("upload")}
                disabled={isSaving}
              >
                Upload PDF
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded-ds ${
                  pitchDeckMode === "link"
                    ? "bg-ds-surface text-ds-text"
                    : "text-ds-text-subtle"
                }`}
                onClick={() => setPitchDeckMode("link")}
                disabled={isSaving}
              >
                Link to a deck
              </button>
            </div>

            {pitchDeck ? (
              <div className="space-y-2 rounded-ds border border-ds-border bg-ds-surface-hover p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
                      Pitch deck
                    </p>
                    <p className="mt-1 truncate text-sm text-ds-text">
                      {pitchDeck.fileName || pitchDeck.url}
                    </p>
                    <p className="mt-0.5 text-xs text-ds-text-subtle">
                      {pitchDeck.source === "external" ? "External link" : "Stored file"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <a
                      href={pitchDeck.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={btnSecondary}
                    >
                      View deck
                    </a>
                    <button
                      type="button"
                      onClick={handlePitchDeckRemove}
                      disabled={isSaving}
                      className="text-xs font-medium text-ds-text-subtle underline underline-offset-2"
                    >
                      {deckStatus === "removing" ? "Removing…" : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            ) : pitchDeckMode === "upload" ? (
              <div className="rounded-ds border border-ds-border bg-ds-surface-hover p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label>
                    <span className={btnSecondary}>
                      {deckStatus === "uploading" ? "Uploading…" : "Choose file"}
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="sr-only"
                      onChange={handlePitchDeckFileChange}
                      disabled={isSaving}
                    />
                  </label>
                  <p className="text-xs text-ds-text-subtle">PDF, up to 20MB.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePitchDeckLinkSave} className="space-y-2">
                <div>
                  <label htmlFor="pitchDeckUrl" className={labelClass}>
                    Deck URL
                  </label>
                  <input
                    id="pitchDeckUrl"
                    type="url"
                    placeholder="https://..."
                    value={pitchDeckUrlInput}
                    onChange={(e) => setPitchDeckUrlInput(e.target.value)}
                    disabled={isSaving}
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-ds-text-subtle">
                    Use a public, view-only link (e.g. Google Slides, Notion, PDF).
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={btnSecondary}
                >
                  {deckStatus === "saving" ? "Saving…" : "Save deck link"}
                </button>
              </form>
            )}

            {deckStatus === "error" && deckMessage && (
              <p role="alert" className="ds-feedback-in text-xs text-ds-error">
                {deckMessage}
              </p>
            )}
            {deckStatus === "idle" && deckMessage && (
              <p role="status" className="ds-feedback-in text-xs text-ds-success">
                {deckMessage}
              </p>
            )}
          </div>
        </section>

        {/* Team section */}
        <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-shadow duration-ds ease-ds sm:p-6">
          <h2 className={sectionTitle}>Team</h2>
          <p className="mt-1.5 text-sm text-ds-text-muted">
            Set each member&apos;s title and start date. These appear on your shared page.
          </p>

          <div className="mt-4 space-y-3">
            {/* Owner card */}
            <div className="rounded-ds border border-ds-border bg-ds-surface-hover p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-ds-border bg-ds-bg-elevated">
                  {ownerAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ownerAvatarUrl}
                      alt={ownerName ? `${ownerName}'s avatar` : "Owner avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-medium text-ds-text-subtle">
                      {ownerName ? getInitials(ownerName) : ownerEmail[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ds-text">
                    {ownerName || ownerEmail}
                  </p>
                  {ownerName && (
                    <p className="truncate text-xs text-ds-text-subtle">{ownerEmail}</p>
                  )}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Title (e.g. CEO)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSaving}
                  className={inputClass}
                  maxLength={100}
                />
                <input
                  type="date"
                  placeholder="Start date"
                  value={ownerStartDate}
                  onChange={(e) => setOwnerStartDate(e.target.value)}
                  disabled={isSaving}
                  className={inputClass}
                />
              </div>
              <textarea
                placeholder="What is your role? (e.g. Leading product strategy, Building the sales pipeline)"
                value={ownerBio}
                onChange={(e) => setOwnerBio(e.target.value)}
                disabled={isSaving}
                className={`${inputClass} mt-2`}
                maxLength={500}
                rows={2}
              />
              <label className="mt-2 flex items-center gap-2 text-xs text-ds-text-muted">
                <input
                  type="checkbox"
                  checked={showOwnerEmail}
                  onChange={(e) => setShowOwnerEmail(e.target.checked)}
                  disabled={isSaving}
                  className="rounded border-ds-border"
                />
                Show email on intro page
              </label>
            </div>

            {/* Collaborator cards */}
            {collaborators
              .filter((c) => c.status === "accepted")
              .map((collab) => {
                const displayName = collab.userName || collab.email;
                return (
                  <div
                    key={collab.id}
                    className="rounded-ds border border-ds-border bg-ds-surface-hover p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-ds-border bg-ds-bg-elevated">
                        {collab.userAvatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={collab.userAvatarUrl}
                            alt={`${displayName}'s avatar`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-ds-text-subtle">
                            {collab.userName
                              ? getInitials(collab.userName)
                              : collab.email[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ds-text">{displayName}</p>
                        {collab.userName && (
                          <p className="truncate text-xs text-ds-text-subtle">{collab.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Title"
                        defaultValue={collab.title ?? ""}
                        onBlur={(e) =>
                          handleCollaboratorFieldSave(collab.id, "title", e.target.value)
                        }
                        disabled={isSaving}
                        className={inputClass}
                        maxLength={100}
                      />
                      <input
                        type="date"
                        placeholder="Start date"
                        defaultValue={collab.startDate ?? ""}
                        onBlur={(e) =>
                          handleCollaboratorFieldSave(collab.id, "startDate", e.target.value)
                        }
                        disabled={isSaving}
                        className={inputClass}
                      />
                    </div>
                    <textarea
                      placeholder="What is your role? (e.g. Leading product strategy, Building the sales pipeline)"
                      defaultValue={collab.bio ?? ""}
                      onBlur={(e) => handleCollaboratorFieldSave(collab.id, "bio", e.target.value)}
                      disabled={isSaving}
                      className={`${inputClass} mt-2`}
                      maxLength={500}
                      rows={2}
                    />
                    <label className="mt-2 flex items-center gap-2 text-xs text-ds-text-muted">
                      <input
                        type="checkbox"
                        defaultChecked={collab.showEmail ?? false}
                        onChange={(e) =>
                          handleCollaboratorFieldSave(collab.id, "showEmail", e.target.checked)
                        }
                        disabled={isSaving}
                        className="rounded border-ds-border"
                      />
                      Show email on intro page
                    </label>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Submit and feedback */}
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isSaving} className={btnPrimary}>
            {status === "saving" ? "Saving\u2026" : "Save intro"}
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

      {/* -- Right column: share + collaborators (sticky) -- */}
      <aside className="w-full space-y-5 lg:sticky lg:top-[4.5rem] lg:w-80 lg:shrink-0">
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
                {shareStatus === "creating" ? "Creating\u2026" : "Create share link"}
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
                    className="absolute inset-y-0 right-0 flex items-center px-2.5 text-ds-text-subtle transition-colors duration-ds-fast ease-ds hover:text-ds-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
                    aria-label={shareStatus === "copied" ? "Copied" : "Copy link"}
                  >
                    <span key={shareStatus} className={shareStatus === "copied" ? "ds-pop" : ""}>
                      {shareStatus === "copied" ? (
                        <svg
                          className="h-4 w-4 text-ds-success"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </span>
                  </button>
                </div>
              </>
            )}
            {shareStatus === "error" && shareError && (
              <p role="alert" className="ds-feedback-in text-sm text-ds-error">
                {shareError}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-shadow duration-ds ease-ds sm:p-6">
          <h2 className={sectionTitle}>Access</h2>

          {isOwner && (
            <>
              <form onSubmit={handleInvite} className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="cofounder@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  disabled={inviteStatus === "sending"}
                  className={`${inputClass} min-w-0 flex-1`}
                />
                <button
                  type="submit"
                  disabled={inviteStatus === "sending" || !inviteEmail.trim()}
                  className={btnPrimary}
                >
                  {inviteStatus === "sending" ? "Sending\u2026" : "Invite"}
                </button>
              </form>

              {inviteStatus === "success" && inviteMessage && (
                <p role="status" className="ds-feedback-in mt-2 text-xs text-ds-success">
                  {inviteMessage}
                </p>
              )}
              {inviteStatus === "error" && inviteMessage && (
                <p role="alert" className="ds-feedback-in mt-2 text-xs text-ds-error">
                  {inviteMessage}
                </p>
              )}
            </>
          )}

          <ul className="mt-4 space-y-2">
            <li className="flex items-center justify-between rounded-ds border border-ds-border bg-ds-surface-hover px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ds-text">{ownerName || ownerEmail}</p>
                <span className="text-xs font-medium text-ds-accent">Owner</span>
              </div>
            </li>
            {collaborators.map((collab) => {
              const displayName = collab.userName || collab.email;
              const isRemoving = removingCollaboratorId === collab.id;
              return (
                <li
                  key={collab.id}
                  className="flex flex-col gap-2 rounded-ds border border-ds-border bg-ds-surface-hover px-3 py-2"
                >
                  {isRemoving ? (
                    <>
                      <p className="text-sm text-ds-text">Remove {displayName}?</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleRemoveCollaboratorCancel}
                          className="rounded-ds-sm border border-ds-border bg-ds-surface px-2 py-1 text-xs font-medium text-ds-text transition-colors duration-ds-fast ease-ds hover:bg-ds-surface-hover"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveCollaboratorConfirm(collab.id)}
                          className="rounded-ds-sm bg-ds-accent px-2 py-1 text-xs font-medium text-ds-text-inverse transition-colors duration-ds-fast ease-ds hover:opacity-90"
                        >
                          Remove
                        </button>
                      </div>
                      {removeCollaboratorError && (
                        <div role="alert" className="ds-feedback-in text-xs text-ds-error">
                          {removeCollaboratorError}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-ds-text">{displayName}</p>
                        <span
                          className={`text-xs ${collab.status === "accepted" ? "text-ds-success" : "text-ds-text-subtle"}`}
                        >
                          {collab.status === "accepted" ? "Collaborator" : "Pending"}
                        </span>
                      </div>
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCollaboratorClick(collab.id)}
                          className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-ds-sm text-ds-text-subtle transition-colors duration-ds-fast ease-ds hover:bg-ds-surface hover:text-ds-text"
                          aria-label={`Remove ${displayName}`}
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </aside>
    </div>
  );
}
