import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import Link from "next/link";

export default function PayrollTab({ employee }) {
  const { data, isLoading } = useQuery({
    queryKey: ["employee-payslips", employee.id],
    queryFn: async () => {
      const res = await apiClient.get(
        `api/v1/payslips?employee_id=${employee.id}`
      );
      return res.data;
    },
  });

  if (isLoading) return <div>Loading payslips…</div>;

  return (
    <div className="space-y-2 text-sm">
      {data?.data?.length === 0 && (
        <div className="text-muted-foreground">
          No payslips available
        </div>
      )}

      {data?.data?.map((payslip) => (
        <Link
          key={payslip.id}
          href={`/dashboard/payroll/payslips/${payslip.id}`}
          className="block border rounded p-3 hover:bg-muted/50"
        >
          <div className="font-medium">
            {payslip.month}/{payslip.year}
          </div>
          <div className="text-muted-foreground">
            Net Pay: {payslip.net_pay}
          </div>
        </Link>
      ))}
    </div>
  );
}
