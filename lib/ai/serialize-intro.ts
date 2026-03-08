import type { PublicIntroProfile, FundingRound, Experience } from "@/types";

function or(s: string | null | undefined): string {
  return s ?? "";
}

function formatFunding(rounds: FundingRound[] | null | undefined): string {
  if (!rounds?.length) return "";
  return rounds
    .map((r) => `${r.roundName}${r.amount ? ` ${r.amount}` : ""}${r.date ? ` (${r.date})` : ""}`)
    .join("; ");
}

function formatExperience(experience: Experience[] | null | undefined): string {
  if (!experience?.length) return "";
  return experience
    .slice(0, 5) // cap to avoid token blowout
    .map((e) => {
      const dates = [e.startDate, e.current ? "present" : e.endDate].filter(Boolean).join("–");
      const role = [e.title, e.company].filter(Boolean).join(" at ");
      return [role, dates].filter(Boolean).join(", ");
    })
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
  const ownerBio = profile.ownerBio ?? profile.ownerBioFromProfile ?? "";
  if (ownerName || ownerTitle || ownerBio) {
    parts.push(
      `Founder: ${ownerName}${ownerTitle ? `, ${ownerTitle}` : ""}${ownerBio ? `. ${ownerBio}` : ""}`
    );
  }
  if (profile.ownerStartDate) parts.push(`Founder start: ${profile.ownerStartDate}`);
  const ownerExp = formatExperience(profile.ownerExperience);
  if (ownerExp) parts.push(`Founder background: ${ownerExp}`);

  // Team (collaborators)
  const team = profile.teamMembers ?? [];
  if (team.length > 0) {
    const teamLines = team.map((m) => {
      const name = or(m.name);
      const title = or(m.title);
      const bio = or(m.bio);
      const exp = formatExperience(m.experience);
      const base = name ? [name, title, bio].filter(Boolean).join(" · ") : "";
      return exp ? `${base} (bg: ${exp})` : base;
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
