import { Award, CalendarDays, Download, Info, PlayCircle } from "lucide-react";
import type { Metadata } from "next";

import { ClaimLine } from "@/components/motion/claim-line";
import { PathwayLine } from "@/components/motion/pathway-line";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ClaimProgress } from "@/components/ui/claim-progress";
import { cn } from "@/lib/utils";

import { DashboardFrame } from "../_components/frames";

export const metadata: Metadata = { title: "Screen: Student dashboard", robots: { index: false } };

const courses = [
  { title: "Medical Coding Foundations", done: 41, total: 64, expires: "Sep 2027" },
  { title: "Medical Billing Essentials", done: 42, total: 42, expires: "Lifetime" },
  { title: "CPC Exam Preparation", done: 3, total: 38, expires: "Mar 2027" },
];

export default function StudentScreen() {
  return (
    <DashboardFrame
      screen="Student dashboard (P1-6)"
      role="student"
      user={{ name: "Ayesha Khan", initials: "AK", label: "Student · sample" }}
    >
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl">Welcome back, Ayesha</h1>
          <p className="text-muted-foreground">You’re 64% through Medical Coding Foundations.</p>
        </div>

        {/* Continue learning — the primary action */}
        <section
          aria-labelledby="continue"
          className="grid gap-6 rounded-lg border bg-card p-6 md:grid-cols-[1fr_auto] md:items-center"
        >
          <div className="flex min-w-0 flex-col gap-3">
            <p
              id="continue"
              className="text-xs font-semibold tracking-[0.12em] text-teal-deep uppercase"
            >
              Continue learning
            </p>
            <h2 className="text-xl">Module 7 · Modifiers 25 and 59</h2>
            <p className="text-sm text-muted-foreground">
              Medical Coding Foundations · resume at 12:34
            </p>
            <ClaimProgress label="Medical Coding Foundations progress" value={41} max={64} />
          </div>
          <span className={cn(buttonVariants({ size: "lg" }), "md:self-center")}>
            <PlayCircle aria-hidden="true" /> Resume lesson
          </span>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <section aria-labelledby="my-courses" className="flex flex-col gap-4">
            <h2 id="my-courses" className="text-xl">
              My courses
            </h2>
            <ul className="divide-y rounded-lg border bg-card">
              {courses.map((c) => {
                const complete = c.done === c.total;
                return (
                  <li key={c.title} className="flex flex-col gap-3 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-sans text-base font-semibold">{c.title}</h3>
                      {complete ? (
                        <Badge variant="gold">Certified</Badge>
                      ) : (
                        <Badge variant="neutral">Access until {c.expires}</Badge>
                      )}
                    </div>
                    <ClaimProgress label={`${c.title} progress`} value={c.done} max={c.total} />
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="flex flex-col gap-6">
            <section
              aria-labelledby="sessions"
              className="flex flex-col gap-4 rounded-lg border bg-card p-5"
            >
              <h2 id="sessions" className="text-xl">
                Upcoming live sessions
              </h2>
              <ul className="flex flex-col gap-3">
                {[
                  ["Mon 29 Sep", "7:00 pm PKT", "Q&A: E/M levels"],
                  ["Thu 2 Oct", "7:00 pm PKT", "Mock exam review"],
                ].map(([day, time, title]) => (
                  <li key={title} className="flex items-start gap-3">
                    <CalendarDays aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-teal" />
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-muted-foreground">
                        {day} · {time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="certs"
              className="flex flex-col gap-4 rounded-lg border bg-card p-5"
            >
              <h2 id="certs" className="text-xl">
                Recent certificate
              </h2>
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-gold-soft text-gold-ink">
                  <Award aria-hidden="true" className="size-5" />
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-semibold">Medical Billing Essentials</p>
                  <p className="font-mono text-sm text-muted-foreground">ID 7F3A9C21B04D</p>
                </div>
              </div>
              <ClaimLine trigger="static" ticks={6} goldEnd />
              <span className={cn(buttonVariants({ variant: "secondary" }), "self-start")}>
                <Download aria-hidden="true" /> Download PDF
              </span>
            </section>

            <Alert variant="info">
              <Info aria-hidden="true" />
              <AlertTitle>New mock exam available</AlertTitle>
              <AlertDescription>
                CPC Exam Preparation now has a third timed mock exam.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <section
          aria-labelledby="pathway"
          className="flex flex-col gap-6 rounded-lg border bg-card p-6"
        >
          <h2 id="pathway" className="text-xl">
            Your certification pathway
          </h2>
          <PathwayLine
            stages={[
              { label: "Foundations" },
              { label: "Billing" },
              { label: "Coding" },
              { label: "Exam prep" },
              { label: "Certified" },
            ]}
            current={2}
          />
        </section>
      </div>
    </DashboardFrame>
  );
}
