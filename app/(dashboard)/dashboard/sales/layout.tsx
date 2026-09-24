import { AreaShell } from "@/components/dashboard/area-shell";

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return <AreaShell area="sales">{children}</AreaShell>;
}
