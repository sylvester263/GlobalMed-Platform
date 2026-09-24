import { AreaShell } from "@/components/dashboard/area-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AreaShell area="admin">{children}</AreaShell>;
}
