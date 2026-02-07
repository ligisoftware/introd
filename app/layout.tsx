import { AuthBar } from "@/app/components/AuthBar";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFounder } from "@/services/founder";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--ds-font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Intro'd",
  description: "Standardized first-impression layer for startup fundraising",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const founder = await getCurrentFounder(supabase);

  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-ds-bg text-ds-text font-sans antialiased">
        <header className="sticky top-0 z-50 border-b border-ds-border bg-ds-surface/95 backdrop-blur transition-colors duration-ds ease-ds supports-[backdrop-filter]:bg-ds-surface/80">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="rounded-ds-sm text-lg font-semibold tracking-tight text-ds-text transition-colors duration-ds ease-ds hover:text-ds-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
            >
              Intro&apos;d
            </Link>
            <nav className="flex items-center gap-3 sm:gap-6" aria-label="Account">
              {founder ? (
                <>
                  <Link
                    href="/profile"
                    className="-mx-2 rounded-ds-sm py-2 px-2 text-sm font-medium text-ds-text-muted transition-colors duration-ds ease-ds hover:text-ds-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
                  >
                    Edit profile
                  </Link>
                  <AuthBar email={founder.email} />
                </>
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
        {children}
      </body>
    </html>
  );
}
