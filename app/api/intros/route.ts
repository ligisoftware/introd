import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { createIntro } from "@/services/intro";
import { NextResponse } from "next/server";

/**
 * POST /api/intros — Create a new intro (max 3 per user).
 */
export async function POST() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await createIntro(supabase, user.id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({ intro: result.intro }, { status: 201 });
  } catch (err) {
    console.error("POST /api/intros error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
