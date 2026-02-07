import type { PublicFounderProfile } from "@/types";

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

const sectionTitle = "text-sm font-semibold uppercase tracking-wider text-ds-text-subtle";
const fieldLabel = "text-sm font-medium text-ds-text-muted";
const fieldValue = "mt-1 text-ds-text";

export function FounderProfileView({ profile }: { profile: PublicFounderProfile }) {
  const displayName = orEmpty(profile.displayName);
  const role = orEmpty(profile.role);
  const bio = orEmpty(profile.bio);
  const startupName = orEmpty(profile.startupName);
  const startupOneLiner = orEmpty(profile.startupOneLiner);
  const websiteUrl = orEmpty(profile.websiteUrl);
  const linkedinUrl = orEmpty(profile.linkedinUrl);
  const twitterUrl = orEmpty(profile.twitterUrl);

  const hasAbout = displayName || role || bio;
  const hasStartup = startupName || startupOneLiner;
  const hasLinks = isValidUrl(websiteUrl) || isValidUrl(linkedinUrl) || isValidUrl(twitterUrl);

  const linkClass =
    "inline-flex items-center font-medium text-ds-accent rounded-ds-sm transition-colors duration-ds ease-ds hover:text-ds-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg";

  return (
    <div className="space-y-10 sm:space-y-12">
      {hasAbout && (
        <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm sm:p-6">
          <h2 className={sectionTitle}>About</h2>
          <div className="mt-4 space-y-5">
            {displayName && (
              <div>
                <p className={fieldLabel}>Display name</p>
                <p className={fieldValue}>{displayName}</p>
              </div>
            )}
            {role && (
              <div>
                <p className={fieldLabel}>Role</p>
                <p className={fieldValue}>{role}</p>
              </div>
            )}
            {bio && (
              <div>
                <p className={fieldLabel}>Bio</p>
                <p className={`${fieldValue} whitespace-pre-wrap`}>{bio}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {hasStartup && (
        <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm sm:p-6">
          <h2 className={sectionTitle}>Startup</h2>
          <div className="mt-4 space-y-5">
            {startupName && (
              <div>
                <p className={fieldLabel}>Company name</p>
                <p className={fieldValue}>{startupName}</p>
              </div>
            )}
            {startupOneLiner && (
              <div>
                <p className={fieldLabel}>One-liner</p>
                <p className={fieldValue}>{startupOneLiner}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {hasLinks && (
        <section className="rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm sm:p-6">
          <h2 className={sectionTitle}>Links</h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 sm:gap-x-8">
            {isValidUrl(websiteUrl) && (
              <li>
                <a
                  href={websiteUrl!.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Website
                </a>
              </li>
            )}
            {isValidUrl(linkedinUrl) && (
              <li>
                <a
                  href={linkedinUrl!.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  LinkedIn
                </a>
              </li>
            )}
            {isValidUrl(twitterUrl) && (
              <li>
                <a
                  href={twitterUrl!.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Twitter / X
                </a>
              </li>
            )}
          </ul>
        </section>
      )}

      {!hasAbout && !hasStartup && !hasLinks && (
        <div className="rounded-ds-lg border border-ds-border bg-ds-surface p-6 text-center">
          <p className="text-ds-text-muted">This profile hasn&apos;t been filled out yet.</p>
        </div>
      )}
    </div>
  );
}
