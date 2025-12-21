"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PayslipTable from "./PayslipTable";
import PayslipViewer from "./PayslipViewer";

export default function PayslipsPage() {
  const [selected, setSelected] = useState(null);

  const { data = [] } = useQuery({
    queryKey: ["payslips"],
    queryFn: () =>
      fetch("/api/v1/payroll/payslips", {
        credentials: "include",
      }).then((r) => r.json()),
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Payslips
      </h1>

      <PayslipTable
        data={data}
        onSelect={setSelected}
      />

      {selected && (
        <PayslipViewer payslip={selected} />
      )}
    </div>
  );
}
