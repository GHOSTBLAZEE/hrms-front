"use client";

import { format } from "date-fns";
import PayslipPDFButton from "./PayslipPDFButton";

export default function PayslipViewer({ payslip }) {
  if (!payslip) return null;

  return (
    <div className="border rounded p-6 space-y-6 bg-white">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {payslip.company.name}
          </h2>
          <p className="text-sm">{payslip.company.address}</p>
        </div>

        <div className="text-right text-sm">
          <p>Payslip for</p>
          <p className="font-medium">
            {format(
              new Date(payslip.month + "-01"),
              "MMMM yyyy"
            )}
          </p>
        </div>
      </div>

      {/* Employee Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Employee:</strong> {payslip.employee.name}
        </div>
        <div>
          <strong>Employee Code:</strong>{" "}
          {payslip.employee.code}
        </div>
        <div>
          <strong>Department:</strong>{" "}
          {payslip.employee.department}
        </div>
        <div>
          <strong>Designation:</strong>{" "}
          {payslip.employee.designation}
        </div>
      </div>

      {/* Earnings & Deductions */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Earnings</h4>
          {payslip.earnings.map((e) => (
            <div
              key={e.name}
              className="flex justify-between text-sm"
            >
              <span>{e.name}</span>
              <span>{e.amount}</span>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-medium mb-2">Deductions</h4>
          {payslip.deductions.map((d) => (
            <div
              key={d.name}
              className="flex justify-between text-sm"
            >
              <span>{d.name}</span>
              <span>{d.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t pt-4 grid grid-cols-2 text-sm">
        <div>
          <strong>Gross Pay:</strong> {payslip.gross}
        </div>
        <div>
          <strong>Net Pay:</strong> {payslip.net_pay}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs">
        <span>
          Generated on{" "}
          {format(new Date(payslip.generated_at), "PPpp")}
        </span>
        <PayslipPDFButton payslipId={payslip.id} />
      </div>
    </div>
  );
}
