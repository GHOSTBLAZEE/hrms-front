"use client";

import { useState } from "react";
import MissingSalaryBanner from "./components/MissingSalaryBanner";
import { useSalaryReadiness } from "./hooks/useSalaryReadiness";

export default function PayrollRunsLanding({
  latestRun,
  onProceed,
  disabled = false,
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
  // ✅ Safe to proceed
  // onProceed(latestRun.id);
  // return null;
    return (
    <div className="p-6 space-y-4">
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Latest Payroll Run
            </h2>
            <p className="text-sm text-muted-foreground">
              {latestRun.month}/{latestRun.year} · Status:{" "}
              <span className="font-medium">
                {latestRun.status}
              </span>
            </p>
          </div>

          <button
            disabled={disabled}
            className={`px-4 py-2 rounded text-white ${
              disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary"
            }`}
            onClick={() => onProceed(latestRun.id)}
          >
            Open Payroll
          </button>
        </div>
      </div>
    </div>
  );

}
