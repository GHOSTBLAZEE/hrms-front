"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =========================================================
   | Normalize highlight ONCE
   |========================================================= */
  const initialHighlightIds = useMemo(() => {
    const raw = searchParams.get("highlight");
    if (!raw) return [];

    return raw
      .split(",")
      .map((id) => Number(id))
      .filter(Boolean);
  }, []); // 👈 IMPORTANT: empty deps (read once)

  const [highlightedIds, setHighlightedIds] = useState(
    initialHighlightIds
  );

  /* =========================================================
   | Fetch employees
   |========================================================= */
  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/employees");
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6">Loading employees…</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Employees</h1>

      <ul className="space-y-2">
        {data?.data?.map((emp) => {
          const isHighlighted = highlightedIds.includes(emp.id);

          return (
            <li
              key={emp.id}
              className={`
                border p-3 rounded cursor-pointer transition
                ${isHighlighted ? "bg-yellow-50 ring-2 ring-yellow-400" : "hover:bg-muted"}
              `}
              onClick={() => {
                // User intent → clear highlight
                setHighlightedIds([]);

                router.push(
                  `/dashboard/employees/${emp.id}?tab=salary`
                );
              }}
            >
              {emp.employee_code} — {emp.user?.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
