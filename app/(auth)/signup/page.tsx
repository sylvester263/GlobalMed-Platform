import type { Metadata } from "next";

import { AccountsComingSoon } from "../_components/accounts-coming-soon";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AccountsComingSoon heading="Create your student account" />;
}
