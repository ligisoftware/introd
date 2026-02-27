import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { getIntroById } from "@/services/intro";
import { removeCollaborator } from "@/services/collaborator";
import { NextResponse } from "next/server";

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
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/intros/[id]/collaborators/[collaboratorId] error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
