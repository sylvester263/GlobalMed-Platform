"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { authorize } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/db/admin";
import { createClient } from "@/lib/db/server";
import {
  audit,
  authorizeCourseStaff,
  courseIdForLesson,
  courseIdForModule,
} from "@/lib/lms/course-staff";
import {
  allowedResourceTypes,
  MAX_FILE_BYTES,
  removeFile,
  signedUploadUrl,
  storagePath,
} from "@/lib/lms/files";
import { getVideo, lessonStatusFor } from "@/lib/video/bunny";
import {
  courseAdminSchema,
  courseDetailsSchema,
  courseTitleSchema,
  lessonTypes,
  lessonUpdateSchema,
  reorderSchema,
  slugify,
  unlockRuleFrom,
} from "@/lib/validation/course";

export type BuilderResult =
  | { ok: true; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

const DENIED: BuilderResult = { ok: false, message: "You can't edit this course." };

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

function builderPath(courseId: string) {
  return `/dashboard/instructor/courses/${courseId}`;
}

function revalidateCourse(courseId: string) {
  revalidatePath(builderPath(courseId), "layout");
  revalidatePath("/dashboard/instructor/courses");
  revalidatePath("/dashboard/admin/courses");
  revalidatePath("/learn", "layout");
}

// ---------- Courses ----------

/** P4-1: create a draft course owned by the caller (admins may assign later). */
export async function createCourse(form: FormData): Promise<void> {
  const session = await authorize(["instructor", "admin"]);
  if (!session) redirect("/dashboard?denied=1");
  const title = courseTitleSchema.safeParse(form.get("title"));
  if (!title.success) redirect("/dashboard/instructor/courses?error=title");

  const supabase = await createClient();
  const base = slugify(title.data) || "course";
  // Find a free slug: base, base-2, base-3…
  const { data: taken } = await createAdminClient()
    .from("courses")
    .select("slug")
    .like("slug", `${base}%`);
  const used = new Set((taken ?? []).map((c) => c.slug));
  let slug = base;
  for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;

  const { data, error } = await supabase
    .from("courses")
    .insert({ title: title.data, slug, instructor_id: session.user.id, status: "draft" })
    .select("id")
    .single();
  if (error || !data) redirect("/dashboard/instructor/courses?error=create");
  await audit(session.user.id, "course.create", "course", data.id, { title: title.data });
  revalidatePath("/dashboard/instructor/courses");
  redirect(builderPath(data.id));
}

export async function updateCourseDetails(input: unknown): Promise<BuilderResult> {
  const parsed = courseDetailsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const d = parsed.data;
  const staff = await authorizeCourseStaff(d.courseId);
  if (!staff) return DENIED;

  const supabase = await createClient();
  const { error } = await supabase
    .from("courses")
    .update({
      title: d.title,
      slug: d.slug,
      summary: d.summary || null,
      description_md: d.description || null,
      outcomes: (d.outcomes ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 20),
      level: d.level,
      pass_pct: d.passPct,
    })
    .eq("id", d.courseId);
  if (error) {
    return error.code === "23505"
      ? {
          ok: false,
          message: "That web address is taken.",
          fieldErrors: { slug: "Another course already uses this address." },
        }
      : { ok: false, message: "Couldn't save the course. Try again." };
  }
  revalidateCourse(d.courseId);
  return { ok: true, message: "Course details saved." };
}

/** Admin-only fields: publishing, pricing, access period and instructor (docs/07 §3). */
export async function updateCourseAdmin(input: unknown): Promise<BuilderResult> {
  const session = await authorize(["admin"]);
  if (!session) return { ok: false, message: "Only admins can change these settings." };
  const parsed = courseAdminSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const d = parsed.data;
  const update = {
    status: d.status,
    price_usd: d.priceUsd,
    price_pkr: d.pricePkr === "" || d.pricePkr === undefined ? null : d.pricePkr,
    access_months: d.accessMonths === "" || d.accessMonths === undefined ? null : d.accessMonths,
    instructor_id: d.instructorId || null,
  };
  const supabase = await createClient();
  const { error } = await supabase.from("courses").update(update).eq("id", d.courseId);
  if (error) return { ok: false, message: "Couldn't save. Try again." };
  await audit(session.user.id, "course.admin_update", "course", d.courseId, update);
  revalidateCourse(d.courseId);
  return {
    ok: true,
    message: d.status === "published" ? "Saved. The course is published." : "Saved.",
  };
}

// ---------- Modules ----------

export async function addModule(courseId: string, title: string): Promise<BuilderResult> {
  const parsedTitle = z
    .string()
    .trim()
    .min(2, "Give the module a title.")
    .max(160)
    .safeParse(title);
  if (!parsedTitle.success) return { ok: false, message: parsedTitle.error.issues[0]!.message };
  if (!z.uuid().safeParse(courseId).success || !(await authorizeCourseStaff(courseId)))
    return DENIED;

  const supabase = await createClient();
  const { count } = await supabase
    .from("modules")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId);
  const { error } = await supabase
    .from("modules")
    .insert({ course_id: courseId, title: parsedTitle.data, position: count ?? 0 });
  if (error) return { ok: false, message: "Couldn't add the module." };
  revalidateCourse(courseId);
  return { ok: true };
}

export async function renameModule(moduleId: string, title: string): Promise<BuilderResult> {
  const parsedTitle = z.string().trim().min(2).max(160).safeParse(title);
  const courseId = z.uuid().safeParse(moduleId).success ? await courseIdForModule(moduleId) : null;
  if (!parsedTitle.success) return { ok: false, message: "Give the module a title." };
  if (!courseId || !(await authorizeCourseStaff(courseId))) return DENIED;
  const supabase = await createClient();
  const { error } = await supabase
    .from("modules")
    .update({ title: parsedTitle.data })
    .eq("id", moduleId);
  if (error) return { ok: false, message: "Couldn't rename the module." };
  revalidateCourse(courseId);
  return { ok: true };
}

export async function deleteModule(moduleId: string): Promise<BuilderResult> {
  const courseId = z.uuid().safeParse(moduleId).success ? await courseIdForModule(moduleId) : null;
  const staff = courseId ? await authorizeCourseStaff(courseId) : null;
  if (!courseId || !staff) return DENIED;
  const supabase = await createClient();
  const { count } = await supabase
    .from("lessons")
    .select("id", { count: "exact", head: true })
    .eq("module_id", moduleId);
  if ((count ?? 0) > 0)
    return { ok: false, message: "Move or delete this module's lessons first." };
  const { error } = await supabase.from("modules").delete().eq("id", moduleId);
  if (error) return { ok: false, message: "Couldn't delete the module." };
  await audit(staff.session.user.id, "module.delete", "module", moduleId);
  revalidateCourse(courseId);
  return { ok: true };
}

/** Drag-and-drop order (also used by the move up/down buttons). */
export async function reorderModules(input: unknown): Promise<BuilderResult> {
  const parsed = reorderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid order." };
  const { parentId: courseId, orderedIds } = parsed.data;
  if (!(await authorizeCourseStaff(courseId))) return DENIED;
  const supabase = await createClient();
  const { data: existing } = await supabase.from("modules").select("id").eq("course_id", courseId);
  const ids = new Set((existing ?? []).map((m) => m.id));
  if (orderedIds.length !== ids.size || orderedIds.some((id) => !ids.has(id))) {
    return { ok: false, message: "The course changed. Refresh and try again." };
  }
  const results = await Promise.all(
    orderedIds.map((id, position) => supabase.from("modules").update({ position }).eq("id", id)),
  );
  if (results.some((r) => r.error)) return { ok: false, message: "Couldn't save the new order." };
  revalidateCourse(courseId);
  return { ok: true };
}

// ---------- Lessons ----------

export async function addLesson(
  moduleId: string,
  title: string,
  type: string,
): Promise<BuilderResult> {
  const parsed = z
    .object({
      moduleId: z.uuid(),
      title: z.string().trim().min(2).max(160),
      type: z.enum(lessonTypes),
    })
    .safeParse({ moduleId, title, type });
  if (!parsed.success) return { ok: false, message: "Give the lesson a title and type." };
  const courseId = await courseIdForModule(moduleId);
  if (!courseId || !(await authorizeCourseStaff(courseId))) return DENIED;
  const supabase = await createClient();
  const { count } = await supabase
    .from("lessons")
    .select("id", { count: "exact", head: true })
    .eq("module_id", moduleId);
  const { error } = await supabase.from("lessons").insert({
    module_id: moduleId,
    title: parsed.data.title,
    type: parsed.data.type,
    position: count ?? 0,
  });
  if (error) return { ok: false, message: "Couldn't add the lesson." };
  revalidateCourse(courseId);
  return { ok: true };
}

export async function updateLesson(input: unknown): Promise<BuilderResult> {
  const parsed = lessonUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const d = parsed.data;
  const courseId = await courseIdForLesson(d.lessonId);
  if (!courseId || !(await authorizeCourseStaff(courseId))) return DENIED;
  if (d.unlock === "after_lesson" && d.unlockLessonId === d.lessonId) {
    return {
      ok: false,
      message: "A lesson can't wait for itself.",
      fieldErrors: { unlockLessonId: "Choose a different lesson." },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("lessons")
    .update({
      title: d.title,
      type: d.type,
      is_preview: d.isPreview,
      required: d.required,
      content_md: d.contentMd || null,
      live_url: d.liveUrl || null,
      unlock_rule: unlockRuleFrom(d),
      // Video durations come from Bunny; other lesson types can set an estimate.
      ...(d.type !== "video" && d.durationMin !== undefined
        ? { duration_sec: d.durationMin * 60 }
        : {}),
    })
    .eq("id", d.lessonId);
  if (error) return { ok: false, message: "Couldn't save the lesson." };
  revalidateCourse(courseId);
  return { ok: true, message: "Lesson saved." };
}

export async function deleteLesson(lessonId: string): Promise<BuilderResult> {
  const courseId = z.uuid().safeParse(lessonId).success ? await courseIdForLesson(lessonId) : null;
  const staff = courseId ? await authorizeCourseStaff(courseId) : null;
  if (!courseId || !staff) return DENIED;
  const db = createAdminClient();
  const { data: lesson } = await db.from("lessons").select("pdf_path").eq("id", lessonId).single();
  const { data: resources } = await db
    .from("lesson_resources")
    .select("storage_path")
    .eq("lesson_id", lessonId);
  const supabase = await createClient();
  const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
  if (error) return { ok: false, message: "Couldn't delete the lesson." };
  for (const path of [lesson?.pdf_path, ...(resources ?? []).map((r) => r.storage_path)]) {
    if (path) await removeFile(path);
  }
  await audit(staff.session.user.id, "lesson.delete", "lesson", lessonId);
  revalidateCourse(courseId);
  redirect(builderPath(courseId));
}

export async function reorderLessons(input: unknown): Promise<BuilderResult> {
  const parsed = reorderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid order." };
  const { parentId: moduleId, orderedIds } = parsed.data;
  const courseId = await courseIdForModule(moduleId);
  if (!courseId || !(await authorizeCourseStaff(courseId))) return DENIED;
  const supabase = await createClient();
  const { data: existing } = await supabase.from("lessons").select("id").eq("module_id", moduleId);
  const ids = new Set((existing ?? []).map((l) => l.id));
  if (orderedIds.length !== ids.size || orderedIds.some((id) => !ids.has(id))) {
    return { ok: false, message: "The module changed. Refresh and try again." };
  }
  const results = await Promise.all(
    orderedIds.map((id, position) => supabase.from("lessons").update({ position }).eq("id", id)),
  );
  if (results.some((r) => r.error)) return { ok: false, message: "Couldn't save the new order." };
  revalidateCourse(courseId);
  return { ok: true };
}

/** Moves a lesson to the end of another module in the same course. */
export async function moveLesson(lessonId: string, targetModuleId: string): Promise<BuilderResult> {
  if (!z.uuid().safeParse(lessonId).success || !z.uuid().safeParse(targetModuleId).success)
    return DENIED;
  const [courseId, targetCourseId] = await Promise.all([
    courseIdForLesson(lessonId),
    courseIdForModule(targetModuleId),
  ]);
  if (!courseId || courseId !== targetCourseId || !(await authorizeCourseStaff(courseId)))
    return DENIED;
  const supabase = await createClient();
  const { count } = await supabase
    .from("lessons")
    .select("id", { count: "exact", head: true })
    .eq("module_id", targetModuleId);
  const { error } = await supabase
    .from("lessons")
    .update({ module_id: targetModuleId, position: count ?? 0 })
    .eq("id", lessonId);
  if (error) return { ok: false, message: "Couldn't move the lesson." };
  revalidateCourse(courseId);
  return { ok: true, message: "Lesson moved." };
}

// ---------- Files (PDF lessons and resources) ----------

const uploadRequestSchema = z.object({
  lessonId: z.uuid(),
  mimeType: z.string(),
  size: z.number().int().positive().max(MAX_FILE_BYTES, "Files can be up to 50 MB."),
  purpose: z.enum(["resource", "pdf"]),
});

/** Step 1: a one-time signed upload URL after checking course ownership and file type. */
export async function requestFileUpload(
  input: unknown,
): Promise<{ ok: true; path: string; token: string } | { ok: false; message: string }> {
  const parsed = uploadRequestSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid file." };
  const ext = allowedResourceTypes[parsed.data.mimeType];
  if (!ext || (parsed.data.purpose === "pdf" && ext !== "pdf")) {
    return {
      ok: false,
      message:
        parsed.data.purpose === "pdf"
          ? "PDF lessons need a PDF file."
          : "Upload a PDF, Word, Excel, PowerPoint, CSV, PNG or JPG file.",
    };
  }
  const courseId = await courseIdForLesson(parsed.data.lessonId);
  if (!courseId || !(await authorizeCourseStaff(courseId)))
    return { ok: false, message: "You can't edit this course." };
  const signed = await signedUploadUrl(storagePath(courseId, parsed.data.lessonId, ext));
  return signed
    ? { ok: true, ...signed }
    : { ok: false, message: "Uploads aren't available right now." };
}

const confirmSchema = z.object({
  lessonId: z.uuid(),
  path: z.string().regex(/^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.[a-z]{3,4}$/),
  label: z.string().trim().min(1).max(160),
  purpose: z.enum(["resource", "pdf"]),
});

/** Step 2: record the uploaded file on the lesson. */
export async function confirmFileUpload(input: unknown): Promise<BuilderResult> {
  const parsed = confirmSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Upload couldn't be saved." };
  const d = parsed.data;
  const courseId = await courseIdForLesson(d.lessonId);
  if (
    !courseId ||
    !d.path.startsWith(`${courseId}/${d.lessonId}/`) ||
    !(await authorizeCourseStaff(courseId))
  ) {
    return DENIED;
  }
  const db = createAdminClient();
  if (d.purpose === "pdf") {
    const { data: lesson } = await db
      .from("lessons")
      .select("pdf_path")
      .eq("id", d.lessonId)
      .single();
    await db.from("lessons").update({ pdf_path: d.path }).eq("id", d.lessonId);
    if (lesson?.pdf_path && lesson.pdf_path !== d.path) await removeFile(lesson.pdf_path);
  } else {
    const { error } = await db
      .from("lesson_resources")
      .insert({ lesson_id: d.lessonId, label: d.label, storage_path: d.path });
    if (error) return { ok: false, message: "Couldn't save the resource." };
  }
  revalidateCourse(courseId);
  return { ok: true, message: d.purpose === "pdf" ? "PDF uploaded." : "Resource added." };
}

export async function deleteResource(resourceId: string): Promise<BuilderResult> {
  if (!z.uuid().safeParse(resourceId).success) return DENIED;
  const db = createAdminClient();
  const { data: resource } = await db
    .from("lesson_resources")
    .select("lesson_id, storage_path")
    .eq("id", resourceId)
    .maybeSingle();
  const courseId = resource ? await courseIdForLesson(resource.lesson_id) : null;
  if (!resource || !courseId || !(await authorizeCourseStaff(courseId))) return DENIED;
  await db.from("lesson_resources").delete().eq("id", resourceId);
  await removeFile(resource.storage_path);
  revalidateCourse(courseId);
  return { ok: true };
}

// ---------- Video ----------

/** After the TUS upload finishes; the Bunny webhook then moves it to "ready". */
export async function markVideoUploaded(lessonId: string): Promise<BuilderResult> {
  const courseId = z.uuid().safeParse(lessonId).success ? await courseIdForLesson(lessonId) : null;
  if (!courseId || !(await authorizeCourseStaff(courseId))) return DENIED;
  await createAdminClient()
    .from("lessons")
    .update({ video_status: "processing" })
    .eq("id", lessonId);
  revalidateCourse(courseId);
  return { ok: true, message: "Upload complete. Bunny is processing the video." };
}

/** Manual status check — useful when the webhook isn't configured yet. */
export async function refreshVideoStatus(lessonId: string): Promise<BuilderResult> {
  const courseId = z.uuid().safeParse(lessonId).success ? await courseIdForLesson(lessonId) : null;
  if (!courseId || !(await authorizeCourseStaff(courseId))) return DENIED;
  const db = createAdminClient();
  const { data: lesson } = await db
    .from("lessons")
    .select("bunny_video_id")
    .eq("id", lessonId)
    .single();
  if (!lesson?.bunny_video_id) return { ok: false, message: "No video uploaded yet." };
  const video = await getVideo(lesson.bunny_video_id);
  if (!video) return { ok: false, message: "Couldn't reach Bunny. Try again shortly." };
  const status = lessonStatusFor(video);
  await db
    .from("lessons")
    .update({
      video_status: status,
      duration_sec: video.length > 0 ? Math.round(video.length) : null,
      video_meta: {
        captions: video.captions,
        width: video.width ?? null,
        height: video.height ?? null,
      },
    })
    .eq("id", lessonId);
  revalidateCourse(courseId);
  return { ok: true, message: status === "ready" ? "Video is ready." : `Video is ${status}.` };
}
