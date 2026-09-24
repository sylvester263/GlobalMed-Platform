"use client";

import { ChevronDown, FileText, Inbox, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BarCompareChart, ChartCard, TrendChart } from "@/components/dashboard/charts";
import { DataTable, dataTableColumns } from "@/components/dashboard/data-table";
import { QuizQuestion, type QuizFeedback } from "@/components/lms/quiz-question";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceField } from "@/components/ui/choice-field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PhiNotice } from "@/components/ui/phi-notice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// All data on this page is fictional sample data. No real people or patients.

export function ButtonStates() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      loading={loading}
      onClick={() => {
        setLoading(true);
        window.setTimeout(() => setLoading(false), 1500);
      }}
    >
      {loading ? "Sending…" : "Click to see loading"}
    </Button>
  );
}

export function FormDemo() {
  const [specialty, setSpecialty] = useState<string | null>(null);
  return (
    <form className="grid gap-6 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
      <FormField label="Practice name" required description="As it appears on your claims.">
        {(control) => <Input {...control} placeholder="Riverside Family Medicine" />}
      </FormField>
      <FormField
        label="Work email"
        required
        error="Enter an email address in the format name@practice.com."
      >
        {(control) => <Input {...control} type="email" defaultValue="office@riverside" />}
      </FormField>
      <FormField label="Specialty">
        {(control) => (
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger
              id={control.id}
              aria-describedby={control["aria-describedby"]}
              className="w-full"
            >
              <SelectValue placeholder="Choose a specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
              <SelectItem value="family">Family medicine</SelectItem>
            </SelectContent>
          </Select>
        )}
      </FormField>
      <FormField label="Monthly claim volume" description="Disabled example.">
        {(control) => <Input {...control} disabled defaultValue="1,000–2,500" />}
      </FormField>
      <FormField
        label="What do you need help with?"
        className="md:col-span-2"
        description="Business details only."
      >
        {(control) => <Textarea {...control} placeholder="Denials from one payer are rising…" />}
      </FormField>
      <PhiNotice className="md:col-span-2" />
      <div className="md:col-span-2">
        <Button type="submit" size="lg">
          Book your free billing audit
        </Button>
      </div>
    </form>
  );
}

export function SelectionControls() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <fieldset className="flex flex-col gap-1">
        <legend className="mb-2 text-sm font-semibold">Checkbox</legend>
        <ChoiceField label="Email me course updates">
          {(a11y) => <Checkbox defaultChecked {...a11y} />}
        </ChoiceField>
        <ChoiceField label="Unchecked" description="With helper text.">
          {(a11y) => <Checkbox {...a11y} />}
        </ChoiceField>
        <ChoiceField label="Disabled" disabled>
          {(a11y) => <Checkbox disabled {...a11y} />}
        </ChoiceField>
      </fieldset>
      <fieldset className="flex flex-col gap-1">
        <legend className="mb-2 text-sm font-semibold">Payment method</legend>
        <RadioGroup defaultValue="usd" className="gap-1">
          <ChoiceField label="Card in USD">
            {(a11y) => <RadioGroupItem value="usd" {...a11y} />}
          </ChoiceField>
          <ChoiceField label="Bank transfer in PKR">
            {(a11y) => <RadioGroupItem value="pkr" {...a11y} />}
          </ChoiceField>
        </RadioGroup>
      </fieldset>
      <fieldset className="flex flex-col gap-1">
        <legend className="mb-2 text-sm font-semibold">Switch</legend>
        <ChoiceField label="Captions on">
          {(a11y) => <Switch defaultChecked {...a11y} />}
        </ChoiceField>
        <ChoiceField label="Autoplay next lesson">{(a11y) => <Switch {...a11y} />}</ChoiceField>
      </fieldset>
    </div>
  );
}

export function OverlayDemos() {
  return (
    <div className="flex flex-wrap gap-3">
      <Dialog>
        <DialogTrigger render={<Button variant="secondary" />}>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke this certificate?</DialogTitle>
            <DialogDescription>
              The verification page will show it as revoked. You can reissue it later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive">Revoke certificate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet>
        <SheetTrigger render={<Button variant="secondary" />}>Open sheet</SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Mobile navigation uses this sheet.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary" />}>
          Account <ChevronDown aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <User aria-hidden="true" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings aria-hidden="true" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut aria-hidden="true" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Lesson notes" />}>
          <FileText aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>Lesson notes</TooltipContent>
      </Tooltip>

      <Button variant="secondary" onClick={() => toast.success("Lesson marked complete.")}>
        Success toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.error("Payment proof upload failed.", {
            description: "Files must be JPG, PNG or PDF under 5 MB.",
          })
        }
      >
        Error toast
      </Button>
    </div>
  );
}

type SampleLead = {
  practice: string;
  specialty: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "won";
  received: string;
};

const leads: SampleLead[] = [
  {
    practice: "Riverside Family Medicine",
    specialty: "Family medicine",
    source: "Audit form",
    status: "new",
    received: "2026-09-22",
  },
  {
    practice: "Lakeview Cardiology",
    specialty: "Cardiology",
    source: "Chatbot",
    status: "contacted",
    received: "2026-09-20",
  },
  {
    practice: "Summit Orthopedics",
    specialty: "Orthopedics",
    source: "WhatsApp",
    status: "qualified",
    received: "2026-09-18",
  },
  {
    practice: "Harbor Pediatrics",
    specialty: "Pediatrics",
    source: "Contact",
    status: "won",
    received: "2026-09-12",
  },
  {
    practice: "Northgate Urgent Care",
    specialty: "Urgent care",
    source: "Audit form",
    status: "new",
    received: "2026-09-23",
  },
  {
    practice: "Cedar Dermatology",
    specialty: "Dermatology",
    source: "Landing page",
    status: "contacted",
    received: "2026-09-15",
  },
];

const statusVariant = {
  new: "secondary",
  contacted: "neutral",
  qualified: "warning",
  won: "success",
} as const;

const col = dataTableColumns<SampleLead>();
const leadColumns = col.columns([
  col.accessor("practice", { header: "Practice" }),
  col.accessor("specialty", { header: "Specialty" }),
  col.accessor("source", { header: "Source" }),
  col.accessor("status", {
    header: "Status",
    cell: (info) => (
      <Badge variant={statusVariant[info.getValue()]} className="capitalize">
        {info.getValue()}
      </Badge>
    ),
  }),
  col.accessor("received", {
    header: "Received",
    cell: (info) => <span className="font-mono text-sm">{info.getValue()}</span>,
  }),
]);

export function TableDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable columns={leadColumns} data={leads} caption="Sample leads" pageSize={4} />
      <DataTable
        columns={leadColumns}
        data={[]}
        caption="Empty leads"
        empty={
          <EmptyState
            icon={Inbox}
            title="No leads yet"
            description="Leads from the audit form, chatbot and WhatsApp appear here."
          />
        }
      />
    </div>
  );
}

const enrollments = [
  { label: "Apr", enrollments: 18, completions: 6 },
  { label: "May", enrollments: 26, completions: 9 },
  { label: "Jun", enrollments: 31, completions: 14 },
  { label: "Jul", enrollments: 29, completions: 17 },
  { label: "Aug", enrollments: 42, completions: 21 },
  { label: "Sep", enrollments: 47, completions: 26 },
];

export function ChartDemos() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Enrollments" description="Sample data, last 6 months">
        <TrendChart
          data={enrollments}
          series={[{ key: "enrollments", label: "Enrollments" }]}
          caption="Monthly enrollments, April to September (sample data)"
        />
      </ChartCard>
      <ChartCard title="Enrollments vs completions" description="Sample data">
        <BarCompareChart
          data={enrollments}
          series={[
            { key: "enrollments", label: "Enrollments" },
            { key: "completions", label: "Completions" },
          ]}
          caption="Enrollments and completions per month (sample data)"
        />
      </ChartCard>
    </div>
  );
}

const sampleQuestion = {
  id: "demo-1",
  type: "single" as const,
  prompt: "Which code set is used to report diagnoses on a US claim?",
  options: [
    { id: "a", label: "CPT" },
    { id: "b", label: "ICD-10-CM" },
    { id: "c", label: "HCPCS Level II" },
  ],
};

export function QuizDemo() {
  const [feedback, setFeedback] = useState<QuizFeedback>();
  const [attempt, setAttempt] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <QuizQuestion
        key={attempt}
        question={sampleQuestion}
        number={3}
        total={10}
        feedback={feedback}
        onSubmit={(ids) =>
          // Demo only: real grading happens on the server (P6-2).
          setFeedback({
            correct: ids.includes("b"),
            correctOptionIds: ["b"],
            explanation:
              "ICD-10-CM reports diagnoses. CPT and HCPCS report procedures and supplies.",
          })
        }
      />
      {feedback && (
        <Button
          variant="link"
          className="self-start"
          onClick={() => {
            setFeedback(undefined);
            setAttempt((n) => n + 1);
          }}
        >
          Try the question again
        </Button>
      )}
    </div>
  );
}
