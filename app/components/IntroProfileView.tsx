import type { PublicIntroProfile, FundingRound, TeamMember } from "@/types";

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

function formatStartDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatDuration(dateStr: string): string {
  const start = new Date(dateStr + "T00:00:00");
  if (isNaN(start.getTime())) return "";
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  if (years > 0 && months > 0) return `${years} yr ${months} mo`;
  if (years > 0) return `${years} yr`;
  if (months > 0) return `${months} mo`;
  return "< 1 mo";
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function TeamMemberCard({ member, foundedDate }: { member: TeamMember; foundedDate?: string }) {
  const name = member.name ?? "";
  const memberAvatar = member.avatarUrl ?? "";
  const memberEmail = member.email ?? "";
  const memberTitle = member.title ?? "";
  const memberBio = member.bio ?? "";
  const memberStartDate = member.startDate ?? "";
  const memberLinkedin = member.linkedinUrl ?? "";
  const memberTwitter = member.twitterUrl ?? "";
  const hasMemberLinks = isValidUrl(memberLinkedin) || isValidUrl(memberTwitter);
  const hasAvatar = !!(memberAvatar || name);
  const hasDetails = !!(
    memberTitle ||
    memberBio ||
    memberEmail ||
    (memberStartDate && formatStartDate(memberStartDate)) ||
    hasMemberLinks
  );

  return (
    <div className="ds-glass rounded-2xl p-5">
      <div className={`flex gap-4 ${hasDetails ? "items-start" : "items-center"}`}>
        {hasAvatar && (
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-ds-border bg-ds-bg-elevated">
            {memberAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={memberAvatar}
                alt={name ? `${name}'s avatar` : "Team member avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-ds-text-subtle">
                {getInitials(name)}
              </div>
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {name && (
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-ds-text">{name}</p>
              {isValidUrl(memberLinkedin) && (
                <a
                  href={memberLinkedin.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${name || "Team member"} on LinkedIn`}
                  className="shrink-0 text-[#0A66C2] transition-opacity duration-ds ease-ds-out hover:opacity-80"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="4" fill="currentColor" />
                    <path
                      fill="white"
                      d="M7.077 19.452H4.027V9h3.05v10.452zM5.552 7.633a1.762 1.762 0 1 1 0-3.523 1.762 1.762 0 0 1 0 3.523zM19.447 19.452h-3.054v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h2.914v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v5.286z"
                    />
                  </svg>
                </a>
              )}
              {isValidUrl(memberTwitter) && (
                <a
                  href={memberTwitter.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${name || "Team member"} on X`}
                  className="shrink-0 text-ds-text transition-opacity duration-ds ease-ds-out hover:opacity-70"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
            </div>
          )}
          {memberTitle && <p className="truncate text-sm text-ds-text-muted">{memberTitle}</p>}
          {memberEmail && (
            <p className="truncate text-sm text-ds-text-muted">
              <a
                href={`mailto:${memberEmail}`}
                className="transition-opacity duration-ds ease-ds-out hover:opacity-70"
              >
                {memberEmail}
              </a>
            </p>
          )}
          {memberStartDate && formatStartDate(memberStartDate) && (
            <p className="mt-0.5 text-xs text-ds-text-subtle">
              {foundedDate && memberStartDate === foundedDate
                ? "Since inception"
                : `Since ${formatStartDate(memberStartDate)}`}
              {formatDuration(memberStartDate)
                ? `\u00A0\u00A0·\u00A0\u00A0${formatDuration(memberStartDate)}`
                : ""}
            </p>
          )}
          {memberBio && (
            <p className="mt-3 text-sm leading-relaxed text-ds-text">{memberBio}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function IntroProfileView({ profile }: { profile: PublicIntroProfile }) {
  const displayName = orEmpty(profile.name);
  const title = orEmpty(profile.title);
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
  const location = orEmpty(profile.location);
  const fundingRounds: FundingRound[] = profile.fundingRounds ?? [];
  const validFundingRounds = fundingRounds.filter((r) => r.roundName?.trim());
  const teamMembers: TeamMember[] = profile.teamMembers ?? [];
  const hasTeamMembers = teamMembers.some((m) => m.name || m.title);

  const hasIdentity = displayName || title || startupName;
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
    <div className="flex flex-col gap-12">
      {/* Company header */}
      <div className="ds-stagger-1 flex flex-col">
        {logoUrl && (
          <div className="ds-glass mb-5 h-[72px] w-[72px] overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={startupName ? `${startupName} logo` : "Company logo"}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {startupName && (
          <h1 className="text-3xl font-bold tracking-tight text-ds-text sm:text-4xl">
            {startupName}
          </h1>
        )}
        {startupOneLiner && (
          <p className="mt-2 text-lg leading-relaxed text-ds-text-muted">{startupOneLiner}</p>
        )}
        {(foundedDate || location) && (
          <p className="mt-2 text-sm text-ds-text-subtle">
            {location}
            {location && foundedDate && formatFoundedDate(foundedDate) ? "\u00A0\u00A0·\u00A0\u00A0" : ""}
            {foundedDate && formatFoundedDate(foundedDate)
              ? `Founded ${formatFoundedDate(foundedDate)}`
              : ""}
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
                  <path
                    fill="white"
                    d="M7.077 19.452H4.027V9h3.05v10.452zM5.552 7.633a1.762 1.762 0 1 1 0-3.523 1.762 1.762 0 0 1 0 3.523zM19.447 19.452h-3.054v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h2.914v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v5.286z"
                  />
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

      {/* About — editorial accent border */}
      {introText && (
        <div className="ds-stagger-2 w-full">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
            About us
          </h2>
          <div className="border-l-2 border-ds-text pl-5">
            <p className="whitespace-pre-wrap text-[15px] leading-[1.8] text-ds-text">
              {introText}
            </p>
          </div>
        </div>
      )}

      {/* Funding — left border */}
      {hasFunding && (
        <div className="ds-stagger-3 w-full">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
            Funding
          </h2>
          <div className="space-y-4">
            {validFundingRounds.map((round, idx) => {
              const isSafe = round.type === "safe";
              return (
                <div key={idx} className="border-l-2 border-ds-text pl-5">
                  <div className="flex items-baseline justify-between gap-4">
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
                        <p className="text-xs text-ds-text-subtle">{formatRoundDate(round.date)}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {round.amount && (
                        <p className="text-sm font-medium text-ds-text">{round.amount}</p>
                      )}
                      {isSafe && round.valuationCap && (
                        <p className="text-xs text-ds-text-subtle">{round.valuationCap} cap</p>
                      )}
                      {!isSafe && round.postValuation && (
                        <p className="text-xs text-ds-text-subtle">{round.postValuation} post</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Team — glass panels */}
      {hasTeamMembers ? (
        <div className="ds-stagger-4 w-full">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
            Team
          </h2>
          <div className="space-y-3">
            {teamMembers
              .filter((m) => m.name || m.title)
              .map((member, idx) => (
                <TeamMemberCard key={idx} member={member} foundedDate={foundedDate || undefined} />
              ))}
          </div>
        </div>
      ) : (
        (displayName || title) && (
          <div className="ds-stagger-4 w-full">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
              Founder
            </h2>
            <TeamMemberCard
              member={{
                name: displayName || undefined,
                avatarUrl: avatarUrl || undefined,
                title: title || undefined,
                linkedinUrl: userLinkedinUrl || undefined,
                twitterUrl: userTwitterUrl || undefined,
              }}
              foundedDate={foundedDate || undefined}
            />
          </div>
        )
      )}
    </div>
  );
}
