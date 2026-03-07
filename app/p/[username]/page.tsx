import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUser, getUserByUsername } from "@/services/user";
import { notFound } from "next/navigation";
import { ProfileView } from "./ProfileView";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const serviceClient = createServiceRoleClient();

  const [profileUser, currentUser] = await Promise.all([
    getUserByUsername(serviceClient, username),
    getCurrentUser(supabase),
  ]);

  if (!profileUser) {
    notFound();
  }

  const isOwner = currentUser?.id === profileUser.id;

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-container-md px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="ds-hero-in">
          <ProfileView user={profileUser} isOwner={isOwner} />
        </div>
      </div>
    </main>
  );
}
