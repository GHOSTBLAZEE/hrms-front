"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { format } from "date-fns";

/* =========================================================
 | API
 |========================================================= */
async function fetchPayslip(id) {
  const res = await apiClient.get(`/api/v1/payslips/${id}`);
  return res.data.data;
}

/* =========================================================
 | Page
 |========================================================= */
export default function PayslipViewerPage({ payslipId }) {
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
  } = useQuery({
    queryKey: ["payslip", payslipId],
    queryFn: () => fetchPayslip(payslipId),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading payslip…
      </div>
    );
  }

  if (isError || !payslip) {
    return (
      <div className="text-sm text-destructive">
        Failed to load payslip.
      </div>
    );
  }

  /* =========================================================
   | Period label (SAFE)
   |========================================================= */
  let periodLabel = "Unknown period";
  try {
    const d = new Date(payslip.year, payslip.month - 1, 1);
    if (!isNaN(d.getTime())) {
      periodLabel = format(d, "MMMM yyyy");
    }
  } catch {}

  const {
    // Salary
    gross,
    prorated_gross,
    net_pay,

    // Attendance snapshot
    present_days,
    paid_leave_days,
    unpaid_leave_days,
    payable_days,
    total_working_days,

    // Meta
    generated_at,
    employee_name,
  } = payslip;

  const isProrated =
    typeof prorated_gross === "number" &&
    typeof gross === "number" &&
    prorated_gross !== gross;

  /* =========================================================
   | Render
   |========================================================= */
  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-md border bg-white p-6">
      {/* ================= Header ================= */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Payslip — {periodLabel}
          </h1>

          <p className="text-sm text-muted-foreground">
            {employee_name
              ? employee_name
              : `Employee #${payslip.employee_id}`}
          </p>

          <div className="mt-1 text-xs text-muted-foreground">
            Generated from a locked payroll run (immutable)
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

      {/* ================= Attendance Impact ================= */}
      <section className="rounded-md border p-4 space-y-2 text-sm">
        <h3 className="font-semibold">Attendance Summary</h3>

        <Row
          label="Total Working Days"
          value={total_working_days}
        />

        <Row
          label="Present Days"
          value={present_days}
        />

        <Row
          label="Paid Leave"
          value={paid_leave_days}
        />

        <Row
          label="Unpaid Leave (LOP)"
          value={unpaid_leave_days}
          highlight={unpaid_leave_days > 0}
        />

        <Row
          label="Payable Days"
          value={`${payable_days} / ${total_working_days}`}
          strong
        />
      </section>

      {/* ================= Salary ================= */}
      <section className="rounded-md border p-4 space-y-2 text-sm">
        <h3 className="font-semibold">Salary</h3>

        <Row
          label="Contractual Gross"
          value={formatMoney(gross)}
        />

        {isProrated && (
          <Row
            label="Prorated Gross"
            value={formatMoney(prorated_gross)}
            highlight
          />
        )}

        <div className="mt-3 rounded-md bg-muted/30 p-3">
          <Row
            label="Net Pay"
            value={formatMoney(net_pay)}
            strong
            large
          />
        </div>
      </section>

      {/* ================= Footer ================= */}
      <footer className="text-xs text-muted-foreground">
        Generated on{" "}
        {generated_at
          ? format(new Date(generated_at), "dd MMM yyyy")
          : "—"}
        . This document is system-generated and audit-locked.
      </footer>
    </div>
  );
}

/* =========================================================
 | Helpers
 |========================================================= */
function Row({
  label,
  value,
  strong = false,
  large = false,
  highlight = false,
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span
        className={[
          strong ? "font-semibold" : "",
          large ? "text-base" : "",
          highlight ? "text-red-600" : "",
        ].join(" ")}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

function formatMoney(value) {
  if (typeof value !== "number") return "—";
  return `₹${value.toLocaleString("en-IN")}`;
}
