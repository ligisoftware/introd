"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewIntroCard() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/intros", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Failed to create intro");
        setCreating(false);
        return;
      }

      router.push(`/intro/${data.intro.id}`);
    } catch {
      alert("Failed to create intro");
      setCreating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCreate}
      disabled={creating}
      className="flex min-h-[5.5rem] items-center justify-center rounded-ds-lg border-2 border-dashed border-ds-border bg-ds-surface p-5 text-ds-text-muted transition-colors duration-ds ease-ds hover:border-ds-accent/40 hover:text-ds-accent disabled:opacity-50"
      data-testid="intro-list-create"
    >
      <div className="flex items-center gap-2">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span className="text-sm font-medium">{creating ? "Creating…" : "New intro"}</span>
      </div>
    </button>
  );
}
