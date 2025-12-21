"use client";

import { DataTable } from "@/components/data-table";

const columns = [
  { accessorKey: "employee_code", header: "Emp Code" },
  { accessorKey: "employee_name", header: "Employee" },
  { accessorKey: "present_days", header: "Present" },
  { accessorKey: "absent_days", header: "Absent" },
  { accessorKey: "leave_days", header: "Leave" },
  { accessorKey: "work_hours", header: "Work Hours" },
  { accessorKey: "overtime_hours", header: "OT Hours" },
];

export default function AttendanceSnapshotTable({ data }) {
  return <DataTable columns={columns} data={data} />;
}
