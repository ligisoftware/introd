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

export const PITCH_DECK_SOURCES = ["storage", "external"] as const;
export type PitchDeckSource = (typeof PITCH_DECK_SOURCES)[number];

export interface PitchDeckAttachment {
  source: PitchDeckSource;
  /**
   * Ready-to-use URL for the deck:
   * - For `storage`, this is derived from the Supabase storage path.
   * - For `external`, this is the external https:// URL provided by the user.
   */
  url: string;
  fileName?: string | null;
  fileSizeBytes?: number | null;
  uploadedAt?: string | null; // ISO date
}

export interface Experience {
  company: string;
  title: string;
  logoUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean;
}

export interface CustomField {
  id: string; // uuid for list keying
  title: string; // user-defined section title
  value: string; // markdown-like text content
}

export interface IntroAttachment {
  id: string; // uuid for list keying
  type: "pdf" | "image";
  storagePath: string; // needed for deletion
  url: string; // public URL
  fileName: string;
  title?: string | null; // user-defined label e.g. "Pitch Deck", "Example intro"
  fileSizeBytes?: number | null;
  mimeType: string;
  uploadedAt: string; // ISO date
}

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  experience?: Experience[] | null;
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
  title?: string | null;
  introText?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  logoUrl?: string | null;
  foundedDate?: string | null;
  location?: string | null;
  fundingRounds?: FundingRound[] | null;
  ownerStartDate?: string | null;
  ownerBio?: string | null;
  showOwnerEmail?: boolean;
  createdAt: string; // ISO date
  updatedAt?: string | null; // ISO date
  pitchDeck?: PitchDeckAttachment | null;
  attachments?: IntroAttachment[] | null;
  customFields?: CustomField[] | null;
}

/** Public intro profile payload for share viewer; no id, no userId. */
export interface PublicIntroProfile {
  name?: string | null;
  avatarUrl?: string | null;
  userLinkedinUrl?: string | null;
  userTwitterUrl?: string | null;
  startupName?: string | null;
  startupOneLiner?: string | null;
  title?: string | null;
  introText?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  logoUrl?: string | null;
  foundedDate?: string | null;
  location?: string | null;
  fundingRounds?: FundingRound[] | null;
  ownerStartDate?: string | null;
  ownerBio?: string | null;
  teamMembers?: TeamMember[];
  pitchDeck?: PitchDeckAttachment | null;
  attachments?: IntroAttachment[] | null;
  customFields?: CustomField[] | null;
}

export interface Collaborator {
  id: string;
  introId: string;
  email: string;
  userId?: string | null;
  userName?: string | null;
  userAvatarUrl?: string | null;
  inviteToken: string;
  status: "pending" | "accepted";
  title?: string | null;
  startDate?: string | null;
  bio?: string | null;
  showEmail?: boolean;
  createdAt: string; // ISO date
  acceptedAt?: string | null; // ISO date
}

export interface TeamMember {
  name?: string | null;
  avatarUrl?: string | null;
  email?: string | null;
  title?: string | null;
  startDate?: string | null;
  bio?: string | null;
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
