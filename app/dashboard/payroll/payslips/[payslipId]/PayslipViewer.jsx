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

  if (isLoading) return <div>Loading payslip…</div>;

  const p = data;

  return (
    <div className="max-w-3xl mx-auto border rounded-md p-6 space-y-4">
      <header className="flex justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Payslip –{" "}
            {format(
              new Date(p.year, p.month - 1),
              "MMMM yyyy"
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            {p.employee_name}
          </p>
        </div>

        <button
          className="underline text-sm"
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

      <section className="grid grid-cols-2 gap-4 text-sm">
        <Row label="Paid Days" value={p.paid_days} />
        <Row label="Basic" value={p.basic} />
        <Row label="HRA" value={p.hra} />
        <Row label="Allowances" value={p.allowances} />
        <Row label="Deductions" value={p.deductions} />
        <Row
          label="Net Pay"
          value={p.net_pay}
          strong
        />
      </section>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">
        {label}
      </span>
      <span className={strong ? "font-semibold" : ""}>
        {value}
      </span>
    </div>
  );
}
