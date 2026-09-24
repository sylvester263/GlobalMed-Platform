import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Fades content up 24px as it scrolls into view (ADR-010). Pure CSS scroll-driven
 * animation: the content is visible in the server HTML, needs no JavaScript, and only
 * animates in browsers that support `animation-timeline` with motion allowed.
 * Styles: `.motion-reveal` in app/globals.css.
 */
export function Reveal({ children, className }: RevealProps) {
  return <div className={cn("motion-reveal", className)}>{children}</div>;
}
