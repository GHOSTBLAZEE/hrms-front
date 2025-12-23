"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { useAuditExport } from "../hooks/useAuditExport";

export default function AuditExportButton({ filters, disabled }) {
  const { startExport, exportStatus } = useAuditExport();

  const status = exportStatus.data?.status;

  // ⬇️ Download
  if (status === "completed") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          window.open(
            `/api/v1/exports/${exportStatus.data.id}/download`,
            "_blank"
          )
        }
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    );
  }

  // ⏳ Processing
  if (status === "processing" || startExport.isPending) {
    return (
      <Button size="sm" variant="outline" disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Processing…
      </Button>
    );
  }

  // ▶️ Start export
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={disabled}
      onClick={() => startExport.mutate(filters)}
    >
      Export (Server)
    </Button>
  );
}
