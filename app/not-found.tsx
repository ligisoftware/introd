import Link from "next/link";

// Rendered inside app/layout.tsx — header and footer (including Feedback link) are present.
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-container-sm text-center">
        <h1 className="text-6xl font-bold tracking-tight text-ds-text sm:text-7xl">404</h1>
        <p className="mt-2 text-lg text-ds-text-muted">This page doesn&apos;t exist.</p>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex rounded-ds bg-ds-accent px-4 py-2.5 text-sm font-medium text-ds-text-inverse shadow-ds-sm transition-[color,box-shadow,transform] duration-ds ease-ds hover:bg-ds-accent-hover hover:shadow-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg active:scale-[0.98]"
          >
            Back to home
          </Link>
          <Link
            href="/feedback"
            className="rounded-ds-sm text-sm font-medium text-ds-accent transition-colors duration-ds ease-ds hover:text-ds-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
          >
            Send feedback
          </Link>
        </p>
      </div>
    </main>
  );
}
