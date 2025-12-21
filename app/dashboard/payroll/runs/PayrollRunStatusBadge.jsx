"use client";

import { Badge } from "@/components/ui/badge";

export default function PayrollRunStatusBadge({ status }) {
  const map = {
    draft: "secondary",
    finalized: "destructive",
    paid: "default",
  };

  return (
    <Badge variant={map[status] ?? "secondary"}>
      {status?.toUpperCase() ?? "DRAFT"}
    </Badge>
  );
}
