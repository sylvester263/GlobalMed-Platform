import { Children, cloneElement, isValidElement } from "react";

import { cn } from "@/lib/utils";

type StaggerGroupProps = {
  children: React.ReactNode;
  className?: string;
  /** Use "ul"/"ol" with StaggerItem as="li" for list content. */
  as?: "div" | "ul" | "ol";
};

/**
 * Reveals StaggerItem children one after another as the group scrolls into view
 * (ADR-010). Each child's position offsets its scroll range, which reads as a 60ms-style
 * stagger. Pure CSS: see `.motion-reveal` in app/globals.css.
 */
export function StaggerGroup({ children, className, as: Component = "div" }: StaggerGroupProps) {
  let index = 0;
  return (
    <Component className={className}>
      {Children.map(children, (child) =>
        isValidElement<StaggerItemProps>(child) ? cloneElement(child, { index: index++ }) : child,
      )}
    </Component>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
  /** Set by StaggerGroup. */
  index?: number;
};

export function StaggerItem({
  children,
  className,
  as: Component = "div",
  index = 0,
}: StaggerItemProps) {
  return (
    <Component
      className={cn("motion-reveal", className)}
      style={{ "--reveal-index": Math.min(index, 8) } as React.CSSProperties}
    >
      {children}
    </Component>
  );
}
