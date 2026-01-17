"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

import PayrollRunsLanding from "./PayrollRunsLanding";
import MissingSalaryBanner from "./components/MissingSalaryBanner";
import { useSalaryReadiness } from "./hooks/useSalaryReadiness";

async function fetchLatestPayrollRun() {
  const res = await apiClient.get("/api/v1/payroll-runs/latest");
  return res.data ?? null;
}

export default function PayrollRunsPage() {
  const router = useRouter();

  const { missing, isLoading } = useSalaryReadiness();

  const { data: latestRun, isLoading: runLoading } = useQuery({
    queryKey: ["latest-payroll-run"],
    queryFn: fetchLatestPayrollRun,
  });

  if (isLoading || runLoading) {
    return <div className="p-6">Loading payroll…</div>;
  }

  return (
    <div className="p-6 space-y-6">

      {/* ❌ Salary issues (shown ABOVE run card) */}
      {missing.length > 0 && (
        <MissingSalaryBanner employees={missing} />
      )}

      {/* ✅ Payroll run card ALWAYS visible */}
      <PayrollRunsLanding
        latestRun={latestRun}
        onProceed={(runId) =>
          router.push(`/dashboard/payroll/runs/${runId}`)
        }
        disabled={missing.length > 0}
      />
    </div>
  );
}
