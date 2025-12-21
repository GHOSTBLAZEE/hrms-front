"use client";

import { Button } from "@/components/ui/button";

export default function PayslipPDFButton({ payslipId }) {
  return (
    <Button
      variant="outline"
      onClick={() =>
        window.open(
          `/api/v1/payroll/payslips/${payslipId}/pdf`,
          "_blank"
        )
      }
    >
      Download PDF
    </Button>
  );
}
