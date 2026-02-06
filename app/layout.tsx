import { AuthBar } from "@/app/components/AuthBar";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFounder } from "@/services/founder";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

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
    <html lang="en">
      <body>
        <header className="border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold text-gray-900">
              Intro&apos;d
            </Link>
            {founder ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="text-sm text-gray-700 underline hover:no-underline"
                >
                  Edit profile
                </Link>
                <AuthBar email={founder.email} />
              </div>
            ) : (
              <Link href="/login" className="text-sm text-gray-700 underline hover:no-underline">
                Log in
              </Link>
            )}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
