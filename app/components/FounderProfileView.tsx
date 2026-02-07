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

  return (
    <div className="mt-8 space-y-8">
      {hasAbout && (
        <section>
          <h2 className="text-lg font-medium text-gray-900">About</h2>
          <div className="mt-4 space-y-4">
            {displayName && (
              <div>
                <p className="text-sm font-medium text-gray-700">Display name</p>
                <p className="mt-0.5 text-gray-900">{displayName}</p>
              </div>
            )}
            {role && (
              <div>
                <p className="text-sm font-medium text-gray-700">Role</p>
                <p className="mt-0.5 text-gray-900">{role}</p>
              </div>
            )}
            {bio && (
              <div>
                <p className="text-sm font-medium text-gray-700">Bio</p>
                <p className="mt-0.5 whitespace-pre-wrap text-gray-900">{bio}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {hasStartup && (
        <section>
          <h2 className="text-lg font-medium text-gray-900">Startup</h2>
          <div className="mt-4 space-y-4">
            {startupName && (
              <div>
                <p className="text-sm font-medium text-gray-700">Company name</p>
                <p className="mt-0.5 text-gray-900">{startupName}</p>
              </div>
            )}
            {startupOneLiner && (
              <div>
                <p className="text-sm font-medium text-gray-700">One-liner</p>
                <p className="mt-0.5 text-gray-900">{startupOneLiner}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {hasLinks && (
        <section>
          <h2 className="text-lg font-medium text-gray-900">Links</h2>
          <ul className="mt-4 space-y-2">
            {isValidUrl(websiteUrl) && (
              <li>
                <a
                  href={websiteUrl!.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 underline hover:no-underline"
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
                  className="text-gray-700 underline hover:no-underline"
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
                  className="text-gray-700 underline hover:no-underline"
                >
                  Twitter / X
                </a>
              </li>
            )}
          </ul>
        </section>
      )}

      {!hasAbout && !hasStartup && !hasLinks && (
        <p className="text-gray-500">This profile hasn&apos;t been filled out yet.</p>
      )}
    </div>
  );
}
