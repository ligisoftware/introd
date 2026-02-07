import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const FEEDBACK_TO = ["nic@ligi.app", "jeff@ligi.app"] as const;

const bodySchema = z.object({
  message: z.string().min(1, "Message is required").max(5000),
  email: z.string().email().optional().or(z.literal("")),
  slug: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email is not configured (RESEND_API_KEY missing)." },
      { status: 503 }
    );
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof z.ZodError ? e.issues : "Invalid request" },
      { status: 400 }
    );
  }

  const subject = body.slug ? `Intro'd feedback (page: /p/${body.slug})` : "Intro'd feedback";
  const from = process.env.RESEND_FROM_EMAIL ?? "Intro'd <onboarding@resend.dev>";
  const replyTo = body.email && body.email.trim() ? body.email.trim() : undefined;

  const text = [
    body.slug ? `Page: /p/${body.slug}` : null,
    replyTo ? `From: ${replyTo}` : null,
    "",
    body.message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [...FEEDBACK_TO],
      replyTo: replyTo ?? undefined,
      subject,
      text,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send email" },
      { status: 500 }
    );
  }
}
