import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/profile");
  }

  redirect(`/p/${user.username}`);
}
