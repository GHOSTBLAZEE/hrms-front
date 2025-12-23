"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function PayslipPDFButton({ payslipId }) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() =>
        window.open(
          `/api/v1/payslips/${payslipId}/pdf`,
          "_blank"
        )
      }
    >
      <Download className="h-4 w-4 mr-1" />
      PDF
    </Button>
  );
}
