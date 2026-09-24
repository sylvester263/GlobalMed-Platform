"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { authorize, getSessionUser } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";
import { recordProgress } from "@/lib/lms/progress-service";

type ActionResult = { ok: true; justCompleted?: boolean } | { ok: false; message: string };

const lessonId = z.uuid();

/** Text, PDF, live and assignment lessons are completed by the learner (docs/08 §3). */
export async function markLessonComplete(id: string, coursePath: string): Promise<ActionResult> {
  const session = await getSessionUser();
  if (!session) return { ok: false, message: "Please sign in again." };
  if (!lessonId.safeParse(id).success) return { ok: false, message: "Lesson not found." };
  const result = await recordProgress({
    userId: session.user.id,
    lessonId: id,
    markComplete: true,
  });
  if (!result.ok) return { ok: false, message: result.message };
  revalidatePath(coursePath, "layout");
  return { ok: true, justCompleted: result.justCompleted };
}

const noteSchema = z.object({
  lessonId,
  body: z.string().max(10000, "Notes are limited to 10,000 characters."),
});

/** L-4 notes. RLS ("own notes") enforces ownership and enrollment. */
export async function saveNote(input: unknown): Promise<ActionResult> {
  const session = await getSessionUser();
  if (!session) return { ok: false, message: "Please sign in again." };
  const parsed = noteSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Couldn't save." };
  const supabase = await createClient();
  const { error } = await supabase.from("lesson_notes").upsert(
    {
      user_id: session.user.id,
      lesson_id: parsed.data.lessonId,
      body: parsed.data.body,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );
  return error ? { ok: false, message: "Couldn't save your note. Try again." } : { ok: true };
}

const questionSchema = z.object({
  lessonId,
  body: z.string().trim().min(10, "Add a little more detail (at least 10 characters).").max(2000),
  path: z.string().startsWith("/learn/"),
});

/** L-9 Q&A: enrolled learners ask (RLS checks enrollment). */
export async function askQuestion(input: unknown): Promise<ActionResult> {
  const session = await getSessionUser();
  if (!session) return { ok: false, message: "Please sign in again." };
  const parsed = questionSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Couldn't post." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("lesson_questions")
    .insert({ lesson_id: parsed.data.lessonId, user_id: session.user.id, body: parsed.data.body });
  if (error)
    return { ok: false, message: "Only enrolled students can ask questions on this lesson." };
  revalidatePath(parsed.data.path);
  return { ok: true };
}

const answerSchema = z.object({
  questionId: z.uuid(),
  body: z.string().trim().min(2, "Write an answer first.").max(4000),
  path: z.string().startsWith("/"),
});

/** Instructors, admins and enrolled learners can answer (RLS checks access to the question). */
export async function answerQuestion(input: unknown): Promise<ActionResult> {
  const session = await authorize(["student", "instructor", "admin"]);
  if (!session) return { ok: false, message: "Please sign in again." };
  const parsed = answerSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Couldn't post." };
  const supabase = await createClient();
  const { error } = await supabase.from("lesson_answers").insert({
    question_id: parsed.data.questionId,
    user_id: session.user.id,
    body: parsed.data.body,
  });
  if (error) return { ok: false, message: "You can't answer this question." };
  revalidatePath(parsed.data.path);
  return { ok: true };
}
