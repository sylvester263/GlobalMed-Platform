import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { certificationPrice } from "@/content/aapc";
import { cn } from "@/lib/utils";

/** "CPC® and CPB® Certification: USD 1,050" (footer and AAPC Certification page). */
export function CertificationPriceCard({
  href,
  cta = "Enroll Now",
  onDark = false,
  headingLevel = "h3",
  className,
}: {
  href: string;
  cta?: string;
  onDark?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg p-5",
        onDark ? "bg-white/10 ring-1 ring-sky/60" : "border-2 border-primary bg-card shadow-sm",
        className,
      )}
    >
      <BadgeCheck aria-hidden="true" className="size-7 text-sky" />
      <Heading
        className={cn(
          "font-sans text-base leading-snug font-semibold",
          onDark ? "text-white" : "text-foreground",
        )}
      >
        {certificationPrice.label}
      </Heading>
      <p
        className={cn(
          "font-serif text-2xl font-semibold tracking-tight whitespace-nowrap",
          onDark ? "text-white" : "text-primary",
        )}
      >
        {certificationPrice.amount}
      </p>
      <p className={cn("text-xs", onDark ? "text-white/75" : "text-muted-foreground")}>
        {certificationPrice.note}
      </p>
      <Link
        href={href}
        className={cn(
          buttonVariants({ size: "lg" }),
          onDark && "bg-sky text-ink hover:bg-white",
          "self-start",
        )}
      >
        {cta} <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  );
}
