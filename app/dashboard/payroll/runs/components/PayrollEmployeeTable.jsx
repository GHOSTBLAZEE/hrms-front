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

  if (!employees || employees.length === 0) {
    return (
      <div className="p-6 text-muted-foreground">
        No payroll employees found.
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="text-right">
                Days Paid
              </TableHead>
              <TableHead className="text-right">
                Gross
              </TableHead>
              <TableHead className="text-right">
                Deductions
              </TableHead>
              <TableHead className="text-right">
                Net Pay
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees.map((emp) => (
              <TableRow
                key={emp.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelected(emp)}
              >
                <TableCell>
                  {emp.employee_name}
                </TableCell>
                <TableCell className="text-right">
                  {emp.paid_days}
                </TableCell>
                <TableCell className="text-right">
                  ₹{emp.gross}
                </TableCell>
                <TableCell className="text-right">
                  ₹{emp.deductions}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ₹{emp.net_pay}
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
