import "server-only";

import { createAdminClient } from "@/lib/db/admin";
import { createClient } from "@/lib/db/server";
import { signedDownloadUrl } from "@/lib/lms/files";

/** "Ayesha K." — enough to follow a conversation without exposing full names. */
function shortName(fullName: string | null | undefined): string {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Student";
  return parts.length === 1 ? parts[0]! : `${parts[0]} ${parts[parts.length - 1]![0]}.`;
}

export async function getLessonNote(lessonId: string, userId: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_notes")
    .select("body")
    .eq("lesson_id", lessonId)
    .eq("user_id", userId)
    .maybeSingle();
  return data?.body ?? "";
}

/**
 * Q&A for a lesson. Rows come through RLS (enrolled learners and course staff only);
 * author names are looked up with the service role and shortened.
 */
export async function getLessonThreads(lessonId: string, staffIds: ReadonlySet<string>) {
  const supabase = await createClient();
  const { data: questions } = await supabase
    .from("lesson_questions")
    .select("id, user_id, body, created_at")
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (!questions?.length) return [];

  const { data: answers } = await supabase
    .from("lesson_answers")
    .select("id, question_id, user_id, body, created_at")
    .in(
      "question_id",
      questions.map((q) => q.id),
    )
    .order("created_at");

  const userIds = [
    ...new Set(
      [...questions, ...(answers ?? [])]
        .map((r) => r.user_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const { data: profiles } = await createAdminClient()
    .from("profiles")
    .select("id, full_name, role")
    .in("id", userIds);
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  return questions.map((q) => ({
    id: q.id,
    author: shortName(byId.get(q.user_id ?? "")?.full_name),
    body: q.body,
    createdAt: q.created_at ?? new Date().toISOString(),
    answers: (answers ?? [])
      .filter((a) => a.question_id === q.id)
      .map((a) => {
        const profile = byId.get(a.user_id ?? "");
        return {
          id: a.id,
          author: shortName(profile?.full_name),
          body: a.body,
          createdAt: a.created_at ?? new Date().toISOString(),
          byStaff: Boolean(a.user_id && (staffIds.has(a.user_id) || profile?.role === "admin")),
        };
      }),
  }));
}

/** Signed download links for a lesson's resources (10 minutes). */
export async function signResources(
  resources: { id: string; label: string; storage_path: string }[],
) {
  const signed = await Promise.all(
    resources.map(async (r) => ({
      id: r.id,
      label: r.label,
      url: await signedDownloadUrl(r.storage_path, r.label),
    })),
  );
  return signed.filter((r): r is { id: string; label: string; url: string } => Boolean(r.url));
}
