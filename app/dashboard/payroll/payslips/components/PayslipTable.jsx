"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import { format } from "date-fns";
import PayslipStatusBadge from "./PayslipStatusBadge";
import PayslipPDFButton from "./PayslipPDFButton";

export default function PayslipTable({
  payslips,
  loading,
}) {
  if (loading) return <div>Loading payslips…</div>;

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Net Pay</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payslips.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                {format(
                  new Date(p.year, p.month - 1),
                  "MMMM yyyy"
                )}
              </TableCell>

              <TableCell>{p.employee_name}</TableCell>

              <TableCell>
                <PayslipStatusBadge status={p.status} />
              </TableCell>

              <TableCell>{p.net_pay}</TableCell>

              <TableCell className="text-right space-x-2">
                <Link
                  href={`/dashboard/payroll/payslips/${p.id}`}
                  className="text-sm underline"
                >
                  View
                </Link>

                <PayslipPDFButton payslipId={p.id} />
              </TableCell>
            </TableRow>
          ))}

          {!payslips.length && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No payslips found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
