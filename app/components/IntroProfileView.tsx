import type { PublicIntroProfile } from "@/types";

function orEmpty(s: string | null | undefined): string {
  return s ?? "";
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

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const linkButtonClass =
  "flex w-full items-center justify-center gap-3 rounded-ds-lg border border-ds-border bg-ds-surface px-5 py-3.5 font-medium text-ds-text shadow-ds-sm transition-all duration-ds ease-ds hover:shadow-ds hover:bg-ds-accent hover:text-ds-text-inverse hover:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg";

export function IntroProfileView({ profile }: { profile: PublicIntroProfile }) {
  const displayName = orEmpty(profile.name);
  const role = orEmpty(profile.role);
  const introText = orEmpty(profile.introText);
  const startupName = orEmpty(profile.startupName);
  const startupOneLiner = orEmpty(profile.startupOneLiner);
  const websiteUrl = orEmpty(profile.websiteUrl);
  const linkedinUrl = orEmpty(profile.linkedinUrl);
  const twitterUrl = orEmpty(profile.twitterUrl);
  const avatarUrl = orEmpty(profile.avatarUrl);

  const hasIdentity = displayName || role || startupName;
  const hasLinks = isValidUrl(websiteUrl) || isValidUrl(linkedinUrl) || isValidUrl(twitterUrl);
  const isEmpty = !hasIdentity && !introText && !startupOneLiner && !hasLinks;

  if (isEmpty) {
    return (
      <div className="py-16 text-center">
        <p className="text-ds-text-muted">This profile hasn&apos;t been filled out yet.</p>
      </div>
    );
  }

  const subtitle = [role, startupName].filter(Boolean).join(" at ");

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Avatar */}
      {(displayName || avatarUrl) && (
        <div className="h-24 w-24 overflow-hidden rounded-full border border-ds-border bg-ds-surface shadow-ds-sm">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName ? `${displayName}'s avatar` : "Profile avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-ds-accent text-3xl font-bold text-ds-text-inverse">
              {getInitials(displayName)}
            </div>
          )}
        </div>
      )}

      {/* Identity */}
      {hasIdentity && (
        <div className="text-center">
          {displayName && (
            <h1 className="text-2xl font-bold text-ds-text sm:text-3xl">{displayName}</h1>
          )}
          {subtitle && <p className="mt-1 text-ds-text-muted">{subtitle}</p>}
          {startupOneLiner && <p className="mt-2 text-sm text-ds-text-subtle">{startupOneLiner}</p>}
        </div>
      )}

      {/* Intro */}
      {introText && (
        <div className="w-full rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm">
          <p className="whitespace-pre-wrap text-ds-text">{introText}</p>
        </div>
      )}

      {/* Links */}
      {hasLinks && (
        <div className="flex w-full flex-col gap-3">
          {isValidUrl(websiteUrl) && (
            <a
              href={websiteUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className={linkButtonClass}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3a14.25 14.25 0 0 1 4 9 14.25 14.25 0 0 1-4 9 14.25 14.25 0 0 1-4-9 14.25 14.25 0 0 1 4-9Z"
                />
              </svg>
              Website
            </a>
          )}
          {isValidUrl(linkedinUrl) && (
            <a
              href={linkedinUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className={linkButtonClass}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123zM6.863 20.452H3.813V9h3.05v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          )}
          {isValidUrl(twitterUrl) && (
            <a
              href={twitterUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className={linkButtonClass}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X (Twitter)
            </a>
          )}
        </div>
      )}

      {/* Attachments placeholder */}
      <div className="w-full rounded-ds-lg border-2 border-dashed border-ds-border px-5 py-8 text-center">
        <p className="text-sm text-ds-text-subtle">Pitch deck &amp; materials coming soon</p>
      </div>
    </div>
  );
}
