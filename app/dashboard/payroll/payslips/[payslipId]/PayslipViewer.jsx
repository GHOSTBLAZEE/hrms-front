"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { format } from "date-fns";

/* ----------------------------
 | API
 |----------------------------*/
async function fetchPayslip(id) {
  const res = await apiClient.get(`/api/v1/payslips/${id}`);
  return res.data.data;
}

/* ----------------------------
 | Page
 |----------------------------*/
export default function PayslipViewerPage({ payslipId }) {
  // 🚫 Invalid route
  if (!payslipId) {
    return (
      <div className="text-sm text-destructive">
        Invalid or missing payslip ID.
      </div>
    );
  }

  const {
    data: payslip,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["payslip", payslipId],
    queryFn: () => fetchPayslip(payslipId),
    enabled: true,
    retry: false,
  });
  
  /* ----------------------------
  | Loading / Error
  |----------------------------*/
  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading payslip…
      </div>
    );
  }
  console.log(payslip);

  if (isError || !payslip) {
    return (
      <div className="text-sm text-destructive">
        Failed to load payslip.
      </div>
    );
  }

  /* ----------------------------
   | Date (ABSOLUTELY SAFE)
   |----------------------------*/
  let monthLabel = "Unknown period";

  try {
    const date = new Date(
      Number(payslip.year),
      Number(payslip.month) - 1,
      1
    );

    if (!isNaN(date.getTime())) {
      monthLabel = format(date, "MMMM yyyy");
    }
  } catch {
    // swallow — UI must never crash
  }

  /* ----------------------------
   | Render
   |----------------------------*/
  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-md border bg-white p-6">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Payslip — {monthLabel}
          </h1>
          <p className="text-sm text-muted-foreground">
            Employee #{payslip.employee_id}
          </p>
          <div className="mt-1 text-xs text-muted-foreground">
            This payslip is final and generated from a locked payroll run.
          </div>
        </div>

        <button
          className="text-sm underline"
          onClick={() =>
            window.open(
              payslip.actions?.download_pdf ??
                `/api/v1/payslips/${payslip.id}/pdf`,
              "_blank"
            )
          }
        >
          Download PDF
        </button>
      </header>

      {/* Earnings & Deductions */}
      <section className="grid grid-cols-2 gap-4 text-sm">
        <Row label="Basic Salary" value={payslip.earnings?.basic} />
        <Row label="HRA" value={payslip.earnings?.hra} />
        <Row
          label="Other Allowances"
          value={payslip.earnings?.allowances}
        />
        <Row
          label="Total Earnings"
          value={payslip.earnings?.gross}
        />
        <Row
          label="Total Deductions"
          value={payslip.deductions?.total}
        />
      </section>

      {/* Net Pay */}
      <div className="rounded-md border bg-muted/20 p-4">
        <Row
          label="Net Pay"
          value={payslip.net_pay}
          strong
          large
        />
      </div>

      {/* Footer */}
      <footer className="text-xs text-muted-foreground">
        Generated on{" "}
        {format(new Date(payslip.generated_at), "dd MMM yyyy")}
        . This document is system-generated and audit-locked.
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
      <span className="text-muted-foreground">{label}</span>
      <span
        className={[
          strong ? "font-semibold" : "",
          large ? "text-base" : "",
        ].join(" ")}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}
