import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cpcCourseSlug } from "@/content/home";

const ctas = [
  {
    href: `/school/courses/${cpcCourseSlug}`,
    label: "Enroll in CPC Training",
    variant: "default" as const,
  },
  { href: "/contact", label: "Book Free Career Counselling", variant: "secondary" as const },
];

/**
 * MG-1 frame 7: after the claim line lands, the two paths settle with a 4px lift
 * (`.cta-settle` in globals.css, ADR-015). Rendered and clickable from the first paint;
 * only a transform animates.
 */
export function HeroCtas() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        {ctas.map((cta, i) => (
          <Link
            key={cta.href}
            href={cta.href}
            style={{ "--i": i } as React.CSSProperties}
            className={buttonVariants({
              size: "lg",
              variant: cta.variant,
              className: "cta-settle",
            })}
          >
            {cta.label}
            {i === 0 && <ArrowRight aria-hidden="true" />}
          </Link>
        ))}
      </div>
      <Link
        href="#services"
        className="self-start text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover"
      >
        Looking for medical billing services for your practice?
      </Link>
    </div>
  );
}
