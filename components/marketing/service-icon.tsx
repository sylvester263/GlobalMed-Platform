import {
  AudioLines,
  FileCode2,
  type LucideIcon,
  Receipt,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "medical-billing": Receipt,
  "medical-coding": FileCode2,
  "medical-transcription": AudioLines,
  "ai-clinical-documentation": Sparkles,
  "revenue-cycle-management": RefreshCcw,
  "denial-management": ShieldCheck,
};

export function ServiceIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = icons[slug] ?? Receipt;
  return <Icon aria-hidden="true" className={className} />;
}
