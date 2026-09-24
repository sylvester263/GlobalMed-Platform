"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type ChoiceFieldProps = {
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
  /** Render a Checkbox, RadioGroupItem or Switch with these props spread on it. */
  children: (control: {
    "aria-labelledby": string;
    "aria-describedby"?: string;
  }) => React.ReactNode;
};

/**
 * Label for Base UI toggles. They render a `span[role=checkbox|radio|switch]`, which a
 * wrapping <label> makes clickable but does not name, so the text is also linked with
 * aria-labelledby. Use this for every checkbox, radio and switch.
 */
export function ChoiceField({
  label,
  description,
  disabled,
  className,
  children,
}: ChoiceFieldProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <label
      className={cn(
        "flex min-h-11 cursor-pointer items-start gap-3 py-1",
        disabled && "cursor-not-allowed opacity-70",
        className,
      )}
    >
      <span className="mt-0.5 flex">
        {children({ "aria-labelledby": labelId, "aria-describedby": descriptionId })}
      </span>
      <span className="flex flex-col">
        <span id={labelId}>{label}</span>
        {description && (
          <span id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
