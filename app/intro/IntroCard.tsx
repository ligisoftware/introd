"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Intro } from "@/types";

export default function IntroCard({ intro }: { intro: Intro }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  function handleDeleteClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDeleteError("");
    setConfirmingDelete(true);
  }

  function handleDeleteCancel(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingDelete(false);
    setDeleteError("");
  }

  async function handleDeleteConfirm(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDeleteError("");
    setDeleting(true);
    try {
      const res = await fetch(`/api/intros/${intro.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error ?? "Failed to delete intro");
        setDeleting(false);
        return;
      }
      setConfirmingDelete(false);
      router.refresh();
    } catch {
      setDeleteError("Failed to delete intro");
      setDeleting(false);
    }
  }

  return (
    <div
      className="group relative rounded-ds-lg border border-ds-border bg-ds-surface shadow-ds-sm transition-[border-color,box-shadow] duration-ds ease-ds hover:border-ds-accent/40 hover:shadow-ds"
      data-testid="intro-card"
    >
      <Link href={`/intro/${intro.id}`} className="block p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ds-border bg-ds-surface-hover text-xs font-medium text-ds-text-subtle">
            {intro.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={intro.logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <svg
                className="h-5 w-5 text-ds-text-subtle"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                />
              </svg>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold text-ds-text transition-colors duration-ds-fast ease-ds group-hover:text-ds-accent">
              {intro.startupName || "Untitled intro"}
            </h2>
            {intro.startupOneLiner && (
              <p className="mt-0.5 truncate text-xs text-ds-text-muted">{intro.startupOneLiner}</p>
            )}
          </div>
        </div>
        {intro.updatedAt && (
          <p className="mt-3 text-xs text-ds-text-subtle">
            Updated{" "}
            {new Date(intro.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </Link>
      {intro.shareSlug && (
        <p className="px-5 pb-4 pt-0">
          <a
            href={`/i/${intro.shareSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ds-accent transition-opacity duration-ds-fast ease-ds hover:text-ds-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg rounded-ds-sm"
          >
            View page
          </a>
        </p>
      )}

      {!confirmingDelete && (
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={deleting}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-ds-sm text-ds-text-subtle opacity-0 transition-opacity duration-ds-fast ease-ds hover:bg-ds-surface-hover hover:text-ds-text group-hover:opacity-100 disabled:opacity-50"
          aria-label="Delete intro"
          data-testid="intro-card-delete"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      )}

      {confirmingDelete && (
        <div className="absolute right-2 top-2 left-2 rounded-ds-sm border border-ds-border bg-ds-surface-hover p-3 shadow-ds-sm">
          <p className="text-sm text-ds-text">Delete this intro? This cannot be undone.</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleDeleteCancel}
              disabled={deleting}
              className="rounded-ds-sm border border-ds-border bg-ds-surface px-2.5 py-1.5 text-sm font-medium text-ds-text transition-colors duration-ds-fast ease-ds hover:bg-ds-surface-hover"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="rounded-ds-sm bg-ds-accent px-2.5 py-1.5 text-sm font-medium text-ds-text-inverse transition-colors duration-ds-fast ease-ds hover:opacity-90 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
          {deleteError && (
            <div role="alert" className="ds-feedback-in mt-2 text-xs text-ds-error">
              {deleteError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
