import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { getIntroById, getIntroForEditing } from "@/services/intro";
import { removeCollaborator } from "@/services/collaborator";
import { refreshIntroScores } from "@/services/intro-scores";
import { updateCollaboratorFields } from "@/repositories/collaborators";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * DELETE /api/intros/[id]/collaborators/[collaboratorId] — Remove a collaborator.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; collaboratorId: string }> }
) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, collaboratorId } = await params;

  // Only intro owners can remove collaborators
  const intro = await getIntroById(supabase, id, user.id);
  if (!intro) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await removeCollaborator(supabase, collaboratorId);
    const serviceClient = createServiceRoleClient();
    refreshIntroScores(serviceClient, id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/intros/[id]/collaborators/[collaboratorId] error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

const CollaboratorPatchSchema = z.object({
  title: z.string().max(100).optional(),
  startDate: z
    .string()
    .max(10)
    .optional()
    .transform((s) => (s === "" ? undefined : s))
    .refine((s) => s === undefined || /^\d{4}-\d{2}-\d{2}$/.test(s), {
      message: "Must be a valid date (YYYY-MM-DD)",
    }),
  bio: z.string().max(500).optional(),
  showEmail: z.boolean().optional(),
});

/**
 * PATCH /api/intros/[id]/collaborators/[collaboratorId] — Update a collaborator's title/startDate.
 * Any editor of the intro (owner or accepted collaborator) can update any collaborator.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; collaboratorId: string }> }
) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, collaboratorId } = await params;

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

  const parsed = CollaboratorPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updatePayload: {
    title?: string | null;
    start_date?: string | null;
    bio?: string | null;
    show_email?: boolean;
  } = {};
  const keys = Object.keys(body as Record<string, unknown>);
  if (keys.includes("title")) {
    updatePayload.title = parsed.data.title ?? null;
  }
  if (keys.includes("startDate")) {
    updatePayload.start_date = parsed.data.startDate ?? null;
  }
  if (keys.includes("bio")) {
    updatePayload.bio = parsed.data.bio ?? null;
  }
  if (keys.includes("showEmail")) {
    updatePayload.show_email = parsed.data.showEmail ?? false;
  }

  try {
    // Use service-role client to bypass RLS (user's edit access already verified above)
    const serviceClient = createServiceRoleClient();
    const updated = await updateCollaboratorFields(serviceClient, collaboratorId, updatePayload);
    refreshIntroScores(serviceClient, id);
    return NextResponse.json({ collaborator: updated });
  } catch (err) {
    console.error("PATCH /api/intros/[id]/collaborators/[collaboratorId] error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
