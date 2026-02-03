/**
 * Shared domain types for Intro'd. No persistence in Phase 0; used by services and API contracts in Phase 1–2.
 */

export interface Founder {
  id: string;
  email: string;
  createdAt: string; // ISO date
}

export interface IntroPage {
  team: string;
  problem: string;
  solution: string;
  wedge: string;
  traction: string;
  ask: string;
}
