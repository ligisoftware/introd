"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function getInitial(email: string): string {
  return email.charAt(0).toUpperCase();
}

export function AuthBar({ email, avatarUrl }: { email: string; avatarUrl?: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevOpenRef = useRef(false);

  function handleMouseEnter() {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpen(true);
  }

  function handleMouseLeave() {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  }

  function toggleOpen() {
    setOpen((prev) => !prev);
  }

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open && menuRef.current) {
      const firstItem = menuRef.current.querySelector<HTMLElement>("[role='menuitem']");
      firstItem?.focus();
    } else if (prevOpenRef.current && !open) {
      buttonRef.current?.focus();
    }
    prevOpenRef.current = open;
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="auth-bar-menu-list"
        id="auth-bar-menu-button"
        onClick={toggleOpen}
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-ds-accent text-sm font-medium text-ds-text-inverse transition-opacity duration-ds ease-ds hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
        data-testid="auth-bar-menu"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          getInitial(email)
        )}
      </button>

      {open && (
        <div
          ref={menuRef}
          id="auth-bar-menu-list"
          role="menu"
          aria-labelledby="auth-bar-menu-button"
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-ds-lg border border-ds-border bg-ds-surface p-1.5 shadow-ds-md ds-pop"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-ds-text">{email}</p>
          </div>

          <div className="my-1 border-t border-ds-border" />

          <Link
            href="/profile"
            role="menuitem"
            tabIndex={0}
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 rounded-ds-sm px-3 py-2 text-left text-sm text-ds-text-muted transition-colors duration-ds-fast ease-ds hover:bg-ds-surface-hover hover:text-ds-text focus:bg-ds-surface-hover focus:text-ds-text focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
          >
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            Edit profile
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-ds-sm px-3 py-2 text-left text-sm text-ds-text transition-colors duration-ds-fast ease-ds hover:bg-ds-surface-hover hover:text-ds-text focus:bg-ds-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
            data-testid="auth-bar-logout"
          >
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
