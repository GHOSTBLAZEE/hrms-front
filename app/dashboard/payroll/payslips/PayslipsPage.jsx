"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import PayslipTable from "./components/PayslipTable";
import { useAuth } from "@/hooks/useAuth";

async function fetchPayslips() {
  const res = await apiClient.get("/api/v1/payslips");
  return res.data;
}

export default function PayslipsPage() {
  const { permissions } = useAuth();
  const canViewAll = permissions.includes("view payroll");

  const { data, isLoading } = useQuery({
    queryKey: ["payslips"],
    queryFn: fetchPayslips,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Payslips</h1>
        <p className="text-sm text-muted-foreground">
          Finalized payroll payslips (read-only)
        </p>
      </header>

      <PayslipTable
        payslips={data?.data || []}
        loading={isLoading}
        canViewAll={canViewAll}
      />
    </div>
  );
}
