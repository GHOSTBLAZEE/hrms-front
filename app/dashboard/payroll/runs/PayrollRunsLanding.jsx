"use client";

import { useState } from "react";
import MissingSalaryBanner from "./components/MissingSalaryBanner";
import { useSalaryReadiness } from "./hooks/useSalaryReadiness";

export default function PayrollRunsLanding({
  latestRun,
  onProceed,
}) {
  const { missing, isLoading } = useSalaryReadiness();

  if (isLoading) {
    return <div className="p-6">Checking payroll readiness…</div>;
  }

  if (!latestRun) {
    return (
      <div className="p-6 text-muted-foreground">
        No payroll runs found.
      </div>
    );
  }

  if (missing.length > 0) {
    return (
      <div className="p-6 space-y-4">
        <MissingSalaryBanner employees={missing} />
      </div>
    );
  }

  // ✅ Safe to proceed
  onProceed(latestRun.id);
  return null;
}
