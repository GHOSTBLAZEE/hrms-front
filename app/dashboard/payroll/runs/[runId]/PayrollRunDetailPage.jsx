"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import PayrollRunSummary from "../components/PayrollRunSummary";

import PayrollTotalsFooter from "../components/PayrollTotalsFooter";

import FinalizePayrollDialog from "../components/FinalizePayrollDialog";
import { exportFile } from "@/lib/exportFile";
import PayrollEmployeeTable from "../components/PayrollEmployeeTable";
import PayrollPreflightChecklist from "../components/PayrollPreflightChecklist";

/**
 * Fetch payroll run details (snapshot-safe)
 */
async function fetchPayrollRun(runId) {
  const res = await apiClient.get(`/api/v1/payroll-runs/${runId}`);
  return res.data;
}

/**
 * Fetch attendance lock for payroll month
 */
async function fetchAttendanceLock(year, month) {
  const res = await apiClient.get(`/api/v1/attendance-locks/${year}-${month}`);
  return res.data;
}

/**
 * Fetch employees missing salary structure
 */
async function fetchMissingSalary(year, month) {
  const res = await apiClient.get(
    `/api/v1/salary-structures/missing`,
    { params: { year, month } }
  );
  return res.data;
}

export default function PayrollRunDetailPage({ runId }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  /**
   * Payroll run data
   */
  const { data, isLoading } = useQuery({
    queryKey: ["payroll-run", runId],
    queryFn: () => fetchPayrollRun(runId),
  });

  const run = data?.run;

  /**
   * Attendance lock state
   */
  const { data: attendanceLock } = useQuery({
    enabled: !!run,
    queryKey: ["attendance-lock", run?.year, run?.month],
    queryFn: () => fetchAttendanceLock(run.year, run.month),
  });

  /**
   * Missing salary structures
   */
  const { data: missingSalaryEmployees = [] } = useQuery({
    enabled: !!run,
    queryKey: ["missing-salary", run?.year, run?.month],
    queryFn: () => fetchMissingSalary(run.year, run.month),
  });

  /**
   * Finalize payroll mutation
   */
  const finalizeMutation = useMutation({
    mutationFn: () =>
      apiClient.post("/api/v1/payroll/finalize", {
        year: run.year,
        month: run.month,
      }),
    onSuccess: () => {
      toast.success("Payroll finalized successfully");
      queryClient.invalidateQueries(["payroll-run", runId]);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to finalize payroll"
      );
    },
  });

  if (isLoading) return <div>Loading payroll run…</div>;

  const attendanceLocked = attendanceLock?.status === "locked";

  const canFinalize =
    attendanceLocked &&
    missingSalaryEmployees.length === 0 &&
    run.status !== "finalized";

  return (
    <div className="space-y-6">
      <PayrollRunSummary run={run} />

      {/* 🔒 Pre-flight checklist */}
      <PayrollPreflightChecklist
        attendanceLocked={attendanceLocked}
        missingSalaryEmployees={missingSalaryEmployees}
        salaryLocked={true}
        payrollFinalized={run.status === "finalized"}
        onFixSalary={() =>
          router.push("/dashboard/payroll/salary-structures")
        }
      />

      {/* 🔥 FINALIZE BUTTON (THIS IS THE ANSWER) */}
      <div className="flex justify-end">
        <FinalizePayrollDialog
          disabled={!canFinalize}
          loading={finalizeMutation.isPending}
          onConfirm={() => finalizeMutation.mutate()}
        />
      </div>
      {/* 📦 Compliance Exports (only after finalize) */}
      {run.status === "finalized" && (
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="font-semibold">Compliance Exports</h3>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                exportFile(
                  `/api/v1/compliance/salary-register/${run.id}`,
                  `salary-register-${run.year}-${run.month}.xlsx`
                )
              }
            >
              Salary Register
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                exportFile(
                  `/api/v1/compliance/pf/${run.id}`,
                  `pf-${run.year}-${run.month}.xlsx`
                )
              }
            >
              PF Challan
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                exportFile(
                  `/api/v1/compliance/pf-ecr/${run.id}`,
                  `pf-ecr-${run.year}-${run.month}.txt`
                )
              }
            >
              PF ECR
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                exportFile(
                  `/api/v1/compliance/pf-arrear-ecr/${run.id}`,
                  `pf-arrear-ecr-${run.year}-${run.month}.txt`
                )
              }
            >
              PF Arrear ECR
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                exportFile(
                  `/api/v1/compliance/esi/${run.id}`,
                  `esi-${run.year}-${run.month}.xlsx`
                )
              }
            >
              ESI Export
            </Button>

            <Button
              className="font-semibold"
              onClick={() =>
                exportFile(
                  `/api/v1/compliance/export/${run.id}`,
                  `compliance-${run.year}-${run.month}.zip`
                )
              }
            >
              📦 Compliance ZIP
            </Button>
          </div>
        </div>
      )}



      <PayrollEmployeeTable employees={data.employees} />
      <PayrollTotalsFooter totals={data.totals} />
    </div>
  );
}
