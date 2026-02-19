import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, updateUserProfile } from "@/services/user";
import { getCurrentIntro, updateIntro } from "@/services/intro";
import { UserProfileUpdateSchema } from "@/lib/validation/user-profile";
import { IntroUpdateSchema } from "@/lib/validation/intro";
import { NextResponse } from "next/server";

/**
 * GET /api/me — Returns { user, intro } when authenticated, or 401.
 */
export async function GET() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const intro = await getCurrentIntro(supabase, user.id);

  return NextResponse.json({ user, intro });
}

/**
 * PATCH /api/me — Accepts { user?: {...}, intro?: {...} } to update either/both.
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const currentUser = await getCurrentUser(supabase);

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Body must be an object" }, { status: 400 });
  }

  const { user: userPayload, intro: introPayload } = body as Record<string, unknown>;

  let updatedUser = currentUser;
  let updatedIntro = await getCurrentIntro(supabase, currentUser.id);

  // Update user fields if provided
  if (userPayload !== undefined) {
    const parsed = UserProfileUpdateSchema.safeParse(userPayload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "User validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const keys = Object.keys(
      (userPayload as Record<string, unknown>) ?? {}
    ) as (keyof typeof parsed.data)[];
    updatedUser = await updateUserProfile(supabase, currentUser.id, parsed.data, keys);
  }

  // Update intro fields if provided
  if (introPayload !== undefined) {
    const parsed = IntroUpdateSchema.safeParse(introPayload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Intro validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const keys = Object.keys(
      (introPayload as Record<string, unknown>) ?? {}
    ) as (keyof typeof parsed.data)[];
    try {
      updatedIntro = await updateIntro(supabase, updatedIntro.id, parsed.data, keys);
    } catch (err) {
      console.error("PATCH /api/me intro error:", err);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }

  return NextResponse.json({ user: updatedUser, intro: updatedIntro });
}
