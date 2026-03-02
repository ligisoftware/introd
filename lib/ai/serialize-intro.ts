import type { PublicIntroProfile, FundingRound } from "@/types";

function or(s: string | null | undefined): string {
  return s ?? "";
}

function formatFunding(rounds: FundingRound[] | null | undefined): string {
  if (!rounds?.length) return "";
  return rounds
    .map((r) => `${r.roundName}${r.amount ? ` ${r.amount}` : ""}${r.date ? ` (${r.date})` : ""}`)
    .join("; ");
}

/**
 * Serializes a public intro profile (and team) into a compact text blob for the LLM.
 * Omits empty fields; target under ~1.5k input tokens.
 */
export function serializeIntroForLLM(profile: PublicIntroProfile): string {
  const parts: string[] = [];

  if (profile.startupName) parts.push(`Company: ${profile.startupName}`);
  if (profile.startupOneLiner) parts.push(`One-liner: ${profile.startupOneLiner}`);
  if (profile.introText) parts.push(`Intro: ${profile.introText}`);

  // Founder (owner)
  const ownerName = profile.name ?? "";
  const ownerTitle = profile.title ?? "";
  const ownerBio = profile.ownerBio ?? "";
  if (ownerName || ownerTitle || ownerBio) {
    parts.push(
      `Founder: ${ownerName}${ownerTitle ? `, ${ownerTitle}` : ""}${ownerBio ? `. ${ownerBio}` : ""}`
    );
  }
  if (profile.ownerStartDate) parts.push(`Founder start: ${profile.ownerStartDate}`);

  // Team (collaborators)
  const team = profile.teamMembers ?? [];
  if (team.length > 0) {
    const teamLines = team.map((m) => {
      const name = or(m.name);
      const title = or(m.title);
      const bio = or(m.bio);
      return name ? [name, title, bio].filter(Boolean).join(" · ") : "";
    });
    parts.push(`Team: ${teamLines.filter(Boolean).join("; ")}`);
  }

  if (profile.foundedDate) parts.push(`Founded: ${profile.foundedDate}`);
  if (profile.location) parts.push(`Location: ${profile.location}`);
  const funding = formatFunding(profile.fundingRounds ?? undefined);
  if (funding) parts.push(`Funding: ${funding}`);
  if (profile.websiteUrl) parts.push(`Website: ${profile.websiteUrl}`);
  if (profile.linkedinUrl) parts.push(`LinkedIn: ${profile.linkedinUrl}`);
  if (profile.twitterUrl) parts.push(`Twitter: ${profile.twitterUrl}`);

  return parts.filter(Boolean).join("\n");
}
