"use client";

import { useSalaryReadiness } from "./hooks/useSalaryReadiness";



export default function PayrollRunsPage() {
  const { isLoading, missing } = useSalaryReadiness();

  if (isLoading) {
    return <div>Checking salary readiness…</div>;
  }

  if (missing.length > 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold">
          Employees Missing Salary Structure
        </h2>

        <ul className="mt-2 list-disc pl-5 text-red-600">
          {missing.map(emp => (
            <li key={emp.id}>
              {emp.name} ({emp.employee_code})
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-green-600">
        All employees are salary-ready ✅
      </h2>
    </div>
  );
}
