"use client";

import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
});

type DataTableFeatures = typeof dataTableFeatures;

/** Column helper bound to DataTable's features: `const col = dataTableColumns<Lead>()`. */
export function dataTableColumns<TData extends Record<string, unknown>>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

type DataTableProps<TData extends Record<string, unknown>> = {
  columns: ColumnDef<DataTableFeatures, TData, unknown>[];
  data: TData[];
  /** Visible caption; describes the table for screen readers too. */
  caption: string;
  pageSize?: number;
  /** Shown when there are no rows. */
  empty?: React.ReactNode;
};

/**
 * TanStack table on shadcn markup (MASTER.md §5 tables). Client-side sort + pagination
 * for small sets; large admin lists should paginate on the server instead.
 */
export function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  caption,
  pageSize = 10,
  empty,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const pageCount = table.getPageCount();

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="bg-ledger hover:bg-ledger">
              {group.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                const SortIcon =
                  sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined
                    }
                    className="h-11 font-semibold text-foreground"
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="-mx-2 inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1 hover:bg-mint"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortIcon
                          aria-hidden="true"
                          className={cn("size-3.5", !sorted && "text-muted-foreground")}
                        />
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-mint/50">
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-6">
                {empty ?? <p className="text-center text-muted-foreground">No results.</p>}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pageCount > 1 && (
        <nav
          aria-label={`${caption} pages`}
          className="flex items-center justify-between gap-4 border-t px-4 py-3 text-sm"
        >
          <p className="text-muted-foreground" aria-live="polite">
            Page {table.state.pagination.pageIndex + 1} of {pageCount}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft aria-hidden="true" />
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
