import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// In production NODE_ENV is "production", so this is always false there.
const E2E_ENABLED = process.env.NODE_ENV === "development" && process.env.E2E_TEST_MODE === "true";

/**
 * E2E-only: create a session for a test user via email+password.
 * Only available when E2E_TEST_MODE=true and NODE_ENV=development.
 * Allows AI agents and E2E runners to authenticate without magic link email.
 */
export async function POST(request: Request) {
  if (!E2E_ENABLED) {
    return NextResponse.json({ error: "E2E session not enabled" }, { status: 404 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  const allowedEmail = process.env.E2E_TEST_EMAIL?.trim();
  const allowedPassword = process.env.E2E_TEST_PASSWORD;

  if (!allowedEmail || !allowedPassword || email !== allowedEmail) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (password !== allowedPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message || "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
