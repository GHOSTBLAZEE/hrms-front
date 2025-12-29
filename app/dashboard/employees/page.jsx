"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await apiClient.get("api/v1/employees");
      return res.data;
    },
  });
  
  console.log(data);
  if (isLoading) return <div className="p-6">Loading employees…</div>;
  
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Employees</h1>

      <ul className="space-y-2">
        {data?.data?.map((emp) => (
          <li
          key={emp.id}
            className="border p-3 rounded cursor-pointer hover:bg-muted"
            onClick={() =>
              router.push(`/dashboard/employees/${emp.id}`)
            }
          >
            {emp.employee_code} — {emp.user?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
