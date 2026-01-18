"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";

import { Button } from "@/components/ui/button";
import SalaryStructureDrawer from "@/app/dashboard/payroll/salary-structures/SalaryStructureDrawer";

/* =========================================================
 | Helpers
 |========================================================= */

// 💰 Currency formatter (reuse-safe)
const formatINR = (amount) =>
  `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/* =========================================================
 | Employee Salary Tab
 |========================================================= */
export default function EmployeeSalaryTab({ employee }) {
  const qc = useQueryClient();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  // Refs for one-time effects
  const containerRef = useRef(null);
  const hasAutoOpenedRef = useRef(false);
  const hasScrolledRef = useRef(false);

  /* ---------------------------------------------------------
   | Normalize highlight= ONCE (deep-link intent)
   |--------------------------------------------------------*/
  const isHighlighted = useMemo(() => {
    const raw = searchParams.get("highlight");
    if (!raw || !employee?.id) return false;

    return raw
      .split(",")
      .map(Number)
      .filter(Boolean)
      .includes(employee.id);
  }, []); // 👈 IMPORTANT: read once only

  /* ---------------------------------------------------------
   | Fetch employee salary history
   |--------------------------------------------------------*/
  const {
    data: salaries = [],
    isLoading,
  } = useQuery({
    queryKey: [
      "employee-salary-structures",
      employee?.id,
    ],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/salary-structures/${employee.id}`
      );
      return res.data;
    },
    enabled: Boolean(employee?.id),
    staleTime: 60_000,
  });

  const hasSalary = salaries.length > 0;

  /* ---------------------------------------------------------
   | Auto-open drawer ONCE (payroll → employee intent)
   |--------------------------------------------------------*/
  useEffect(() => {
    if (
      !isHighlighted ||
      hasSalary ||
      hasAutoOpenedRef.current
    ) {
      return;
    }

    setOpen(true);
    hasAutoOpenedRef.current = true;
  }, [isHighlighted, hasSalary]);

  /* ---------------------------------------------------------
   | Auto-scroll salary section into view ONCE
   |--------------------------------------------------------*/
  useEffect(() => {
    if (
      !isHighlighted ||
      hasScrolledRef.current ||
      isLoading
    ) {
      return;
    }

    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    hasScrolledRef.current = true;
  }, [isHighlighted, isLoading]);

  /* ---------------------------------------------------------
   | Create salary revision
   |--------------------------------------------------------*/
  const createSalaryMutation = useMutation({
    mutationFn: (payload) =>
      apiClient.post("/api/v1/salary-structures", payload),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [
          "employee-salary-structures",
          employee.id,
        ],
      });
      qc.invalidateQueries({
        queryKey: ["salary-structures"],
      });
      setOpen(false);
    },
  });

  /* ---------------------------------------------------------
   | Pre-compute totals safely
   |--------------------------------------------------------*/
  const rows = useMemo(
    () =>
      salaries.map((s) => {
        const total =
          Number(s.basic || 0) +
          Number(s.hra || 0) +
          Number(s.allowances || 0);

        return {
          ...s,
          total,
        };
      }),
    [salaries]
  );

  /* ---------------------------------------------------------
   | Render
   |--------------------------------------------------------*/
  return (
    <div
      ref={containerRef}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Salary Structure
        </h3>

        <Button onClick={() => setOpen(true)}>
          Add Salary Structure
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          Loading salary…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          No salary structure found.
        </div>
      ) : (
        <div className="rounded-md border divide-y">
          {rows.map((s) => (
            <div
              key={s.id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">
                  {formatINR(s.total)}
                </div>

                <div className="text-xs text-muted-foreground">
                  Effective from {s.effective_from}
                </div>
              </div>

              {s.is_active && (
                <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                  Active
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <SalaryStructureDrawer
        open={open}
        onClose={() => setOpen(false)}
        employee={employee}
        loading={createSalaryMutation.isPending}
        onSubmit={(values) =>
          createSalaryMutation.mutate({
            ...values,
            employee_id: employee.id,
            is_active: true,
          })
        }
      />
    </div>
  );
}
