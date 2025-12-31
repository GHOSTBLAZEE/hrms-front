"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { format } from "date-fns";

async function fetchPayslip(id) {
  const res = await apiClient.get(`/api/v1/payslips/${id}`);
  return res.data;
}

export default function PayslipViewerPage({ payslipId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["payslip", payslipId],
    queryFn: () => fetchPayslip(payslipId),
  });

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading payslip…
      </div>
    );
  }

  const p = data;

  const monthLabel = format(
    new Date(p.year, p.month - 1),
    "MMMM yyyy"
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-md border bg-white p-6">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Payslip — {monthLabel}
          </h1>
          <p className="text-sm text-muted-foreground">
            {p.employee_name}
          </p>

          <div className="mt-1 text-xs text-muted-foreground">
            This payslip is final and generated from a
            locked payroll run.
          </div>
        </div>

        <button
          className="text-sm underline"
          onClick={() =>
            window.open(
              `/api/v1/payslips/${p.id}/pdf`,
              "_blank"
            )
          }
        >
          Download PDF
        </button>
      </header>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-4 text-sm">
        <Row label="Paid Days" value={p.paid_days} />
        <Row label="Basic Salary" value={p.basic} />
        <Row label="HRA" value={p.hra} />
        <Row
          label="Other Allowances"
          value={p.allowances}
        />
        <Row
          label="Total Deductions"
          value={p.deductions}
        />
      </section>

      {/* Net Pay */}
      <div className="rounded-md border bg-muted/20 p-4">
        <Row
          label="Net Pay"
          value={p.net_pay}
          strong
          large
        />
      </div>

      {/* Footer */}
      <footer className="text-xs text-muted-foreground">
        Generated as part of the finalized payroll for{" "}
        {monthLabel}. For any discrepancies, please
        contact HR.
      </footer>
    </div>
  );
}

/* ----------------------------
 | Helpers
 |----------------------------*/
function Row({ label, value, strong, large }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">
        {label}
      </span>
      <span
        className={[
          strong ? "font-semibold" : "",
          large ? "text-base" : "",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}
