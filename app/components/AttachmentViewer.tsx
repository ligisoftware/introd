"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export interface ViewerAttachment {
  id: string;
  type: "pdf" | "image";
  url: string;
  fileName: string;
  label?: string;
}

function PdfIcon() {
  return (
    <svg className="h-8 w-8 text-ds-text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

// All styles as inline objects to avoid Tailwind/Safari interaction issues
const S = {
  backdrop: {
    position: "fixed" as const,
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.82)",
    padding: "2.5rem",
    WebkitBackdropFilter: "blur(4px)",
    backdropFilter: "blur(4px)",
  },
  frame: {
    width: "100%",
    maxWidth: "1024px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  closeRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  closeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "9999px",
    background: "rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.8)",
    border: "1px solid rgba(255,255,255,0.15)",
    cursor: "pointer",
    flexShrink: 0 as const,
  },
  previewRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  arrowBtn: (enabled: boolean) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "9999px",
    background: "rgba(255,255,255,0.1)",
    color: enabled ? "white" : "rgba(255,255,255,0.2)",
    border: "1px solid rgba(255,255,255,0.15)",
    cursor: enabled ? "pointer" : "not-allowed",
    flexShrink: 0 as const,
    opacity: enabled ? 1 : 0.4,
  }),
  contentBox: {
    flex: "1 1 0%",
    minWidth: 0,
    height: "calc(100vh - 11rem)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  imageCentre: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111",
  },
  footerRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
  },
  dotsWrap: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  openLink: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.1)",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.8)",
    border: "1px solid rgba(255,255,255,0.15)",
    textDecoration: "none",
    whiteSpace: "nowrap" as const,
  },
};

export function AttachmentViewer({ attachments }: { attachments: ViewerAttachment[] }) {
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isOpen = previewIdx !== null;
  const current = previewIdx !== null ? attachments[previewIdx] : null;
  const hasPrev = previewIdx !== null && previewIdx > 0;
  const hasNext = previewIdx !== null && previewIdx < attachments.length - 1;
  const multiple = attachments.length > 1;

  const goNext = useCallback(() => setPreviewIdx(i => (i !== null && i < attachments.length - 1 ? i + 1 : i)), [attachments.length]);
  const goPrev = useCallback(() => setPreviewIdx(i => (i !== null && i > 0 ? i - 1 : i)), []);
  const close = useCallback(() => setPreviewIdx(null), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close, goNext, goPrev]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (attachments.length === 0) return null;

  return (
    <>
      {/* Thumbnail row */}
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {attachments.map((att, idx) => (
          <button
            key={att.id}
            type="button"
            onClick={() => setPreviewIdx(idx)}
            className="group flex w-[180px] shrink-0 flex-col overflow-hidden rounded-ds border border-ds-border bg-ds-surface shadow-ds-sm transition-shadow duration-ds ease-ds hover:shadow-ds-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-accent active:scale-[0.98]"
          >
            <div className="flex h-[120px] w-full items-center justify-center overflow-hidden bg-ds-surface-hover">
              {att.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={att.url} alt={att.fileName} className="h-full w-full object-cover transition-transform duration-ds ease-ds group-hover:scale-105" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <PdfIcon />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-ds-text-subtle">PDF</span>
                </div>
              )}
            </div>
            <div className="flex flex-col px-3 py-2 text-left">
              <span className="truncate text-xs font-medium text-ds-text">
                {att.label || att.fileName}
              </span>
              {att.label && (
                <span className="truncate text-[10px] text-ds-text-subtle">{att.fileName}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Portal modal — all layout via inline styles to avoid Safari/Tailwind quirks */}
      {isOpen && current && mounted && createPortal(
        <div style={S.backdrop} onClick={close}>
          <div style={S.frame} onClick={e => e.stopPropagation()}>

            {/* Row 1: close */}
            <div style={S.closeRow}>
              <button type="button" onClick={close} aria-label="Close" style={S.closeBtn}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Row 2: left arrow · content · right arrow */}
            <div style={S.previewRow}>
              <button type="button" onClick={goPrev} disabled={!hasPrev} aria-label="Previous" style={S.arrowBtn(hasPrev)}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>

              <div style={S.contentBox}>
                {current.type === "image" ? (
                  <div style={S.imageCentre}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={current.url}
                      src={current.url}
                      alt={current.fileName}
                      style={{ display: "block", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <iframe
                    key={current.url}
                    src={current.url}
                    title={current.fileName}
                    style={{ display: "block", width: "100%", height: "100%", border: "none" }}
                  />
                )}
              </div>

              <button type="button" onClick={goNext} disabled={!hasNext} aria-label="Next" style={S.arrowBtn(hasNext)}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* Row 3: label+dots | open */}
            <div style={S.footerRow}>
              <div />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                {current.label && (
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.85)", textAlign: "center" }}>
                    {current.label}
                  </span>
                )}
              <div style={S.dotsWrap}>
                {multiple && attachments.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewIdx(idx)}
                    aria-label={`Go to ${idx + 1}`}
                    style={{
                      height: "6px",
                      width: idx === previewIdx ? "20px" : "6px",
                      borderRadius: "9999px",
                      background: idx === previewIdx ? "white" : "rgba(255,255,255,0.3)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "width 200ms, background 200ms",
                    }}
                  />
                ))}
              </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={S.openLink}
                >
                  Open
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
