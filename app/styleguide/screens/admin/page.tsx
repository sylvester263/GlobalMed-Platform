import { MessageSquare, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";

import { BarCompareChart, ChartCard, TrendChart } from "@/components/dashboard/charts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { StatBlock } from "@/components/ui/stat-block";

import { DashboardFrame } from "../_components/frames";
import { PendingOrders } from "./pending-orders";

export const metadata: Metadata = { title: "Screen: Admin overview", robots: { index: false } };

const revenue = [
  { label: "Apr", usd: 4200, pkr: 1300 },
  { label: "May", usd: 5100, pkr: 1650 },
  { label: "Jun", usd: 6300, pkr: 1900 },
  { label: "Jul", usd: 5900, pkr: 2400 },
  { label: "Aug", usd: 7800, pkr: 2750 },
  { label: "Sep", usd: 8600, pkr: 3100 },
];

const leadSources = [
  { label: "Audit form", leads: 34 },
  { label: "Chatbot", leads: 21 },
  { label: "WhatsApp", leads: 17 },
  { label: "Contact", leads: 9 },
  { label: "Landing pages", leads: 12 },
];

export default function AdminScreen() {
  return (
    <DashboardFrame
      screen="Admin overview (P1-6)"
      role="admin"
      user={{ name: "Sample Admin", initials: "SA", label: "Admin" }}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl">Overview</h1>
            <p className="text-muted-foreground">Last 30 days · sample data</p>
          </div>
          <Badge variant="neutral">Updated nightly at 02:00 UTC</Badge>
        </div>

        <section
          aria-label="Key figures"
          className="grid grid-cols-2 gap-8 rounded-lg border bg-card p-6 lg:grid-cols-4"
        >
          <StatBlock
            label="Revenue (USD)"
            value={8600}
            prefix="$"
            delta={{ value: 10.3, label: "% vs Aug" }}
          />
          <StatBlock label="New enrollments" value={47} delta={{ value: 12, label: "vs Aug" }} />
          <StatBlock
            label="Completion rate"
            value={61}
            suffix="%"
            delta={{ value: -2, label: "pts", goodWhen: "up" }}
          />
          <StatBlock label="New leads" value={93} delta={{ value: 18, label: "vs Aug" }} />
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <Alert variant="warning">
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>3 manual payments awaiting approval</AlertTitle>
            <AlertDescription>
              Students get access as soon as you approve their proof.
            </AlertDescription>
          </Alert>
          <Alert variant="info">
            <MessageSquare aria-hidden="true" />
            <AlertTitle>2 chat handoffs waiting</AlertTitle>
            <AlertDescription>Oldest waiting 14 minutes (web chat).</AlertDescription>
          </Alert>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard
            title="Revenue"
            description="USD card payments and PKR manual payments (in USD equivalent)"
          >
            <TrendChart
              data={revenue}
              series={[
                { key: "usd", label: "Card (USD)" },
                { key: "pkr", label: "Manual (PKR → USD)" },
              ]}
              caption="Monthly revenue by payment rail, April to September (sample data)"
            />
          </ChartCard>
          <ChartCard title="Lead sources" description="Last 30 days">
            <BarCompareChart
              data={leadSources}
              series={[{ key: "leads", label: "Leads" }]}
              caption="Leads by source, last 30 days (sample data)"
            />
          </ChartCard>
        </div>

        <section aria-labelledby="pending" className="flex flex-col gap-4">
          <h2 id="pending" className="text-xl">
            Manual payments awaiting approval
          </h2>
          <PendingOrders />
        </section>
      </div>
    </DashboardFrame>
  );
}
