"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { ClaimLine } from "@/components/motion/claim-line";
import { CountUp } from "@/components/motion/count-up";
import { LottiePlayer } from "@/components/motion/lottie-player";
import { MotionProvider } from "@/components/motion/motion-provider";
import { PageTransition } from "@/components/motion/page-transition";
import { PathwayLine } from "@/components/motion/pathway-line";
import { Reveal } from "@/components/motion/reveal";
import { SealStamp } from "@/components/motion/seal-stamp";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { Button } from "@/components/ui/button";
import { ChoiceField } from "@/components/ui/choice-field";
import { Switch } from "@/components/ui/switch";
import { motionAssets } from "@/lib/motion-assets";

const pathway = [
  { label: "Foundations", description: "Anatomy, terminology" },
  { label: "Billing", description: "Claims, payers, AR" },
  { label: "Coding", description: "ICD-10-CM, CPT, HCPCS" },
  { label: "Exam prep", description: "Timed mock exams" },
  { label: "Certified", description: "Verifiable certificate" },
];

function Demo({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4 rounded-lg border bg-card p-6">
      <div>
        <h3 id={id} className="text-lg">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{note}</p>
      </div>
      {children}
    </section>
  );
}

/** P1-9: every motion primitive, replayable, with a reduced-motion preview toggle. */
export function MotionLab() {
  const [reduced, setReduced] = useState(false);
  const [run, setRun] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-mint px-4 py-3">
        <ChoiceField label="Preview reduced motion" className="items-center font-semibold">
          {(a11y) => <Switch checked={reduced} onCheckedChange={setReduced} {...a11y} />}
        </ChoiceField>
        <Button variant="secondary" size="sm" onClick={() => setRun((n) => n + 1)}>
          <RotateCcw aria-hidden="true" />
          Replay all
        </Button>
      </div>

      <MotionProvider reducedMotion={reduced ? "always" : "user"}>
        <div key={`${run}-${reduced}`} className="grid gap-6 lg:grid-cols-2">
          <Demo
            id="m-claim"
            title="ClaimLine"
            note="Brand signature. Draws left-to-right, ticks light in sequence (MG-1, DM-3). Reduced: final state."
          >
            <ClaimLine trigger="mount" ticks={9} />
            <ClaimLine trigger="mount" ticks={6} filled={4} delay={0.2} />
            <ClaimLine trigger="mount" ticks={5} goldEnd delay={0.4} />
          </Demo>

          <Demo
            id="m-count"
            title="CountUp"
            note="Counts once when visible (MG-4, DM-7). Width reserved; screen readers get the final value."
          >
            <p className="font-serif text-4xl font-semibold">
              <CountUp value={98.4} decimals={1} suffix="%" />
            </p>
            <p className="font-serif text-4xl font-semibold">
              <CountUp value={125000} suffix="+" />
            </p>
            <p className="text-xs text-muted-foreground">Illustrative figures</p>
          </Demo>

          <Demo
            id="m-reveal"
            title="Reveal + StaggerGroup"
            note="Pure CSS scroll-driven fade-up (ADR-010): visible without JavaScript, scrubs with scroll where supported, children offset in sequence. Reduced motion or unsupported browser: static."
          >
            <Reveal className="rounded-md border bg-ledger p-4">
              A section that reveals once.
            </Reveal>
            <StaggerGroup as="ul" className="grid grid-cols-3 gap-2">
              {["Watch", "Practice", "Mock exam", "Certificate", "Rewatch", "Verify"].map((t) => (
                <StaggerItem
                  key={t}
                  as="li"
                  className="rounded-md border bg-ledger px-3 py-2 text-sm"
                >
                  {t}
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Demo>

          <Demo
            id="m-seal"
            title="SealStamp"
            note="Certificate seal stamps in with a snappy spring (MG-15, DM-6). Status is also in text."
          >
            <div className="flex gap-10">
              <SealStamp status="valid" />
              <SealStamp status="revoked" />
            </div>
          </Demo>

          <Demo
            id="m-pathway"
            title="PathwayLine"
            note="Certification pathway (MG-9). Current stage glows; vertical on mobile."
          >
            <PathwayLine stages={pathway} current={2} />
          </Demo>

          <Demo
            id="m-page"
            title="PageTransition"
            note="Client navigations fade in with an 8px rise (MG-16). The first page load never animates."
          >
            <PageTransition>
              <div className="rounded-md border bg-ledger p-6">
                <p className="font-serif text-xl font-semibold">Page content</p>
                <p className="text-sm text-muted-foreground">
                  Press “Replay all” to see the enter transition.
                </p>
              </div>
            </PageTransition>
          </Demo>

          <Demo
            id="m-lottie"
            title="LottiePlayer"
            note="Lazy dotLottie with poster, off-screen pause and a pause control. Hero asset (MG-2) is not delivered yet, so the poster shows."
          >
            <LottiePlayer
              src={motionAssets.heroClaimForm}
              poster="/motion/posters/hero-claim-form.svg"
              alt="A claim form fills itself in: codes appear, a denial flag turns green, and the status changes to Paid."
              width={480}
              height={320}
              className="w-full max-w-md rounded-md border bg-ledger"
            />
          </Demo>
        </div>
      </MotionProvider>
    </div>
  );
}
