import { ArrowRight, Download, Info, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CertificatePreview } from "@/components/lms/certificate-preview";
import { VideoPlayerShell } from "@/components/lms/video-player-shell";
import { PricingBlock } from "@/components/marketing/pricing-block";
import { Testimonial } from "@/components/marketing/testimonial";
import { ClaimLine } from "@/components/motion/claim-line";
import { PathwayLine } from "@/components/motion/pathway-line";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import { ClaimProgress } from "@/components/ui/claim-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { StatBlock } from "@/components/ui/stat-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ButtonStates,
  ChartDemos,
  FormDemo,
  OverlayDemos,
  QuizDemo,
  SelectionControls,
  TableDemo,
} from "./_components/interactive-demos";
import { MotionLab } from "./_components/motion-lab";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "ink", hex: "#0F2A3D", use: "Text, headings, footer", swatch: "bg-ink", light: false },
  { name: "teal", hex: "#0E7C7B", use: "Actions, links, focus", swatch: "bg-teal", light: false },
  {
    name: "teal-deep",
    hex: "#0A5857",
    use: "Teal text on mint",
    swatch: "bg-teal-deep",
    light: false,
  },
  { name: "mint", hex: "#E6F4F1", use: "Bands, highlights", swatch: "bg-mint", light: true },
  { name: "ledger", hex: "#F7F8F6", use: "Page background", swatch: "bg-ledger", light: true },
  {
    name: "gold",
    hex: "#C8962E",
    use: "Decorative achievement only",
    swatch: "bg-gold",
    light: true,
  },
  { name: "gold-ink", hex: "#8A6414", use: "Gold text", swatch: "bg-gold-ink", light: false },
  { name: "alert", hex: "#B42318", use: "Errors, destructive", swatch: "bg-alert", light: false },
  { name: "success", hex: "#1D7A43", use: "Success states", swatch: "bg-success", light: false },
  {
    name: "warning",
    hex: "#A15C07",
    use: "Pending, timer amber",
    swatch: "bg-warning",
    light: false,
  },
  {
    name: "input",
    hex: "#7A8A88",
    use: "Control borders (≥ 3:1)",
    swatch: "bg-input",
    light: false,
  },
  { name: "border", hex: "#D9E0DC", use: "Decorative dividers", swatch: "bg-border", light: true },
];

const typeScale = [
  { token: "text-4xl", size: "49px", sample: "Cleaner claims, faster payments", serif: true },
  { token: "text-3xl", size: "39px", sample: "Start your coding career", serif: true },
  { token: "text-2xl", size: "31px", sample: "How we work", serif: true },
  { token: "text-xl", size: "25px", sample: "Denial management", serif: true },
  {
    token: "text-lg",
    size: "20px",
    sample: "Lead paragraph for sections and course intros.",
    serif: false,
  },
  {
    token: "text-base",
    size: "16px",
    sample: "Body copy at 1.6 line height, at most 75 characters per line.",
    serif: false,
  },
  { token: "text-sm", size: "14px", sample: "Labels, table cells and helper text.", serif: false },
  { token: "text-xs", size: "12px", sample: "Legal text and captions only.", serif: false },
];

const nav = [
  ["colors", "Colors"],
  ["type", "Typography"],
  ["claim-line", "Claim line"],
  ["buttons", "Buttons"],
  ["forms", "Forms"],
  ["status", "Status & feedback"],
  ["overlays", "Overlays"],
  ["navigation", "Navigation"],
  ["data", "Data"],
  ["lms", "Learning"],
  ["marketing", "Marketing"],
  ["motion", "Motion"],
  ["screens", "Key screens"],
] as const;

const screens = [
  [
    "/styleguide/screens/home",
    "Home",
    "Both paths above the fold, trust strip, services, how we work, school, pathway, FAQ",
  ],
  [
    "/styleguide/screens/course",
    "Course detail",
    "Outcomes, curriculum with previews, instructor, certificate sample, sticky enroll",
  ],
  [
    "/styleguide/screens/student",
    "Student dashboard",
    "Continue learning, course progress, sessions, certificate, pathway",
  ],
  [
    "/styleguide/screens/admin",
    "Admin overview",
    "KPIs, alerts, revenue and lead charts, manual payment approvals",
  ],
] as const;

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-8 flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 id={`${id}-title`} className="text-3xl">
          {title}
        </h2>
        {description && <p className="max-w-prose text-muted-foreground">{description}</p>}
        <ClaimLine ticks={12} filled={1} trigger="static" className="max-w-xs" />
      </div>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="mx-auto flex max-w-300 flex-col gap-20 px-4 py-12 md:px-6 md:py-16">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-semibold tracking-[0.12em] text-teal-deep uppercase">
          Design system · v1.0 · pending client sign-off
        </p>
        <h1 className="text-3xl md:text-4xl">GlobalMed styleguide</h1>
        <p className="max-w-prose text-lg text-muted-foreground">
          Every token and component from design-system/MASTER.md, with its states. All names and
          figures on this page are fictional samples.
        </p>
        <nav aria-label="Styleguide sections">
          <ul className="flex flex-wrap gap-2">
            {nav.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-flex rounded-full border px-3 py-1 text-sm hover:bg-mint"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <Section
        id="colors"
        title="Colors"
        description="Contrast ratios for every allowed pairing are listed in MASTER.md §1.3."
      >
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {colors.map((c) => (
            <li key={c.name} className="overflow-hidden rounded-lg border bg-card">
              <div className={`${c.swatch} h-20 ${c.light ? "border-b" : ""}`} />
              <div className="p-3">
                <p className="font-semibold">{c.name}</p>
                <p className="font-mono text-sm text-muted-foreground">{c.hex}</p>
                <p className="text-sm text-muted-foreground">{c.use}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="type"
        title="Typography"
        description="Source Serif 4 for headings and figures, Public Sans for UI and body, JetBrains Mono for codes and IDs."
      >
        <div className="divide-y rounded-lg border bg-card">
          {typeScale.map((t) => (
            <div
              key={t.token}
              className="grid gap-2 p-4 md:grid-cols-[140px_1fr] md:items-baseline"
            >
              <p className="font-mono text-sm text-muted-foreground">
                {t.token} · {t.size}
              </p>
              <p
                className={`${t.token} ${t.serif ? "font-serif font-semibold tracking-tight" : ""}`}
              >
                {t.sample}
              </p>
            </div>
          ))}
          <div className="grid gap-2 p-4 md:grid-cols-[140px_1fr] md:items-baseline">
            <p className="font-mono text-sm text-muted-foreground">font-mono</p>
            <p className="font-mono">99213 · E11.9 · CERT-7F3A9C21B04D</p>
          </div>
        </div>
      </Section>

      <Section
        id="claim-line"
        title="Claim line"
        description="The signature motif: a ledger rule with tick marks. Used for dividers, progress, pathways and the certificate underline."
      >
        <div className="flex flex-col gap-6 rounded-lg border bg-card p-6">
          <ClaimLine trigger="static" ticks={12} />
          <ClaimLine trigger="static" ticks={12} filled={7} />
          <ClaimLine trigger="static" ticks={8} goldEnd />
        </div>
      </Section>

      <Section id="buttons" title="Buttons" description="Tab through to see the focus ring.">
        <div className="flex flex-col gap-6 rounded-lg border bg-card p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">
              Large <ArrowRight aria-hidden="true" />
            </Button>
            <Button size="icon" variant="secondary" aria-label="Download certificate">
              <Download aria-hidden="true" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Disabled</Button>
            <Button loading>Saving</Button>
            <ButtonStates />
            <Link href="/education" className={buttonVariants({ variant: "secondary" })}>
              Link styled as button
            </Link>
          </div>
        </div>
      </Section>

      <Section
        id="forms"
        title="Forms"
        description="Visible labels, helper text and errors below the field, the patient-data notice on every public form."
      >
        <div className="flex flex-col gap-10 rounded-lg border bg-card p-6">
          <FormDemo />
          <SelectionControls />
        </div>
      </Section>

      <Section id="status" title="Status & feedback">
        <div className="flex flex-wrap gap-2">
          <Badge>Published</Badge>
          <Badge variant="secondary">New</Badge>
          <Badge variant="neutral">Draft</Badge>
          <Badge variant="success">Paid</Badge>
          <Badge variant="warning">Awaiting verification</Badge>
          <Badge variant="destructive">Denied</Badge>
          <Badge variant="gold">Certified</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Alert variant="info">
            <Info aria-hidden="true" />
            <AlertTitle>Your next batch starts 6 October</AlertTitle>
            <AlertDescription>Live sessions run Mondays and Thursdays at 7pm PKT.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Payment received</AlertTitle>
            <AlertDescription>Your course is unlocked. A receipt is on its way.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>Payment proof under review</AlertTitle>
            <AlertDescription>We verify bank transfers within one business day.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>We couldn’t send your request</AlertTitle>
            <AlertDescription>Check your connection and try again.</AlertDescription>
          </Alert>
        </div>
        <div
          role="status"
          aria-label="Loading example"
          className="flex items-center gap-4 rounded-lg border bg-card p-6"
        >
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </Section>

      <Section
        id="overlays"
        title="Overlays"
        description="Dialog, sheet, dropdown, tooltip and toasts."
      >
        <OverlayDemos />
      </Section>

      <Section id="navigation" title="Navigation">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/education">Education</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/education/courses">Courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Medical Coding Foundations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Tabs defaultValue="overview" className="rounded-lg border bg-card p-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4">
            What you will learn and who the course is for.
          </TabsContent>
          <TabsContent value="curriculum" className="pt-4">
            12 modules, 64 lessons, 3 mock exams.
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
            Student reviews appear here.
          </TabsContent>
        </Tabs>
        <Accordion className="rounded-lg border bg-card px-6">
          <AccordionItem value="access">
            <AccordionTrigger>How long do I keep access to a course?</AccordionTrigger>
            <AccordionContent>
              Each course lists its access period. You can rewatch any lesson as often as you like
              during that time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="phi">
            <AccordionTrigger>Can I send patient files through this website?</AccordionTrigger>
            <AccordionContent>
              No. This website never handles patient information. Clients exchange files through
              GlobalMed’s existing secure systems.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-mint font-semibold text-teal-deep">AK</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-gold-soft font-semibold text-gold-ink">SR</AvatarFallback>
          </Avatar>
        </div>
      </Section>

      <Section
        id="data"
        title="Data"
        description="Stat blocks, the TanStack data table, and chart wrappers with screen-reader tables."
      >
        <div className="grid gap-8 rounded-lg border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatBlock label="Clean-claim rate" value={98.4} decimals={1} suffix="%" illustrative />
          <StatBlock label="Claims processed" value={125000} suffix="+" illustrative />
          <StatBlock
            label="Enrollments this month"
            value={47}
            delta={{ value: 12, label: "vs last month" }}
          />
          <StatBlock
            label="Denial rate"
            value={4.1}
            decimals={1}
            suffix="%"
            delta={{ value: -1.3, label: "pts", goodWhen: "down" }}
          />
        </div>
        <TableDemo />
        <ChartDemos />
      </Section>

      <Section
        id="lms"
        title="Learning"
        description="Progress, pathway, player shell, quiz feedback and the certificate."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6 rounded-lg border bg-card p-6">
            <ClaimProgress label="Medical Coding Foundations progress" value={7} max={12} />
            <ClaimProgress label="Completed course progress" value={12} max={12} />
            <ClaimProgress label="Long course progress" value={41} max={64} />
          </div>
          <VideoPlayerShell title="Lesson 4 · Reading an EOB" state="ready" resumeAt={754} />
          <VideoPlayerShell title="Lesson 5 · Modifiers 25 and 59" state="processing" />
          <VideoPlayerShell title="Lesson 6 · Appeals" state="locked" />
        </div>
        <div className="rounded-lg border bg-card p-6">
          <PathwayLine
            stages={[
              { label: "Foundations" },
              { label: "Billing" },
              { label: "Coding" },
              { label: "Exam prep" },
              { label: "Certified" },
            ]}
            current={5}
          />
        </div>
        <QuizDemo />
        <CertificatePreview
          nameOnCertificate="Ayesha Khan"
          courseTitle="Medical Coding Foundations"
          issuedAt={new Date("2026-09-24")}
          code="7F3A9C21B04D"
        />
      </Section>

      <Section id="marketing" title="Marketing">
        <div className="grid gap-6 md:grid-cols-2">
          <PricingBlock
            title="Medical Coding Foundations"
            priceUsd={299}
            pricePkr={45000}
            accessMonths={12}
            highlight="Most popular"
            includes={[
              "64 video lessons you can rewatch",
              "3 timed mock exams",
              "Verifiable certificate",
            ]}
            action={
              <Link href="/education" className={buttonVariants({ size: "lg" })}>
                Enroll now
              </Link>
            }
          />
          <div className="flex flex-col gap-6">
            <Testimonial
              audience="practice"
              quote="Our denial rate dropped within the first quarter, and we finally know where every claim stands."
              name="Sample Practice Manager"
              role="Office manager, family practice"
            />
            <Testimonial
              audience="student"
              quote="The mock exams felt like the real thing. I knew exactly what to review."
              name="Sample Student"
              role="Medical coder, Lahore"
            />
          </div>
        </div>
      </Section>

      <Section
        id="motion"
        title="Motion"
        description="Primitives from components/motion using lib/motion.ts tokens. Toggle reduced motion to review each fallback."
      >
        <MotionLab />
      </Section>

      <Section
        id="screens"
        title="Key screens"
        description="P1-6: four screens built from these components with sample data, for client design sign-off (P1-7)."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {screens.map(([href, title, body]) => (
            <li key={href}>
              <Link
                href={href}
                className="flex h-full flex-col gap-2 rounded-lg border bg-card p-6 hover:border-teal"
              >
                <span className="flex items-center gap-2 font-serif text-xl font-semibold">
                  {title} <ArrowRight aria-hidden="true" className="size-4 text-teal" />
                </span>
                <span className="text-muted-foreground">{body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <footer className="border-t pt-6 text-sm text-muted-foreground">
        Designed &amp; developed by SylJo Tech
      </footer>
    </div>
  );
}
