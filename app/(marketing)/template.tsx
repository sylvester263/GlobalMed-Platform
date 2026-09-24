import { PageTransition } from "@/components/motion/page-transition";

/** MG-16: templates remount on navigation, so each client navigation fades in. */
export default function MarketingTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
