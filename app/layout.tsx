import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intro'd",
  description: "Standardized first-impression layer for startup fundraising",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
