import { CalendarDays, Clock, Users, Video } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand, PageHero, Section } from "@/components/marketing/sections";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { batches } from "@/content/school";
import { getCourse } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Upcoming Live Batches",
  description:
    "Join a live medical billing or coding batch with an instructor. See start dates, schedules in Pakistan time and seats available.",
  path: "/school/batches",
});

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeZone: "Asia/Karachi",
});

export default function BatchesPage() {
  return (
    <>
      <PageHero
        eyebrow="Upcoming batches"
        title="Learn live with an instructor and a cohort"
        intro="Batches combine the course videos with live online sessions for questions, practice and exam tips. Recordings of live sessions are added to your course."
        crumbs={[
          { name: "School", path: "/school" },
          { name: "Upcoming batches", path: "/school/batches" },
        ]}
      />
      <Section>
        <p className="text-sm text-muted-foreground">
          Schedule to be confirmed by GlobalMed. [CLIENT TO CONFIRM]
        </p>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch) => {
            const course = getCourse(batch.course);
            if (!course) return null;
            return (
              <li
                key={`${batch.course}-${batch.starts}`}
                className="flex flex-col gap-4 rounded-lg border bg-card p-6"
              >
                <Badge variant="secondary">{batch.mode}</Badge>
                <h2 className="text-xl">{course.title}</h2>
                <ul className="flex flex-col gap-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CalendarDays aria-hidden="true" className="size-4 text-teal" />
                    Starts {dateFormat.format(new Date(`${batch.starts}T12:00:00+05:00`))}
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock aria-hidden="true" className="size-4 text-teal" /> {batch.schedule}
                  </li>
                  <li className="flex items-center gap-2">
                    <Video aria-hidden="true" className="size-4 text-teal" /> Live on Zoom or Google
                    Meet
                  </li>
                  <li className="flex items-center gap-2">
                    <Users aria-hidden="true" className="size-4 text-teal" /> {batch.seats} seats
                  </li>
                </ul>
                <Link
                  href={`/school/courses/${course.slug}`}
                  className={buttonVariants({ variant: "secondary", className: "mt-auto" })}
                >
                  View course
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
      <CtaBand
        title="Can't make these dates?"
        body="Every course is also available self-paced, and new batches open regularly."
        href="/school/courses"
        label="Study at your own pace"
      />
    </>
  );
}
