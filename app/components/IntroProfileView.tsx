import type { PublicIntroProfile, FundingRound } from "@/types";

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

function formatFoundedDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatRoundDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

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
  const logoUrl = orEmpty(profile.logoUrl);
  const userLinkedinUrl = orEmpty(profile.userLinkedinUrl);
  const userTwitterUrl = orEmpty(profile.userTwitterUrl);
  const foundedDate = orEmpty(profile.foundedDate);
  const fundingRounds: FundingRound[] = profile.fundingRounds ?? [];
  const validFundingRounds = fundingRounds.filter((r) => r.roundName?.trim());

  const hasIdentity = displayName || role || startupName;
  const hasLinks = isValidUrl(websiteUrl) || isValidUrl(linkedinUrl) || isValidUrl(twitterUrl);
  const hasUserLinks = isValidUrl(userLinkedinUrl) || isValidUrl(userTwitterUrl);
  const hasFunding = validFundingRounds.length > 0;
  const isEmpty = !hasIdentity && !introText && !startupOneLiner && !hasLinks && !hasFunding;

  if (isEmpty) {
    return (
      <div className="py-16 text-center">
        <p className="text-ds-text-subtle">This profile hasn&apos;t been filled out yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Company header */}
      <div className="flex flex-col">
        {logoUrl && (
          <div className="mb-5 h-[72px] w-[72px] overflow-hidden rounded-xl border border-ds-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={startupName ? `${startupName} logo` : "Company logo"}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {startupName && (
          <h1 className="text-3xl font-bold text-ds-text sm:text-4xl">{startupName}</h1>
        )}
        {startupOneLiner && (
          <p className="mt-2 text-lg text-ds-text-muted">{startupOneLiner}</p>
        )}
        {foundedDate && formatFoundedDate(foundedDate) && (
          <p className="mt-2 text-sm text-ds-text-subtle">
            Founded {formatFoundedDate(foundedDate)}
          </p>
        )}
        {hasLinks && (
          <div className="mt-4 flex items-center gap-4">
            {isValidUrl(websiteUrl) && (
              <a
                href={websiteUrl.trim()}
                target="_blank"
                rel="noopener noreferrer"
                title="Website"
                className="text-ds-text transition-opacity duration-ds ease-ds-out hover:opacity-70"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
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
              </a>
            )}
            {isValidUrl(linkedinUrl) && (
              <a
                href={linkedinUrl.trim()}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="text-[#0A66C2] transition-opacity duration-ds ease-ds-out hover:opacity-80"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="4" fill="currentColor" />
                  <path fill="white" d="M7.077 19.452H4.027V9h3.05v10.452zM5.552 7.633a1.762 1.762 0 1 1 0-3.523 1.762 1.762 0 0 1 0 3.523zM19.447 19.452h-3.054v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h2.914v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v5.286z" />
                </svg>
              </a>
            )}
            {isValidUrl(twitterUrl) && (
              <a
                href={twitterUrl.trim()}
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
          </div>
        )}
      </div>

      {/* Intro text card */}
      {introText && (
        <div className="w-full">
          <h2 className="mb-3 text-sm font-medium text-ds-text-muted">About us</h2>
          <div className="w-full rounded-2xl border border-ds-border bg-ds-surface p-6">
            <p className="whitespace-pre-wrap leading-relaxed text-ds-text-muted">{introText}</p>
          </div>
        </div>
      )}

      {/* Funding rounds */}
      {hasFunding && (
        <div className="w-full">
          <h2 className="mb-3 text-sm font-medium text-ds-text-muted">Funding</h2>
          <div className="w-full rounded-2xl border border-ds-border bg-ds-surface p-6">
            <div className="space-y-4">
              {validFundingRounds.map((round, idx) => {
                const isSafe = round.type === "safe";
                return (
                  <div key={idx} className="flex items-baseline justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-ds-text">{round.roundName}</p>
                        {isSafe && (
                          <span className="rounded-ds-sm bg-ds-surface-hover px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ds-text-subtle">
                            SAFE
                          </span>
                        )}
                      </div>
                      {round.date && formatRoundDate(round.date) && (
                        <p className="text-xs text-ds-text-subtle">
                          {formatRoundDate(round.date)}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {round.amount && (
                        <p className="text-sm font-medium text-ds-text-muted">
                          {round.amount}
                        </p>
                      )}
                      {isSafe && round.valuationCap && (
                        <p className="text-xs text-ds-text-subtle">
                          {round.valuationCap} cap
                        </p>
                      )}
                      {!isSafe && round.postValuation && (
                        <p className="text-xs text-ds-text-subtle">
                          {round.postValuation} post
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Founder card */}
      {(displayName || role) && (
        <div className="w-full">
          <h2 className="mb-3 text-sm font-medium text-ds-text-muted">Founder</h2>
        <div className="w-full rounded-2xl border border-ds-border bg-ds-surface p-5">
          <div className="flex items-center gap-4">
            {(avatarUrl || displayName) && (
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-ds-border bg-ds-bg-elevated">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={displayName ? `${displayName}'s avatar` : "Founder avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium text-ds-text-subtle">
                    {getInitials(displayName)}
                  </div>
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              {displayName && (
                <p className="truncate font-medium text-ds-text">{displayName}</p>
              )}
              {role && (
                <p className="truncate text-sm text-ds-text-muted">{role}</p>
              )}
            </div>
            {hasUserLinks && (
              <div className="flex shrink-0 items-center gap-3">
                {isValidUrl(userLinkedinUrl) && (
                  <a
                    href={userLinkedinUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${displayName || "Founder"} on LinkedIn`}
                    className="text-[#0A66C2] transition-opacity duration-ds ease-ds-out hover:opacity-80"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <rect width="24" height="24" rx="4" fill="currentColor" />
                      <path fill="white" d="M7.077 19.452H4.027V9h3.05v10.452zM5.552 7.633a1.762 1.762 0 1 1 0-3.523 1.762 1.762 0 0 1 0 3.523zM19.447 19.452h-3.054v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h2.914v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v5.286z" />
                    </svg>
                  </a>
                )}
                {isValidUrl(userTwitterUrl) && (
                  <a
                    href={userTwitterUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${displayName || "Founder"} on X`}
                    className="text-ds-text transition-opacity duration-ds ease-ds-out hover:opacity-70"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        </div>
      )}

      {/* Separator */}
      <div className="w-full border-t border-ds-border" />

      {/* Attachments placeholder */}
      <p className="text-sm text-ds-text-subtle">Pitch deck &amp; materials coming soon</p>
    </div>
  );
}
