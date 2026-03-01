import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { getIntroForEditing } from "@/services/intro";
import { listCollaborators, inviteCollaborator, removeCollaborator } from "@/services/collaborator";
import { getById } from "@/repositories/intros";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
});

/**
 * GET /api/intros/[id]/collaborators — List collaborators for an intro.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await getIntroForEditing(supabase, id, user.id);
  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const collaborators = await listCollaborators(supabase, id);
    return NextResponse.json({ collaborators });
  } catch (err) {
    console.error("GET /api/intros/[id]/collaborators error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

/**
 * POST /api/intros/[id]/collaborators — Invite a collaborator by email.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const intro = await getById(supabase, id);
  if (!intro || intro.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();

  if (email === user.email.toLowerCase()) {
    return NextResponse.json({ error: "You cannot invite yourself" }, { status: 400 });
  }

  try {
    const { collaborator, error } = await inviteCollaborator(supabase, id, email);
    if (error) {
      return NextResponse.json({ error }, { status: 409 });
    }

    // Send invite email
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set, skipping invite email");
      return NextResponse.json({ collaborator, emailSkipped: true });
    }

    if (collaborator) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.RESEND_FROM_EMAIL ?? "Introd <noreply@introd.me>";
      const origin =
        request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://introd.com";
      const ownerName = user.name || user.email;
      const startupName = intro.startupName;

      const { error: emailError } = await resend.emails.send({
        from,
        to: [email],
        subject: `${ownerName} invited you to collaborate on Introd`,
        text: [
          `${ownerName} has invited you to collaborate on ${startupName ? `"${startupName}"` : "an intro"} on Introd.`,
          "",
          `Accept the invite: ${origin}/invite/${collaborator.inviteToken}`,
          "",
          "If you don't have an account yet, you'll be able to create one after accepting.",
        ].join("\n"),
      });

      if (emailError) {
        console.error("Failed to send invite email:", emailError);
        await removeCollaborator(supabase, collaborator.id);
        return NextResponse.json(
          { error: `Failed to send invite email: ${emailError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ collaborator });
  } catch (err) {
    console.error("POST /api/intros/[id]/collaborators error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
