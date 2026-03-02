import { createServiceRoleClient, createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { redirect } from "next/navigation";
import { getByInviteToken, acceptInvite } from "@/repositories/collaborators";
import { invalidateIntroScores } from "@/services/intro-scores";

export default async function InviteAcceptPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  // Use service role client to look up invite (bypasses RLS)
  const serviceClient = createServiceRoleClient();
  const invite = await getByInviteToken(serviceClient, token);

  if (!invite) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-ds-text sm:text-3xl">
            Invalid invite
          </h1>
          <p className="text-sm text-ds-text-muted">This invite link is invalid or has expired.</p>
        </div>
      </main>
    );
  }

  // Check if user is logged in
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    // Not logged in — redirect to login, then back here to complete acceptance
    redirect(`/login?next=/invite/${token}&invited=true`);
  }

  // User is logged in — accept the invite (sets status, user_id, accepted_at atomically)
  if (invite.status === "pending") {
    await acceptInvite(serviceClient, invite.id, user.id);
    await invalidateIntroScores(serviceClient, invite.introId);
  }

  redirect(`/intro/${invite.introId}?invited=true`);
}
