import { AreaShell } from "@/components/dashboard/area-shell";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <AreaShell area="student">{children}</AreaShell>;
}
