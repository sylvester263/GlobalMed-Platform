import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | GlobalMed dashboard" },
  robots: { index: false, follow: false },
};

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
