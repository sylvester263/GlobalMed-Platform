"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createAdminClient } from "@/lib/db/admin";
import { createClient } from "@/lib/db/server";
import type { BuilderResult } from "@/lib/lms/builder-actions";
import { audit, authorizeCourseStaff } from "@/lib/lms/course-staff";
import { enrollmentActive } from "@/lib/lms/rules";
import {
  announcementSchema,
  batchMemberSchema,
  batchSchema,
  batchSessionSchema,
} from "@/lib/validation/batch";

const DENIED: BuilderResult = { ok: false, message: "You can't manage this batch." };
const BATCHES = "/dashboard/instructor/batches";

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

function invalid(error: z.ZodError): BuilderResult {
  return { ok: false, message: "Check the highlighted fields.", fieldErrors: fieldErrors(error) };
}

/** Looks up the batch's course and checks the caller is its instructor or an admin. */
async function staffForBatch(batchId: string) {
  if (!z.uuid().safeParse(batchId).success) return null;
  const { data } = await createAdminClient()
    .from("batches")
    .select("course_id")
    .eq("id", batchId)
    .maybeSingle();
  return data ? authorizeCourseStaff(data.course_id) : null;
}

function revalidateBatch(batchId?: string) {
  revalidatePath(BATCHES);
  if (batchId) revalidatePath(`${BATCHES}/${batchId}`);
  revalidatePath("/dashboard/student/live");
}

// ---------- Batches ----------

export async function createBatch(input: unknown): Promise<BuilderResult> {
  const parsed = batchSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  const staff = await authorizeCourseStaff(d.courseId);
  if (!staff) return DENIED;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("batches")
    .insert({
      course_id: d.courseId,
      name: d.name,
      starts_at: d.startsAt,
      schedule: d.schedule || null,
      seats: d.seats === "" || d.seats === undefined ? null : d.seats,
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, message: "Couldn't create the batch." };
  await audit(staff.session.user.id, "batch.create", "batch", data.id, { name: d.name });
  revalidateBatch();
  redirect(`${BATCHES}/${data.id}`);
}

export async function deleteBatch(batchId: string): Promise<BuilderResult> {
  const staff = await staffForBatch(batchId);
  if (!staff) return DENIED;
  const supabase = await createClient();
  const { error } = await supabase.from("batches").delete().eq("id", batchId);
  if (error) return { ok: false, message: "Couldn't delete the batch." };
  await audit(staff.session.user.id, "batch.delete", "batch", batchId);
  revalidateBatch();
  redirect(BATCHES);
}

// ---------- Sessions ----------

export async function addBatchSession(input: unknown): Promise<BuilderResult> {
  const parsed = batchSessionSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  if (!(await staffForBatch(d.batchId))) return DENIED;
  const supabase = await createClient();
  const { error } = await supabase.from("batch_sessions").insert({
    batch_id: d.batchId,
    title: d.title,
    starts_at: d.startsAt,
    duration_min: d.durationMin,
    join_url: d.joinUrl || null,
  });
  if (error) return { ok: false, message: "Couldn't add the session." };
  revalidateBatch(d.batchId);
  return { ok: true, message: "Session scheduled." };
}

export async function deleteBatchSession(sessionId: string): Promise<BuilderResult> {
  if (!z.uuid().safeParse(sessionId).success) return DENIED;
  const { data } = await createAdminClient()
    .from("batch_sessions")
    .select("batch_id")
    .eq("id", sessionId)
    .maybeSingle();
  if (!data || !(await staffForBatch(data.batch_id))) return DENIED;
  const supabase = await createClient();
  const { error } = await supabase.from("batch_sessions").delete().eq("id", sessionId);
  if (error) return { ok: false, message: "Couldn't remove the session." };
  revalidateBatch(data.batch_id);
  return { ok: true, message: "Session removed." };
}

// ---------- Members ----------

/** Only students with an active enrollment in the batch's course can join it. */
export async function addBatchMember(input: unknown): Promise<BuilderResult> {
  const parsed = batchMemberSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Choose a student." };
  const { batchId, userId } = parsed.data;
  const staff = await staffForBatch(batchId);
  if (!staff) return DENIED;
  const db = createAdminClient();
  const [{ data: batch }, { count }] = await Promise.all([
    db.from("batches").select("seats").eq("id", batchId).single(),
    db
      .from("batch_members")
      .select("user_id", { count: "exact", head: true })
      .eq("batch_id", batchId),
  ]);
  if (batch?.seats && (count ?? 0) >= batch.seats) {
    return { ok: false, message: "This batch is full." };
  }
  const { data: enrollment } = await db
    .from("enrollments")
    .select("status, expires_at")
    .eq("user_id", userId)
    .eq("course_id", staff.courseId)
    .maybeSingle();
  if (!enrollment || !enrollmentActive(enrollment)) {
    return { ok: false, message: "That student isn't actively enrolled in this course." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("batch_members")
    .upsert({ batch_id: batchId, user_id: userId }, { onConflict: "batch_id,user_id" });
  if (error) return { ok: false, message: "Couldn't add the student." };
  revalidateBatch(batchId);
  return { ok: true, message: "Student added." };
}

export async function removeBatchMember(input: unknown): Promise<BuilderResult> {
  const parsed = batchMemberSchema.safeParse(input);
  if (!parsed.success) return DENIED;
  if (!(await staffForBatch(parsed.data.batchId))) return DENIED;
  const supabase = await createClient();
  const { error } = await supabase
    .from("batch_members")
    .delete()
    .eq("batch_id", parsed.data.batchId)
    .eq("user_id", parsed.data.userId);
  if (error) return { ok: false, message: "Couldn't remove the student." };
  revalidateBatch(parsed.data.batchId);
  return { ok: true, message: "Student removed." };
}

// ---------- Announcements ----------

/** Posts to the batch and drops an in-app notification for every member. */
export async function postAnnouncement(input: unknown): Promise<BuilderResult> {
  const parsed = announcementSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  const staff = await staffForBatch(d.batchId);
  if (!staff) return DENIED;
  const supabase = await createClient();
  const { error } = await supabase.from("batch_announcements").insert({
    batch_id: d.batchId,
    author_id: staff.session.user.id,
    title: d.title,
    body: d.body,
  });
  if (error) return { ok: false, message: "Couldn't post the announcement." };

  const db = createAdminClient();
  const { data: members } = await db
    .from("batch_members")
    .select("user_id")
    .eq("batch_id", d.batchId);
  if (members?.length) {
    await db.from("notifications").insert(
      members.map((m) => ({
        user_id: m.user_id,
        title: d.title,
        body: d.body.slice(0, 200),
        link: "/dashboard/student/live",
      })),
    );
  }
  revalidateBatch(d.batchId);
  return { ok: true, message: "Announcement posted." };
}
