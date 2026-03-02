import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { getInviteByToken } from "@/services/collaborator";
import { acceptInvite } from "@/repositories/collaborators";
import { invalidateIntroScores } from "@/services/intro-scores";
import { NextResponse } from "next/server";

/**
 * POST /api/invite/[token]/accept — Accept a collaborator invite.
 */
export async function POST(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await params;

  try {
    const invite = await getInviteByToken(supabase, token);
    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.status === "accepted") {
      return NextResponse.json({ introId: invite.introId });
    }

    const updated = await acceptInvite(supabase, invite.id, user.id);
    const serviceClient = createServiceRoleClient();
    await invalidateIntroScores(serviceClient, updated.introId);
    return NextResponse.json({ introId: updated.introId });
  } catch (err) {
    console.error("POST /api/invite/[token] error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
