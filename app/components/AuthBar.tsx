"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AuthBar({ email }: { email: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <span>You are editing as {email}</span>
      <button
        type="button"
        onClick={handleLogout}
        className="text-gray-700 underline hover:no-underline"
      >
        Log out
      </button>
    </div>
  );
}
