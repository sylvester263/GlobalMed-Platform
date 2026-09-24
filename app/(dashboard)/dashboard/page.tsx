import { redirect } from "next/navigation";

import { roleHome } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/session";

/** /dashboard sends everyone to their role's home (P3-3). */
export default async function DashboardIndex() {
  const session = await requireUser("/dashboard");
  redirect(roleHome(session.profile.role));
}
