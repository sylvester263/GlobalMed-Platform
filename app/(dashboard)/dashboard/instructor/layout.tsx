import { AreaShell } from "@/components/dashboard/area-shell";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return <AreaShell area="instructor">{children}</AreaShell>;
}
