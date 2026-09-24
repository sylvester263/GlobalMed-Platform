import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type PathwayStage = { label: string; description?: string };

type PathwayLineProps = {
  stages: PathwayStage[];
  /** Index of the stage the learner is on. `stages.length` means everything is complete. */
  current?: number;
  className?: string;
};

/**
 * Certification pathway (MG-9, docs/15 §3): the claim line connects stages, completed
 * stages fill teal, the current stage glows, and the final stage turns gold when reached.
 * Horizontal from `md`, vertical on mobile. Zero JS (ADR-015): the connector and nodes
 * animate with a CSS scroll-driven timeline where supported (`.pathway` in globals.css);
 * elsewhere, and for reduced motion, the final state shows. Meaning is carried by text
 * and aria-current, never by the animation.
 */
export function PathwayLine({ stages, current = 0, className }: PathwayLineProps) {
  const last = stages.length - 1;
  const progress = last <= 0 ? 0 : Math.min(current, last) / last;

  return (
    <ol
      // Equal columns so nodes sit at even intervals along the connector.
      style={
        {
          "--pathway-cols": `repeat(${stages.length}, minmax(0, 1fr))`,
          "--progress": progress,
        } as React.CSSProperties
      }
      className={cn(
        "pathway relative grid gap-8 md:grid-cols-(--pathway-cols) md:gap-4",
        className,
      )}
    >
      {/* Connector: vertical below md, horizontal from md. Only transform animates. */}
      <span aria-hidden="true" className="absolute top-4 bottom-4 left-4 w-px bg-tick md:hidden">
        <span className="pathway-fill-y absolute inset-0 origin-top bg-teal" />
      </span>
      <span
        aria-hidden="true"
        className="absolute top-4 hidden h-px bg-tick md:block"
        style={{
          left: `calc(100% / ${stages.length * 2})`,
          right: `calc(100% / ${stages.length * 2})`,
        }}
      >
        <span className="pathway-fill-x absolute inset-0 origin-left bg-teal" />
      </span>

      {stages.map((stage, i) => {
        const done = i < current;
        const isCurrent = i === current;
        const isFinal = i === last;
        return (
          <li
            key={stage.label}
            aria-current={isCurrent ? "step" : undefined}
            className="relative flex gap-4 md:flex-col md:items-center md:text-center"
          >
            <span
              aria-hidden="true"
              style={{ "--pos": last <= 0 ? 0 : i / last } as React.CSSProperties}
              className={cn(
                "pathway-node relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                done && !isFinal && "border-teal bg-teal text-primary-foreground",
                done && isFinal && "border-gold bg-gold text-ink",
                isCurrent && "border-teal bg-card ring-4 ring-teal/25",
                !done && !isCurrent && "border-tick bg-card",
              )}
            >
              {done ? (
                <Check className="size-4" strokeWidth={2.5} />
              ) : (
                <span className={cn("size-2 rounded-full", isCurrent ? "bg-teal" : "bg-tick")} />
              )}
            </span>
            <div className="pt-1 md:pt-0">
              <p className="font-serif text-lg font-semibold">{stage.label}</p>
              {stage.description && (
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              )}
              <p className="sr-only">
                {done ? "Completed" : isCurrent ? "Current stage" : "Not started"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
