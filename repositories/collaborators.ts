import type { SupabaseClient } from "@supabase/supabase-js";
import type { Collaborator, TeamMember } from "@/types";

interface CollaboratorRow {
  id: string;
  intro_id: string;
  email: string;
  user_id?: string | null;
  invite_token: string;
  status: "pending" | "accepted";
  role?: string | null;
  start_date?: string | null;
  show_email?: boolean;
  created_at: string;
  accepted_at?: string | null;
}

function rowToCollaborator(row: CollaboratorRow): Collaborator {
  return {
    id: row.id,
    introId: row.intro_id,
    email: row.email,
    userId: row.user_id ?? undefined,
    inviteToken: row.invite_token,
    status: row.status,
    role: row.role ?? undefined,
    startDate: row.start_date ?? undefined,
    showEmail: row.show_email ?? false,
    createdAt: row.created_at,
    acceptedAt: row.accepted_at ?? undefined,
  };
}

const COLLABORATOR_SELECT =
  "id, intro_id, email, user_id, invite_token, status, role, start_date, show_email, created_at, accepted_at";

export async function listByIntroId(
  supabase: SupabaseClient,
  introId: string
): Promise<Collaborator[]> {
  const { data, error } = await supabase
    .from("intro_collaborators")
    .select(COLLABORATOR_SELECT)
    .eq("intro_id", introId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return (data as CollaboratorRow[]).map(rowToCollaborator);
}

interface CollaboratorWithUserRow extends CollaboratorRow {
  users?: { name?: string | null; avatar_url?: string | null } | null;
}

const COLLABORATOR_WITH_USER_SELECT = `${COLLABORATOR_SELECT}, users(name, avatar_url)`;

function rowWithUserToCollaborator(row: CollaboratorWithUserRow): Collaborator {
  return {
    ...rowToCollaborator(row),
    userName: row.users?.name ?? undefined,
    userAvatarUrl: row.users?.avatar_url ?? undefined,
  };
}

export async function listByIntroIdWithUsers(
  supabase: SupabaseClient,
  introId: string
): Promise<Collaborator[]> {
  const { data, error } = await supabase
    .from("intro_collaborators")
    .select(COLLABORATOR_WITH_USER_SELECT)
    .eq("intro_id", introId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return (data as unknown as CollaboratorWithUserRow[]).map(rowWithUserToCollaborator);
}

export async function getByInviteToken(
  supabase: SupabaseClient,
  token: string
): Promise<Collaborator | null> {
  const { data, error } = await supabase
    .from("intro_collaborators")
    .select(COLLABORATOR_SELECT)
    .eq("invite_token", token)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return rowToCollaborator(data as CollaboratorRow);
}

export async function create(
  supabase: SupabaseClient,
  introId: string,
  email: string
): Promise<Collaborator> {
  const { data, error } = await supabase
    .from("intro_collaborators")
    .insert({ intro_id: introId, email })
    .select(COLLABORATOR_SELECT)
    .single();

  if (error) throw error;
  return rowToCollaborator(data as CollaboratorRow);
}

export async function acceptInvite(
  supabase: SupabaseClient,
  collaboratorId: string,
  userId: string
): Promise<Collaborator> {
  const { data, error } = await supabase
    .from("intro_collaborators")
    .update({
      status: "accepted",
      user_id: userId,
      accepted_at: new Date().toISOString(),
    })
    .eq("id", collaboratorId)
    .select(COLLABORATOR_SELECT)
    .single();

  if (error) throw error;
  return rowToCollaborator(data as CollaboratorRow);
}

export async function markAccepted(
  supabase: SupabaseClient,
  collaboratorId: string
): Promise<void> {
  const { error } = await supabase
    .from("intro_collaborators")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", collaboratorId);

  if (error) throw error;
}

export async function setUserId(
  supabase: SupabaseClient,
  collaboratorId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("intro_collaborators")
    .update({ user_id: userId })
    .eq("id", collaboratorId);

  if (error) throw error;
}

export async function deleteById(supabase: SupabaseClient, collaboratorId: string): Promise<void> {
  const { error } = await supabase.from("intro_collaborators").delete().eq("id", collaboratorId);

  if (error) throw error;
}

export async function listByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<Collaborator[]> {
  const { data, error } = await supabase
    .from("intro_collaborators")
    .select(COLLABORATOR_SELECT)
    .eq("user_id", userId)
    .eq("status", "accepted")
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return (data as CollaboratorRow[]).map(rowToCollaborator);
}

export async function getByIntroAndUser(
  supabase: SupabaseClient,
  introId: string,
  userId: string
): Promise<Collaborator | null> {
  const { data, error } = await supabase
    .from("intro_collaborators")
    .select(COLLABORATOR_SELECT)
    .eq("intro_id", introId)
    .eq("user_id", userId)
    .eq("status", "accepted")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return rowToCollaborator(data as CollaboratorRow);
}

export async function updateCollaboratorFields(
  supabase: SupabaseClient,
  collaboratorId: string,
  payload: { role?: string | null; start_date?: string | null; show_email?: boolean }
): Promise<Collaborator> {
  const { data, error } = await supabase
    .from("intro_collaborators")
    .update(payload)
    .eq("id", collaboratorId)
    .select(COLLABORATOR_SELECT)
    .single();

  if (error) throw error;
  return rowToCollaborator(data as CollaboratorRow);
}

interface TeamMemberJoinRow {
  role?: string | null;
  start_date?: string | null;
  show_email?: boolean;
  email: string;
  users: {
    name?: string | null;
    avatar_url?: string | null;
    linkedin_url?: string | null;
    twitter_url?: string | null;
  };
}

export async function getTeamMembersForIntro(
  supabase: SupabaseClient,
  introId: string
): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("intro_collaborators")
    .select(
      "role, start_date, show_email, email, users(name, avatar_url, linkedin_url, twitter_url)"
    )
    .eq("intro_id", introId)
    .eq("status", "accepted")
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return (data as unknown as TeamMemberJoinRow[]).map((row) => ({
    name: row.users?.name ?? undefined,
    avatarUrl: row.users?.avatar_url ?? undefined,
    email: row.show_email ? row.email : undefined,
    role: row.role ?? undefined,
    startDate: row.start_date ?? undefined,
    linkedinUrl: row.users?.linkedin_url ?? undefined,
    twitterUrl: row.users?.twitter_url ?? undefined,
  }));
}
