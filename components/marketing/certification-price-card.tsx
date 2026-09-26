import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { formatUsdPrice, getAapcCourses } from "@/data/courses";
import { cn } from "@/lib/utils";

const shortNames: Record<string, string> = {
  cpc: "CPC®",
  cpb: "CPB®",
  "cpc-cpb": "CPC® + CPB® Dual",
};

/**
 * AAPC course prices (footer). Confirmed by the client on 2026-09-26:
 * CPC® USD 1,050 · CPB® USD 1,050 · CPC® + CPB® Dual USD 1,600 (save USD 500).
 */
export function CertificationPriceCard({
  href,
  cta = "Register Now",
  onDark = false,
  className,
}: {
  href: string;
  cta?: string;
  onDark?: boolean;
  className?: string;
}) {
  const courses = getAapcCourses();
  const cpc = courses.find((c) => c.slug === "cpc");
  const cpb = courses.find((c) => c.slug === "cpb");
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg p-5",
        onDark ? "bg-white/10 ring-1 ring-sky/60" : "border-2 border-primary bg-card shadow-sm",
        className,
      )}
    >
      <BadgeCheck aria-hidden="true" className="size-7 text-sky" />
      <ul className="flex flex-col gap-3">
        {courses.map((course) => {
          const saving =
            course.bestValue && cpc && cpb ? cpc.priceUsd + cpb.priceUsd - course.priceUsd : 0;
          return (
            <li key={course.slug} className="flex flex-col">
              <span
                className={cn("text-sm font-semibold", onDark ? "text-white" : "text-foreground")}
              >
                {shortNames[course.slug] ?? course.credential}
              </span>
              <span
                className={cn(
                  "font-serif text-xl font-semibold tracking-tight whitespace-nowrap",
                  onDark ? "text-white" : "text-primary",
                )}
              >
                {formatUsdPrice(course.priceUsd)}
              </span>
              {saving > 0 && (
                <span className={cn("text-xs", onDark ? "text-sky" : "text-success-ink")}>
                  Save {formatUsdPrice(saving)}
                </span>
              )}
            </li>
          );
        })}
      </ul>
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
