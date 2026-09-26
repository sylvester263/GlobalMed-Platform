"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { updateCourseAdmin, updateCourseDetails } from "@/lib/lms/builder-actions";

import { useBuilderAction } from "./use-builder-action";

type Course = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description_md: string | null;
  outcomes: string[] | null;
  level: string | null;
  pass_pct: number;
  status: "draft" | "published" | "archived";
  price_usd: number;
  price_pkr: number | null;
  access_months: number | null;
  instructor_id: string | null;
};

const text = (form: FormData, key: string) => String(form.get(key) ?? "");

/** Details every course editor can change. */
export function CourseDetailsForm({ course }: { course: Course }) {
  const { pending, fieldErrors, run } = useBuilderAction();
  return (
    <form
      action={(form) =>
        run(() =>
          updateCourseDetails({
            courseId: course.id,
            title: text(form, "title"),
            slug: text(form, "slug"),
            summary: text(form, "summary"),
            description: text(form, "description"),
            outcomes: text(form, "outcomes"),
            level: text(form, "level"),
            passPct: text(form, "passPct"),
          }),
        )
      }
      className="grid gap-5 md:grid-cols-2"
    >
      <FormField label="Course title" required error={fieldErrors.title} className="md:col-span-2">
        {(c) => <Input {...c} name="title" defaultValue={course.title} />}
      </FormField>
      <FormField
        label="Web address"
        required
        description="globalmedtranscriptions.com/education/courses/…"
        error={fieldErrors.slug}
      >
        {(c) => <Input {...c} name="slug" defaultValue={course.slug} className="font-mono" />}
      </FormField>
      <FormField label="Level" required error={fieldErrors.level}>
        {(c) => (
          <NativeSelect {...c} name="level" defaultValue={course.level ?? "beginner"}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </NativeSelect>
        )}
      </FormField>
      <FormField
        label="Summary"
        description="One or two sentences for course cards."
        error={fieldErrors.summary}
        className="md:col-span-2"
      >
        {(c) => (
          <Textarea
            {...c}
            name="summary"
            rows={2}
            maxLength={300}
            defaultValue={course.summary ?? ""}
          />
        )}
      </FormField>
      <FormField
        label="Description"
        description="Markdown supported."
        error={fieldErrors.description}
        className="md:col-span-2"
      >
        {(c) => (
          <Textarea {...c} name="description" rows={6} defaultValue={course.description_md ?? ""} />
        )}
      </FormField>
      <FormField
        label="What students will learn"
        description="One outcome per line."
        error={fieldErrors.outcomes}
        className="md:col-span-2"
      >
        {(c) => (
          <Textarea
            {...c}
            name="outcomes"
            rows={5}
            defaultValue={(course.outcomes ?? []).join("\n")}
          />
        )}
      </FormField>
      <FormField
        label="Pass mark (%)"
        required
        description="Final exam score needed for the certificate."
        error={fieldErrors.passPct}
      >
        {(c) => (
          <Input
            {...c}
            name="passPct"
            type="number"
            min={1}
            max={100}
            defaultValue={course.pass_pct}
          />
        )}
      </FormField>
      <div className="md:col-span-2">
        <Button type="submit" loading={pending}>
          Save details
        </Button>
      </div>
    </form>
  );
}

/** Publishing, pricing, access period and instructor — admins only (docs/07 §3). */
export function CourseAdminForm({
  course,
  instructors,
}: {
  course: Course;
  instructors: { id: string; full_name: string | null }[];
}) {
  const { pending, fieldErrors, run } = useBuilderAction();
  return (
    <form
      action={(form) =>
        run(() =>
          updateCourseAdmin({
            courseId: course.id,
            status: text(form, "status"),
            priceUsd: text(form, "priceUsd"),
            pricePkr: text(form, "pricePkr"),
            accessMonths: text(form, "accessMonths"),
            instructorId: text(form, "instructorId"),
          }),
        )
      }
      className="grid gap-5 md:grid-cols-2"
    >
      <FormField label="Status" required error={fieldErrors.status}>
        {(c) => (
          <NativeSelect {...c} name="status" defaultValue={course.status}>
            <option value="draft">Draft (hidden)</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </NativeSelect>
        )}
      </FormField>
      <FormField label="Instructor" error={fieldErrors.instructorId}>
        {(c) => (
          <NativeSelect {...c} name="instructorId" defaultValue={course.instructor_id ?? ""}>
            <option value="">Unassigned</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.full_name ?? "Unnamed"}
              </option>
            ))}
          </NativeSelect>
        )}
      </FormField>
      <FormField label="Price (USD)" required error={fieldErrors.priceUsd}>
        {(c) => (
          <Input
            {...c}
            name="priceUsd"
            type="number"
            min={0}
            step="0.01"
            defaultValue={course.price_usd}
          />
        )}
      </FormField>
      <FormField
        label="Price (PKR)"
        description="For bank transfer, JazzCash and Easypaisa."
        error={fieldErrors.pricePkr}
      >
        {(c) => (
          <Input
            {...c}
            name="pricePkr"
            type="number"
            min={0}
            step="1"
            defaultValue={course.price_pkr ?? ""}
          />
        )}
      </FormField>
      <FormField
        label="Access period (months)"
        description="Leave empty for lifetime access."
        error={fieldErrors.accessMonths}
      >
        {(c) => (
          <Input
            {...c}
            name="accessMonths"
            type="number"
            min={1}
            max={120}
            defaultValue={course.access_months ?? ""}
          />
        )}
      </FormField>
      <div className="md:col-span-2">
        <Button type="submit" loading={pending}>
          Save publishing and pricing
        </Button>
      </div>
    </form>
  );
}
