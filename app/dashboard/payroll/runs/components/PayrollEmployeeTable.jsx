"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import PayrollEmployeeDrawer from "./PayrollEmployeeDrawer";

export default function PayrollEmployeeTable({ employees }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Days Paid</TableHead>
              <TableHead>Gross</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Pay</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees.map((emp) => (
              <TableRow
                key={emp.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelected(emp)}
              >
                <TableCell>{emp.employee_name}</TableCell>
                <TableCell>{emp.paid_days}</TableCell>
                <TableCell>{emp.gross}</TableCell>
                <TableCell>{emp.deductions}</TableCell>
                <TableCell className="font-medium">
                  {emp.net_pay}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PayrollEmployeeDrawer
        employee={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
