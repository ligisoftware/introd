import { getHealth } from "@/services/health";
import { NextResponse } from "next/server";

/**
 * Health/readiness endpoint. Thin route: delegates to health service, returns JSON.
 */
export async function GET() {
  const health = getHealth();
  return NextResponse.json(health);
}
