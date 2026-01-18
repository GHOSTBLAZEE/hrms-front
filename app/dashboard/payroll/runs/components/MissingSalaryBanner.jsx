"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MissingSalaryBanner({ employees = [] }) {
  const router = useRouter();

  if (!employees.length) return null;

  const employeeIds = employees.map((e) => e.id);

  const goToEmployeeSalary = (employeeId) => {
    router.push(
      `/dashboard/employees/${employeeId}?tab=salary&highlight=${employeeId}`
    );
  };

  const goToBulkSalaryFix = () => {
    router.push(
      `/dashboard/employees?tab=salary&highlight=${employeeIds.join(",")}`
    );
  };

  return (
    <div className="border border-yellow-300 bg-yellow-50 rounded-md p-4 space-y-3">
      <div className="flex items-center gap-2 text-yellow-800">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="font-medium">
          Salary setup required
        </h3>
      </div>

      <p className="text-sm text-yellow-700">
        Payroll cannot proceed until salary structures
        are defined for the following employees:
      </p>

      <ul className="space-y-2">
        {employees.map((emp) => (
          <li
            key={emp.id}
            className="flex justify-between items-center bg-white rounded px-3 py-2"
          >
            <span className="text-sm">
              {emp.employee_code}
            </span>

            <Button
              size="sm"
              onClick={() => goToEmployeeSalary(emp.id)}
            >
              Add Salary
            </Button>
          </li>
        ))}
      </ul>

      {employees.length > 1 && (
        <Button
          size="sm"
          variant="outline"
          onClick={goToBulkSalaryFix}
        >
          Fix All Salaries
        </Button>
      )}
    </div>
  );
}
