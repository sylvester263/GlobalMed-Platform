import type { Metadata } from "next";

import { AccountsComingSoon } from "../_components/accounts-coming-soon";

export const metadata: Metadata = { title: "Log in", robots: { index: false, follow: false } };

export default function Page() {
  return <AccountsComingSoon heading="Log in to GlobalMed" />;
}
