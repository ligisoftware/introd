import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { getIntroById, updateIntro, deleteIntro, getIntroForEditing } from "@/services/intro";
import { IntroUpdateSchema } from "@/lib/validation/intro";
import { NextResponse } from "next/server";

/**
 * DELETE /api/intros/[id] — Delete an intro (with ownership check).
 */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await deleteIntro(supabase, id, user.id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/intros/[id] error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

/**
 * PATCH /api/intros/[id] — Update intro fields (with ownership check).
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Allow both owners and accepted collaborators to update
  const result = await getIntroForEditing(supabase, id, user.id);
  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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

  const parsed = IntroUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const keys = Object.keys(body as Record<string, unknown>) as (keyof typeof parsed.data)[];

  try {
    const updated = await updateIntro(supabase, result.intro.id, parsed.data, keys);
    return NextResponse.json({ intro: updated });
  } catch (err) {
    console.error("PATCH /api/intros/[id] error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
