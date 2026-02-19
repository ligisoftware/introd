import { FeedbackForm } from "@/app/components/FeedbackForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback — Intro'd",
};

export default function FeedbackPage() {
  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-container-sm ds-hero-in">
        <h1 className="text-2xl font-bold tracking-tight text-ds-text sm:text-3xl">
          Send feedback
        </h1>
        <div className="mt-6">
          <FeedbackForm />
        </div>
      </div>
    </main>
  );
}
