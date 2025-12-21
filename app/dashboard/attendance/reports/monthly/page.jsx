"use client";

import { useState } from "react";
import MonthlyAttendanceFilters from "./MonthlyAttendanceFilters";
import MonthlyAttendanceTable from "./MonthlyAttendanceTable";
import { useQuery } from "@tanstack/react-query";

async function fetchMonthlyAttendance(month) {
  const res = await fetch(
    `/api/v1/attendance/reports/monthly?month=${month}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Failed to load report");
  return res.json();
}

export default function MonthlyAttendanceReportPage() {
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["monthly-attendance", month],
    queryFn: () => fetchMonthlyAttendance(month),
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">
        Monthly Attendance Report
      </h1>

      <MonthlyAttendanceFilters
        month={month}
        setMonth={setMonth}
        onApply={refetch}
      />

      {isLoading ? (
        <p>Loading report...</p>
      ) : (
        <MonthlyAttendanceTable data={data} />
      )}
    </div>
  );
}
