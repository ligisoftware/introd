import { AuthBar } from "@/app/components/AuthBar";
import { ConditionalHeader } from "@/app/components/ConditionalHeader";
import { NavLinks } from "@/app/components/NavLinks";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import type { Metadata } from "next";
import { Figtree, Sora } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--ds-font-heading",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--ds-font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Introd",
  description: "Standardized first-impression layer for startup fundraising",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  return (
    <html lang="en" className={`${sora.variable} ${figtree.variable} bg-ds-bg`}>
      <body className="flex min-h-screen flex-col pt-14 text-ds-text font-sans antialiased">
        <ConditionalHeader>
          <header className="fixed inset-x-0 top-0 z-50 border-b border-ds-border bg-ds-surface/95 backdrop-blur transition-colors duration-ds ease-ds supports-[backdrop-filter]:bg-ds-surface/80">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="rounded-ds-sm text-lg font-semibold tracking-tight text-ds-text transition-colors duration-ds ease-ds hover:text-ds-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
              >
                Introd
              </Link>
              {user && <NavLinks username={user.username} />}
              <nav className="flex items-center gap-3 sm:gap-6" aria-label="Account">
                {user ? (
                  <AuthBar email={user.email} avatarUrl={user.avatarUrl} username={user.username} />
                ) : (
                  <Link
                    href="/login"
                    className="-mx-2 rounded-ds-sm py-2 px-2 text-sm font-medium text-ds-text-muted transition-colors duration-ds ease-ds hover:text-ds-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
                  >
                    Log in
                  </Link>
                )}
              </nav>
            </div>
          </header>
        </ConditionalHeader>
        <div className="flex flex-1 flex-col">{children}</div>
        <ConditionalHeader>
          <footer className="relative z-10 border-t border-ds-border py-6 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-6">
              <Link
                href="/feedback"
                className="rounded-ds-sm text-sm text-ds-text-muted transition-colors duration-ds ease-ds hover:text-ds-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
              >
                Feedback
              </Link>
            </div>
          </footer>
        </ConditionalHeader>
      </body>
    </html>
  );
}
