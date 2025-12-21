"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CorrectionsTable from "./CorrectionsTable";
import CorrectionDetailDrawer from "./CorrectionDetailDrawer";

async function fetchCorrections() {
  const res = await fetch("/api/v1/attendance-corrections", {
    credentials: "include",
  });
  return res.json();
}

export default function AttendanceCorrectionsPage() {
  const [selected, setSelected] = useState(null);
  const { data = [] } = useQuery({
    queryKey: ["attendance-corrections"],
    queryFn: fetchCorrections,
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Attendance Corrections
      </h1>

      <CorrectionsTable
        data={data}
        onSelect={setSelected}
      />

      <CorrectionDetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        correction={selected}
        canApprove={true} // permission-based
      />
    </div>
  );
}
