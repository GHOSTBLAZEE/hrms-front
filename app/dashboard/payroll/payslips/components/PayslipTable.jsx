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

/* =========================================================
 | Payslip Table (READ-ONLY)
 |========================================================= */
export default function PayslipTable({
  payslips = [],
  loading = false,
}) {
  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading payslips…
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Net Pay</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payslips.map((p) => {
            const period = safeMonthLabel(p.year, p.month);

            const hasUnpaidLeave =
              Number(p.unpaid_leave_days) > 0;

            const isProrated =
              typeof p.prorated_gross === "number" &&
              typeof p.gross === "number" &&
              p.prorated_gross !== p.gross;

            return (
              <TableRow key={p.id}>
                {/* Month */}
                <TableCell>{period}</TableCell>

                {/* Employee */}
                <TableCell>
                  {p.employee_name ??
                    `Employee #${p.employee_id}`}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <PayslipStatusBadge status={p.status} />
                </TableCell>

                {/* Attendance Impact */}
                <TableCell className="text-sm">
                  <div>
                    {p.payable_days} / {p.total_working_days} days
                  </div>

                  {hasUnpaidLeave && (
                    <div className="text-xs text-red-600">
                      LOP: {p.unpaid_leave_days} day(s)
                    </div>
                  )}
                </TableCell>

                {/* Net Pay */}
                <TableCell>
                  <div>{formatMoney(p.net_pay)}</div>

                  {isProrated && (
                    <div className="text-xs text-orange-600">
                      Prorated
                    </div>
                  )}
                </TableCell>

                {/* Actions */}
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
            );
          })}

          {!payslips.length && (
            <TableRow>
              <TableCell
                colSpan={6}
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

/* =========================================================
 | Helpers
 |========================================================= */
function safeMonthLabel(year, month) {
  try {
    const d = new Date(Number(year), Number(month) - 1, 1);
    if (!isNaN(d.getTime())) {
      return format(d, "MMMM yyyy");
    }
  } catch {}
  return "—";
}

function formatMoney(value) {
  if (typeof value !== "number") return "—";
  return `₹${value.toLocaleString("en-IN")}`;
}
