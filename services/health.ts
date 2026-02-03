/**
 * Trivial health service to validate repo structure and deployment.
 * Called by app/api/health route only.
 */
export function getHealth(): { status: "ok"; app: string } {
  return { status: "ok", app: "Intro'd" };
}
