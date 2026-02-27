import type { SupabaseClient } from "@supabase/supabase-js";
import type { Collaborator, Intro } from "@/types";
import {
  listByIntroId,
  getByInviteToken,
  create,
  deleteById,
  listByUserId,
  getByIntroAndUser,
} from "@/repositories/collaborators";
import { getById } from "@/repositories/intros";

export async function listCollaborators(
  supabase: SupabaseClient,
  introId: string
): Promise<Collaborator[]> {
  return listByIntroId(supabase, introId);
}

export async function inviteCollaborator(
  supabase: SupabaseClient,
  introId: string,
  email: string
): Promise<{ collaborator?: Collaborator; error?: string }> {
  try {
    const collaborator = await create(supabase, introId, email);
    return { collaborator };
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      return { error: "This email has already been invited" };
    }
    throw err;
  }
}

export async function removeCollaborator(
  supabase: SupabaseClient,
  collaboratorId: string
): Promise<void> {
  await deleteById(supabase, collaboratorId);
}

export async function getInviteByToken(
  supabase: SupabaseClient,
  token: string
): Promise<Collaborator | null> {
  return getByInviteToken(supabase, token);
}

export async function listCollaboratedIntros(
  supabase: SupabaseClient,
  userId: string
): Promise<Intro[]> {
  const collabs = await listByUserId(supabase, userId);
  const intros: Intro[] = [];
  for (const collab of collabs) {
    const intro = await getById(supabase, collab.introId);
    if (intro) intros.push(intro);
  }
  return intros;
}

export async function isCollaborator(
  supabase: SupabaseClient,
  introId: string,
  userId: string
): Promise<boolean> {
  const collab = await getByIntroAndUser(supabase, introId, userId);
  return collab !== null;
}
