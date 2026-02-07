/**
 * Shared domain types for Intro'd. No persistence in Phase 0; used by services and API contracts in Phase 1–2.
 */

export interface Founder {
  id: string;
  email: string;
  createdAt: string; // ISO date
  shareSlug?: string | null;
  // Profile (optional until set)
  displayName?: string | null;
  role?: string | null;
  startupName?: string | null;
  startupOneLiner?: string | null;
  bio?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  updatedAt?: string | null; // ISO date
}

/** Public profile payload for share viewer; no email or auth identifiers. */
export interface PublicFounderProfile {
  displayName?: string | null;
  role?: string | null;
  startupName?: string | null;
  startupOneLiner?: string | null;
  bio?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
}

export interface IntroPage {
  team: string;
  problem: string;
  solution: string;
  wedge: string;
  traction: string;
  ask: string;
}
