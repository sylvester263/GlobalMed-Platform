import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/** MASTER.md §5 — sizes 32 / 40 / 48px, radius 6px, verbs for labels. */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-transparent font-semibold whitespace-nowrap transition-colors duration-(--duration-instant) ease-(--ease-standard) select-none disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "border-input bg-card text-foreground hover:bg-mint",
        outline: "border-input bg-card text-foreground hover:bg-mint",
        ghost: "text-foreground hover:bg-mint aria-expanded:bg-mint",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        link: "h-auto! px-0! text-primary underline underline-offset-4 hover:text-primary-hover",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
        // shadcn internals (pagination, dialogs) reference these names.
        xs: "h-7 px-2 text-xs",
        "icon-xs": "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Shows a spinner, keeps the width, disables the button and sets aria-busy. */
    loading?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner aria-hidden="true" role={undefined} aria-label={undefined} />}
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
