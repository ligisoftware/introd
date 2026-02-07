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
    <div className="flex items-center gap-2 text-sm text-ds-text-muted">
      <span className="hidden truncate max-w-[140px] sm:max-w-[200px] sm:inline" title={email}>
        {email}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="-mx-2 rounded-ds-sm py-2 px-2 font-medium text-ds-text-muted transition-colors duration-ds ease-ds hover:text-ds-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg active:scale-[0.98]"
      >
        Log out
      </button>
    </div>
  );
}
