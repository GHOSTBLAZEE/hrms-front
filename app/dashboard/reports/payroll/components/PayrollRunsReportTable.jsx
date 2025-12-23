"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";

export default function PayrollRunsReportTable({ runs }) {
  if (!runs.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No payroll runs found
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Run By</TableHead>
            <TableHead>Run At</TableHead>
            <TableHead className="text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {runs.map((run) => (
            <TableRow key={run.id}>
              <TableCell>
                {format(
                  new Date(run.year, run.month - 1),
                  "MMMM yyyy"
                )}
              </TableCell>

              <TableCell>{run.status}</TableCell>

              <TableCell>
                {run.run_by?.name ?? "—"}
              </TableCell>

              <TableCell>
                {run.run_at
                  ? format(new Date(run.run_at), "PPp")
                  : "—"}
              </TableCell>

              <TableCell className="text-right">
                <Link
                  href={`/dashboard/payroll/runs/${run.id}`}
                  className="text-sm underline"
                >
                  View Run
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
