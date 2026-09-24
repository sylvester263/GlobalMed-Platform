import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TestimonialProps = {
  quote: string;
  name: string;
  role: string;
  audience: "practice" | "student";
  className?: string;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Testimonial with consent-approved text only (pm/CLIENT_INPUTS_NEEDED.md). */
export function Testimonial({ quote, name, role, audience, className }: TestimonialProps) {
  return (
    <figure className={cn("flex flex-col gap-5 rounded-lg border bg-card p-6", className)}>
      <Badge variant={audience === "practice" ? "secondary" : "gold"}>
        {audience === "practice" ? "Practice client" : "Student"}
      </Badge>
      <blockquote className="font-serif text-lg leading-relaxed">
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-mint font-semibold text-teal-deep">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
