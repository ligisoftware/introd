import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { getIntroForEditing } from "@/services/intro";
import { listCollaborators } from "@/services/collaborator";
import { getById as getUserById } from "@/repositories/users";
import { redirect, notFound } from "next/navigation";
import { IntroEditor } from "./IntroEditor";

export default async function IntroEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ invited?: string }>;
}) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/intro");
  }

  const { id } = await params;
  const result = await getIntroForEditing(supabase, id, user.id);

  if (!result) {
    notFound();
  }

  const serviceClient = createServiceRoleClient();

  let ownerUser = user;
  if (!result.isOwner) {
    const owner = await getUserById(serviceClient, result.intro.userId);
    if (owner) ownerUser = owner;
  }

  const collaborators = await listCollaborators(serviceClient, id);

  const { invited } = await searchParams;

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-container-lg">
        {invited === "true" && (
          <div className="ds-feedback-in mb-6 rounded-ds border border-ds-success/30 bg-ds-success-muted/50 px-4 py-3 text-sm text-ds-success">
            You&apos;ve been added as a collaborator.
          </div>
        )}
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-ds-text sm:text-3xl">
            Edit your intro
          </h1>
          <p className="mt-1.5 text-sm text-ds-text-muted">
            The details that appear on your shareable intro page.
          </p>
        </header>
        <IntroEditor
          initialIntro={result.intro}
          initialCollaborators={collaborators}
          isOwner={result.isOwner}
          ownerEmail={ownerUser.email}
          ownerName={ownerUser.name ?? undefined}
          ownerAvatarUrl={ownerUser.avatarUrl ?? undefined}
        />
      </div>
    </main>
  );
}
