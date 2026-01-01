"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Badge } from "@/components/ui/badge";

export default function AttendanceIntegrityPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["attendance-integrity"],
    queryFn: async () => {
      const res = await apiClient.get(
        "/attendance/integrity"
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading integrity data…</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">
        Attendance Integrity Audit
      </h1>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Employee</th>
              <th className="p-2">Date</th>
              <th className="p-2">Type</th>
              <th className="p-2">Source</th>
              <th className="p-2">Integrity</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-2">{row.employee}</td>
                <td className="p-2">
                  {new Date(row.punch_time).toLocaleString()}
                </td>
                <td className="p-2">{row.type}</td>
                <td className="p-2 capitalize">
                  {row.source}
                </td>
                <td className="p-2">
                  <IntegrityBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IntegrityBadge({ status }) {
  if (status === "valid")
    return <Badge variant="success">Valid</Badge>;

  if (status === "tampered")
    return <Badge variant="destructive">Tampered</Badge>;

  return <Badge variant="secondary">Missing</Badge>;
}
