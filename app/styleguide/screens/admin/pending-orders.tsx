"use client";

import { DataTable, dataTableColumns } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PendingOrder = {
  student: string;
  course: string;
  amount: string;
  method: string;
  submitted: string;
};

const orders: PendingOrder[] = [
  {
    student: "Sample Student A",
    course: "Medical Coding Foundations",
    amount: "PKR 45,000",
    method: "Bank transfer",
    submitted: "2026-09-23",
  },
  {
    student: "Sample Student B",
    course: "CPC Exam Preparation",
    amount: "PKR 52,000",
    method: "JazzCash",
    submitted: "2026-09-23",
  },
  {
    student: "Sample Student C",
    course: "Medical Billing Essentials",
    amount: "PKR 30,000",
    method: "Easypaisa",
    submitted: "2026-09-22",
  },
];

const col = dataTableColumns<PendingOrder>();
const columns = col.columns([
  col.accessor("student", { header: "Student" }),
  col.accessor("course", { header: "Course" }),
  col.accessor("amount", {
    header: "Amount",
    cell: (info) => <span className="tabular-nums">{info.getValue()}</span>,
  }),
  col.accessor("method", {
    header: "Method",
    cell: (info) => <Badge variant="warning">{info.getValue()}</Badge>,
  }),
  col.accessor("submitted", {
    header: "Submitted",
    cell: (info) => <span className="font-mono text-sm">{info.getValue()}</span>,
  }),
  col.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: () => (
      <Button size="sm" variant="secondary">
        Review proof
      </Button>
    ),
  }),
]);

export function PendingOrders() {
  return <DataTable columns={columns} data={orders} caption="Manual payments awaiting approval" />;
}
