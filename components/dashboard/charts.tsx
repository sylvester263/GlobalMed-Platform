"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";

export type ChartSeries<TKey extends string> = { key: TKey; label: string };
type Row<TKey extends string> = { label: string } & Record<TKey, number>;

const SERIES_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const axisProps = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

const tooltipProps = {
  cursor: { fill: "var(--mint)", stroke: "var(--tick)" },
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    fontSize: 14,
    color: "var(--popover-foreground)",
  },
} as const;

/** DM-7: animate on first render only, never for reduced motion. */
function useFirstRenderAnimation(): boolean {
  const reduced = usePrefersReducedMotion();
  const [first, setFirst] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setFirst(false), 1200);
    return () => window.clearTimeout(t);
  }, []);
  return first && !reduced;
}

type ChartCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <figure className={cn("flex min-w-0 flex-col gap-4 rounded-lg border bg-card p-6", className)}>
      <figcaption>
        <p className="font-serif text-lg font-semibold">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </figcaption>
      {children}
    </figure>
  );
}

/** Screen-reader equivalent of a chart: the same numbers as a table. */
function ChartDataTable<TKey extends string>({
  data,
  series,
  caption,
}: {
  data: Row<TKey>[];
  series: ChartSeries<TKey>[];
  caption: string;
}) {
  return (
    // A <table> ignores sr-only's 1px width, so the wrapper carries it.
    <div className="sr-only">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            {series.map((s) => (
              <th key={s.key} scope="col">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {series.map((s) => (
                <td key={s.key}>{row[s.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Legend<TKey extends string>({ series }: { series: ChartSeries<TKey>[] }) {
  return (
    <ul aria-hidden="true" className="flex flex-wrap gap-4 text-sm">
      {series.map((s, i) => (
        <li key={s.key} className="flex items-center gap-2">
          <span className="size-3 rounded-sm" style={{ background: SERIES_COLORS[i % 5] }} />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

type ChartProps<TKey extends string> = {
  data: Row<TKey>[];
  series: ChartSeries<TKey>[];
  /** Summary for screen readers, e.g. "Monthly enrollments, January to June". */
  caption: string;
  height?: number;
};

export function TrendChart<TKey extends string>({
  data,
  series,
  caption,
  height = 260,
}: ChartProps<TKey>) {
  const animate = useFirstRenderAnimation();
  return (
    <div className="flex flex-col gap-3">
      <div aria-hidden="true" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            accessibilityLayer={false}
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            {series.map((s, i) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={SERIES_COLORS[i % 5]}
                strokeWidth={2}
                fill={SERIES_COLORS[i % 5]}
                fillOpacity={0.12}
                isAnimationActive={animate}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {series.length > 1 && <Legend series={series} />}
      <ChartDataTable data={data} series={series} caption={caption} />
    </div>
  );
}

export function BarCompareChart<TKey extends string>({
  data,
  series,
  caption,
  height = 260,
}: ChartProps<TKey>) {
  const animate = useFirstRenderAnimation();
  return (
    <div className="flex flex-col gap-3">
      <div aria-hidden="true" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            accessibilityLayer={false}
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="label" interval={0} {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            {series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={SERIES_COLORS[i % 5]}
                radius={[4, 4, 0, 0]}
                isAnimationActive={animate}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {series.length > 1 && <Legend series={series} />}
      <ChartDataTable data={data} series={series} caption={caption} />
    </div>
  );
}
