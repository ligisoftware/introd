/**
 * Shared domain types for Introd.
 */

export interface FundingRound {
  type?: "round" | "safe";
  roundName: string;
  amount?: string | null;
  date?: string | null;
  postValuation?: string | null;
  valuationCap?: string | null;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  createdAt: string; // ISO date
  updatedAt?: string | null; // ISO date
}

export interface Intro {
  id: string;
  userId: string;
  shareSlug?: string | null;
  startupName?: string | null;
  startupOneLiner?: string | null;
  role?: string | null;
  introText?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  logoUrl?: string | null;
  foundedDate?: string | null;
  fundingRounds?: FundingRound[] | null;
  createdAt: string; // ISO date
  updatedAt?: string | null; // ISO date
}

/** Public intro profile payload for share viewer; no id, no userId. */
export interface PublicIntroProfile {
  name?: string | null;
  avatarUrl?: string | null;
  userLinkedinUrl?: string | null;
  userTwitterUrl?: string | null;
  startupName?: string | null;
  startupOneLiner?: string | null;
  role?: string | null;
  introText?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  logoUrl?: string | null;
  foundedDate?: string | null;
  fundingRounds?: FundingRound[] | null;
}

export interface IntroPage {
  team: string;
  problem: string;
  solution: string;
  wedge: string;
  traction: string;
  ask: string;
}
